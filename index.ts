export type TaskFunction = (options: RepeatingTaskOptions) => any

export interface RepeatingTaskOptions {
  readonly isRegister: boolean
}

export interface RegisterOptions {
  readonly onError?: onErrorFunction
}

export type onErrorFunction = (error: unknown) => void

export type TaskID = string

export default class RepeatingTaskManager {
  private readonly dicFn = new Map<TaskID, Function>()
  private readonly dicClearFn = new Map<TaskID, Function>()
  private readonly dicPause = new Map<TaskID, boolean>()

  public register (
    taskId: TaskID,
    interval: number,
    taskFunction: TaskFunction,
    { onError = () => undefined }: RegisterOptions = {}
  ): void {
    if (!taskId || this.dicFn.has(taskId)) {
      throw new Error(`Given task key [${taskId}] was duplicated.`)
    }

    const repeatTask = async (options: RepeatingTaskOptions): Promise<void> => {
      if (!this.dicPause.get(taskId)) {
        try {
          await Promise.resolve(taskFunction(options))
        } catch (err) {
          onError(err)
        }
      }
      this.doTaskAfter(taskId, async () => { await repeatTask({ isRegister: false }) }, interval)
    }
    this.dicFn.set(taskId, taskFunction)
    this.dicPause.set(taskId, false)
    this.doTaskAfter(taskId, async () => { await repeatTask({ isRegister: true }) }, interval)
  }

  public async execute (taskId: TaskID, options?: RepeatingTaskOptions): Promise<any> {
    const task = this.dicFn.get(taskId)
    if (!task) {
      return
    }
    return await Promise.resolve(task(options))
  }

  public clear (taskId: TaskID): void {
    const clearFn = this.dicClearFn.get(taskId)
    if (clearFn != null) {
      clearFn()
      this.dicFn.delete(taskId)
      this.dicClearFn.delete(taskId)
    }
  }

  public clearAll (): void {
    this.dicFn.forEach((_, taskId: TaskID) => { this.clear(taskId) })
  }

  public pause (taskId?: TaskID): void {
    if (!taskId) {
      this.dicPause.forEach((_, taskId: TaskID) => { this.pause(taskId) })
    } else if (this.dicPause.has(taskId)) {
      this.dicPause.set(taskId, true)
    }
  }

  public resume (taskId?: TaskID): void {
    if (!taskId) {
      this.dicPause.forEach((_, taskId: TaskID) => { this.resume(taskId) })
    } else if (this.dicPause.has(taskId)) {
      this.dicPause.set(taskId, false)
    }
  }

  private doTaskAfter (taskId: TaskID, taskFunction: TaskFunction, interval: number): void {
    const timer = setTimeout(taskFunction, interval)
    this.dicClearFn.set(taskId, () => { clearTimeout(timer) })
  }
}
