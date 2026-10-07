# Ceylon Echo - Heritage Site Audio Guide

## Project Description
A mobile application built with React Native that provides location-aware audio explanations for heritage sites. Developed for IT3060 Milestone 03.

## Run the App
1. Clone this repository: `git clone https://github.com/therume/Ceylon-Echo.git`
2. Open terminal in the project folder and run: `npm install`
3. Start the application: `npx expo start`

## Firebase Setup

The app uses Firebase Authentication, Cloud Firestore, and Cloud Storage. User-facing attraction lists read the existing `attractions` collection, which is managed in the admin screens; there is no separate tours collection in this heritage/audio-guide app.

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. In **Project settings → General**, register a **Web app**. Copy its Firebase web configuration values into the ignored local `.env` file (or `.env.local`) using [.env.example](./.env.example) as a template. Restart Expo after changing environment variables.
3. In **Authentication → Sign-in method**, enable **Email/Password**. Account registration and sign-in are provided by the existing login screen; visitor mode can browse public attractions without an account.
4. Create a **Cloud Firestore** database and a **Cloud Storage** bucket.
5. Publish `firestore.rules` and `storage.rules` from this repository in Firebase Console under **Firestore Database → Rules** and **Storage → Rules**, or deploy them with the Firebase CLI (`npx firebase-tools login`, then `npx firebase-tools deploy --only firestore:rules,storage`). The Storage rules use Firestore to verify admin roles and may prompt you to enable that integration.
6. To create an admin account, register it through the app, then create `admins/{firebase-auth-uid}` in Firestore with a string field `role: "admin"`. Only a trusted project owner should create this role document; the client cannot grant itself admin access.
7. Start the app with `npm start`. Open `/admin` to curate attraction records and upload photo/audio files.

The app creates user profiles at `users/{uid}` and saved attractions at `users/{uid}/savedAttractions/{attractionId}`. Attraction records remain in `attractions`; uploaded media stays in Storage under `attractions/{id}/photos/` or `attractions/{id}/audio/`, with the download URL stored in the attraction document. Audio-guide buttons open the Firebase Storage URL externally; offline caching is not implemented. Booking and review collections have authenticated, owner-checked Firestore rules, but this project currently has no booking or review screens/forms to connect.

The `EXPO_PUBLIC_FIREBASE_*` values are Firebase web-app identifiers intended to be included in a client bundle; Firebase API keys are not authorization secrets. Firestore and Storage security rules enforce access. Never put a Firebase Admin SDK service-account JSON, private key, or other server credential in an Expo app or any `EXPO_PUBLIC_*` variable.

## APK Download
[Paste your Google Drive link here after building the APK]