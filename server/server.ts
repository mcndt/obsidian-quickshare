import "dotenv/config";
import logger from "./src/logger";
import app from "./src/app";

// start the Express server
app.listen(process.env.PORT, () => {
  logger.info(`server started at port ${process.env.PORT}`);
});
