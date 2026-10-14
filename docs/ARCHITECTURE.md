# Architecture

1. Kernel: `crates/bun-engine-core`; time, lifecycle, one C ABI and deterministic scheduling.
2. World: the pinned `crates/bevy` source in the unified workspace.
3. Render: pinned `crates/wgpu` with DX12, static DXC, WGSL, SPIR-V and GLSL.
4. Platform: pinned `crates/winit` windows, input, displays and event loop.
5. Editor: separate binary using the same public contracts.
6. Tooling: Bun asset graph, packaging, hot reload and compatibility services.
7. Binary ingestion: the dependency-free kernel identifies bounded PE, ELF, Wasm,
   Android packages and runtime formats (APK/AAB/APKS/APEX, DEX/OAT/ART),
   Nintendo DS, archive, virtual-filesystem and firmware headers. Identification
   reports architecture and endianness when the format defines them; decoding,
   mounting, execution and conversion delegate to their unified owners.

Physics, animation, audio, networking, scripting, streaming and authoring share
the same distribution contract and may load lazily through their owners.

The repository has one root Cargo workspace, one Bun package workspace, one
CMake project and one vcpkg manifest. `src/runtime/bun` owns Bun, Buv, PyJS,
Python, CUDA bindings and the shared runtime FFI. Linux/NVIDIA/CUDA/DirectX
sources are pinned under `src/`; LLVM, QEMU, CMake, vcpkg and Make are pinned
under `toolchains/`. They are required distribution owners with scoped builds.

Console runtimes, CPU implementations and free native SDK source trees are
unified catalog entries described in [CONSOLE-PLUGINS.md](CONSOLE-PLUGINS.md).
Their implementations remain owner-routed rather than duplicated in the kernel.
