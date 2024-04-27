import { httpServer } from "./src/app";
import { config } from "./src/configs";
// This connects to DB
import "./src/configs/db";
// This includes all realtime logic
import "./src/socket";

httpServer.listen(config.port, () => {
  console.log(`Server us up & running at http://localhost:${config.port} 🚀`);
});
