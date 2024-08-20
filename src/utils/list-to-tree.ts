import { sortTree } from './sort-tree'

export interface IOptions {
  id: string
  parentId: string
  children: string
  sort: string
}

export const listToTree = <T>(list: T[], options: IOptions = { id: 'id', parentId: 'parentId', children: 'children', sort: 'sort' }) => {
  const map = new Map()
  const tree = []

  list.forEach((item) => {
    item[options.children] = []

    map.set(item[options.id], item)
  })

  list.forEach((item) => {
    const parent = map.get(item[options.parentId])

    if (parent) {
      parent[options.children].push(item)
    } else {
      tree.push(item)
    }
  })

  return sortTree(tree, options)
}
