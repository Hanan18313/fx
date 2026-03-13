export declare function buildTree<T extends {
    id: number;
    parentId: number;
}>(list: T[], rootParentId?: number): (T & {
    children: T[];
})[];
