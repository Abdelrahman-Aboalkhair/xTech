import "module-alias/register";
import { createApp } from "./app";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const { app, httpServer } = await createApp();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  httpServer.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}

bootstrap();
