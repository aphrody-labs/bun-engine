# Console source provenance

The catalog pins public upstream Git commits. Submodules retain their own full
license and attribution files; Bun Engine does not relicense them. GPL owners
remain optional and isolated from the MIT kernel.

No proprietary Nintendo SDK, BIOS, firmware, keys, ROM, game image or generated
binary belongs in this tree. `open_agb_firm` is included specifically as freely
licensed source code, not as a firmware image.

## Selection

| Owner | Purpose | License | Integration |
| --- | --- | --- | --- |
| devkitPro/libnds | Nintendo DS homebrew C library | zlib | submodule |
| devkitPro/libogc | GameCube/Wii homebrew C library | zlib | submodule |
| melonDS | DS/DSi focused HLE core | GPL-3.0-only | submodule, isolated |
| ares | accuracy-oriented multi-system components | ISC plus bundled notices | submodule, isolated |
| open_agb_firm | free GBA firmware source for 3DS hardware | GPL-3.0-or-later | submodule, isolated |
| Dolphin | GameCube/Wii HLE reference | GPL-2.0-or-later, per-file SPDX | submodule, isolated |
| Azahar | maintained 3DS HLE reference | GPL-3.0 | submodule, isolated |
| MAME | broad device/kernel reference | GPL aggregate, per-file licenses | submodule, isolated |
| RetroArch | libretro frontend/API reference | GPL-3.0 | submodule, isolated |

Citra is not selected: its original upstream is discontinued and Azahar is the
maintained source considered here. Large application trees remain isolated and
are never linked into the default kernel merely because their submodule exists.
