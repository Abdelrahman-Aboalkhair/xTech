import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { serverV1 } from "./v1";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";
import AppError from "@/shared/errors/AppError";

const prisma = new PrismaClient();

export const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://egwinch.com"]
    : ["http://localhost:3000"];

export const configureGraphQL = async (app: express.Application) => {
  await serverV1.start();

  app.use(
    "/api/v1/graphql",
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new AppError(403, "CORS policy violation"));
        }
      },
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(serverV1, {
      context: async ({ req, res }) => ({
        req,
        res,
        prisma,
      }),
    })
  );
};
