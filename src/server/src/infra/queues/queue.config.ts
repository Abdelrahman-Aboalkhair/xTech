import { ConnectionOptions } from "bullmq";
import { injectable } from "tsyringe";
import { ConfigService } from "../services/config.service"; 

@injectable()
export class QueueConfig {
  constructor(private configService: ConfigService) {}

  getConnection(): ConnectionOptions {
    return {
      host: this.configService.get("REDIS_HOST", "localhost"),
      port: Number(this.configService.get("REDIS_PORT", "6379")),
      password: this.configService.get("REDIS_PASSWORD"),
    };
  }
}