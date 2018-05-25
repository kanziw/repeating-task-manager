export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

export function onError(ex: Error) { console.log('>> onError :', ex) }
