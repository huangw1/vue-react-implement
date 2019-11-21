/**
 * @Author: huangw1
 * @Date: 2019-11-20 17:45
 */
import {INTERNAL_INSTANCE, OPERATION, RENDERED_INTERNAL_INSTANCE} from "../constants";
import {
    appendNode,
    createNode,
    getFirstChildNode,
    getParentNode,
    removeNode,
    replaceNode,
    updateNodeAttributes
} from "../render/dom";

function instantiateComponent(element) {
    const {type} = element;
    const isHostComponent = typeof type === 'string';
    let internalInstance;

    if (isHostComponent) {
        internalInstance = new HostComponent(element);
    } else {
        internalInstance = new CompositeComponent(element);
    }

    return internalInstance;
}

// 管理组件
class CompositeComponent {
    constructor(element) {
        this.currentElement = element;
        this.publicInstance = null;
        this.renderedInternalInstance = null;
    }

    getHostNode() {
        return this.renderedInternalInstance.getHostNode();
    }

    mount() {
        const element = this.currentElement;
        const { type = (() => {}), props = {} } = element;

        let renderedElement;
        if (isClass(type)) {
            const publicInstance = new type(props);
            this.publicInstance = publicInstance;
            renderedElement = publicInstance.render();
        } else {
            renderedElement = type(props);
        }

        const renderedInternalInstance = instantiateComponent(renderedElement);
        this.renderedInternalInstance = renderedInternalInstance;

        if (this.publicInstance) {
            this.publicInstance[RENDERED_INTERNAL_INSTANCE] = renderedInternalInstance;
        }

        const node = renderedInternalInstance.mount();
        if (this.publicInstance && typeof this.publicInstance.componentDidMount === 'function') {
            this.publicInstance.componentDidMount();
        }

        return node;
    }

    unmount() {
        const { renderedInternalInstance } = this;
        renderedInternalInstance.unmount();
    }

    receive (element) {
        const prevRenderedInternalInstance = this.renderedInternalInstance;
        const prevRenderedElement = prevRenderedInternalInstance.currentElement;

        const { type } = element;
        const nextProps = element.props || {};

        if (this.publicInstance) {
            this.publicInstance.props = nextProps;
        }

        let nextRenderedElement;
        if (isClass(type)) {
            nextRenderedElement = this.publicInstance.render();
        } else {
            nextRenderedElement = type(nextProps);
        }

        if (prevRenderedElement.type === nextRenderedElement.type) {
            prevRenderedInternalInstance.receive(nextRenderedElement);
        }

        // 直接替换
        const prevNode = prevRenderedInternalInstance.getHostNode();
        const nextRenderedInternalInstance = instantiateComponent(nextRenderedElement);
        // const nextNode = nextRenderedInternalInstance.getHostNode()
        const nextNode = nextRenderedInternalInstance.mount();

        const parentNode = getParentNode(prevNode);
        if (parentNode) {
            replaceNode(parentNode, nextNode, prevNode);
        }
    }
}

class HostComponent {
    constructor(element) {
        this.currentElement = element;
        this.renderedInternalInstanceChildren = [];
        this.node = null;
    }

    getHostNode() {
        return this.node;
    }

    mount () {
        const element = this.currentElement;
        const props = element.props || {};

        const node = createNode(element);
        this.node = node;

        let elementChildren = props.children || [];
        if (!Array.isArray(elementChildren)) {
            elementChildren = [elementChildren];
        }

        const renderedInternalInstanceChildren = elementChildren.map(instantiateComponent);
        const nodeChildren = renderedInternalInstanceChildren.map(child => child.mount());
        this.renderedInternalInstanceChildren = renderedInternalInstanceChildren;

        nodeChildren.forEach(nodeChild => appendNode(node, nodeChild));

        return node;
    }

    unmount () {
        const node = this.node;
        const renderedInternalInstanceChildren = this.renderedInternalInstanceChildren;
        if (renderedInternalInstanceChildren) {
            renderedInternalInstanceChildren.forEach(child => {
                child.unmount();

                const childNode = child.getHostNode();
                removeNode(node, childNode);
            })
        }
    }

