#!/usr/bin/env bun
import { policyFor } from "./catalog";
import { inspectAndroidArtifact, planLowering, type PortableTarget } from "./android";
import { launch, trace } from "./launcher";
import { identifyWithMagika, setupMagika } from "./ml/magika";
import { probeHost } from "./probe";
import {
  buildWorkspace,
  compileWorkspace,
  isCompileTarget,
  serveWorkspace,
  testWorkspace,
} from "./workspace";

async function main(): Promise<void> {
  const [command = "probe", appId, target, sources] = process.argv.slice(2);
  if (command === "probe") console.log(JSON.stringify(await probeHost(), null, 2));
  else if (command === "build") process.exitCode = await buildWorkspace(appId === "--release");
  else if (command === "test") process.exitCode = await testWorkspace();
  else if (command === "ml:setup") process.exitCode = await setupMagika();
  else if (command === "ml:identify" && appId)
    console.log(JSON.stringify(await identifyWithMagika(appId), null, 2));
  else if (command === "compile") {
    const compileTarget = isCompileTarget(appId) ? appId : undefined;
    if (appId && !compileTarget && appId.startsWith("bun-")) {
      throw new TypeError(`unsupported compile target: ${appId}`);
    }
    const outfile = compileTarget ? target : appId;
    const profile = compileTarget ? sources : target;
    process.exitCode = await compileWorkspace({
      target: compileTarget,
      outfile,
      bytecodeOrder: profile?.split(","),
    });
  } else if (command === "web") await serveWorkspace();
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
  } else {
    throw new Error(
      "usage: bun-engine build [--release] | compile [bun-<os>-<arch>] [outfile] [bytecode-order] | test | web | probe | ml:setup | ml:identify <path> | qualify <appid> | launch <appid> | trace <appid> | android:inspect <path> [pe|elf|wasm] [--sources]",
    );
  }
}

void main();
