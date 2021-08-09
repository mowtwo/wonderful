type Resolve = (result?: any) => any
type Reject = (reason?: any) => void
type Catch = (reason: any) => void
type PreSetFuncList = { onResolve?: Resolve; onReject?: Reject }[]
type BindCatch<T> = (this: ThisType<T>, reason: any) => void
type PromiseStatus = 'resolve' | 'reject'
type MPromiseCallback = (resolve: Resolve, reject: Reject) => void
type Finally = () => void
type BindFinally<T> = (this: ThisType<T>) => void

class MPromise {
  private preSetFuncList: PreSetFuncList = []
  private catchCallBack: BindCatch<MPromise> = function () {
    console.warn('unhandler reject')
  }
  private finallyCallback: BindFinally<MPromise> = function () { }
  private isDone = false

  constructor(callback: MPromiseCallback) {
    setTimeout(() => {
      try {
        callback(this.resolveCallback.bind(this), this.rejectCallback.bind(this))
      } catch (err) {
        this.catchCallBack.call(this, err)
      }
    }, 0);
  }

  private resolveCallback(val?: any) {
    if (this.preSetFuncList.length <= 0) {
      this.done()
      return
    }
    const item = this.preSetFuncList.shift()
    if (typeof item.onResolve == 'function') {
      const res = item.onResolve(val)
      this.next(res)
    }
    else {
      this.resolveCallback(val)
    }
  }
  private rejectCallback(reason?: any) {
    if (this.preSetFuncList.length <= 0) {
      this.catchCallBack(reason)
      this.done()
      return
    }
    const item = this.preSetFuncList.shift()
    if (typeof item.onReject == 'function') {
      item.onReject(reason)
      this.next()
    }
    else {
      this.rejectCallback(reason)
    }
  }
  private next(res?: any) {
    this.resolveCallback(res)
  }
  private done() {
    this.preSetFuncList.length = 0
    if (!this.isDone) {
      this.isDone = true
      this.finallyCallback.call(this)
    }
  }
  then(onResolve?: Resolve, onReject?: Reject) {
    this.preSetFuncList.push({
      onResolve, onReject
    })
    return this
  }
  catch(callback: Catch) {
    this.catchCallBack = callback.bind(this)
    return this
  }
  finally(callback: Finally) {
    this.finallyCallback = callback
    return this
  }
  static resolve(val: any) {
    return new MPromise(resolve => resolve(val))
  }
  static reject(reason: any) {
    return new MPromise((_, reject) => reject(reason))
  }
}