/**
 * @Author: huangw1
 * @Date: 2019-11-20 17:11
 */

// 前缀
const prefix = '@react/__';

// 通用常量
export const TEXT_NODE = `${prefix}text_node`;

// diff 类型
export const OPERATION = {
    ADD: `${prefix}operation_add`,
    REMOVE: `${prefix}operation_remove`,
    REPLACE: `${prefix}operation_replace`,
    UPDATE: `${prefix}_operation_update`,
};

// diff 中常量
export const RENDERED_INTERNAL_INSTANCE = `${prefix}rendered_internal_instance`;

export const INTERNAL_INSTANCE = `${prefix}internal_instance`;
