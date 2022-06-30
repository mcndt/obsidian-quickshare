import "dotenv/config";
import express, { Express, Request } from "express";
import cors from "cors";
import { PrismaClient, EncryptedNote } from "@prisma/client";
import { addDays } from "./util";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Initialize middleware clients
const prisma = new PrismaClient();

const app: Express = express();
app.use(express.json());
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

// start the Express server
app.listen(process.env.PORT, () => {
  console.log(`server started at http://localhost:${process.env.PORT}`);
});

// Post new encrypted note
app.post(
  "/note/",
  postLimiter,
  async (req: Request<{}, {}, EncryptedNote>, res) => {
    const note = req.body;
    const savedNote = await prisma.encryptedNote.create({
      data: { ...note, expire_time: addDays(new Date(), 30) },
    });
    res.json({
      view_url: `${process.env.FRONTEND_URL}/note/${savedNote.id}`,
      expire_time: savedNote.expire_time,
    });
  }
);

// Get encrypted note
app.get("/note/:id", async (req, res) => {
  const note = await prisma.encryptedNote.findUnique({
    where: { id: req.params.id },
  });
  if (note != null) {
    res.send(note);
  }
  res.status(404).send();
});

// Default response for any other request
app.use((req, res, next) => {
  res.status(404).send();
});

// Clean up expired notes periodically
const interval =
  Math.max(parseInt(<string>process.env.CLEANUP_INTERVAL_SECONDS) || 1, 1) *
  1000;
setInterval(async () => {
  try {
    console.log("[Cleanup] Cleaning up expired notes...");
    const deleted = await prisma.encryptedNote.deleteMany({
      where: {
        expire_time: {
          lte: new Date(),
        },
      },
    });
    console.log(`[Cleanup] Deleted ${deleted.count} expired notes.`);
  } catch (err) {
    console.error(`[Cleanup] Error cleaning expired notes:`);
    console.error(err);
  }
}, interval);
