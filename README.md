# RepeatingTaskManager
> Repeating task manager using tail recursion for Node.js

* [NPM repository](https://www.npmjs.com/package/repeating-task-manager)

## Install

### Using NPM
```bash
npm install repeating-task-manager
```

### Using Yarn
```bash
yarn add repeating-task-manager
```

## Usage

## Simple example
```javascript
import RepeatingTaskManager from 'repeating-task-manager'

const rtm = new RepeatingTaskManager()

const taskKey = 'TASK_KEY'
let cnt = 0
rtm.register(taskKey, 10, () => console.log(`[${++cnt}] TASK!`))

setTimeout(() => rtm.clear(taskKey), 1000)

// [1] TASK!
// [2] TASK!
// [3] TASK!
// [4] TASK!
// [5] TASK!
// [6] TASK!
// [7] TASK!
// [8] TASK!
// [9] TASK!
// [10] TASK!
// ....
```

## rtm.register
> Register task.
> Throws an Error when an already registered task key is entered.

### (taskId, interval, taskFunction[, options]) => void
* taskId `<string>` Unique ID for task
* interval `<number>` Interval times(ms) between before task and after task
* taskFunction: `<Function>` Function to be executed repeatedly
* options
  * onError: `<Function>`
    * err: `<Error>`


## rtm.execute
> Execute task function immediately

### (taskId[, options]) => void (or depends on task function.)
* taskId `<string>`
* options
  * isRegister `<boolean>` Default: false, True only when registered.
  * ...CUSTOM_PROPERTIES


## rtm.clear
> Clear(remove) task.

### (taskId) => void
* taskId `<string>`


## rtm.clearAll
> Clear(remove) all tasks.

### () => void


## rtm.pause
> Pause all tasks without param.
> Pause task with taskId.

### ([taskId]) => void


## rtm.resume
> Resume all tasks without param.
> Resume task with taskId.

### ([taskId]) => void
