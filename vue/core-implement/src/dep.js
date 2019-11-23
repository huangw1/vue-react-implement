/**
 * @Author: huangw1
 * @Date: 2019-11-22 13:16
 */

export default class Dep {
    constructor () {
        this.subs = [];
    }

    addSub (sub) {
        this.subs.push(sub);
    }

    removeSub (sub) {
        this.subs.splice(this.subs.findIndex(v => v === sub), 1);
    }

    notify (...params) {
        this.subs.forEach(sub => sub.update(...params));
    }
}
