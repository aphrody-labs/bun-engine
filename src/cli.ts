#!/usr/bin/env bun
import { policyFor } from "./catalog";
import { inspectAndroidArtifact, planLowering, type PortableTarget } from "./android";
import { launch, trace } from "./launcher";
import { probeHost } from "./probe";

const [command = "probe", appId, target, sources] = process.argv.slice(2);
if (command === "probe") console.log(JSON.stringify(await probeHost(), null, 2));
else if (command === "qualify" && appId) console.log(JSON.stringify(policyFor(appId), null, 2));
else if (command === "launch" && appId) process.exitCode = await launch(appId);
else if (command === "trace" && appId) process.exitCode = await trace(appId);
else if (command === "android:inspect" && appId) {
  const artifact = await inspectAndroidArtifact(appId);
  if (target && target !== "pe" && target !== "elf" && target !== "wasm") {
    throw new TypeError(`unsupported Android lowering target: ${target}`);
  }
  const loweringTarget = target as PortableTarget | undefined;
  const output = loweringTarget
    ? { artifact, plan: planLowering(artifact, loweringTarget, sources === "--sources") }
    : { artifact };
  console.log(JSON.stringify(output, null, 2));
}
else throw new Error("usage: bun-engine probe | qualify <appid> | launch <appid> | trace <appid> | android:inspect <path> [pe|elf|wasm] [--sources]");