    receive (element) {
        const node = this.node;
        const prevProps = this.currentElement.props;
        const nextProps = element.props || {};

        updateNodeAttributes(node, nextProps, prevProps);

        const prevRenderedInternalInstanceChildren = this.renderedInternalInstanceChildren;
        const nextRenderedInternalInstanceChildren = [];

        const prevElementChildren = prevProps.children || [];
        const nextElementChildren = nextProps.children || [];

        const operationQueue = [];

        for (let i = 0; i < nextElementChildren.length; i++) {
            const prevRenderedInternalInstance = prevRenderedInternalInstanceChildren[i];
            const prevElement = prevElementChildren[i];
            const nextElement = nextElementChildren[i];

            // 新增
            if (!prevElement) {
                const nextRenderedInternalInstance = instantiateComponent(nextElement);
                const nextNode = nextRenderedInternalInstance.mount();

                nextRenderedInternalInstanceChildren.push(nextRenderedInternalInstance);
                operationQueue.push({ type: OPERATION.ADD, node: nextNode });
                continue;
            }

            // 替换
            const canUpdate = prevElement.type === nextElement.type;
            if (!canUpdate) {
                const nextRenderedInternalInstance = instantiateComponent(nextElement);
                const nextNode = nextRenderedInternalInstance.mount();

                const prevNode = prevRenderedInternalInstance.getHostNode();

                nextRenderedInternalInstanceChildren.push(nextRenderedInternalInstance);

                operationQueue.push({ type: OPERATION.REPLACE, prevNode, nextNode });
                continue;
            }

            // 更新
            prevRenderedInternalInstance.receive(nextElement);
            nextRenderedInternalInstanceChildren.push(prevRenderedInternalInstance);
        }

        // 删除
        for (let i = nextElementChildren.length; i < prevElementChildren.length; i++) {
            const prevRenderedInternalInstance = prevRenderedInternalInstanceChildren[i];
            prevRenderedInternalInstance.unmount();

            const prevNode = prevRenderedInternalInstance.getHostNode();
            operationQueue.push({ type: OPERATION.REMOVE, node: prevNode });
        }

        // 执行各操作
        while (operationQueue.length > 0) {
            const operation = operationQueue.shift();

            if (operation.type === OPERATION.ADD) {
                appendNode(node, operation.node);
            } else if (operation.type === OPERATION.REMOVE) {
                removeNode(node, operation.node);
            } else if (operation.type === OPERATION.REPLACE) {
                replaceNode(node, operation.nextNode, operation.prevNode);
            }
        }
        this.renderedInternalInstanceChildren = nextRenderedInternalInstanceChildren;
    }
}

function unmountAll(containerNode) {
    const firstChildNode = getFirstChildNode(containerNode);

    if (firstChildNode) {
        const rootInternalInstance = firstChildNode[INTERNAL_INSTANCE];

        if (rootInternalInstance) {
            rootInternalInstance.unmount();
            const rootNode = rootInternalInstance.getHostNode();

            removeNode(containerNode, rootNode);
        }
    }
}

export function render(element, containerNode) {
    const firstChildNode = getFirstChildNode(containerNode)
    if (firstChildNode) {
        const prevInternalInstance = firstChildNode[INTERNAL_INSTANCE];
        if (prevInternalInstance) {
            const prevElement = prevInternalInstance.currentElement;

            if (prevElement.type === element.type) {
                prevInternalInstance.receive(element);
                return;
            }
        }

        unmountAll(containerNode)
    }

    const internalInstance = instantiateComponent(element);
    const node = internalInstance.mount();

    node[INTERNAL_INSTANCE] = internalInstance;
    appendNode(containerNode, node);
}

function isClass(type) {
    return type.isReactComponent;
}

export class Component {
    constructor(props) {
        this.props = props
    }

    setState (state) {
        const nextState = Object.assign({}, state);
        const renderedInternalInstance = this[RENDERED_INTERNAL_INSTANCE];

        this.state = nextState;
        const nextRenderedElement = this.render();

        if (renderedInternalInstance) {
            renderedInternalInstance.receive(nextRenderedElement);
        }
    }

    componentDidMount () {
        // override
    }

    render () {
        // override
    }
}

Component.isReactComponent = true;
