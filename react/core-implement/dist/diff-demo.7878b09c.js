// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"../src/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INTERNAL_INSTANCE = exports.RENDERED_INTERNAL_INSTANCE = exports.OPERATION = exports.TEXT_NODE = void 0;

/**
 * @Author: huangw1
 * @Date: 2019-11-20 17:11
 */
// 前缀
var prefix = '@react/__'; // 通用常量

var TEXT_NODE = "".concat(prefix, "text_node"); // diff 类型

exports.TEXT_NODE = TEXT_NODE;
var OPERATION = {
  ADD: "".concat(prefix, "operation_add"),
  REMOVE: "".concat(prefix, "operation_remove"),
  REPLACE: "".concat(prefix, "operation_replace"),
  UPDATE: "".concat(prefix, "_operation_update")
}; // diff 中常量

exports.OPERATION = OPERATION;
var RENDERED_INTERNAL_INSTANCE = "".concat(prefix, "rendered_internal_instance");
exports.RENDERED_INTERNAL_INSTANCE = RENDERED_INTERNAL_INSTANCE;
var INTERNAL_INSTANCE = "".concat(prefix, "internal_instance");
exports.INTERNAL_INSTANCE = INTERNAL_INSTANCE;
},{}],"../src/render/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirstChildNode = getFirstChildNode;
exports.removeNode = removeNode;
exports.appendNode = appendNode;
exports.getParentNode = getParentNode;
exports.replaceNode = replaceNode;
exports.createNode = createNode;
exports.setNodeAttributes = setNodeAttributes;
exports.updateNodeAttributes = updateNodeAttributes;
exports.removeNodeAttributes = removeNodeAttributes;

var _constants = require("../constants");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function getFirstChildNode(node) {
  if (!(node instanceof Node)) {
    return null;
  }

  return node.firstChild;
}

function removeNode(parentNode, childNode) {
  if (!(parentNode instanceof Node) || !(childNode instanceof Node)) {
    return null;
  }

  parentNode.removeChild(childNode);
  return parentNode;
}

function appendNode(parentNode, childNode) {
  if (!(parentNode instanceof Node) || !(childNode instanceof Node)) {
    return null;
  }

  parentNode.appendChild(childNode);
  return parentNode;
}

function getParentNode(node) {
  if (!(node instanceof Node)) {
    return null;
  }

  return node.parentNode;
}

function replaceNode(parentNode, newNode, oldNode) {
  if (!(parentNode instanceof Node) || !(newNode instanceof Node) || !(oldNode instanceof Node)) {
    return null;
  }

  parentNode.replaceChild(newNode, oldNode);
  return parentNode;
}

function createNode(element) {
  var type = element.type || '';
  var props = element.props || {};

  if (typeof type !== 'string' || _typeof(props) !== 'object') {
    return null;
  }

  var node;

  if (type === _constants.TEXT_NODE) {
    node = document.createTextNode(props.textContent || '');
  } else {
    node = document.createElement(type);
    setNodeAttributes(node, props);
  }

  return node;
} // 事件代理 - 方便进行事件绑定和取消绑定


function eventProxy(e) {
  return this._listener[e.type](e);
}

var attributeHandler = {
  listener: function listener(node, eventName, eventFunc) {
    node.addEventListener(eventName, eventProxy);
    node._listener = node._listener || {};
    node._listener[eventName] = eventFunc;
  },
  unlistener: function unlistener(node, eventName) {
    node.removeEventListener(eventName, eventProxy);
  },
  style: function style(node, value) {
    if (_typeof(value) === 'object') {
      value = Object.keys(value).map(function (key) {
        return "".concat(key, ": ").concat(value[key]);
      }).join(', ');
    }

    node.setAttribute('style', value);
  },
  className: function className(node, value) {
    node.setAttribute('class', value);
  }
};

var isListener = function isListener(propName) {
  return propName.startsWith('on');
};

var isStyle = function isStyle(propName) {
  return propName === 'style';
};

var isClass = function isClass(propName) {
  return propName === 'class' || propName === 'className';
};

var isChildren = function isChildren(propName) {
  return propName === 'children';
};

var hasProperty = function hasProperty(obj, prop) {
  return !Object.prototype.hasOwnProperty.call(obj, prop);
};

