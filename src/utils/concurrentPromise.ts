export class ConcurrentPromise {
  private concurrency: number;
  private queue: (() => Promise<any>)[] = [];
  private running: number = 0;
  private isStop: boolean = false;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  stop() {
    this.isStop = true;
  }

  add(task: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.decrementRunningAndRunNext();
        }
      };

      this.incrementRunningAndExecuteOrQueue(execute);
    });
  }

  private incrementRunningAndExecuteOrQueue(execute: () => Promise<void>): void {
    if (this.running < this.concurrency && !this.isStop) {
      this.running++;
      execute();
    } else {
      this.queue.push(execute);
    }
  }

  private decrementRunningAndRunNext(): void {
    this.running--;
    this.runNext();
  }

  private runNext(): void {
    if (this.queue.length > 0 && this.running < this.concurrency && !this.isStop) {
      const task = this.queue.shift();
      if (task) {
        this.running++;
        task();
      }
    }
  }
}
