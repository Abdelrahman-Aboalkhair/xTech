import "module-alias/register";
import { startApp } from "./app";
import http from "http";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const app = await startApp();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
