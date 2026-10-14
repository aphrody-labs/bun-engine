# Bun Engine

A Rust-first, Bun-operated cross-OS game engine. Bevy ECS, wgpu rendering,
winit platform integration and every declared owner form one distribution. Bun owns
asset tooling, automation, packaging and compatibility orchestration.

Its universal porting pipeline classifies executables, bytecode, ROMs, archives,
VFS images and firmware, then selects native rebuild, translation, emulation,
compatibility or packaging. Targets are PE, ELF, WebAssembly/WASI and Android
APK through unified owners; see `docs/UNIVERSAL-PORTING.md`.

The reverse-engineering surface is documented in
[`docs/GHIDRA-PLUGIN-SUITE.md`](docs/GHIDRA-PLUGIN-SUITE.md): Ghidra, the native
Rust decompiler and NTRGhidra form one Bun Win32-aware plugin pipeline.

The root manifests are canonical: `Cargo.toml`, `package.json`, `CMakeLists.txt`
and `vcpkg.json`. `bun-engine` is the only CLI; `include/bun_engine.h` is the
only stable native FFI and `apps/web` is the single web entry point.

The first vertical slice includes Steam/Linux qualification through the local
Proton, Wine, DXVK, vkd3d-proton, gamescope and Linux source forks. It probes
Steam, Vulkan, kernel and user namespaces and records per-game support.

EA SPORTS FC 27 is currently recorded as experimental. The project qualifies
its Windows publisher services, DirectX 12 path, Steam session and multiplayer
startup end to end without disabling required game components.

Commands:

- 'bun run probe'
- 'bun run compile' emits the optimized single-file executable.
- 'bun run ml:setup' and 'bun run ml:identify -- <path>' provision and use Magika classification.
- 'bun run skills' lists the embedded Replica workflow; 'bun run ./src/cli.ts skill recon' prints one skill and 'bun run ./src/cli.ts pipeline replica' exposes its ordered artifact pipeline.
- 'bun run ghidra:probe' qualifies Ghidra, NTRGhidra, Java and the native Windows toolchain through 'bun:windows'; 'ghidra:inspect <pe>' uses the native PE parser before analysis.
- 'bep install', 'bep add' and 'bep pm' expose Bun Engine Packages.
- 'bun run qualify:fc27'
- 'bun run ./src/cli.ts launch <appid>'
- 'bun run ./src/cli.ts trace <appid>' enables Proton logging for reproduction.

Jev may select one of the read-only actions in 'src/jev-agent.ts'. It cannot
expand that allowlist or authorize installation, publication, DRM bypass or
anti-cheat bypass.
