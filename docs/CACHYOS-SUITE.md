# CachyOS suite

Bun Engine pins one CachyOS-based Linux gaming suite:

| Owner                         | Canonical path       | Upstream branch |
| ----------------------------- | -------------------- | --------------- |
| `aphrody-labs/linux-cachyos`  | `src/kernel/linux`   | `master`        |
| `aphrody-labs/kernel-patches` | `src/kernel/patches` | `master`        |
| `aphrody-labs/proton-cachyos` | `src/compat/proton`  | `cachyos_main`  |
| `aphrody-labs/wine-cachyos`   | `src/compat/wine`    | `proton_9.0`    |

The kernel source replaces the former generic Linux fork. The patch repository
is its versioned patch owner. Proton-CachyOS replaces the generic Proton layer
and composes its Wine, DXVK and vkd3d-proton dependencies. Wine-CachyOS is kept
as the source owner used for direct Wine work; it is not a second runtime
selected beside Proton.

All four owners are shallow gitlinks. Their upstream build systems stay intact;
the root Bun workspace owns orchestration, provenance and qualification. Kernel,
Proton and Wine production builds require a qualified native Linux or container
host and are not claimed by the native Windows source gates.
