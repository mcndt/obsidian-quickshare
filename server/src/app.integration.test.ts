import app from "./app";
import request from "supertest";
import { describe, it, expect } from "vitest";
import prisma from "./client";

// const testNote with base64 ciphertext and hmac
const testNote = {
  ciphertext: Buffer.from("sample_ciphertext").toString("base64"),
  hmac: Buffer.from("sample_hmac").toString("base64"),
};

describe("GET /api/note", () => {
  it("returns a note for valid ID", async () => {
    // Insert a note
    const { id } = await prisma.encryptedNote.create({
      data: testNote,
    });

    // Make get request
    const res = await request(app).get(`/api/note/${id}`);

    // Validate returned note
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("expire_time");
    expect(res.body).toHaveProperty("insert_time");
    expect(res.body).toHaveProperty("ciphertext");
    expect(res.body).toHaveProperty("hmac");
    expect(res.body.id).toEqual(id);
    expect(res.body.ciphertext).toEqual(testNote.ciphertext);
    expect(res.body.hmac).toEqual(testNote.hmac);
  });

  it("responds 404 for invalid ID", async () => {
    // Make get request
    const res = await request(app).get(`/api/note/NaN`);

    // Validate returned note
    expect(res.statusCode).toBe(404);
  });

  it("Applies rate limits to endpoint", async () => {
    // Insert a note
    const { id } = await prisma.encryptedNote.create({
      data: testNote,
    });

    // Make get requests
    const requests = [];
    for (let i = 0; i < 51; i++) {
      requests.push(request(app).get(`/api/note/${id}`));
    }
    const responses = await Promise.all(requests);
    const responseCodes = responses.map((res) => res.statusCode);

    // at least one response should be 429
    expect(responseCodes).toContain(429);

    // sleep for 100 ms to allow rate limiter to reset
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});

describe("POST /api/note", () => {
  it("returns a view_url on correct POST body", async () => {
    const res = await request(app).post("/api/note").send(testNote);
    expect(res.statusCode).toBe(200);

    // Returned body has correct fields
    expect(res.body).toHaveProperty("expire_time");
    expect(res.body).toHaveProperty("view_url");

    // View URL is properly formed
    expect(res.body.view_url).toMatch(/^http[s]?:\/\//);

    // A future expiry date is assigned
    expect(new Date(res.body.expire_time).getTime()).toBeGreaterThan(
      new Date().getTime()
    );
  });

  it("Returns a bad request on invalid POST body", async () => {
    const res = await request(app).post("/api/note").send({});
    expect(res.statusCode).toBe(400);
  });

  it("returns a valid view_url on correct POST body", async () => {
    // Make post request
    let res = await request(app).post("/api/note").send(testNote);

    // Extract note id from post response
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("view_url");
    const match = (res.body.view_url as string).match(/note\/(.+)$/);
    expect(match).not.toBeNull();
    expect(match).toHaveLength(2);
    const note_id = (match as RegExpMatchArray)[1];

    // Make get request
    res = await request(app).get(`/api/note/${note_id}`);

    // Validate returned note
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("expire_time");
    expect(res.body).toHaveProperty("insert_time");
    expect(res.body).toHaveProperty("ciphertext");
    expect(res.body).toHaveProperty("hmac");
    expect(res.body.id).toEqual(note_id);
    expect(res.body.ciphertext).toEqual(testNote.ciphertext);
    expect(res.body.hmac).toEqual(testNote.hmac);
  });

  it("Applies upload limit to endpoint of 400kb", async () => {
    const largeNote = {
      ciphertext: "a".repeat(400 * 1024),
      hmac: "sample_hmac",
    };
    const res = await request(app).post("/api/note").send(largeNote);
    expect(res.statusCode).toBe(413);
  });

  it("Applies rate limits to endpoint", async () => {
    // make more requests than the post limit set in .env.test
    const requests = [];
    for (let i = 0; i < 51; i++) {
      requests.push(request(app).post("/api/note").send(testNote));
    }
    const responses = await Promise.all(requests);
    const responseCodes = responses.map((res) => res.statusCode);

    // at least one response should be 429
    expect(responseCodes).toContain(429);

    // sleep for 100 ms to allow rate limiter to reset
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});
