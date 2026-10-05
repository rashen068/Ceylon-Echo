# Ceylon Echo - Heritage Site Audio Guide

## Project Description
A mobile application built with React Native that provides location-aware audio explanations for heritage sites. Developed for IT3060 Milestone 03.

## Run the App
1. Clone this repository: `git clone https://github.com/therume/Ceylon-Echo.git`
2. Open terminal in the project folder and run: `npm install`
3. Start the application: `npx expo start`

## Firebase Setup

The admin screens use Firebase Authentication, Cloud Firestore, and Cloud Storage. The previous in-memory sample attractions are not migrated; the dashboard starts empty and new sites are saved in Firestore.

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. In **Project settings**, register a **Web app** and copy its Firebase config values into a local `.env.local` file using [.env.example](./.env.example) as a template. These `EXPO_PUBLIC_` values are client configuration, not server credentials. Never put a service-account key in the app.
3. In **Authentication → Sign-in method**, enable **Email/Password**, then create the admin user in **Authentication → Users**.
4. Create a **Cloud Firestore** database and a **Cloud Storage** bucket in the Firebase console.
5. Publish this repository's `firestore.rules` and `storage.rules` to the Firebase project. Install/use the Firebase CLI, sign in with `npx firebase-tools login`, select the project with `npx firebase-tools use --add`, then run `npx firebase-tools deploy --only firestore:rules,storage`. The CLI may ask you to enable Cloud Storage access to Firestore for the admin-role check.
6. In Firestore, create a collection named `admins`. Create a document whose document ID is the admin user's Firebase Authentication UID, with a string field `role` set to `admin`. This role document can only be created by a trusted project owner in the Firebase console; the client cannot grant itself admin access.
7. Restart Expo after creating `.env.local`: `npx expo start`. Open `/admin` and sign in with the Firebase admin user's email and password.

Firestore site records are stored in `attractions`; media is uploaded to `attractions/{id}/photos/` or `attractions/{id}/audio/`. The supplied rules make attraction/media reads public for the heritage guide, but restrict writes and deletes to users with an admin role document. Review and publish the rules before using a production Firebase project.

## APK Download
[Paste your Google Drive link here after building the APK]