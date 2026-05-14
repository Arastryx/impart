export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function delay(call: () => Promise<any>, delay: number) {
  await sleep(delay)
  return call()
}

