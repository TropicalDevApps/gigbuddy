# Agent SOP: gigBuddy Operations

## Operational Mandates
- **Real-time Hygiene:** All shared state must reside in Firestore. Optimize for minimal document writes to control costs and latency.
- **Security Rules:** Every Firestore operation must be backed by a corresponding rule in `firestore.rules`.
- **Media Stability:** Handle API rate limits and token expirations gracefully for Spotify and YouTube integrations.
- **Offline First:** Ensure critical stage assets (lyrics/chords) are cached via Service Workers.

## Core Workflows
1. **Stage View Updates:**
   - Modify components in `src/components/stage/`.
   - Test for touch-responsiveness and high-contrast accessibility.
2. **API Integrations:**
   - Update services in `src/services/`.
   - Verify OAuth flows and error recovery logic.
3. **Database Schema Changes:**
   - Update `docs/wiki/schema.json`.
   - Deploy new Firestore rules.

## Documentation SOP
- Update `CHANGELOG.md` for setiap release.
- Maintain the wiki in `docs/wiki/` for technical integrations.
- Keep `docs/MEMORY.md` updated with API provider changes and project health.

## Related Docs
- [Project Identity](./IDENTITY.md)
- [Project Soul](./SOUL.md)
- [Wiki Index](./wiki/index.md)
- [Firestore Rules](../../firestore.rules)