function setNodeAttributes(node, props) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  props = props || {};

  if (_typeof(props) !== 'object') {
    return;
  }

  Object.keys(props).forEach(function (prop) {
    var value = props[prop];

    if (isListener(prop)) {
      attributeHandler.unlistener(node, prop.replace(/^on/, '').toLowerCase());
      attributeHandler.listener(node, prop.replace(/^on/, '').toLowerCase(), value);
    } else if (isStyle(prop)) {
      attributeHandler.style(node, value);
    } else if (isClass(prop)) {
      attributeHandler.className(node, value);
    } else if (!isChildren(prop)) {
      node.setAttribute(prop, value);
    }
  });
}

function updateNodeAttributes(node, newProps, oldProps) {
  newProps = newProps || {};
  oldProps = oldProps || {};

  if (node instanceof Text) {
    node.textContent = newProps.textContent || '';
    return;
  }

  if (!(node instanceof HTMLElement)) {
    return;
  }

  if (_typeof(newProps) !== 'object' || _typeof(oldProps) !== 'object') {
    return;
  }

  var willRemoveProps = {};
  var willSetProps = {};
  Object.keys(oldProps).filter(function (prop) {
    return !isChildren(prop) && hasProperty(newProps, prop);
  }).forEach(function (prop) {
    willRemoveProps[prop] = oldProps[prop];
  });
  removeNodeAttributes(node, willRemoveProps);
  Object.keys(newProps).filter(function (prop) {
    return !isChildren(prop);
  }).forEach(function (prop) {
    willSetProps[prop] = newProps[prop];
  });
  setNodeAttributes(node, willSetProps);
}

function removeNodeAttributes(node, props) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  if (_typeof(props) !== 'object') {
    return;
  }

  props = props || {};
  Object.keys(props).forEach(function (prop) {
    if (isListener(prop)) {
      attributeHandler.unlistener(node, prop.replace(/^on/, '').toLowerCase());
    } else if (!isChildren(prop)) {
      node.removeAttribute(prop);
    }
  });
}
},{"../constants":"../src/constants.js"}],"../src/reconciler/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.Component = void 0;

var _constants = require("../constants");

var _dom = require("../render/dom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function instantiateComponent(element) {
  var type = element.type;
  var isHostComponent = typeof type === 'string';
  var internalInstance;

  if (isHostComponent) {
    internalInstance = new HostComponent(element);
  } else {
    internalInstance = new CompositeComponent(element);
  }

  return internalInstance;
} // 管理组件


var CompositeComponent =
/*#__PURE__*/
function () {
  function CompositeComponent(element) {
    _classCallCheck(this, CompositeComponent);

    this.currentElement = element;
    this.publicInstance = null;
    this.renderedInternalInstance = null;
  }

  _createClass(CompositeComponent, [{
    key: "getHostNode",
    value: function getHostNode() {
      return this.renderedInternalInstance.getHostNode();
    }
  }, {
    key: "mount",
    value: function mount() {
      var element = this.currentElement;
      var _element$type = element.type,
          type = _element$type === void 0 ? function () {} : _element$type,
          _element$props = element.props,
          props = _element$props === void 0 ? {} : _element$props;
      var renderedElement;

      if (isClass(type)) {
        var publicInstance = new type(props);
        this.publicInstance = publicInstance;
        renderedElement = publicInstance.render();
      } else {
        renderedElement = type(props);
      }

      var renderedInternalInstance = instantiateComponent(renderedElement);
      this.renderedInternalInstance = renderedInternalInstance;

      if (this.publicInstance) {
        this.publicInstance[_constants.RENDERED_INTERNAL_INSTANCE] = renderedInternalInstance;
      }

      var node = renderedInternalInstance.mount();

      if (this.publicInstance && typeof this.publicInstance.componentDidMount === 'function') {
        this.publicInstance.componentDidMount();
      }

      return node;
    }
  }, {
    key: "unmount",
    value: function unmount() {
      var renderedInternalInstance = this.renderedInternalInstance;
      renderedInternalInstance.unmount();
    }
  }, {
    key: "receive",
    value: function receive(element) {
      var prevRenderedInternalInstance = this.renderedInternalInstance;
      var prevRenderedElement = prevRenderedInternalInstance.currentElement;
      var type = element.type;
      var nextProps = element.props || {};

      if (this.publicInstance) {
        this.publicInstance.props = nextProps;
      }

      var nextRenderedElement;

      if (isClass(type)) {
        nextRenderedElement = this.publicInstance.render();
      } else {
        nextRenderedElement = type(nextProps);
      }

      if (prevRenderedElement.type === nextRenderedElement.type) {
        prevRenderedInternalInstance.receive(nextRenderedElement);
      } // 直接替换


      var prevNode = prevRenderedInternalInstance.getHostNode();
      var nextRenderedInternalInstance = instantiateComponent(nextRenderedElement); // const nextNode = nextRenderedInternalInstance.getHostNode()

      var nextNode = nextRenderedInternalInstance.mount();
      var parentNode = (0, _dom.getParentNode)(prevNode);

      if (parentNode) {
        (0, _dom.replaceNode)(parentNode, nextNode, prevNode);
      }
    }
  }]);

  return CompositeComponent;
}();

