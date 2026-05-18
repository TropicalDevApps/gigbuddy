# Project Memory: gigBuddy

## Status: v0.2.x (Development)
- **Current Goal:** Stabilize Spotify remote control bridge and refine the real-time lyrics synchronization logic.
- **Last Milestone:** Integrated Firebase Authentication and basic Firestore real-time setlist updates.

## Persistent Context
- **Stack:** React, TypeScript, Vite, Firebase (Firestore/Auth/Hosting), Spotify Web API, YouTube IFrame API.
- **Core Files:** `server.ts` (Dev Proxy), `firestore.rules`, `src/App.tsx`.

## Active Tasks
- [ ] Implement "Band Leader" role for exclusive playback control.
- [ ] Add PDF export for offline setlist backups.
- [ ] Refine Service Worker caching for large lyric datasets.

## Technical Debt
- Spotify token refresh logic needs to be more robust for long rehearsal sessions.
- Styling in Stage View uses some hardcoded hex values that should be moved to CSS variables.

## Notes
- *2026-05-18:* Jules Dev Standard v1.0 applied. All technical and governance documents migrated to `docs/wiki/`.
- Project prioritizes high-contrast UI for stage visibility.
- Backend is purely serverless via Firebase.