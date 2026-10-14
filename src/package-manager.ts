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
