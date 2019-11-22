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
exports.INSTANCE_INNER_FIBER = exports.ROOT_FIBER = exports.ENOUGH_TIME = exports.HOST_ROOT = exports.COMPOSITE_COMPONENT = exports.HOST_COMPONENT = exports.INTERNAL_INSTANCE = exports.RENDERED_INTERNAL_INSTANCE = exports.OPERATION = exports.TEXT_NODE = void 0;

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
var INTERNAL_INSTANCE = "".concat(prefix, "internal_instance"); // fiber中的常量

exports.INTERNAL_INSTANCE = INTERNAL_INSTANCE;
var HOST_COMPONENT = "".concat(prefix, "host_component");
exports.HOST_COMPONENT = HOST_COMPONENT;
var COMPOSITE_COMPONENT = "".concat(prefix, "composite_component");
exports.COMPOSITE_COMPONENT = COMPOSITE_COMPONENT;
var HOST_ROOT = "".concat(prefix, "host_root");
exports.HOST_ROOT = HOST_ROOT;
var ENOUGH_TIME = 1;
exports.ENOUGH_TIME = ENOUGH_TIME;
var ROOT_FIBER = "".concat(prefix, "root_fiber");
exports.ROOT_FIBER = ROOT_FIBER;
var INSTANCE_INNER_FIBER = "".concat(prefix, "instance_inner_fiber");
exports.INSTANCE_INNER_FIBER = INSTANCE_INNER_FIBER;
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
},{"../constants":"../src/constants.js"}],"../src/reconciler/fiber.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.scheduleUpdate = scheduleUpdate;
exports.Component = void 0;

var _constants = require("../constants");

