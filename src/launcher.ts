import { policyFor } from "./catalog";

export function launchCommand(appId: string, steam = "steam"): string[] {
  const policy = policyFor(appId);
  if (policy.support === "blocked") throw new Error(policy.name + " is blocked: " + policy.reason);
  return [steam, "-applaunch", appId];
}

export async function launch(appId: string): Promise<number> {
  const proc = Bun.spawn({ cmd: launchCommand(appId), stdin: "inherit", stdout: "inherit", stderr: "inherit" });
  return await proc.exited;
}
