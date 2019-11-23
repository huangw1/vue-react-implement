// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextTick = void 0;

/**
 * @Author: huangw1
 * @Date: 2019-11-22 11:30
 */
var nextTick = function () {
  var pending = false;
  var callbacks = [];
  var execute;

  var nextTickHandler = function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    copies.forEach(function (cb) {
      return cb();
    });
  };

  var p = Promise.resolve();

  execute = function execute() {
    p.then(nextTickHandler);
  };

  return function (cb, ctx) {
    callbacks.push(function () {
      try {
        ctx ? cb.call(ctx) : cb();
      } catch (err) {
        console.log('nextTick', err);
      }
    });

    if (!pending) {
      pending = true;
      execute();
    }
  };
}();

exports.nextTick = nextTick;
},{}],"../src/scheduler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queueWatcher = queueWatcher;

var _util = require("./util");

/**
 * @Author: huangw1
 * @Date: 2019-11-22 11:38
 */
var queueWatchers = [];
var toWatcher = new Map();

function queueWatcher(watcher) {
  if (!toWatcher.has(watcher.id)) {
    toWatcher.set(watcher.id, watcher);
    queueWatchers.push(watcher);
    (0, _util.nextTick)(flushScheduleQueue);
  }
}

function flushScheduleQueue() {
  // 父级先执行
  queueWatchers.sort(function (a, b) {
    return a.id - b.id;
  });
  queueWatchers.forEach(function (watcher) {
    return watcher.run();
  });
  resetSchedulerQueue();
}

function resetSchedulerQueue() {
  queueWatchers.length = 0;
  toWatcher.clear();
}
},{"./util":"../src/util.js"}],"../src/proxy.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWatcher = setWatcher;
exports.clearWatcher = clearWatcher;
exports.createProxy = createProxy;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @Author: huangw1
 * @Date: 2019-11-22 12:16
 */
var _watcher = null;

var isObject = function isObject(target) {
  return _typeof(target) === 'object';
};

function setWatcher(watcher) {
  _watcher = watcher;
}

function clearWatcher() {
  _watcher = null;
}

function createProxy(vueInstance) {
  function collect(key) {
    if (_watcher) {
      _watcher.$watch(key, _watcher.update.bind(_watcher));
    }
  }

  var createHandler = function createHandler(path) {
    return {
      get: function get(target, key) {
        var fullPath = path ? "".concat(path, ".").concat(key) : key;
        collect(fullPath);
        var result = target[key];

        if (isObject(result)) {
          return new Proxy(result, createHandler(fullPath));
        }

        return result;
      },
      set: function set(target, key, value) {
        var fullPath = path ? "".concat(path, ".").concat(key) : key;
        var oldValue = target[key];
        target[key] = value;
        vueInstance.notify(fullPath, value, oldValue);
        return true;
      },
      deleteProperty: function deleteProperty(target, key) {
        var value = target[key];
        delete target[key];
        var fullPath = path ? "".concat(path, ".").concat(key) : key;

        if (key in target) {
          vueInstance.notify(fullPath, value);
        }

        return true;
      }
    };
  };

  var data = vueInstance.$data;
  var props = vueInstance._props;
  var _vueInstance$$options = vueInstance.$options,
      _vueInstance$$options2 = _vueInstance$$options.methods,
      methods = _vueInstance$$options2 === void 0 ? {} : _vueInstance$$options2,
      _vueInstance$$options3 = _vueInstance$$options.computed,
      computed = _vueInstance$$options3 === void 0 ? {} : _vueInstance$$options3;
  var handler = {
    get: function get(target, key) {
      if (key in props) {
        return createHandler().get(props, key);
      } else if (key in data) {
        return createHandler().get(data, key);
      } else if (key in computed) {
        return computed[key].call(vueInstance._proxy);
      } else if (key in methods) {
        return methods[key].bind(vueInstance._proxy);
      }

      return target[key];
    },
    set: function set(target, key, value) {
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
},{}],"../src/watcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genWatchId = genWatchId;
exports.ComputedWatcher = exports.Watcher = void 0;

var _scheduler = require("./scheduler");

var _proxy = require("./proxy");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var index = 0;

function genWatchId() {
  return index++;
}

var Watcher =
/*#__PURE__*/
function () {
  function Watcher(vm, key, cb) {
    _classCallCheck(this, Watcher);

    this.vm = vm;
    this.key = key;
    this.cb = cb;
    this.id = genWatchId();
  }

  _createClass(Watcher, [{
    key: "update",
    value: function update(value, oldValue) {
      this.value = value;
      this.oldValue = oldValue;
      (0, _scheduler.queueWatcher)(this);
    }
  }, {
    key: "run",
    value: function run() {
      this.cb.call(this.vm, this.value, this.oldValue);
    }
  }]);

  return Watcher;
}();

exports.Watcher = Watcher;

var ComputedWatcher =
/*#__PURE__*/
function () {
  function ComputedWatcher(vm, fn, cb) {
    _classCallCheck(this, ComputedWatcher);

    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.id = genWatchId();
    (0, _proxy.setWatcher)(this);
    this.value = this.get();
    (0, _proxy.clearWatcher)();
  }

  _createClass(ComputedWatcher, [{
    key: "get",
    value: function get() {
      this.fn.call(this.vm);
    }
  }, {
    key: "update",
    value: function update() {
      (0, _scheduler.queueWatcher)(this);
    }
  }, {
    key: "run",
    value: function run() {
      var oldValue = this.value;
      var value = this.get();
      this.value = value;
      this.cb.call(this.vm, value, oldValue);
    }
  }]);

  return ComputedWatcher;
}();

exports.ComputedWatcher = ComputedWatcher;
},{"./scheduler":"../src/scheduler.js","./proxy":"../src/proxy.js"}],"../src/dep.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @Author: huangw1
 * @Date: 2019-11-22 13:16
 */
