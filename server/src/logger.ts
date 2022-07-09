import { createWriteStream } from "fs";
import pino, { multistream } from "pino";

// const streams = [
//   { stream: process.stdout },
//   { stream: createWriteStream("/logs/logfile.log", { flags: "a" }) },
// ];

// export default pino({}, multistream(streams));

export default pino({
  level: process.env.LOG_LEVEL || "info",
});
