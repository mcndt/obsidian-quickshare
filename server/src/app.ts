import "dotenv/config";
import express, { Express, Request } from "express";
import { PrismaClient, EncryptedNote } from "@prisma/client";
import { addDays } from "./util";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import logger from "./logger";

// Initialize middleware clients
const prisma = new PrismaClient();
const app: Express = express();
app.use(express.json());

// configure logging
app.use(
  pinoHttp({
    logger: logger,
  })
);

// configure Helmet and CORS
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: process.env.ENVIRONMENT == "dev" ? "cross-origin" : "same-origin",
    },
  })
);

// Apply rate limiting
const postLimiter = rateLimit({
  windowMs: parseInt(process.env.POST_LIMIT_WINDOW_SECONDS as string) * 1000,
  max: parseInt(process.env.POST_LIMIT as string), // Limit each IP to X requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Post new encrypted note
app.post(
  "/api/note/",
  postLimiter,
  (req: Request<{}, {}, EncryptedNote>, res, next) => {
    const note = req.body;
    prisma.encryptedNote
      .create({
        data: { ...note, expire_time: addDays(new Date(), 30) },
      })
      .then((savedNote) => {
        res.json({
          view_url: `${process.env.FRONTEND_URL}/note/${savedNote.id}`,
          expire_time: savedNote.expire_time,
        });
      })
      .catch(next);
  }
);

// Get encrypted note
app.get("/api/note/:id", (req, res, next) => {
  prisma.encryptedNote
    .findUnique({
      where: { id: req.params.id },
    })
    .then((note) => {
      if (note != null) {
        res.send(note);
      }
      res.status(404).send();
    })
    .catch(next);
});

// Clean up expired notes periodically
const interval =
  Math.max(parseInt(<string>process.env.CLEANUP_INTERVAL_SECONDS) || 1, 1) *
  1000;
setInterval(async () => {
  try {
    logger.info("[Cleanup] Cleaning up expired notes...");
    const deleted = await prisma.encryptedNote.deleteMany({
      where: {
        expire_time: {
          lte: new Date(),
        },
      },
    });
    logger.info(`[Cleanup] Deleted ${deleted.count} expired notes.`);
  } catch (err) {
    logger.error(`[Cleanup] Error cleaning expired notes:`);
    logger.error(err);
  }
}, interval);

export default app;
