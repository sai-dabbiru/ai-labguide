# Interactive Lab Guide — Serverless Edition

A modern, cloud-native lab guide built with **React** and **Firebase**. This application is fully serverless, providing real-time progress persistence and a beautiful developer experience without the need for a managed backend.

## 🚀 Architecture Overview

- **Frontend**: React + Vite (Vanilla CSS)
- **Database**: Cloud Firestore (Real-time NoSQL)
- **Authentication**: Firebase Anonymous Auth (Unique sessions per device)
- **Persistence**: Experimental Long-Polling enabled for maximum connectivity resilience.

## 🛠️ Getting Started (Local Development)

The application is now a single-tier architecture. You only need to run the frontend.

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   *The app will automatically detect your Firebase configuration and start syncing your progress to the cloud.*

## ☁️ Cloud Features

### Private Progress Sync
Every checklist item, reflection, and lab score you complete is automatically synchronized with your personal **Firestore** profile. You can close your browser and resume exactly where you left off.

### Resilient Login
The authentication system features a fail-safe 5-second timeout. If the cloud database is slow to respond, the app gracefully falls back to a local-first session to ensure zero downtime for learners.

### Personal Scoreboard
The Scoreboard (formerly the Leaderboard) is now private. It provides a dedicated view of your Grand Total XP, milestone badges, and completion status for all 10 labs.

## 📦 Deployment (Firebase Hosting)

To deploy this application to production:

1. **Build the Project**:
   ```bash
   cd client && npm run build
   ```

2. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

3. **Deploy to Hosting**:
   ```bash
   firebase deploy --only hosting
   ```

*Note: Ensure your `firestore.rules` are deployed to protect user data.*

---

## 🧹 Legacy Cleanup
The previous Node.js/Express server and SQLite (`data.db`) dependencies have been fully removed in favor of this simplified serverless architecture.