var Dep =
/*#__PURE__*/
function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.subs = [];
  }

  _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }
  }, {
    key: "removeSub",
    value: function removeSub(sub) {
      this.subs.splice(this.subs.findIndex(function (v) {
        return v === sub;
      }), 1);
    }
  }, {
    key: "notify",
    value: function notify() {
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      this.subs.forEach(function (sub) {
        return sub.update.apply(sub, params);
      });
    }
  }]);

  return Dep;
}();

exports.default = Dep;
},{}],"../src/vnode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = vnode;

/**
 * @Author: huangw1
 * @Date: 2019-11-22 10:41
 */
function vnode(tag, data, children, componentOptions, componentInstance) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.componentOptions = componentOptions;
  this.componentInstance = componentInstance;
}
},{}],"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _watcher = require("./watcher");

var _proxy = require("./proxy");

var _dep = _interopRequireDefault(require("./dep"));

var _scheduler = require("./scheduler");

var _util = require("./util");

var _vnode = _interopRequireDefault(require("./vnode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vue =
/*#__PURE__*/
function () {
  function Vue(options) {
    _classCallCheck(this, Vue);

    this.$options = options;
    this.id = (0, _watcher.genWatchId)();
    this.initProps();
    this.initData();
    this._proxy = (0, _proxy.createProxy)(this);
    this._deps = {};
    this.initWatch();
    return this._proxy;
  }

  _createClass(Vue, [{
    key: "initProps",
    value: function initProps() {
      var _this = this;

      this._props = {};
      var _this$$options = this.$options,
          propsOptions = _this$$options.props,
          propsData = _this$$options.propsData;

      if (propsOptions && propsOptions.length) {
        propsOptions.forEach(function (key) {
          _this._props[key] = propsData[key];
        });
      }
    }
  }, {
    key: "initData",
    value: function initData() {
      this.$data = this.$options.data ? this.$options.data() : {};
    }
  }, {
    key: "initWatch",
    value: function initWatch() {
      var _this$$options2 = this.$options,
          _this$$options2$watch = _this$$options2.watch,
          watch = _this$$options2$watch === void 0 ? {} : _this$$options2$watch,
          _this$$options2$compu = _this$$options2.computed,
          computed = _this$$options2$compu === void 0 ? {} : _this$$options2$compu;
      var data = this.$data;

      for (var key in watch) {
        var cb = watch[key];

        if (key in data) {
          this.$watch(key, cb);
        } else if (key in computed) {
          new _watcher.ComputedWatcher(this._proxy, computed[key], cb);
        } else {
          console.error("".concat(key, " does not exist in vue"));
        }
      }
    }
  }, {
    key: "$nextTick",
    value: function $nextTick(cb) {
      (0, _util.nextTick)(cb, this._proxy);
    }
  }, {
    key: "$watch",
    value: function $watch(key, cb) {
      if (!this._deps[key]) {
        this._deps[key] = new _dep.default();
      }

      this._deps[key].addSub(new _watcher.Watcher(this._proxy, key, cb));
    }
  }, {
    key: "update",
    value: function update() {
      this.run();
    }
  }, {
    key: "notify",
    value: function notify(key, value, oldValue) {
      if (this._deps[key]) {
        this._deps[key].notify(value, oldValue);
      }
    }
  }, {
    key: "$mount",
    value: function $mount(root) {
      this.$el = root;
      (0, _proxy.setWatcher)(this);
      this.run();
      (0, _proxy.clearWatcher)();
      var mounted = this.$options.mounted;
      mounted && mounted.call(this._proxy);
      return this;
    }
  }, {
    key: "run",
    value: function run() {
      var parent = this.$el && this.$el.parentElement;
      var vnode = this.$options.render.call(this._proxy, this.createElement.bind(this));
      var oldEl = this.$el;
      this.$el = this.patch(this._vnode, vnode);
      this._vnode = vnode;

      if (parent) {
        parent.replaceChild(this.$el, oldEl);
      }
    }
  }, {
    key: "createElement",
    value: function createElement(tag, data, children) {
      var _this$$options$compon = this.$options.components,
          components = _this$$options$compon === void 0 ? {} : _this$$options$compon;

      if (tag in components) {
        return new _vnode.default(tag, data, children, components[tag]);
      } else {
        return new _vnode.default(tag, data, children);
      }
    }
  }, {
    key: "patch",
    value: function patch(oldVnode, vnode) {
      return this.createDom(vnode);
    }
  }, {
    key: "createDom",
    value: function createDom(vnode) {
      var _this2 = this;

      if (vnode.componentOptions) {
        var componentInstance = new Vue(Object.assign({}, vnode.componentOptions, {
          propsData: vnode.data.props
        }));
        vnode.componentInstance = componentInstance;
        componentInstance.$mount();
        return componentInstance.$el;
      }

      var el = document.createElement(vnode.tag);
      el.__vue__ = this;
      var _vnode$data = vnode.data,
          data = _vnode$data === void 0 ? {} : _vnode$data,
          children = vnode.children;
      var _data$attrs = data.attrs,
          attrs = _data$attrs === void 0 ? {} : _data$attrs,
          _data$class = data.class,
          classname = _data$class === void 0 ? '' : _data$class,
          _data$on = data.on,
          events = _data$on === void 0 ? {} : _data$on;

      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }

      if (classname) {
        el.setAttribute('class', classname);
      }

      for (var _key in events) {
        el.addEventListener(_key, events[_key]);
      }

      if (!Array.isArray(children)) {
        children = [children];
      }

      children.forEach(function (child) {
        if (_typeof(child) !== 'object') {
          el.appendChild(document.createTextNode(child));
        } else {
          el.appendChild(_this2.createDom(child));
        }
      });
      return el;
    }
  }]);

  return Vue;
}();

exports.default = Vue;
},{"./watcher":"../src/watcher.js","./proxy":"../src/proxy.js","./dep":"../src/dep.js","./scheduler":"../src/scheduler.js","./util":"../src/util.js","./vnode":"../src/vnode.js"}],"demo.js":[function(require,module,exports) {
"use strict";

var _src = _interopRequireDefault(require("../src"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @Author: huangw1
 * @Date: 2019-11-23 14:20
 */
window.vue = new _src.default({
  data: function data() {
    return {
      count: 0,
      test: 'test'
    };
  },
  methods: {
    addCount: function addCount() {
      this.count++;
      this.test = 'click';
    }
  },
  render: function render(h) {
    return h('div', {
      on: {
        click: this.addCount
      }
    }, "".concat(this.test, " -> ") + this.count);
  }
}).$mount(document.getElementById('app'));
},{"../src":"../src/index.js"}],"../node_modules/_parcel-bundler@1.12.4@parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58641" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/_parcel-bundler@1.12.4@parcel-bundler/src/builtins/hmr-runtime.js","demo.js"], null)
//# sourceMappingURL=/demo.d3b53871.js.map