import { fetchFirmwareCatalog } from "./firmware/catalog";
import { importFirmware } from "./firmware/import";

const packageManagerCommands = new Set([
  "add",
  "install",
  "remove",
  "update",
  "dedupe",
  "prune",
  "outdated",
  "why",
  "audit",
  "info",
  "link",
  "unlink",
  "patch",
  "pm",
]);

export function packageManagerInvocation(args: string[]): string[] {
  const [command, ...rest] = args;
  if (!command || !packageManagerCommands.has(command)) {
    throw new Error(`usage: bep <${[...packageManagerCommands].join("|")}> [arguments]`);
  }
  return [command, ...rest];
}

export async function runEnginePackageManager(args: string[]): Promise<number> {
  if (args[0] === "firmware:index") {
    console.log(JSON.stringify(await fetchFirmwareCatalog(), null, 2));
    return 0;
  }
  if (args[0] === "firmware:import") {
    const [, consoleName, sourcePath, ...options] = args;
    if (!consoleName || !sourcePath) {
      throw new Error("usage: bep firmware:import <console> <local-dump> [--store <directory>]");
    }
    const storeAt = options.indexOf("--store");
    const store = storeAt >= 0 ? options[storeAt + 1] : undefined;
    if (storeAt >= 0 && !store) throw new Error("--store requires a directory");
    console.log(JSON.stringify(await importFirmware(consoleName, sourcePath, store), null, 2));
    return 0;
  }
  const invocation = packageManagerInvocation(args);
  const child = Bun.spawn([process.execPath, ...invocation], {
    cwd: process.cwd(),
    env: { ...process.env, BUN_BE_BUN: "1" },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  return child.exited;
}
