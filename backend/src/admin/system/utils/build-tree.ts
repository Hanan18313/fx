/**
 * 将扁平列表转换为树形结构
 * @param list  扁平数据（每项须含 id 和 parentId）
 * @param rootParentId  根节点的 parentId，默认 0
 */
export function buildTree<T extends { id: number; parentId: number }>(
  list: T[],
  rootParentId: number = 0,
): (T & { children: T[] })[] {
  const map = new Map<number, T & { children: T[] }>();
  const roots: (T & { children: T[] })[] = [];

  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of list) {
    const node = map.get(item.id)!;
    if (item.parentId === rootParentId) {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        // 找不到父节点时挂到根
        roots.push(node);
      }
    }
  }

  return roots;
}
