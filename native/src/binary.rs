//! Bounded binary-format identification for asset ingestion.
//!
//! This module classifies headers. It does not decode, mount, execute or convert payloads.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BinaryFamily {
    Executable,
    Bytecode,
    Rom,
    Archive,
    VirtualFileSystem,
    Firmware,
    Unknown,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BinaryFormat {
    Pe,
    Elf,
    WebAssembly,
    NintendoDsRom,
    Zip,
    Gzip,
    SevenZip,
    Tar,
    Xz,
    Bzip2,
    CpioNewc,
    SquashFs,
    Iso9660,
    ExtFileSystem,
    Qcow2,
    Vhdx,
    UefiFirmwareVolume,
    FlattenedDeviceTree,
    UBootImage,
    IntelHex,
    Unknown,
}

impl BinaryFormat {
    pub const fn family(self) -> BinaryFamily {
        match self {
            Self::Pe | Self::Elf => BinaryFamily::Executable,
            Self::WebAssembly => BinaryFamily::Bytecode,
            Self::NintendoDsRom => BinaryFamily::Rom,
            Self::Zip
            | Self::Gzip
            | Self::SevenZip
            | Self::Tar
            | Self::Xz
            | Self::Bzip2
            | Self::CpioNewc => BinaryFamily::Archive,
            Self::SquashFs | Self::Iso9660 | Self::ExtFileSystem | Self::Qcow2 | Self::Vhdx => {
                BinaryFamily::VirtualFileSystem
            }
            Self::UefiFirmwareVolume
            | Self::FlattenedDeviceTree
            | Self::UBootImage
            | Self::IntelHex => BinaryFamily::Firmware,
            Self::Unknown => BinaryFamily::Unknown,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Endianness {
    Little,
    Big,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Architecture {
    X86,
    X86_64,
    Arm,
    Aarch64,
    Mips,
    PowerPc,
    PowerPc64,
    RiscV32,
    RiscV64,
    S390x,
    Sparc,
    Itanium,
    WebAssembly32,
    Unknown(u16),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct BinaryInspection {
    pub format: BinaryFormat,
    pub family: BinaryFamily,
    pub architecture: Option<Architecture>,
    pub endianness: Option<Endianness>,
    pub bits: Option<u8>,
}

impl BinaryInspection {
    const fn new(
        format: BinaryFormat,
        architecture: Option<Architecture>,
        endianness: Option<Endianness>,
        bits: Option<u8>,
    ) -> Self {
        Self {
            format,
            family: format.family(),
            architecture,
            endianness,
            bits,
        }
    }

    const UNKNOWN: Self = Self::new(BinaryFormat::Unknown, None, None, None);
}

/// Inspects only bounded, format-defined header bytes. Unknown and truncated inputs are safe.
pub fn inspect_binary(bytes: &[u8]) -> BinaryInspection {
    inspect_pe(bytes)
        .or_else(|| inspect_elf(bytes))
        .or_else(|| inspect_wasm(bytes))
        .or_else(|| inspect_nds(bytes))
        .or_else(|| inspect_archive(bytes))
        .or_else(|| inspect_vfs(bytes))
        .or_else(|| inspect_firmware(bytes))
        .unwrap_or(BinaryInspection::UNKNOWN)
}

fn inspect_pe(bytes: &[u8]) -> Option<BinaryInspection> {
    if bytes.get(..2)? != b"MZ" || bytes.len() < 0x40 {
        return None;
    }
    let pe_offset = read_u32(bytes, 0x3c, Endianness::Little)? as usize;
    if bytes.get(pe_offset..pe_offset.checked_add(6)?)?.get(..4)? != b"PE\0\0" {
        return None;
    }
    let machine = read_u16(bytes, pe_offset + 4, Endianness::Little)?;
    let (architecture, bits) = pe_architecture(machine);
    Some(BinaryInspection::new(
        BinaryFormat::Pe,
        Some(architecture),
        Some(Endianness::Little),
        bits,
    ))
}

fn pe_architecture(machine: u16) -> (Architecture, Option<u8>) {
    match machine {
        0x014c => (Architecture::X86, Some(32)),
        0x8664 => (Architecture::X86_64, Some(64)),
        0x01c0 | 0x01c2 | 0x01c4 => (Architecture::Arm, Some(32)),
        0xaa64 => (Architecture::Aarch64, Some(64)),
        0x0200 => (Architecture::Itanium, Some(64)),
        0x5032 => (Architecture::RiscV32, Some(32)),
        0x5064 => (Architecture::RiscV64, Some(64)),
        other => (Architecture::Unknown(other), None),
    }
}

fn inspect_elf(bytes: &[u8]) -> Option<BinaryInspection> {
    if bytes.get(..4)? != b"\x7fELF" {
        return None;
    }
    let bits = match *bytes.get(4)? {
        1 => 32,
        2 => 64,
        _ => return None,
    };
    let endianness = match *bytes.get(5)? {
        1 => Endianness::Little,
        2 => Endianness::Big,
        _ => return None,
    };
    let machine = read_u16(bytes, 18, endianness)?;
    let architecture = match machine {
        3 => Architecture::X86,
        8 => Architecture::Mips,
        20 => Architecture::PowerPc,
        21 => Architecture::PowerPc64,
        40 => Architecture::Arm,
        43 => Architecture::Sparc,
        50 => Architecture::Itanium,
        62 => Architecture::X86_64,
        183 => Architecture::Aarch64,
        243 if bits == 32 => Architecture::RiscV32,
        243 => Architecture::RiscV64,
        22 => Architecture::S390x,
        other => Architecture::Unknown(other),
    };
    Some(BinaryInspection::new(
        BinaryFormat::Elf,
        Some(architecture),
        Some(endianness),
        Some(bits),
    ))
}

fn inspect_wasm(bytes: &[u8]) -> Option<BinaryInspection> {
    (bytes.get(..8)? == b"\0asm\x01\0\0\0").then_some(BinaryInspection::new(
        BinaryFormat::WebAssembly,
        Some(Architecture::WebAssembly32),
        Some(Endianness::Little),
        Some(32),
    ))
}

fn inspect_nds(bytes: &[u8]) -> Option<BinaryInspection> {
    const LOGO_PREFIX: &[u8] = b"\x24\xff\xae\x51\x69\x9a\xa2\x21\x3d\x84\x82\x0a";
    if bytes.get(0xc0..0xc0 + LOGO_PREFIX.len())? != LOGO_PREFIX {
        return None;
    }
    let game_code = bytes.get(12..16)?;
    let arm9_offset = read_u32(bytes, 0x20, Endianness::Little)?;
    let arm7_offset = read_u32(bytes, 0x30, Endianness::Little)?;
    if !game_code.iter().all(u8::is_ascii_alphanumeric)
        || arm9_offset < 0x200
        || arm7_offset < 0x200
    {
        return None;
    }
    Some(BinaryInspection::new(
        BinaryFormat::NintendoDsRom,
        Some(Architecture::Arm),
        Some(Endianness::Little),
        Some(32),
    ))
}

fn inspect_archive(bytes: &[u8]) -> Option<BinaryInspection> {
    let format = if matches!(
        bytes.get(..4),
        Some(b"PK\x03\x04" | b"PK\x05\x06" | b"PK\x07\x08")
    ) {
        BinaryFormat::Zip
    } else if bytes.starts_with(b"\x1f\x8b\x08") {
        BinaryFormat::Gzip
    } else if bytes.starts_with(b"7z\xbc\xaf\x27\x1c") {
        BinaryFormat::SevenZip
    } else if bytes.get(257..262) == Some(b"ustar") {
        BinaryFormat::Tar
    } else if bytes.starts_with(b"\xfd7zXZ\0") {
        BinaryFormat::Xz
    } else if bytes.starts_with(b"BZh") {
        BinaryFormat::Bzip2
    } else if matches!(bytes.get(..6), Some(b"070701" | b"070702")) {
        BinaryFormat::CpioNewc
    } else {
        return None;
    };
    Some(BinaryInspection::new(format, None, None, None))
}

fn inspect_vfs(bytes: &[u8]) -> Option<BinaryInspection> {
    let (format, endianness) = if bytes.starts_with(b"hsqs") {
        (BinaryFormat::SquashFs, Some(Endianness::Little))
    } else if bytes.starts_with(b"sqsh") {
        (BinaryFormat::SquashFs, Some(Endianness::Big))
    } else if [0x8001, 0x8801, 0x9001]
        .into_iter()
        .any(|offset| bytes.get(offset..offset + 5) == Some(b"CD001"))
    {
        (BinaryFormat::Iso9660, None)
    } else if bytes.get(1080..1082) == Some(&[0x53, 0xef]) {
        (BinaryFormat::ExtFileSystem, Some(Endianness::Little))
    } else if bytes.starts_with(b"QFI\xfb") {
        (BinaryFormat::Qcow2, Some(Endianness::Big))
    } else if bytes.starts_with(b"vhdxfile") {
        (BinaryFormat::Vhdx, Some(Endianness::Little))
    } else {
        return None;
    };
    Some(BinaryInspection::new(format, None, endianness, None))
}

fn inspect_firmware(bytes: &[u8]) -> Option<BinaryInspection> {
    let (format, endianness) = if bytes.get(0x28..0x2c) == Some(b"_FVH") {
        (BinaryFormat::UefiFirmwareVolume, Some(Endianness::Little))
    } else if bytes.starts_with(b"\xd0\x0d\xfe\xed") {
        (BinaryFormat::FlattenedDeviceTree, Some(Endianness::Big))
    } else if bytes.starts_with(b"\x27\x05\x19\x56") {
        (BinaryFormat::UBootImage, Some(Endianness::Big))
    } else if is_intel_hex(bytes) {
        (BinaryFormat::IntelHex, None)
    } else {
        return None;
    };
    Some(BinaryInspection::new(format, None, endianness, None))
}

fn is_intel_hex(bytes: &[u8]) -> bool {
    let Some(line) = bytes.split(|byte| *byte == b'\n' || *byte == b'\r').next() else {
        return false;
    };
    line.len() >= 11 && line[0] == b':' && line[1..].iter().all(u8::is_ascii_hexdigit)
}

fn read_u16(bytes: &[u8], offset: usize, endianness: Endianness) -> Option<u16> {
    let value: [u8; 2] = bytes.get(offset..offset.checked_add(2)?)?.try_into().ok()?;
    Some(match endianness {
        Endianness::Little => u16::from_le_bytes(value),
        Endianness::Big => u16::from_be_bytes(value),
    })
}

fn read_u32(bytes: &[u8], offset: usize, endianness: Endianness) -> Option<u32> {
    let value: [u8; 4] = bytes.get(offset..offset.checked_add(4)?)?.try_into().ok()?;
    Some(match endianness {
        Endianness::Little => u32::from_le_bytes(value),
        Endianness::Big => u32::from_be_bytes(value),
    })
}
