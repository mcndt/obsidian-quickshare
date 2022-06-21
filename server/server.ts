import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { PrismaClient, EncryptedNote } from "@prisma/client";

const prisma = new PrismaClient();

const app: Express = express();

app.use(express.json());

// start the Express server
app.listen(process.env.PORT, () => {
  console.log(`server started at http://localhost:${process.env.PORT}`);
});

// type EncryptedNote = {
//   id?: string;
//   ciphertext: string;
//   hmac: string;
// };

// Post new encrypted note
app.post("/note/", async (req: Request<{}, {}, EncryptedNote>, res) => {
  const note = req.body;
  const savedNote = await prisma.encryptedNote.create({ data: note });
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
