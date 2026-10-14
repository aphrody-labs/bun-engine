import { dlopen, FFIType, suffix } from "bun:ffi";
import { dirname, resolve } from "node:path";

export function loadAndroidNative() {
  const target = resolve(import.meta.dir, "../../../target");
  const name = `${process.platform === "win32" ? "" : "lib"}android_native.${suffix}`;
  const local = resolve(target, "debug", name);
  const shared = process.env.LOCALAPPDATA
    ? resolve(process.env.LOCALAPPDATA, "Aphrody", "cache", "cargo-target", "debug", name)
    : local;
  const library = process.env.ANDROID_NATIVE_LIB ?? (Bun.file(local).size > 0 ? local : shared);
  if (process.platform === "win32") {
    const javaHome = process.env.JAVA_HOME ?? dirname(dirname(Bun.which("java.exe") ?? ""));
    if (javaHome) process.env.PATH = `${resolve(javaHome, "bin", "server")};${process.env.PATH ?? ""}`;
  }
  return dlopen(library, {
    android_add: { args: [FFIType.i32, FFIType.i32], returns: FFIType.i32 },
  });
}

if (import.meta.main) {
  const library = loadAndroidNative();
  try {
    const result = library.symbols.android_add(17, 25);
    if (result !== 42) throw new Error(`Native FFI returned ${result}, expected 42`);
    console.log(JSON.stringify({ runtime: Bun.version, revision: Bun.revision, ffi: "android_add", result }));
  } finally { library.close(); }
}
