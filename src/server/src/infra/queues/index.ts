import { container } from "tsyringe";
import { QueueService } from "./queue.service";
import { ImageUploadWorker } from "../workers/image-upload.worker";
import { EmailWorker } from "../workers/email.worker";

export function initializeQueues() {
    const queueService = container.resolve(QueueService);
    const imageUploadWorker = container.resolve(ImageUploadWorker);
    const emailWorker = container.resolve(EmailWorker);

    // Process image upload queue
    queueService.processQueue("image-upload", (job) =>
        imageUploadWorker.process(job)
    );

    // Process email queue
    queueService.processQueue("email", (job) => emailWorker.process(job));

    // Handle errors
    queueService.onError("image-upload", (error) =>
        console.error("Image upload queue error:", error)
    );
    queueService.onError("email", (error) =>
        console.error("Email queue error:", error)
    );
}