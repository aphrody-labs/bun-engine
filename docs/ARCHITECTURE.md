# Architecture

1. Kernel: time, lifecycle, plugin ownership and deterministic scheduling.
2. World: Bevy ECS behind the 'ecs' feature.
3. Render: wgpu graph, shaders and resource lifetimes behind 'render'.
4. Platform: winit windows, input, displays and event loop.
5. Editor: separate binary using the same public contracts.
6. Tooling: Bun asset graph, packaging, hot reload and compatibility services.
7. Binary ingestion: the dependency-free kernel identifies bounded PE, ELF, Wasm,
   Android packages and runtime formats (APK/AAB/APKS/APEX, DEX/OAT/ART),
   Nintendo DS, archive, virtual-filesystem and firmware headers. Identification
   reports architecture and endianness when the format defines them; decoding,
   mounting, execution and arbitrary conversion belong to opt-in owners.

Physics, animation, audio, networking, scripting, streaming and authoring stay
independent plugins until measurements justify promotion into the core.
