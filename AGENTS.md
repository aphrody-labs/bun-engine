# Bun Engine

Use Rust for native engine logic and Bun for tooling. `Cargo.toml` and
`package.json` at the repository root are the only Cargo and Bun workspaces.
The distribution is unified: every declared subsystem is required and managed
through the canonical workspace. Heavy owners may load lazily, while remaining
mandatory product surfaces. Bevy, wgpu and winit are pinned under `crates/`.

Run Cargo through `crates/bun-runtime/scripts/build/rust/cargo-serial.ts --msvc`
on this Windows workstation. Resolve every tool from this workspace or explicit
configuration; never use a fixed external checkout path. Never use WSL. Commit
and push only verified paths.
