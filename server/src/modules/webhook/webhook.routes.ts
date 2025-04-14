import express from "express";
import bodyParser from "body-parser";
import { makeWebhookController } from "./webhook.factory";

const router = express.Router();
const webhookController = makeWebhookController();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  webhookController.handleWebhook
);

export default router;
