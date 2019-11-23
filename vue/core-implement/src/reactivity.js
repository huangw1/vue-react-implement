/**
 * @Author: huangw1
 * @Date: 2019-11-19 10:42
 */

const toProxy = new WeakMap();
const toRow = new WeakMap();

const isObject = (target) => typeof target === 'object';

function reactive(target) {
    if (!isObject(target)) {
        return target;
    }
    let proxy = toProxy.get(target);
    if (proxy) {
        return proxy;
    }
    if (toRow.has(target)) {
        return target;
    }

    const handlers = {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            if (isObject(res)) {
                return reactive(res);
            }
            return res;
        },

        set(target, key, value, receiver) {
            return Reflect.set(target, key, value, receiver);
        },

        deleteProperty(target, key) {
            return Reflect.deleteProperty(target, key);
        }
    };

    const observed = new Proxy(target, handlers);
    toProxy.set(target, observed);
    toRow.set(observed, target);
    return observed;
}
