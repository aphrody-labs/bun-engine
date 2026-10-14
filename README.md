# Steam Linux Compatibility Lab

Bun-native qualification and launch policy for legitimate Steam games on
Linux through vendor-supported Proton/Wine paths. It probes Steam, Vulkan,
kernel and user namespaces, and records per-game support.

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
