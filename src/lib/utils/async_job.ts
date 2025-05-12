export async function asyncPool<Args extends any[], R>(
  poolLimit: number,
  items: Args[],
  iteratorFn: (...args: Args) => Promise<R>
): Promise<R[]> {
  const ret: Promise<R | null>[] = [];
  const executing: Promise<void>[] = [];

  for (const args of items) {
    // Kick off the work, catch errors to null so Promise.all never rejects
    const p: Promise<R | null> = Promise.resolve()
      .then(() => iteratorFn(...args))
      .catch(() => null);

    ret.push(p);

    // When p settles, remove its “slot‐freeing” promise from executing
    const e: Promise<void> = p.then(() => {
      executing.splice(executing.indexOf(e), 1);
    });
    executing.push(e);

    // If we’ve hit the limit, wait for *one* to free up
    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }

  // Wait for *all* the work to finish
  const results = await Promise.all(ret);
  return results.filter(r => r !== null) as R[];
}