var _dom = require("../render/dom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// 任务队列
var taskQueue = []; // 下一个需要操作的 fiber

var nextUnitWork = null; // 所有操作完成后，会将该值赋值为跟节点

var pendingCommit = null;

if (!global['requestIdleCallback']) {
  global['requestIdleCallback'] = function (func) {
    return func({
      timeRemaining: function timeRemaining() {
        return 100;
      }
    });
  };
}

function render(elements, containerDom) {
  taskQueue.push({
    tag: _constants.HOST_ROOT,
    dom: containerDom,
    props: {
      children: elements
    }
  });
  requestIdleCallback(performWork);
} // 更新函数


function scheduleUpdate(instance, partialState) {
  taskQueue.push({
    tag: _constants.HOST_COMPONENT,
    instance: instance,
    partialState: partialState,
    props: instance.props
  });
  requestIdleCallback(performWork);
}

function performWork(deadline) {
  workLoop(deadline);

  if (taskQueue.length || nextUnitWork !== null) {
    requestIdleCallback(performWork);
  }
}

function workLoop(deadline) {
  if (nextUnitWork === null) {
    nextUnitWork = resetNextUnitWork();
  }

  if (nextUnitWork && deadline.timeRemaining() > _constants.ENOUGH_TIME) {
    nextUnitWork = performUnitWork(nextUnitWork);
  } // 如果所有任务执行完毕则提交所有任务


  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
} // 获取下一个要操作的 fiber
// 更新或渲染的过程就是构建 fiber 树的过程，每次都是从根 fiber 开始


function resetNextUnitWork() {
  var task = taskQueue.shift();

  if (task === undefined) {
    return null;
  }

  if (task.tag === _constants.HOST_ROOT) {
    nextUnitWork = {
      tag: _constants.HOST_ROOT,
      statNode: task.dom,
      props: task.props,
      alternate: task.dom[_constants.ROOT_FIBER]
    };
    return nextUnitWork;
  }

  var currentFiber = task.instance[_constants.INSTANCE_INNER_FIBER]; // 有疑问 - use while get root fiber

  var getRootFiber = function getRootFiber(fiber) {
    if (fiber.tag !== _constants.HOST_ROOT) {
      fiber = fiber.parent;
    }

    return fiber;
  };

  var oldRootFiber = getRootFiber(currentFiber);
  nextUnitWork = {
    tag: _constants.HOST_ROOT,
    statNode: oldRootFiber.statNode,
    props: oldRootFiber.props,
    alternate: oldRootFiber
  };

  if (task.partialState) {
    currentFiber.partialState = task.partialState;
  }

  return nextUnitWork;
}

function performUnitWork(fiber) {
  beginWork(fiber); // 采用深度优先遍历 fiber 树，先遍历孩子节点

  if (fiber.child) {
    return fiber.child;
  }

  while (fiber) {
    completeWork(fiber);

    if (fiber.sibling) {
      return fiber.sibling;
    } // 父节点兄弟节点


    fiber = fiber.parent;
  }

  return null;
}

function beginWork(fiber) {
  if (fiber.tag === _constants.COMPOSITE_COMPONENT) {
    workInCompositeComponent(fiber);
  } else {
    workInHostComponent(fiber);
  }
} // 将各 fiber 的操作以及它需要操作的孩子 fiber 都提交到父 fiber


function completeWork(fiber) {
  if (fiber.tag === _constants.COMPOSITE_COMPONENT && fiber.statNode != null) {
    fiber.statNode[_constants.INSTANCE_INNER_FIBER] = fiber;
  } // 向父 fiber 提交所有操作


  if (fiber.parent) {
    var childEffects = fiber.effects || [];
    var parentEffects = fiber.parent.effects || [];
    fiber.parent.effects = [].concat(_toConsumableArray(parentEffects), _toConsumableArray(childEffects), [fiber]);
  } else {
    pendingCommit = fiber;
  }
} // 提交阶段就是对所有需要操作的 fiber 进行遍历，将他们的结果呈现在浏览器


function commitAllWork(rootFiber) {
  var effects = rootFiber.effects;

  for (var i = 0; i < effects.length; i++) {
    var fiber = effects[i];
    var parentNodeFiber = upwardUtilNodeFiber(fiber);
    var nodeFiber = downwardUtilNodeFiber(fiber);

    if (nodeFiber) {
      var parentNode = parentNodeFiber.statNode;
      var node = nodeFiber.statNode;

      if (fiber.effectTag === _constants.OPERATION.ADD) {
        (0, _dom.appendNode)(parentNode, node);
      } else if (fiber.effectTag === _constants.OPERATION.REMOVE) {
        (0, _dom.removeNode)(parentNode, node);
      } else if (fiber.effectTag === _constants.OPERATION.REPLACE) {
        var prevNodeFiber = downwardUtilNodeFiber(nodeFiber.alternate);

        if (prevNodeFiber) {
          (0, _dom.replaceNode)(parentNode, node, prevNodeFiber.statNode);
        }
      } else if (fiber.effectTag === _constants.OPERATION.UPDATE) {
        if (fiber.tag === _constants.HOST_COMPONENT) {
          (0, _dom.updateNodeAttributes)(node, fiber.props, fiber.alternate.props);
        }
      }
    }

    var fiberInstance = fiber.type.isReactComponent ? fiber.statNode : null;

    if (fiberInstance && fiberInstance.isFirstCreate && typeof fiberInstance.componentDidMount === 'function') {
      fiberInstance.componentDidMount();
    }
  }
}

function downwardUtilNodeFiber(fiber) {
  while (fiber.tag === _constants.COMPOSITE_COMPONENT) {
    fiber = fiber.child;
  }

  return fiber;
}

function upwardUtilNodeFiber(fiber) {
  fiber = fiber.parent;

  while (fiber.tag === _constants.COMPOSITE_COMPONENT) {
    fiber = fiber.parent;
  }

  return fiber;
}

function workInCompositeComponent(fiber) {
  var type = fiber.type,
      props = fiber.props,
      alternate = fiber.alternate,
      statNode = fiber.statNode,
      partialState = fiber.partialState; // 未更新直接克隆

  if (alternate && alternate.props === props && !partialState) {
    cloneChildrenFiber(fiber);
    return;
  }

  var instance = statNode;
  var isClassComponent = type.isReactComponent;

  if (isClassComponent) {
    if (!instance) {
      instance = new type(props);
      instance.isFirstCreate = true;
    } else {
      instance.isFirstCreate = false;
    }

    instance.props = props;
    instance.state = Object.assign({}, instance.state, partialState);
  }

  fiber.statNode = instance;
  var childrenElements = instance ? instance.render() : type(props);
  reconcileChildren(fiber, childrenElements);
}

function workInHostComponent(fiber) {
  var _fiber$props = fiber.props,
      props = _fiber$props === void 0 ? {} : _fiber$props;

  if (!fiber.statNode) {
    fiber.statNode = (0, _dom.createNode)({
      type: fiber.type,
      props: fiber.props
    });
  }

  var childrenElements = props.children;
  reconcileChildren(fiber, childrenElements);
}

function reconcileChildren(fiber, elements) {
  elements = elements ? Array.isArray(elements) ? elements : [elements] : [];
  var oldChildFiber = fiber.alternate ? fiber.alternate.child : null;
  var newChildFiber = null;
  var index = 0;

  while (index < elements.length || oldChildFiber) {
    var prevFiber = newChildFiber;
    var element = elements[index];

    if (element) {
      newChildFiber = {
        tag: typeof element.type === 'function' ? _constants.COMPOSITE_COMPONENT : _constants.HOST_COMPONENT,
        type: element.type,
        props: element.props,
        parent: fiber,
        alternate: oldChildFiber
      };
    } else {
      newChildFiber = null;
    }

    if (!oldChildFiber && element) {
      newChildFiber.effectTag = _constants.OPERATION.ADD;
    }

    if (oldChildFiber) {
      if (!element) {
        // 移除 fiber tree，需存储
        oldChildFiber.effectTag = _constants.OPERATION.REMOVE;
        fiber.effects = fiber.effects || [];
        fiber.effects.push(oldChildFiber);
      } else if (element && newChildFiber.type !== oldChildFiber.type) {
        newChildFiber.effectTag = _constants.OPERATION.REPLACE;
      } else if (element && (oldChildFiber.props !== newChildFiber.props || oldChildFiber.partialState)) {
        newChildFiber.partialState = oldChildFiber.partialState;
        newChildFiber.statNode = oldChildFiber.statNode;
        newChildFiber.effectTag = _constants.OPERATION.UPDATE;
      }
    } // 更改指向


    if (oldChildFiber) {
      oldChildFiber = oldChildFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newChildFiber;
    } else {
      prevFiber.sibling = newChildFiber;
    }

    index += 1;
  }
}

function cloneChildrenFiber(parentFiber) {
  var oldFiber = parentFiber.alternate.child;
  var prevFiber = null; // 遍历更改指向

  while (oldFiber) {
    var newFiber = _objectSpread({}, oldFiber, {
      alternate: oldFiber,
      parent: parentFiber
    });

    if (!prevFiber) {
      parentFiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }

    prevFiber = newFiber;
    oldFiber = oldFiber.sibling;
  }
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
    value: function setState(nextState) {
      scheduleUpdate(this, nextState);
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
},{"./constants":"../src/constants.js"}],"fiber-demo.js":[function(require,module,exports) {
"use strict";

var _fiber = require("../src/reconciler/fiber");

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
}(_fiber.Component);

(0, _fiber.render)((0, _h.h)(App, null), document.getElementById('fiber-app'));
},{"../src/reconciler/fiber":"../src/reconciler/fiber.js","../src/h":"../src/h.js"}],"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57059" + '/');

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
},{}]},{},["../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","fiber-demo.js"], null)
//# sourceMappingURL=/fiber-demo.167446f8.map