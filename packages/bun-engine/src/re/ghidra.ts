import { join } from "node:path";
import windows from "bun:windows";

const root = join(import.meta.dir, "..", "..", "..", "..");
export const ghidraRoot = join(root, "crates", "ghidra");
export const ntrGhidraRoot = join(root, "crates", "ntr-ghidra");

function requireWindows(): void {
  if (!windows.isSupported) throw new Error("Ghidra Win32 integration requires Windows");
}

export async function probeGhidraWindows() {
  requireWindows();
  const toolchain = windows.toolchain();
  return {
    source: ghidraRoot,
    ntrExtension: ntrGhidraRoot,
    sourceReady: await Bun.file(join(ghidraRoot, "build.gradle")).exists(),
    ntrExtensionReady: await Bun.file(join(ntrGhidraRoot, "Module.manifest")).exists(),
    java: Bun.which("java"),
    windows: windows.version(),
    conpty: windows.conpty.info(),
    msvc: toolchain.msvc?.version ?? null,
    windowsSdk: toolchain.sdk?.version ?? null,
  };
}

export async function inspectPeForGhidra(path: string) {
  requireWindows();
  const bytes = new Uint8Array(await Bun.file(path).arrayBuffer());
  if (!windows.pe.looksLikePe(bytes)) throw new TypeError(`not a PE image: ${path}`);
  const image = windows.pe.parse(bytes, path);
  if (!image) throw new TypeError(`invalid PE image: ${path}`);
  return {
    path,
    kind: image.kind,
    machine: image.machine,
    sections: image.sections.length,
    imports: image.imports.reduce((count, item) => count + item.functions.length, 0),
    exports: image.exports.length,
    authenticode: image.authenticode,
  };
}

export async function buildGhidraWindows(): Promise<number> {
  requireWindows();
  const java = Bun.which("java");
  if (!java) throw new Error("Ghidra build requires JDK 25 on PATH");
  const launcher = join(ghidraRoot, "gradlew.bat");
  if (!(await Bun.file(launcher).exists()))
    throw new Error(`missing Ghidra Gradle launcher: ${launcher}`);
  const job = new windows.Job({ name: "BunEngine.GhidraBuild", killOnClose: true });
  try {
    const child = job.spawn(["cmd.exe", "/d", "/s", "/c", launcher, "buildGhidra"], {
      cwd: ghidraRoot,
      env: { ...process.env, BUN_ENGINE_ROOT: root, JAVA: java },
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });
    return await child.exited;
  } finally {
    job.close();
  }
}
