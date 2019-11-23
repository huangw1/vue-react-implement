/**
 * @Author: huangw1
 * @Date: 2019-11-22 10:41
 */

export default function vnode(tag, data, children, componentOptions, componentInstance) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.componentOptions = componentOptions;
    this.componentInstance = componentInstance;
}
