/**
 * @Author: huangw1
 * @Date: 2019-11-20 17:43
 */
import {TEXT_NODE} from "../constants";

export function getFirstChildNode(node) {
    if (!(node instanceof Node)) {
        return null;
    }

    return node.firstChild
}

export function removeNode(parentNode, childNode) {
    if (!(parentNode instanceof Node) || !(childNode instanceof Node)) {
        return null;
    }

    parentNode.removeChild(childNode);
    return parentNode;
}

export function appendNode(parentNode, childNode) {
    if (!(parentNode instanceof Node) || !(childNode instanceof Node)) {
        return null;
    }

    parentNode.appendChild(childNode);
    return parentNode;
}

export function getParentNode(node) {
    if (!(node instanceof Node)) {
        return null;
    }

    return node.parentNode;
}

export function replaceNode(parentNode, newNode, oldNode) {
    if (!(parentNode instanceof Node) || !(newNode instanceof Node) || !(oldNode instanceof Node)) {
        return null;
    }

    parentNode.replaceChild(newNode, oldNode);
    return parentNode;
}

export function createNode (element) {
    const type = element.type || '';
    const props = element.props || {};

    if (typeof type !== 'string' || typeof props !== 'object') {
        return null;
    }

    let node;
    if (type === TEXT_NODE) {
        node = document.createTextNode(props.textContent || '');
    } else {
        node = document.createElement(type);

        setNodeAttributes(node, props);
    }

    return node;
}

// 事件代理 - 方便进行事件绑定和取消绑定
function eventProxy(e) {
    return this._listener[e.type](e);
}

const attributeHandler = {
    listener: (node, eventName, eventFunc) => {
        node.addEventListener(eventName, eventProxy);
        node._listener = node._listener || {};
        node._listener[eventName] = eventFunc;
    },

    unlistener: (node, eventName) => {
        node.removeEventListener(eventName, eventProxy);
    },

    style: (node, value) => {
        if (typeof value === 'object') {
            value = Object.keys(value).map(key => `${key}: ${value[key]}`).join(', ');
        }

        node.setAttribute('style', value);
    },

    className: (node, value) => {
        node.setAttribute('class', value);
    },
};

const isListener = propName => propName.startsWith('on');
const isStyle = propName => propName === 'style';
const isClass = propName => propName === 'class' || propName === 'className';
const isChildren = propName => propName === 'children';
const hasProperty = (obj, prop) => !Object.prototype.hasOwnProperty.call(obj, prop);

export function setNodeAttributes(node, props) {
    if (!(node instanceof HTMLElement)) {
        return;
    }

    props = props || {};
    if (typeof props !== 'object') {
        return;
    }

    Object.keys(props).forEach((prop) => {
        const value = props[prop];

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

export function updateNodeAttributes (node, newProps, oldProps) {
    newProps = newProps || {};
    oldProps = oldProps || {};

    if (node instanceof Text) {
        node.textContent = newProps.textContent || '';
        return;
    }

    if (!(node instanceof HTMLElement)) {
        return;
    }

    if (typeof newProps !== 'object' || typeof oldProps !== 'object') {
        return;
    }

    const willRemoveProps = {};
    const willSetProps = {};

    Object.keys(oldProps)
        .filter(prop => !isChildren(prop) && hasProperty(newProps, prop))
        .forEach((prop) => {
            willRemoveProps[prop] = oldProps[prop];
        });

    removeNodeAttributes(node, willRemoveProps);

    Object.keys(newProps)
        .filter(prop => !isChildren(prop))
        .forEach((prop) => {
            willSetProps[prop] = newProps[prop];
        });

    setNodeAttributes(node, willSetProps);
}

export function removeNodeAttributes(node, props) {
    if (!(node instanceof HTMLElement)) {
        return;
    }

    if (typeof props !== 'object') {
        return;
    }

    props = props || {};

    Object.keys(props).forEach((prop) => {
        if (isListener(prop)) {
            attributeHandler.unlistener(node, prop.replace(/^on/, '').toLowerCase());
        } else if (!isChildren(prop)) {
            node.removeAttribute(prop);
        }
    });
}
