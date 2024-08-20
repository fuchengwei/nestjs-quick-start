import type { IOptions } from './list-to-tree'

export const sortTree = <T>(list: T[], options: IOptions) => {
  const { sort, children } = options

  const cloneList = structuredClone(list)

  cloneList.sort((a, b) => a[sort] - b[sort])

  cloneList.forEach((item) => {
    if (item[children].length) {
      item[children] = sortTree(item[children], options)
    }
  })

  return cloneList
}
