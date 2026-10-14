# Steam platform owners

| Owner                                   | Canonical path                          | Upstream branch |
| --------------------------------------- | --------------------------------------- | --------------- |
| `aphrody-labs/steamcmd`                 | `src/platform/steamcmd`                 | `master`        |
| `aphrody-labs/steamos-nvidia-installer` | `src/platform/steamos-nvidia-installer` | `main`          |

The SteamCMD owner provides minimal Debian container definitions for Valve's
SteamCMD client. It owns dedicated-server and SteamPipe provisioning without
embedding Steam credentials or login sessions in Bun Engine. Persistent login
state remains in an explicitly mounted protected volume.

The SteamOS NVIDIA installer remains the separate recovery-image owner. Neither
source is bundled into the Bun Engine executable. Container image builds and
privileged recovery-image assembly require their qualified Linux hosts.
