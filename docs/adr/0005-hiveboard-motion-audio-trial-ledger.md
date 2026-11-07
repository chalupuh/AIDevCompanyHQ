# 0005: HiveBoard motion/audio stack, local trial, and points-reset ledger

Date: 2026-11-07 · Status: Proposed (owner gate with design.md)

## Context
The revised HiveBoard spec (Full track) requires rich, 60 fps animation with Reduce Motion support, 15 sound cues that respect the mute switch, a 14-day trial with no server, and periodic points resets that keep history. These go beyond the studio mobile defaults.

## Decision
- Animation: react-native-reanimated + gesture-handler, with @shopify/react-native-skia for particles. Not Lottie: celebrations are parametric and code-driven, and the studio has no After Effects pipeline. Lottie may be added later only for designer-supplied files.
- Audio: expo-audio with preloaded players, ambient mode (mix with others, silent when muted). Cues are `.m4a` AAC mono, -18 LUFS, pack ≤ 1 MB.
- Trial: `trialStartedAt` + forward-only `lastSeenAt` in local SQLite. Reinstall resets the trial (accepted).
- Points reset: written as negative `points_adjustment` ledger entries keyed by (child, boundary), so balance stays derived, resets are idempotent, and history is kept.

## Consequences
- Requires EAS dev-client builds (Skia, IAP); Expo Go is not enough.
- Placeholder sound files with fixed names let the build proceed before Creative Studio delivers.
- Export/import must include `points_adjustment` and must exclude trial and purchase state.
