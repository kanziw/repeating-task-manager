import RepeatingTaskManager from '../'
import { expect } from 'chai'
import { delay, onError } from './common'

describe('[ Pause ]', function () {
  let rtm: RepeatingTaskManager
  let ret: string[] = []
  const task1 = 'TASK1'
  const task2 = 'TASK2'

  beforeEach(() => {
    rtm = new RepeatingTaskManager()
    ret = []

    rtm.register(task1, 10, () => { ret.push(task1) }, { onError })
    rtm.register(task2, 10, () => { ret.push(task2) }, { onError })
  })
  afterEach(() => { rtm.clearAll() })

  it('"Pause" pause all tasks /wo params.', async () => {
    rtm.pause()
    const beforeCompletedTasksCount = ret.length

    await delay(100)
    expect(ret.length).eql(beforeCompletedTasksCount)
  })

  it('"Pause" pause it\'s task /w taskId.', async () => {
    rtm.pause(task1)
    const beforeCompletedTasksCount = ret.length

    await delay(100)
    const expectEveryKeysAreTask2 = ret.slice(beforeCompletedTasksCount)
    expect(expectEveryKeysAreTask2.length).above(5)
    expect(expectEveryKeysAreTask2.every(s => s === task2)).eql(true)
  })
})
