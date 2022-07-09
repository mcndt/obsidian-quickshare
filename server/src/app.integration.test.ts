import app from "./app";
import request from "supertest";
import { describe, it, expect } from "vitest";

describe("GET /api/test", () => {
  it('should respond "Hello world!"', () => {
    return request(app)
      .get("/api/test")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Hello world!");
      });
  });
});
