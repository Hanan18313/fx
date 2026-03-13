export function buildTree<T extends { id: number; parentId: number; children?: T[] }>(
  list: T[],
  parentId = 0,
): T[] {
  const tree: T[] = [];
  for (const item of list) {
    if (item.parentId === parentId) {
      const children = buildTree(list, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  }
  return tree;
}
