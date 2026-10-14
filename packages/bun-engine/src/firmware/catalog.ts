const catalogUrl = "https://www.retrostic.com/fr/bios";
const maxCatalogBytes = 2 * 1024 * 1024;

export interface FirmwareCatalogEntry {
  name: string;
  page: string;
}

export async function parseFirmwareCatalogHtml(
  html: string,
  base = catalogUrl,
): Promise<FirmwareCatalogEntry[]> {
  const entries: FirmwareCatalogEntry[] = [];
  let current: { href: string; text: string } | undefined;
  const rewriter = new HTMLRewriter().on("a[href]", {
    element(element) {
      current = { href: element.getAttribute("href") ?? "", text: "" };
      element.onEndTag(() => {
        if (!current) return;
        const name = current.text.replace(/\s+/g, " ").trim();
        const page = new URL(current.href, base);
        if (
          name &&
          page.origin === new URL(base).origin &&
          !/\.(?:bin|rom|zip|7z|rar)(?:$|\?)/i.test(page.pathname)
        ) {
          entries.push({ name, page: page.href });
        }
        current = undefined;
      });
    },
    text(text) {
      if (current) current.text += text.text;
    },
  });
  await rewriter.transform(new Response(html)).text();
  return [...new Map(entries.map((entry) => [entry.page, entry])).values()];
}

export async function fetchFirmwareCatalog(url = catalogUrl): Promise<FirmwareCatalogEntry[]> {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { accept: "text/html", "user-agent": "Bun-Engine/0.1" },
  });
  if (!response.ok) throw new Error(`firmware catalog returned HTTP ${response.status}`);
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > maxCatalogBytes) throw new Error("firmware catalog exceeds 2 MiB");
  const bytes = await response.bytes();
  if (bytes.byteLength > maxCatalogBytes) throw new Error("firmware catalog exceeds 2 MiB");
  return parseFirmwareCatalogHtml(new TextDecoder().decode(bytes), response.url || url);
}
