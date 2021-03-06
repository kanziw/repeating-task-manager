export interface TaskFunction {
  (options: RepeatingTaskOptions): any
}

export interface RepeatingTaskOptions {
  readonly isRegister: boolean
}

export interface RegisterOptions {
  readonly onError?: onErrorFunction
}

export interface onErrorFunction {
  (error: Error): void
}

export type TaskID = string

export default class RepeatingTaskManager {
  private dicFn = new Map<TaskID, Function>()
  private dicClearFn = new Map<TaskID, Function>()
  private dicPause = new Map<TaskID, boolean>()

  public register(
    taskId: TaskID,
    interval: number,
    taskFunction: TaskFunction,
    { onError = () => undefined }: RegisterOptions = {},
  ): void {
    if (!taskId || this.dicFn.has(taskId)) {
      throw getDuplicatedTaskKeyError(taskId)
    }

    const repeatTask = async (options: RepeatingTaskOptions) => {
      if (!this.dicPause.get(taskId)) {
        try {
          await Promise.resolve(taskFunction(options))
        } catch (ex) {
          onError(ex)
        }
      }
      this.doTaskAfter(taskId, () => repeatTask({ isRegister: false }), interval)
    }
    this.dicFn.set(taskId, taskFunction)
    this.dicPause.set(taskId, false)
    this.doTaskAfter(taskId, () => repeatTask({ isRegister: true }), interval)
  }

  public execute = (taskId: TaskID, options?: RepeatingTaskOptions): Promise<any> => {
    return Promise.resolve(this.dicFn.has(taskId) && this.dicFn.get(taskId)!(options))
  }

  public clear(taskId: TaskID) {
    const clearFn = this.dicClearFn.get(taskId)
    if (clearFn) {
      clearFn()
      this.dicFn.delete(taskId)
      this.dicClearFn.delete(taskId)
    }
  }

  public clearAll(): void {
    this.dicFn.forEach((_, taskId: TaskID) => this.clear(taskId))
  }

  public pause(taskId?: TaskID): void {
    if (!taskId) {
      this.dicPause.forEach((_, taskId: TaskID) => this.pause(taskId))
    } else if (this.dicPause.has(taskId)) {
      this.dicPause.set(taskId, true)
    }
  }

  public resume(taskId?: TaskID): void {
    if (!taskId) {
      this.dicPause.forEach((_, taskId: TaskID) => this.resume(taskId))
    } else if (this.dicPause.has(taskId)) {
      this.dicPause.set(taskId, false)
    }
  }

  private doTaskAfter(taskId: TaskID, taskFunction: TaskFunction, interval: number): void {
    const timer = setTimeout(taskFunction, interval)
    this.dicClearFn.set(taskId, () => clearTimeout(timer))
  }
}

export function getDuplicatedTaskKeyError(taskId: TaskID): Error {
  return new Error(`Given task key [${taskId}] was duplicated.`)
}
