/*
  Warnings:

  - The primary key for the `EncryptedNote` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EncryptedNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "insert_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ciphertext" TEXT NOT NULL,
    "hmac" TEXT NOT NULL
);
INSERT INTO "new_EncryptedNote" ("ciphertext", "hmac", "id", "insert_time") SELECT "ciphertext", "hmac", "id", "insert_time" FROM "EncryptedNote";
DROP TABLE "EncryptedNote";
ALTER TABLE "new_EncryptedNote" RENAME TO "EncryptedNote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
