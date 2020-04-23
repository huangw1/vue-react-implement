/**
 * @Author: huangw1
 * @Date: 2019-11-21 11:13
 */

import {
    COMPOSITE_COMPONENT,
    ENOUGH_TIME,
    HOST_COMPONENT,
    HOST_ROOT,
    INSTANCE_INNER_FIBER, OPERATION,
    ROOT_FIBER
} from "../constants";
import {appendNode, createNode, removeNode, replaceNode, updateNodeAttributes} from "../render/dom";

// 任务队列
let taskQueue = [];

// 下一个需要操作的 fiber
let nextUnitWork = null;

// 所有操作完成后，会将该值赋值为跟节点
let pendingCommit = null;

if (!global['requestIdleCallback']) {
    global['requestIdleCallback'] = (func) => func({
        timeRemaining () {
            return 100
        }
    });
}

export function render(elements, containerDom) {
    taskQueue.push({
        tag  : HOST_ROOT,
        dom  : containerDom,
        props: {
            children: elements
        }
    });

    requestIdleCallback(performWork);
}

// 更新函数
export function scheduleUpdate(instance, partialState) {
    taskQueue.push({
        tag  : HOST_COMPONENT,
        instance,
        partialState,
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

    if (nextUnitWork && deadline.timeRemaining() > ENOUGH_TIME) {
        nextUnitWork = performUnitWork(nextUnitWork);
    }

    // 如果所有任务执行完毕则提交所有任务
    if (pendingCommit) {
        commitAllWork(pendingCommit);
    }
}

// 获取下一个要操作的 fiber
// 更新或渲染的过程就是构建 fiber 树的过程，每次都是从根 fiber 开始
function resetNextUnitWork() {
    const task = taskQueue.shift();
    if (task === undefined) {
        return null
    }

    if (task.tag === HOST_ROOT) {
        nextUnitWork = {
            tag      : HOST_ROOT,
            statNode : task.dom,
            props    : task.props,
            alternate: task.dom[ROOT_FIBER],
        };
        return nextUnitWork;
    }

    const currentFiber = task.instance[INSTANCE_INNER_FIBER];
    // 有疑问 - use while get root fiber
    const getRootFiber = (fiber) => {
        if (fiber.tag !== HOST_ROOT) {
            fiber = fiber.parent;
        }
        return fiber;
    };
    const oldRootFiber = getRootFiber(currentFiber);
    nextUnitWork = {
        tag      : HOST_ROOT,
        statNode : oldRootFiber.statNode,
        props    : oldRootFiber.props,
        alternate: oldRootFiber
    };

    if (task.partialState) {
        currentFiber.partialState = task.partialState;
    }
    return nextUnitWork
}

function performUnitWork(fiber) {
    beginWork(fiber);

    // 采用深度优先遍历 fiber 树，先遍历孩子节点
    if (fiber.child) {
        return fiber.child
    }

    while (fiber) {
        completeWork(fiber)
        if (fiber.sibling) {
            return fiber.sibling;
        }

        // 父节点兄弟节点
        fiber = fiber.parent;
    }
    return null
}

function beginWork(fiber) {
    if (fiber.tag === COMPOSITE_COMPONENT) {
        workInCompositeComponent(fiber);
    } else {
        workInHostComponent(fiber);
    }
}

// 将各 fiber 的操作以及它需要操作的孩子 fiber 都提交到父 fiber
function completeWork(fiber) {
    if (fiber.tag === COMPOSITE_COMPONENT && fiber.statNode != null) {
        fiber.statNode[INSTANCE_INNER_FIBER] = fiber;
    }

    // 向父 fiber 提交所有操作
    if (fiber.parent) {
        const childEffects = fiber.effects || [];
        const parentEffects = fiber.parent.effects || [];
        fiber.parent.effects = [...parentEffects, ...childEffects, fiber];
    } else {
        pendingCommit = fiber;
    }
}

// 提交阶段就是对所有需要操作的 fiber 进行遍历，将他们的结果呈现在浏览器
function commitAllWork(rootFiber) {
    const { effects } = rootFiber;
    for (let i = 0; i < effects.length; i++) {
        const fiber = effects[i];
        const parentNodeFiber = upwardUtilNodeFiber(fiber);
        const nodeFiber = downwardUtilNodeFiber(fiber);

        if (nodeFiber) {
            const parentNode = parentNodeFiber.statNode;
            const node = nodeFiber.statNode;

            if (fiber.effectTag === OPERATION.ADD) {
                appendNode(parentNode, node)
            } else if (fiber.effectTag === OPERATION.REMOVE) {
                removeNode(parentNode, node);
            } else if (fiber.effectTag === OPERATION.REPLACE) {
                const prevNodeFiber = downwardUtilNodeFiber(nodeFiber.alternate);

                if (prevNodeFiber) {
                    replaceNode(parentNode, node, prevNodeFiber.statNode);
                }
            } else if (fiber.effectTag === OPERATION.UPDATE) {
                if (fiber.tag === HOST_COMPONENT) {
                    updateNodeAttributes(node, fiber.props, fiber.alternate.props);
                }
            }
        }

        const fiberInstance = fiber.type.isReactComponent ? fiber.statNode : null;
        if (fiberInstance && fiberInstance.isFirstCreate && typeof fiberInstance.componentDidMount === 'function') {
            fiberInstance.componentDidMount();
        }
    }
}

function downwardUtilNodeFiber(fiber) {
    while (fiber.tag === COMPOSITE_COMPONENT) {
        fiber = fiber.child;
    }
    return fiber;
}

function upwardUtilNodeFiber(fiber) {
    fiber = fiber.parent;
    while (fiber.tag === COMPOSITE_COMPONENT) {
        fiber = fiber.parent;
    }
    return fiber;
}

function workInCompositeComponent(fiber) {
    const { type, props, alternate, statNode, partialState } = fiber;

    // 未更新直接克隆
    if (alternate && alternate.props === props && !partialState) {
        cloneChildrenFiber(fiber);
        return;
    }

    let instance = statNode;
    const isClassComponent = type.isReactComponent;
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

    const childrenElements = instance ? instance.render() : type(props);
    reconcileChildren(fiber, childrenElements);
}

function workInHostComponent(fiber) {
    const { props = {} } = fiber;

    if (!fiber.statNode) {
        fiber.statNode = createNode({
            type: fiber.type,
            props: fiber.props
        })
    }

    const childrenElements = props.children;
    reconcileChildren(fiber, childrenElements);
}

/**
 // react call stack 实现
 function link(parent, elements) {
    if (elements === null) elements = [];

    parent.child = elements.reduceRight((previous, current) => {
        const node = new Node(current);
        node.return = parent;
        node.sibling = previous;
        return node;
    }, null);

    return parent.child;
 }
 // 实现类似
 */
function reconcileChildren(fiber, elements) {
    elements = elements ? (Array.isArray(elements) ? elements : [elements]) : [];

    let oldChildFiber = fiber.alternate ? fiber.alternate.child : null;
    let newChildFiber = null;
    let index = 0;

    while (index < elements.length || oldChildFiber) {
        const prevFiber = newChildFiber;
        const element = elements[index];

        if (element){
            newChildFiber = {
                tag: typeof element.type === 'function' ? COMPOSITE_COMPONENT : HOST_COMPONENT,
                type: element.type,
                props: element.props,
                parent: fiber,
                alternate: oldChildFiber
            }
        } else {
            newChildFiber = null;
        }

        if (!oldChildFiber && element) {
            newChildFiber.effectTag = OPERATION.ADD
        }

        if (oldChildFiber) {
            if (!element) {
                // 移除 fiber tree，需存储
                oldChildFiber.effectTag = OPERATION.REMOVE;
                fiber.effects = fiber.effects || [];
                fiber.effects.push(oldChildFiber);
            } else if (element && newChildFiber.type !== oldChildFiber.type) {
                newChildFiber.effectTag = OPERATION.REPLACE
            } else if (element && (oldChildFiber.props !== newChildFiber.props || oldChildFiber.partialState)) {
                newChildFiber.partialState = oldChildFiber.partialState;
                newChildFiber.statNode = oldChildFiber.statNode;
                newChildFiber.effectTag = OPERATION.UPDATE;
            }
        }

        // 更改指向
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
    let oldFiber = parentFiber.alternate.child;
    let prevFiber = null;

    // 遍历更改指向
    while (oldFiber) {
        const newFiber = {
            ...oldFiber,
            alternate: oldFiber,
            parent: parentFiber,
        };

        if (!prevFiber) {
            parentFiber.child = newFiber;
        } else {
            prevFiber.sibling = newFiber;
        }

        prevFiber = newFiber;
        oldFiber = oldFiber.sibling;
    }
}

export class Component {
    constructor(props) {
        this.props = props
    }

    setState (nextState) {
        scheduleUpdate(this, nextState);
    }
}

Component.isReactComponent = true;