var HostComponent =
/*#__PURE__*/
function () {
  function HostComponent(element) {
    _classCallCheck(this, HostComponent);

    this.currentElement = element;
    this.renderedInternalInstanceChildren = [];
    this.node = null;
  }

  _createClass(HostComponent, [{
    key: "getHostNode",
    value: function getHostNode() {
      return this.node;
    }
  }, {
    key: "mount",
    value: function mount() {
      var element = this.currentElement;
      var props = element.props || {};
      var node = (0, _dom.createNode)(element);
      this.node = node;
      var elementChildren = props.children || [];

      if (!Array.isArray(elementChildren)) {
        elementChildren = [elementChildren];
      }

      var renderedInternalInstanceChildren = elementChildren.map(instantiateComponent);
      var nodeChildren = renderedInternalInstanceChildren.map(function (child) {
        return child.mount();
      });
      this.renderedInternalInstanceChildren = renderedInternalInstanceChildren;
      nodeChildren.forEach(function (nodeChild) {
        return (0, _dom.appendNode)(node, nodeChild);
      });
      return node;
    }
  }, {
    key: "unmount",
    value: function unmount() {
      var node = this.node;
      var renderedInternalInstanceChildren = this.renderedInternalInstanceChildren;

      if (renderedInternalInstanceChildren) {
        renderedInternalInstanceChildren.forEach(function (child) {
          child.unmount();
          var childNode = child.getHostNode();
          (0, _dom.removeNode)(node, childNode);
        });
      }
    }
  }, {
    key: "receive",
    value: function receive(element) {
      var node = this.node;
      var prevProps = this.currentElement.props;
      var nextProps = element.props || {};
      (0, _dom.updateNodeAttributes)(node, nextProps, prevProps);
      var prevRenderedInternalInstanceChildren = this.renderedInternalInstanceChildren;
      var nextRenderedInternalInstanceChildren = [];
      var prevElementChildren = prevProps.children || [];
      var nextElementChildren = nextProps.children || [];
      var operationQueue = [];

      for (var i = 0; i < nextElementChildren.length; i++) {
        var prevRenderedInternalInstance = prevRenderedInternalInstanceChildren[i];
        var prevElement = prevElementChildren[i];
        var nextElement = nextElementChildren[i]; // 新增

        if (!prevElement) {
          var nextRenderedInternalInstance = instantiateComponent(nextElement);
          var nextNode = nextRenderedInternalInstance.mount();
          nextRenderedInternalInstanceChildren.push(nextRenderedInternalInstance);
          operationQueue.push({
            type: _constants.OPERATION.ADD,
            node: nextNode
          });
          continue;
        } // 替换


        var canUpdate = prevElement.type === nextElement.type;

        if (!canUpdate) {
          var _nextRenderedInternalInstance = instantiateComponent(nextElement);

          var _nextNode = _nextRenderedInternalInstance.mount();

          var prevNode = prevRenderedInternalInstance.getHostNode();
          nextRenderedInternalInstanceChildren.push(_nextRenderedInternalInstance);
          operationQueue.push({
            type: _constants.OPERATION.REPLACE,
            prevNode: prevNode,
            nextNode: _nextNode
          });
          continue;
        } // 更新


        prevRenderedInternalInstance.receive(nextElement);
        nextRenderedInternalInstanceChildren.push(prevRenderedInternalInstance);
      } // 删除


      for (var _i = nextElementChildren.length; _i < prevElementChildren.length; _i++) {
        var _prevRenderedInternalInstance = prevRenderedInternalInstanceChildren[_i];

        _prevRenderedInternalInstance.unmount();

        var _prevNode = _prevRenderedInternalInstance.getHostNode();

        operationQueue.push({
          type: _constants.OPERATION.REMOVE,
          node: _prevNode
        });
      } // 执行各操作


      while (operationQueue.length > 0) {
        var operation = operationQueue.shift();

        if (operation.type === _constants.OPERATION.ADD) {
          (0, _dom.appendNode)(node, operation.node);
        } else if (operation.type === _constants.OPERATION.REMOVE) {
          (0, _dom.removeNode)(node, operation.node);
        } else if (operation.type === _constants.OPERATION.REPLACE) {
          (0, _dom.replaceNode)(node, operation.nextNode, operation.prevNode);
        }
      }

      this.renderedInternalInstanceChildren = nextRenderedInternalInstanceChildren;
    }
  }]);

  return HostComponent;
}();

