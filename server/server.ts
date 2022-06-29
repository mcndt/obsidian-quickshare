import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { PrismaClient, EncryptedNote } from "@prisma/client";
import { addDays } from "./util";

// Initialize middleware clients
const prisma = new PrismaClient();

const app: Express = express();
app.use(express.json());

// Allow CORS in dev mode.
if (process.env.ENVIRONMENT == "dev") {
  app.use(
    cors({
      origin: "*",
    })
  );
}

// start the Express server
app.listen(process.env.PORT, () => {
  console.log(`server started at http://localhost:${process.env.PORT}`);
});

// Post new encrypted note
app.post("/note/", async (req: Request<{}, {}, EncryptedNote>, res) => {
  const note = req.body;
  const savedNote = await prisma.encryptedNote.create({
    data: { ...note, expire_time: addDays(new Date(), 14) },
  });
  res.json({ view_url: `${process.env.FRONTEND_URL}/note/${savedNote.id}` });
});

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
