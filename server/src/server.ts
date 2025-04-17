import "module-alias/register";
import { startApp } from "./graphql";
import http from "http";

const PORT = process.env.PORT || 5000;

const app = startApp(); // No need to await since startApp is not async

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1); // Exit with failure status
});
