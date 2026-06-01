import app from "./app";
import "dotenv/config";
import { appConfig } from "./config/app-config";

const PORT = appConfig.port || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
