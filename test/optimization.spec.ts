import RepeatingTaskManager from '../'
import { expect } from 'chai'
import { delay, onError } from './common'

describe('[ Optimization ]', function () {
  this.timeout(11000)
  let rtm: RepeatingTaskManager
  beforeEach(() => { rtm = new RepeatingTaskManager() })
  afterEach(() => { rtm.clearAll() })

  it('Is it tail recursive? => stack trace does not have caller function name.', async () => {
    const task = 'TASK'
    let ret = 0
    const checkStackTraceFn = (): void => {
      const lastErrorStack = new Error().stack as string
      const split = lastErrorStack.split('at ')
      expect(split.filter(str => str.includes('checkStackTraceFn')).length).eql(1)
      ret++
    }

    rtm.register(task, 1, checkStackTraceFn, { onError })
    await delay(100)
    expect(ret).above(10)
  })
})
