# FunDoo Notes 📝

[![React Native](https://img.shields.io/badge/React%20Native-0.78.0-blue)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-9.x-orange)](https://firebase.google.com)

FunDoo Notes revolutionizes note-taking with intelligent organization tools, location-based reminders, and instant cloud sync. Effortlessly capture ideas, set contextual alerts, and access content across devices. Features rich text formatting, multi-note selection, and secure Firebase-backed storage. Perfect for personal productivity or team collaboration, it combines sleek design with powerful functionality for seamless digital note management.



## Features ✨

- **Note Management**
  - 📄 Create/edit rich text notes
  - 🗂️ Archive/restore notes
  - 🗑️ Trash with 30-day auto-cleanup
  - 🔍 Full-text search across notes

- **Smart Organization**
  - 🏷️ Label/tag system
  - 📅 Date-based filtering
  - 🔄 Grid/List view toggle
  - ✨ Multi-note selection

- **Reminders & Alerts** 🔔
  - ⏰ Time-based notifications
  - 📍 Location-based triggers
  - 🔄 Recurring reminders
  - 📲 Push notifications (Notifee)

- **Security & Sync** 🔒
  - 🔐 Firebase Authentication
  - ☁️ Firestore real-time sync
  - 📱 Offline-first support
  - 🔄 Cross-device synchronization

## Prerequisites 📋

- Node.js v18.x+
- npm v9.x+ or Yarn 1.22.x+
- Android Studio (for Android builds)
- Xcode 15+ (for iOS development)
- Firebase project (free tier)

## Installation 🛠️

1. **Clone Repository**
```sh
git clone https://github.com/ayush7252/fundoo-notes.git
cd fundoo-notes
```
2. **Install Dependencies**
```sh
npm install
# or
yarn install
```
3. **Setup Firebase**
```sh
# Add your Firebase config (get from console)
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Firebase Setup 🔥
1. Create project at [Firebase Colsole](https://firebase.google.com/)

2. Enable services:
- Authentication (Email/Password)
- Firestore Database (Test mode)

3. Add platforms:
- Android: Package `com.fundoo.notes`

- iOS: Bundle ID `com.fundoo.notes`

4. Download `google-services.json` and `GoogleService-Info.plist`

## Congratulations! :tada:

You've successfully run your React Native App. :partying_face:
