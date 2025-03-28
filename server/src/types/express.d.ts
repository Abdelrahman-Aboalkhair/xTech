import { UserPayload } from "../middlewares/authorizeRole";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}
