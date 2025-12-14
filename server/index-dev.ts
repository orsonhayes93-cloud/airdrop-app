import "dotenv/config";
import { app } from "./app";

const PORT = 5001; // Always use 5001 for backend

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
