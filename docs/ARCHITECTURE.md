# Architecture

1. Kernel: time, lifecycle, plugin ownership and deterministic scheduling.
2. World: Bevy ECS behind the 'ecs' feature.
3. Render: wgpu graph, shaders and resource lifetimes behind 'render'.
4. Platform: winit windows, input, displays and event loop.
5. Editor: separate binary using the same public contracts.
6. Tooling: Bun asset graph, packaging, hot reload and compatibility services.

Physics, animation, audio, networking, scripting, streaming and authoring stay
independent plugins until measurements justify promotion into the core.
