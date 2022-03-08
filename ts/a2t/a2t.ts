type Ident = {
  id: number
  pid: number
}

type Identify<T> = T & Ident

type Merge<T extends {}, U extends {}> = T & U

type WithChildren<T> = T & {
  children: Array<WithChildren<T>>
}

function a2t<T extends Ident>(arr: Array<T>): WithChildren<T>[] {
  if (arr.length <= 0) {
    return []
  }
  const transArr: WithChildren<T>[] = arr.map(item => ({
    ...item,
    children: []
  }))
  const result: WithChildren<T>[] = [transArr[0]]
  const itemMap = new Map<number, WithChildren<T>>(transArr.map(item => [item.id, item]))

  for (const item of transArr) {
    if (itemMap.has(item.pid)) {
      const parent = itemMap.get(item.pid)!
      if (parent.id !== item.id) {
        parent.children.push(item)
      } else {
        result.push(item)
      }
    } else {
      result.push(item)
    }
  }
  return result
}

function t2a<T extends WithChildren<{ id: number }>>(tree: T[]): Identify<T>[] {
  type RT = Identify<T>
  type RTA = RT[]
  const result: RTA = []
  const queue: [pid: number, item: T][] = tree.map(item => [0, item])
  for (; ;) {
    if (queue.length <= 0) {
      break
    }
    const tuple = queue.shift()!
    const { children, ...otherItem } = tuple[1]
    result.push({
      ...otherItem,
      pid: tuple[0],
    } as RT)
    queue.push(...children.map(item => [otherItem.id, item as T] as [pid: number, item: T]))
  }
  return result.sort((item1, item2) => item1.id - item2.id)
}

console.time()
const res = a2t([
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
  { id: 7, name: '部门5', pid: 7 },
])
console.timeEnd()
// console.log(JSON.stringify(res, null, ' '))

console.time()
const rev = t2a(res)
console.timeEnd()
// console.log(JSON.stringify(rev, null, ' '))