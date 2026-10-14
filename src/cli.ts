#!/usr/bin/env bun
import { policyFor } from "./catalog";
import { launch, trace } from "./launcher";
import { probeHost } from "./probe";

const [command = "probe", appId] = process.argv.slice(2);
if (command === "probe") console.log(JSON.stringify(await probeHost(), null, 2));
else if (command === "qualify" && appId) console.log(JSON.stringify(policyFor(appId), null, 2));
else if (command === "launch" && appId) process.exitCode = await launch(appId);
else if (command === "trace" && appId) process.exitCode = await trace(appId);
else throw new Error("usage: steam-linux-compat probe | qualify <appid> | launch <appid> | trace <appid>");
