import { afterEach, describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/site";

afterEach(() => {
  delete process.env.SITE_URL;
});

describe("siteUrl", () => {
  it("defaults to the template origin", () => {
    expect(siteUrl()).toBe("https://example.com");
  });
  it("uses the versioned site.json origin instead of a runtime environment override", () => {
    process.env.SITE_URL = "http://localhost:3007/";
    expect(siteUrl()).toBe("https://example.com");
  });
});
