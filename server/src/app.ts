import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { EncryptedNote } from "@prisma/client";
import { addDays } from "./util";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import logger from "./logger";
import prisma from "./client";
import bodyParser from "body-parser";
import { NotePostRequest } from "./model/NotePostRequest";
import { validateOrReject } from "class-validator";

// Initialize middleware clients
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
  windowMs: parseFloat(process.env.POST_LIMIT_WINDOW_SECONDS as string) * 1000,
  max: parseInt(process.env.POST_LIMIT as string), // Limit each IP to X requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const getLimiter = rateLimit({
  windowMs: parseFloat(process.env.GET_LIMIT_WINDOW_SECONDS as string) * 1000,
  max: parseInt(process.env.GET_LIMIT as string), // Limit each IP to X requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply 400kB upload limit on POST
app.use(bodyParser.json({ limit: "400k" }));

// Get encrypted note
app.get("/api/note/:id", getLimiter, (req: Request, res: Response, next) => {
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

// Post new encrypted note
app.post("/api/note/", postLimiter, (req: Request, res: Response, next) => {
  const notePostRequest = new NotePostRequest();
  Object.assign(notePostRequest, req.body);
  validateOrReject(notePostRequest).catch((err) => {
    res.status(400).send(err.message);
  });
  const note = notePostRequest as EncryptedNote;
  prisma.encryptedNote
    .create({
      data: {
        ...note,
        expire_time: addDays(new Date(), 30),
      },
    })
    .then((savedNote) => {
      res.json({
        view_url: `${process.env.FRONTEND_URL}/note/${savedNote.id}`,
        expire_time: savedNote.expire_time,
      });
    })
    .catch(next);
});

// Clean up expired notes periodically
export async function cleanExpiredNotes(): Promise<number> {
  logger.info("[Cleanup] Cleaning up expired notes...");
  return prisma.encryptedNote
    .deleteMany({
      where: {
        expire_time: {
          lte: new Date(),
        },
      },
    })
    .then((deleted) => {
      logger.info(`[Cleanup] Deleted ${deleted.count} expired notes.`);
      return deleted.count;
    })
    .catch((err) => {
      logger.error(`[Cleanup] Error cleaning expired notes:`);
      logger.error(err);
      return -1;
    });
}

const interval =
  Math.max(parseInt(<string>process.env.CLEANUP_INTERVAL_SECONDS) || 1, 1) *
  1000;
setInterval(cleanExpiredNotes, interval);

export default app;
