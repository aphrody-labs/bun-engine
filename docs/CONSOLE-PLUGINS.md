# Console plugin catalog

`plugins/consoles/manifest.json` is the machine-readable boundary between Bun
Engine and optional console implementations. The default native kernel neither
loads nor links these components.

Each component declares its console, CPU domains, runtime role, firmware policy,
license metadata, publication gate, immutable source revision, build owner, and source owner files.
These files may identify Rust crates or free C, C++, and SDK trees under `plugins/` or
`src/console/`; the catalog never authorizes downloads or proprietary inputs.

License metadata does not block local research. Publication remains disabled
while `publicationGate` is `deferred-review`; changing it to `approved` requires
separate provenance and redistribution evidence. Every source stays isolated
from the kernel regardless of that publication state.

Firmware policies are deliberately restrictive:

- `not-required`: the component operates without firmware.
- `caller-supplied-only`: firmware is never stored or distributed by Bun Engine.
- `redistributable-only`: only firmware carrying an explicit redistribution grant is accepted.

Run `bun run console:validate` to validate fields, revisions, ownership and local
source paths. Adding a component does not enable it: its build owner remains the
only place allowed to compile or package it.
