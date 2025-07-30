import { Queue, Job, QueueEvents } from "bullmq";
import { injectable, inject } from "tsyringe";
import { QueueConfig } from "./queue.config";

export interface JobData {
  [key: string]: any;
}

@injectable()
export class QueueService {
  private queues: Map<string, Queue> = new Map();

  constructor(@inject(QueueConfig) private queueConfig: QueueConfig) {}

  private getQueue(queueName: string): Queue {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, {
        connection: this.queueConfig.getConnection(),
      });
      this.queues.set(queueName, queue);
    }
    return this.queues.get(queueName)!;
  }

  async addJob<T extends JobData>(
    queueName: string,
    jobName: string,
    data: T,
    options: BullMQ.JobOptions = { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    return queue.add(jobName, data, options);
  }

  processQueue<T extends JobData>(
    queueName: string,
    processor: (job: Job<T>) => Promise<void>
  ): void {
    const queue = this.getQueue(queueName);
    queue.process(processor);
  }

  onError(queueName: string, callback: (error: Error) => void): void {
    const queueEvents = new QueueEvents(queueName, {
      connection: this.queueConfig.getConnection(),
    });
    queueEvents.on("error", callback);
  }

  async closeAll(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
  }
}