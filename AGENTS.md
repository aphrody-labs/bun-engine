# Bun Engine

Use Rust for native engine logic and Bun for tooling. Keep the default kernel
dependency-free. New subsystems are opt-in features or separate binaries.
Reuse Bevy, wgpu and winit owners; do not duplicate their implementations.

Run Cargo through 'C:\bun\scripts\build\rust\cargo-serial.ts --msvc' on this
Windows workstation. Never use WSL. Commit and push only verified paths.
