import { User } from "./userTypes";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
