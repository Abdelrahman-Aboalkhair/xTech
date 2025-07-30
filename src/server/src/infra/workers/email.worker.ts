import { Job } from "bullmq";
import { injectable } from "tsyringe";
import { sendEmail } from "../utils/email";

interface EmailJobData {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

@injectable()
export class EmailWorker {
    async process(job: Job<EmailJobData>): Promise<void> {
        const { to, subject, text, html } = job.data;

        try {
            await sendEmail({ to, subject, text, html });
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
            throw error;
        }
    }
}