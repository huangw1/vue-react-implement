/**
 * @Author: huangw1
 * @Date: 2019-11-22 12:16
 */

let _watcher = null;
const isObject = (target) => typeof target === 'object';

export function setWatcher (watcher) {
    _watcher = watcher;
}

export function clearWatcher () {
    _watcher = null;
}

export function createProxy (vueInstance) {
    function collect (key) {
        if (_watcher) {
            _watcher.$watch(key, _watcher.update.bind(_watcher));
        }
    }

    const createHandler = path => {
        return {
            get (target, key) {
                const fullPath = path ? `${path}.${key}` : key;
                collect(fullPath);

                const result = target[key];
                if (isObject(result)) {
                    return new Proxy(result, createHandler(fullPath));
                }

                return result;
            },

            set (target, key, value) {
                const fullPath = path ? `${path}.${key}` : key;
                const oldValue = target[key];

                target[key] = value;
                vueInstance.notify(fullPath, value, oldValue);

                return true;
            },

            deleteProperty(target, key) {
                const value = target[key];
                delete target[key];
                const fullPath = path ? `${path}.${key}` : key;

                if (key in target) {
                    vueInstance.notify(fullPath, value);
                }

                return true;
            }
        }
    };

    const data = vueInstance.$data;
    const props = vueInstance._props;
    const {methods = {}, computed = {}} = vueInstance.$options;

    const handler = {
        get (target, key) {
            if (key in props) {
                return createHandler().get(props, key)
            } else if (key in data) {
                return createHandler().get(data, key)
            } else if (key in computed) {
                return computed[key].call(vueInstance._proxy)
            } else if (key in methods) {
                return methods[key].bind(vueInstance._proxy);
            }

            return target[key];
        },

        set (target, key, value) {
            if (key in props) {
                return createHandler().set(props, key, value);
            } else if (key in data) {
                return createHandler().set(data, key, value);
            }

            target[key] = value;
            return true;
        }
    };

    return new Proxy(vueInstance, handler);
}
