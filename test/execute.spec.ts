import RepeatingTaskManager from '../'
import { expect } from 'chai'
import { delay, onError } from './common'

describe('[ ClearAll ]', function () {
  let rtm: RepeatingTaskManager
  let ret: string[] = []
  beforeEach(() => {
    rtm = new RepeatingTaskManager()
    ret = []
  })
  afterEach(() => rtm.clearAll())

  const task1 = 'TASK1'
  const task2 = 'TASK2'
  const taskFn1 = () => { ret.push(task1) }
  const taskFn2 = () => { ret.push(task2) }

  it(`Clear should stop it's task.`, async () => {
    rtm.register(task1, 10, taskFn1, { onError })
    rtm.register(task2, 10, taskFn2, { onError })
    rtm.clear(task1)

    await delay(100)
    expect(ret.length).above(0)
    expect(ret.every(s => s === task2)).eql(true)
  })

  it('ClearAll should stop all tasks.', async () => {
    rtm.register(task1, 10, taskFn1, { onError })
    rtm.register(task2, 10, taskFn2, { onError })
    rtm.clearAll()

    expect(ret.length).eql(0)
    await delay(100)
    expect(ret.length).eql(0)
  })
})
