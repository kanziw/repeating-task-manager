interface RepeatingTaskOptions {
  readonly isRegister?: boolean
  readonly onError?: onErrorFunction
}

interface onErrorFunction {
  (error: Error): void
}

const defaultRepeatingTaskOptions: RepeatingTaskOptions = {
  isRegister: false,
  onError: () => undefined,
}

export default class RepeatingTaskManager {
  private isPausing = false
  private hashFn = new Map<string, Function>()
  private clearFn = new Map<string, Function>()

  public register = (task: string, interval: number, fn: Function) => {
    const repeatTask = async ({isRegister, onError}: RepeatingTaskOptions = defaultRepeatingTaskOptions) => {
      if (!this.isPausing) {
        try {
          await Promise.resolve(fn({isRegister}))
        } catch (ex) {
          onError!(ex)
        }
      }
      const timer = setTimeout(repeatTask, interval)
      this.clearFn.set(task, () => clearTimeout(timer))
    }
    this.hashFn.set(task, fn)
  }

  public execute = (task: string, options: RepeatingTaskOptions): Promise<any> => {
    return Promise.resolve(this.hashFn.has(task) && this.hashFn.get(task)!(options))
  }

  public clearAll = (): void => this.clearFn.forEach((clearFunction: Function) => clearFunction())

  public pause = (): void => {
    this.isPausing = true
  }

  public resume = (): void => {
    this.isPausing = false
  }
}
