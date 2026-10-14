# Architecture

1. Kernel: `crates/bun-engine-core`; time, lifecycle, one C ABI and deterministic scheduling.
2. World: the pinned `crates/bevy` source behind the `ecs` feature.
3. Render: pinned `crates/wgpu` with DX12, static DXC, WGSL, SPIR-V and GLSL behind `render`.
4. Platform: pinned `crates/winit` windows, input, displays and event loop.
5. Editor: separate binary using the same public contracts.
6. Tooling: Bun asset graph, packaging, hot reload and compatibility services.
7. Binary ingestion: the dependency-free kernel identifies bounded PE, ELF, Wasm,
   Android packages and runtime formats (APK/AAB/APKS/APEX, DEX/OAT/ART),
   Nintendo DS, archive, virtual-filesystem and firmware headers. Identification
   reports architecture and endianness when the format defines them; decoding,
   mounting, execution and arbitrary conversion belong to opt-in owners.

Physics, animation, audio, networking, scripting, streaming and authoring stay
independent plugins until measurements justify promotion into the core.

The repository has one root Cargo workspace, one Bun package workspace, one
CMake project and one vcpkg manifest. `src/runtime/bun` owns Bun, Buv, PyJS,
Python, CUDA bindings and the shared runtime FFI. Linux/NVIDIA/CUDA/DirectX
sources are pinned under `src/`; LLVM, QEMU, CMake, vcpkg and Make are pinned
under `toolchains/`. These source owners are not built into the default kernel.

Console runtimes, CPU implementations and free native SDK source trees are
optional catalog entries described in [CONSOLE-PLUGINS.md](CONSOLE-PLUGINS.md).
They are never linked into the default kernel merely because they are cataloged.
