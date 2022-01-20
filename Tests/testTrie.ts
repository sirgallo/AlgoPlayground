export const testTrie: string[] = [
  'hello',
  'hell',
  'world',
  'hi',
  'car',
  'comet',
  'computer',
  'compute',
  'computed'
]

async function f2() {
  throw new Error('hi this is a test error')
}

async function f1() {
  try {
    await f2()
  } catch (err) {
    throw new Error(err)
  }
}

async function runTest(): Promise<boolean> {
  await f1()
  return true
}

