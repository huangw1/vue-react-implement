/**
 * @Author: huangw1
 * @Date: 2019-11-23 10:10
 */
import {ComputedWatcher, genWatchId, Watcher} from "./watcher";
import {clearWatcher, createProxy, setWatcher} from "./proxy";
import Dep from "./dep";
import {queueWatcher} from "./scheduler";
import {nextTick} from "./util";
import vnode from "./vnode";

export default class Vue {
    constructor (options) {
        this.$options = options;
        this.id = genWatchId();

        this.initProps();
        this.initData();
        this._proxy = createProxy(this);

        this._deps = {};
        this.initWatch();

        return this._proxy;
    }

    initProps () {
        this._props = {};
        const {props: propsOptions, propsData} = this.$options;
        if (propsOptions && propsOptions.length) {
            propsOptions.forEach(key => {
                this._props[key] = propsData[key];
            })
        }
    }

    initData () {
        this.$data = this.$options.data ? this.$options.data() : {}
    }

    initWatch () {
        const {watch = {}, computed = {}} = this.$options;
        const data = this.$data;

        for (let key in watch) {
            const cb = watch[key];
            if (key in data) {
                this.$watch(key, cb);
            } else if (key in computed) {
                new ComputedWatcher(this._proxy, computed[key], cb);
            } else {
                console.error(`${key} does not exist in vue`);
            }
        }
    }

    $nextTick (cb) {
        nextTick(cb, this._proxy)
    }

    $watch (key, cb) {
        if (!this._deps[key]) {
            this._deps[key] = new Dep();
        }
        this._deps[key].addSub(new Watcher(this._proxy, key, cb));
    }

    update () {
        this.run();
    }

    notify (key, value, oldValue) {
        if (this._deps[key]) {
            this._deps[key].notify(value, oldValue);
        }
    }

    $mount (root) {
        this.$el = root;

        setWatcher(this);
        this.run();
        clearWatcher();

        const {mounted} = this.$options;
        mounted && mounted.call(this._proxy);

        return this;
    }

    run () {
        const parent = this.$el && this.$el.parentElement;
        const vnode = this.$options.render.call(this._proxy, this.createElement.bind(this));
        const oldEl = this.$el;

        this.$el = this.patch(this._vnode, vnode);
        this._vnode = vnode;

        if (parent) {
            parent.replaceChild(this.$el, oldEl);
        }
    }

    createElement (tag, data, children) {
        const {components = {}} = this.$options;

        if (tag in components) {
            return new vnode(tag, data, children, components[tag]);
        } else {
            return new vnode(tag, data, children);
        }
    }

    patch (oldVnode, vnode) {
        return this.createDom(vnode)
    }

    createDom (vnode) {
        if (vnode.componentOptions) {
            const componentInstance = new Vue(Object.assign({}, vnode.componentOptions, {propsData: vnode.data.props}));
            vnode.componentInstance = componentInstance;
            componentInstance.$mount();
            return componentInstance.$el;
        }

        const el = document.createElement(vnode.tag);
        el.__vue__ = this;

        let {data = {}, children} = vnode;
        const {attrs = {}, class: classname  = '', on: events = {}} = data;

        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }

        if (classname) {
            el.setAttribute('class', classname);
        }

        for (let key in events) {
            el.addEventListener(key, events[key])
        }

        if (!Array.isArray(children)) {
            children = [children]
        }
        children.forEach(child => {
            if (typeof child !== 'object') {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(this.createDom(child));
            }
        });

        return el;
    }
}
