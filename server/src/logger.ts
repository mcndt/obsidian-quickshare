import pino from "pino";

/* c8 ignore start */
export default pino({
  level: process.env.LOG_LEVEL || "info",
});
/* c8 ignore stop */
