import { describe, expect, test } from "bun:test";
import { parseFirmwareCatalogHtml } from "../packages/bun-engine/src/firmware/catalog";

describe("firmware metadata catalog", () => {
  test("keeps detail pages and rejects direct payload links", async () => {
    const entries = await parseFirmwareCatalogHtml(
      '<a href="/fr/bios/nintendo-ds">Nintendo DS</a><a href="/payload/bios.zip">archive</a><a href="https://example.com/file">external</a>',
    );
    expect(entries).toEqual([
      { name: "Nintendo DS", page: "https://www.retrostic.com/fr/bios/nintendo-ds" },
    ]);
  });
});
