export interface TaskFunction {
    (options: RepeatingTaskOptions): any;
}
export interface RepeatingTaskOptions {
    readonly isRegister: boolean;
}
export interface RegisterOptions {
    readonly onError?: onErrorFunction;
}
export interface onErrorFunction {
    (error: Error): void;
}
export type TaskID = string;
export default class RepeatingTaskManager {
    private dicFn;
    private dicClearFn;
    private dicPause;
    register(taskId: TaskID, interval: number, taskFunction: TaskFunction, { onError }?: RegisterOptions): void;
    execute: (taskId: TaskID, options?: RepeatingTaskOptions) => Promise<any>;
    clear(taskId: TaskID): void;
    clearAll(): void;
    pause(taskId?: TaskID): void;
    resume(taskId?: TaskID): void;
    private doTaskAfter;
}
export declare function getDuplicatedTaskKeyError(taskId: TaskID): Error;
