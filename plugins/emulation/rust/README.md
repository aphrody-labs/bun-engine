# Rust emulator research catalog

These repositories are optional, pinned research inputs. They are Git submodules,
not Cargo workspace members, and are never linked into the dependency-free kernel.

Initialize only the owner needed for a task:

```text
git submodule update --init --depth 1 plugins/emulation/rust/<owner>
```

No ROM, BIOS, firmware, keys, game data, or other proprietary payload is included.
Each upstream license applies independently. GPL projects remain isolated until a
separate publication gate approves the intended distribution.

See [CATALOG.md](CATALOG.md) for pinned provenance and selection status.
