/**
 * @Author: huangw1
 * @Date: 2019-11-22 11:22
 */
import {queueWatcher} from "./scheduler";
import {clearWatcher, setWatcher} from "./proxy";

let index = 0;
export function genWatchId() {
    return index++
}

export class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        this.id = genWatchId()
    }

    update (value, oldValue) {
        this.value = value;
        this.oldValue = oldValue;
        queueWatcher(this);
    }

    run () {
        this.cb.call(this.vm, this.value, this.oldValue);
    }
}

export class ComputedWatcher {
    constructor (vm, fn, cb) {
        this.vm = vm;
        this.fn = fn;
        this.cb = cb;
        this.id = genWatchId();

        setWatcher(this);
        this.value = this.get();
        clearWatcher();
    }

    get () {
        this.fn.call(this.vm);
    }

    update () {
        queueWatcher(this);
    }

    run () {
        const oldValue = this.value;
        const value = this.get();
        this.value = value;
        this.cb.call(this.vm, value, oldValue);
    }
}
