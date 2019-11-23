/**
 * @Author: huangw1
 * @Date: 2019-11-22 11:38
 */
import {nextTick} from "./util";

const queueWatchers = [];
const toWatcher = new Map();

export function queueWatcher(watcher) {
    if (!toWatcher.has(watcher.id)) {
        toWatcher.set(watcher.id, watcher);
        queueWatchers.push(watcher);
        nextTick(flushScheduleQueue);
    }
}

function flushScheduleQueue () {
    // 父级先执行
    queueWatchers.sort((a, b) => a.id - b.id);
    queueWatchers.forEach(watcher => watcher.run());
    resetSchedulerQueue();
}

function resetSchedulerQueue() {
    queueWatchers.length = 0;
    toWatcher.clear();
}
