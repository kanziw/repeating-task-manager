import { setTimeout as delay } from 'timers/promises'

export { delay }

export const onError = (ex: unknown): void => { console.log('>> onError :', ex) }
