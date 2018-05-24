export default class RepeatingTaskManager {
  private isPausing = false
  private hashFn = new Map<string, Function>()
  private clearFn = new Map<string, Function>()

  public register = (
    task: string,
    interval: number,
    fn: TaskFunction,
    { onError = () => undefined }: RegisterOptions = {},
  ): any | Promise<any> => {
    const repeatTask = async (options: RepeatingTaskOptions) => {
      if (!this.isPausing) {
        try {
          await Promise.resolve(fn(options))
        } catch (ex) {
          onError(ex)
        }
      }
      const timer = setTimeout(() => repeatTask({ isRegister: false }), interval)
      this.clearFn.set(task, () => clearTimeout(timer))
    }
    this.hashFn.set(task, fn)
    return repeatTask({ isRegister: true })
  }

  public execute = (task: string, options?: RepeatingTaskOptions): Promise<any> => {
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
