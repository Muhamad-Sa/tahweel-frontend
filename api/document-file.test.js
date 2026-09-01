import { describe, expect, it } from "vitest";

import { requestedRange } from "./document-file";

describe("document file range proxy", () => {
  it("defaults to a one-megabyte range", () => {
    expect(requestedRange()).toBe("bytes=0-1048575");
  });

  it("caps oversized ranges at one megabyte", () => {
    expect(requestedRange("bytes=1048576-9999999")).toBe("bytes=1048576-2097151");
  });

  it("preserves smaller ranges", () => {
    expect(requestedRange("bytes=20-99")).toBe("bytes=20-99");
  });

  it("rejects malformed or reversed ranges", () => {
    expect(requestedRange("items=0-10")).toBeNull();
    expect(requestedRange("bytes=10-2")).toBeNull();
  });
});
