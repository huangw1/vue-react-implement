/**
 * @Author: huangw1
 * @Date: 2019-11-20 17:15
 */

import {TEXT_NODE} from "./constants";

export function h(type, props, ...children) {
    props = props || {};

    children = [].concat(...children)
        .filter(child => child !== null && typeof child !== 'boolean')
        .map(child => (typeof child === 'number' ? String(child) : child))
        .map(child => (typeof child === 'string' ? h(TEXT_NODE, { textContent: child }) : child));

    props.children = children;

    return { type, props };
}
