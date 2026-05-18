<table border="0">
  <tr>
    <td width="200" align="center" valign="top">
      <img src="shot.png" width="180" alt="gigBuddy logo">
    </td>
    <td valign="top">
      <h1>gigBuddy</h1>
      <p><strong>The ultimate real-time live music dashboard.</strong><br/>
      <em>Sync setlists, lyrics, and chords, and control Spotify/YouTube Music playback directly from the stage.</em></p>
      <p>
        <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="License Apache 2.0"></a>
        <img src="https://img.shields.io/badge/status-development-orange" alt="Status">
        <img src="https://img.shields.io/badge/tech-React%20%2B%20Firebase-yellow" alt="Tech Stack">
      </p>
    </td>
  </tr>
</table>

---

## ⚡ Superpowers

- **Real-Time Sync:** Synchronized setlists, lyrics, and chords across all band members' devices.
- **Media Bridge:** Direct remote control for Spotify and YouTube Music from the dashboard.
- **PWA Ready:** Installable on Desktop, Tablet, and Mobile for a native experience.
- **Offline Resilient:** Access cached stage data even when the venue Wi-Fi fails.
- **Stage-Optimized:** High-contrast, touch-friendly UI designed for live performance.

---

## 📖 Documentation

For a comprehensive technical breakdown, architectural ADRs, and operational guides, visit our official **[Wiki](docs/wiki/index.md)**.

*   **[Data Schema](docs/wiki/schema.json)**
*   **[Contributing Guide](docs/wiki/CONTRIBUTING.md)**
*   **[Agent SOP](docs/AGENT.md)**

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Firebase Project
- (Optional) Spotify Developer Account for Spotify integration
- (Optional) Google Cloud Project for YouTube integration

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd gigbuddy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your credentials in `.env.local`. You will need:
     - **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com/). Enable Authentication (Google & Anonymous) and Firestore.
     - **Spotify**: Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
     - **YouTube**: Get an API Key from [Google Cloud Console](https://console.cloud.google.com/).

4. **Firebase Rules:**
   - Use the provided `firestore.rules` and `firebase-blueprint.json` (as a guide for the database structure) to set up your Firestore security rules and initial data.

5. **Run the app locally:**
   ```bash
   npm run dev
   ```

## 🛠️ Deployment

This app is ready to be deployed to platforms like Vercel, Netlify, or Firebase Hosting. Ensure you set the same environment variables from `.env.local` in your deployment platform's settings.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
