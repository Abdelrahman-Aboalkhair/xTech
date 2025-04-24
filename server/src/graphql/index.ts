import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { combinedSchemas } from "./v1/schema";
import { PrismaClient } from "@prisma/client";
import AppError from "@/shared/errors/AppError";

const prisma = new PrismaClient();

export const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://egwinch.com"]
    : ["http://localhost:3000"];

export async function configureGraphQL(app: express.Application) {
  // 1) Create your HTTP + Express app
  const httpServer = http.createServer(app);

  // 3) Create the WebSocketServer on the same HTTP server + path. This is for graphql subscriptions for things like realtime stock updates, etc.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/api/v1/graphql",
  });

  // 4) Attach graphql-ws’s useServer to handle subscriptions
  const serverCleanup = useServer(
    {
      schema: combinedSchemas,
      context: async (ctx, msg, args) => {
        // ctx.connectionParams is how the client can pass an auth token
        const token = ctx.connectionParams?.authorization as string | undefined;
        // const user = token ? await verifyToken(token) : null;
        const user = null;
        return { prisma, user };
      },
    },
    wsServer
  );

  // 5) Create your ApolloServer, with a plugin to drain both HTTP & WS
  const apolloServer = new ApolloServer({
    schema: combinedSchemas,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }), // ensure we drain the HTTP server (so we can shut down gracefully)
      {
        async serverWillStart() {
          return {
            async drainServer() {
              // Make sure we clean up our WebSocket server
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();

  // 6) Mount the Express-style GraphQL endpoint
  app.use(
    "/api/v1/graphql",
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) cb(null, true);
        else cb(new AppError(403, "CORS policy violation"));
      },
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        req,
        res,
        prisma,
        user: (req as any).user,
      }),
    })
  );

  return httpServer;
}
