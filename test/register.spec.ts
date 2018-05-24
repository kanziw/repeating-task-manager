import RepeatingTaskManager from '../'
import { expect } from 'chai'
import { delay } from './common'

const onError = (ex: Error) => console.log('>> onError :', ex)

describe('[ Register ]', function () {
  let rtm: RepeatingTaskManager
  let ret: boolean[] = []
  beforeEach(() => {
    rtm = new RepeatingTaskManager()
    ret = []
  })
  afterEach(() => rtm.clearAll())

  const task = 'TASK'
  const taskFn = ({ isRegister }: RepeatingTaskOptions) => { ret.push(isRegister) }

  it('Nothing happens before register.', async () => {
    await rtm.execute(task)
    expect(ret.length).eql(0)

    taskFn({ isRegister: true })
    expect(ret.length).eql(1)
  })

  it('isRegister option should work.', async () => {
    await rtm.register(task, 10, taskFn, { onError })
    await delay(30)

    expect(ret.length).above(1)
    expect(ret[ 0 ]).eql(true)
    expect(ret.slice(1).every(r => r === false)).eql(true)
  })

  it('Simple repeating task should work.', async () => {
    rtm.register(task, 10, taskFn, { onError })
    await delay(30)

    expect(ret.length).above(2)
  })
})
