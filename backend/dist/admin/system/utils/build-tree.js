"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTree = buildTree;
function buildTree(list, rootParentId = 0) {
    const map = new Map();
    const roots = [];
    for (const item of list) {
        map.set(item.id, { ...item, children: [] });
    }
    for (const item of list) {
        const node = map.get(item.id);
        if (item.parentId === rootParentId) {
            roots.push(node);
        }
        else {
            const parent = map.get(item.parentId);
            if (parent) {
                parent.children.push(node);
            }
            else {
                roots.push(node);
            }
        }
    }
    return roots;
}
//# sourceMappingURL=build-tree.js.map