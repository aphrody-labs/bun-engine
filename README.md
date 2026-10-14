# Bun Engine

A Rust-first, Bun-operated cross-OS game engine. The native kernel stays small;
Bevy ECS, wgpu rendering and winit platform integration are opt-in. Bun owns
asset tooling, automation, packaging and compatibility orchestration.

Its universal porting pipeline classifies executables, bytecode, ROMs, archives,
VFS images and firmware, then selects native rebuild, translation, emulation,
compatibility or packaging. Targets are PE, ELF, WebAssembly/WASI and Android
APK through optional owners; see `docs/UNIVERSAL-PORTING.md`.

The first vertical slice includes Steam/Linux qualification through the local
Proton, Wine, DXVK, vkd3d-proton, gamescope and Linux source forks. It probes
Steam, Vulkan, kernel and user namespaces and records per-game support.

EA SPORTS FC 27 is currently recorded as experimental. The project qualifies
its Windows publisher services, DirectX 12 path, Steam session and multiplayer
startup end to end without disabling required game components.

Commands:

- 'bun run probe'
- 'bun run qualify:fc27'
- 'bun run ./src/cli.ts launch <appid>'
- 'bun run ./src/cli.ts trace <appid>' enables Proton logging for reproduction.

Jev may select one of the read-only actions in 'src/jev-agent.ts'. It cannot
expand that allowlist or authorize installation, publication, DRM bypass or
anti-cheat bypass.