function unmountAll(containerNode) {
  var firstChildNode = (0, _dom.getFirstChildNode)(containerNode);

  if (firstChildNode) {
    var rootInternalInstance = firstChildNode[_constants.INTERNAL_INSTANCE];

    if (rootInternalInstance) {
      rootInternalInstance.unmount();
      var rootNode = rootInternalInstance.getHostNode();
      (0, _dom.removeNode)(containerNode, rootNode);
    }
  }
}

function render(element, containerNode) {
  var firstChildNode = (0, _dom.getFirstChildNode)(containerNode);

  if (firstChildNode) {
    var prevInternalInstance = firstChildNode[_constants.INTERNAL_INSTANCE];

    if (prevInternalInstance) {
      var prevElement = prevInternalInstance.currentElement;

      if (prevElement.type === element.type) {
        prevInternalInstance.receive(element);
        return;
      }
    }

    unmountAll(containerNode);
  }

  var internalInstance = instantiateComponent(element);
  var node = internalInstance.mount();
  node[_constants.INTERNAL_INSTANCE] = internalInstance;
  (0, _dom.appendNode)(containerNode, node);
}

function isClass(type) {
  return type.isReactComponent;
}

var Component =
/*#__PURE__*/
function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(state) {
      var nextState = Object.assign({}, state);
      var renderedInternalInstance = this[_constants.RENDERED_INTERNAL_INSTANCE];
      this.state = nextState;
      var nextRenderedElement = this.render();

      if (renderedInternalInstance) {
        renderedInternalInstance.receive(nextRenderedElement);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {// override
    }
  }, {
    key: "render",
    value: function render() {// override
    }
  }]);

  return Component;
}();

exports.Component = Component;
Component.isReactComponent = true;
},{"../constants":"../src/constants.js","../render/dom":"../src/render/dom.js"}],"../src/h.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;

var _constants = require("./constants");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function h(type, props) {
  var _ref;

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  props = props || {};
  children = (_ref = []).concat.apply(_ref, _toConsumableArray(children)).filter(function (child) {
    return child !== null && typeof child !== 'boolean';
  }).map(function (child) {
    return typeof child === 'number' ? String(child) : child;
  }).map(function (child) {
    return typeof child === 'string' ? h(_constants.TEXT_NODE, {
      textContent: child
    }) : child;
  });
  props.children = children;
  return {
    type: type,
    props: props
  };
}
},{"./constants":"../src/constants.js"}],"diff-demo.js":[function(require,module,exports) {
"use strict";

var _diff = require("../src/reconciler/diff");

var _h = require("../src/h");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var App =
/*#__PURE__*/
function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.state = {
      count: 0
    };
    return _this;
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var state = this.state;
      return (0, _h.h)("div", {
        onClick: function onClick() {
          _this2.setState({
            count: ++state.count
          });
        }
      }, state.count);
    }
  }]);

  return App;
}(_diff.Component);

(0, _diff.render)((0, _h.h)(App, null), document.getElementById('diff-app'));
},{"../src/reconciler/diff":"../src/reconciler/diff.js","../src/h":"../src/h.js"}],"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58531" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","diff-demo.js"], null)
//# sourceMappingURL=/diff-demo.7878b09c.map