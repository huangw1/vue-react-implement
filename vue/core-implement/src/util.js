/**
 * @Author: huangw1
 * @Date: 2019-11-22 11:30
 */

export const nextTick = (() => {
    let pending = false;
    const callbacks = [];
    let execute;

    const nextTickHandler = () => {
        pending = false;
        const copies = callbacks.slice(0);
        callbacks.length = 0;
        copies.forEach(cb => cb());
    };

    const p = Promise.resolve();
    execute = () => {
        p.then(nextTickHandler);
    };

    return (cb, ctx) => {
        callbacks.push(() => {
            try {
                ctx ? cb.call(ctx) : cb();
            } catch (err) {
                console.log('nextTick', err);
            }
        });
        if (!pending) {
            pending = true;
            execute()
        }
    }
})();
