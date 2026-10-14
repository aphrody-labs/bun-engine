# Bun Engine

Use Rust for native engine logic and Bun for tooling. `Cargo.toml` and
`package.json` at the repository root are the only Cargo and Bun workspaces.
Keep the default kernel dependency-free. New subsystems are opt-in features or
separate binaries. Bevy, wgpu and winit are pinned source owners under `crates/`.

Run Cargo through `src/runtime/bun/scripts/build/rust/cargo-serial.ts --msvc`
on this Windows workstation. Resolve every tool from this workspace or explicit
configuration; never use a fixed external checkout path. Never use WSL. Commit
and push only verified paths.
