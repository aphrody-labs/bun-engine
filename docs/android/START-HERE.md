# Android monorepo Windows

`crates/android-native` fournit une bibliothèque Rust nightly avec ABI C (`android_add`) et JNI (`NativeBridge.add`).
`web/android` compile le frontend avec Bun 1.4.4 et charge la DLL Rust par `bun:ffi`.
`packages/java-ffi` utilise la même DLL via JNI ; `packages/android-app` assemble Java, les bibliothèques Android quatre ABI et les assets Bun dans un APK.

```powershell
. ./tools/android/env.ps1
./tools/android/bun.ps1 build
./tools/android/bun.ps1 test
./tools/android/build-rust.ps1 -HostOnly
./tools/android/bun.ps1 ffi
./tools/android/test-java-ffi.ps1
./tools/android/build-android.ps1
```

Java 21 est utilisé pour Android/Ghidra. `java-latest` et `javac-latest` invoquent Java 27.
`ghidra`, `ghidra-headless`, `jadx`, `apktool`, `frida`, `adb` et `android` sont accessibles après chargement de l'environnement.

Les clones officiels RE sont dans `sources/`. Les paquets SDK et les exécutables restent dans `sdk/` et `tools/`.
