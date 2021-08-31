export class LinkedList<T> implements Iterable<LinkedList<T>> {
  constructor(
    private _value: T,
    private _next?: LinkedList<T>
  ) { }
  get value() { return this._value }
  set value(v: T) { this._value = v }
  get next() { return this._next }
  set next(n: LinkedList<T>) { this._next = n }
  get length() {
    let len = 1
    let curNode = this as LinkedList<T>
    while (curNode.next != null) {
      len++
      curNode = curNode.next
    }
    return len
  }
  get tail() {
    let curNode = this as LinkedList<T>
    while (true) {
      if (!curNode.next) {
        return curNode
      }
      curNode = curNode.next
    }
  }
  get valueIter(): Iterable<T> {
    const self = this as LinkedList<T>
    return {
      [Symbol.iterator]() {
        let curNode = self
        return {
          next() {
            const value = curNode?.value ?? undefined
            if (curNode) {
              curNode = curNode.next
              return {
                value,
                done: false
              }
            } else {
              return {
                value,
                done: true
              }
            }
          }
        }
      }
    }
  }
  [Symbol.iterator]() {
    let curNode = this as LinkedList<T>
    return {
      next() {
        const value = curNode ?? undefined
        if (curNode) {
          curNode = curNode.next
          return {
            value,
            done: false
          }
        } else {
          return {
            value,
            done: true
          }
        }
      }
    }
  }
  insert(index: number, v: T) {
    if (index >= this.length) {
      return false
    }
    if (index == 0) {
      const temp = this.next
      this.next = new LinkedList(v, temp)
      return true
    } else if (index == this.length - 1) {
      this.tail.next = new LinkedList(v)
      return true
    } else {
      let curNode: LinkedList<T> = this
      for (let i = 0; i < index; i++) {
        curNode = curNode.next
        if (!curNode) {
          return false
        }
      }
      const temp = curNode.next
      curNode.next = new LinkedList(v, temp)
      return true
    }
  }
}

export interface ILinkedList<T> {
  value: T;
  next?: ILinkedList<T>
}

export function init<T>(value: T, next?: ILinkedList<T>): ILinkedList<T> {
  return {
    value, next
  }
}

export function length(list: ILinkedList<unknown>): number {
  let len = 1
  let curNode = list
  while (curNode.next != null) {
    len++
    curNode = curNode.next
  }
  return len
}

export function iter<T>(list: ILinkedList<T>): Iterable<ILinkedList<T>> {
  return {
    [Symbol.iterator]() {
      let curNode = list
      return {
        next() {
          const value = curNode ?? undefined
          if (curNode) {
            curNode = curNode.next
            return {
              value, done: false
            }
          } else {
            return {
              value, done: true
            }
          }
        }
      }
    }
  }
}

export function getValueIter<T>(list: ILinkedList<T>): Iterable<T> {
  return {
    [Symbol.iterator]() {
      let curNode = list
      return {
        next() {
          const value = curNode?.value ?? undefined
          if (curNode) {
            curNode = curNode.next
            return {
              value, done: false
            }
          } else {
            return {
              value, done: true
            }
          }
        }
      }
    }
  }
}

export function insert<T>(list: ILinkedList<T>, index: number, v: T): boolean {
  if (index >= length(list)) {
    return false
  }
  if (index == 0) {
    const temp = list.next
    list.next = init(v, temp)
    return true
  } else {
    let curNode = list
    for (let i = 0; i < index; i++) {
      if (curNode.next) {
        curNode = curNode.next
      } else {
        return false
      }
    }
    const temp = curNode.next
    curNode.next = init(v, temp)
    return true
  }
}

export function tail<T>(list: ILinkedList<T>): ILinkedList<T> {
  let curNode = list
  while (true) {
    if (!curNode.next) {
      return curNode
    }
    curNode = curNode.next
  }
}