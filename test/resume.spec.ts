import RepeatingTaskManager from '../'
import { expect } from 'chai'
import { delay, onError } from './common'

describe('[ Resume ]', function () {
  let rtm: RepeatingTaskManager
  let ret: string[] = []
  const task1 = 'TASK1'
  const task2 = 'TASK2'

  beforeEach(() => {
    rtm = new RepeatingTaskManager()
    ret = []

    rtm.register(task1, 10, () => { ret.push(task1) }, { onError })
    rtm.register(task2, 10, () => { ret.push(task2) }, { onError })
    rtm.pause()
    ret = []
  })
  afterEach(() => rtm.clearAll())

  it(`"Resume" resume all tasks /wo params.`, async () => {
    rtm.resume()
    await delay(100)
    expect(ret.length).above(0)

    const set = new Set(ret)
    expect(set.size).eql(2)
    expect(set.has(task1)).eql(true)
    expect(set.has(task2)).eql(true)
  })

  it(`"Resume" resume it's task /w taskId.`, async () => {
    rtm.resume(task1)
    await delay(100)

    const set = new Set(ret)
    expect(set.size).eql(1)
    expect(set.has(task1)).eql(true)
    expect(set.has(task2)).eql(false)
  })
})
