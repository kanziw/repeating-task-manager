interface TaskFunction {
  (options: RepeatingTaskOptions): any
}

interface RepeatingTaskOptions {
  readonly isRegister: boolean
}

interface RegisterOptions {
  readonly onError?: onErrorFunction
}

interface onErrorFunction {
  (error: Error): void
}
