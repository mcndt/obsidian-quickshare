import { describe, it, expect } from "vitest";
import { addDays } from "./util";

describe("addDays()", () => {
  it("Should add n days to the input date", () => {
    const date = new Date("2022-01-01");
    const expectedDate = new Date("2022-01-31");
    expect(addDays(date, 30)).toEqual(expectedDate);
  });
});
