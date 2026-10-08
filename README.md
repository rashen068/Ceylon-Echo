# Ceylon Echo - Heritage Site Audio Guide

## Project Description
A mobile application built with React Native that provides location-aware audio explanations for heritage sites. Developed for IT3060 Milestone 03.

## Run the App
1. Clone this repository: `git clone https://github.com/therume/Ceylon-Echo.git`
2. Open terminal in the project folder and run: `npm install`
3. Start the application: `npx expo start`

## Firebase Setup

The app uses Firebase Authentication and Cloud Firestore. New attraction photos and audio are uploaded to Cloudinary from native iOS and Android builds using Expo FileSystem multipart uploads; this uploader does not support web. Existing Firebase Storage media remains readable. User-facing attraction lists read the existing `attractions` collection, which is managed in the admin screens; there is no separate tours collection in this heritage/audio-guide app.

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. In **Project settings → General**, register a **Web app**. Copy its Firebase web configuration values into the ignored local `.env` file (or `.env.local`) using [.env.example](./.env.example) as a template. `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` is optional and only needed to manage existing Firebase Storage media. Restart Expo after changing environment variables.
3. In **Authentication → Sign-in method**, enable **Email/Password**. Account registration and sign-in are provided by the existing login screen; visitor mode can browse public attractions without an account.
4. Create a **Cloud Firestore** database. Media uploads use Cloudinary, configured in `src/features/admin/upload-media.ts` with cloud name `mweyti8z` and unsigned preset `Sigiriya1`. Restrict the preset's allowed formats to the image/audio types you use and set a reasonable maximum file size and usage limits in Cloudinary. You do not need to enable Firebase Storage for new uploads.
5. Publish `firestore.rules` from this repository in Firebase Console under **Firestore Database → Rules**, or deploy it with the Firebase CLI (`npx firebase-tools login`, then `npx firebase-tools deploy --only firestore:rules`). Publish `storage.rules` only if the project still needs to manage existing Firebase Storage media.
6. To create an admin account, register it through the app, then have a trusted project owner update that account's `users/{firebase-auth-uid}` document in Firestore and set its `role` field to `"admin"`. The client cannot grant itself admin access.
7. Start the app with `npm start`. Open `/admin` to curate attraction records and upload photo/audio files.

The app creates user profiles at `users/{uid}` and saved attractions at `users/{uid}/savedAttractions/{attractionId}`. Attraction records remain in `attractions`; new attraction media is uploaded to Cloudinary and its secure URL is stored in Firestore. Profile photos also use Cloudinary. Removing or replacing Cloudinary media removes its Firestore reference, but does not delete the Cloudinary asset: secure deletion requires a trusted backend, so remove unused assets from the Cloudinary console. The unsigned preset and cloud name are public client configuration, not secrets; never put a Cloudinary API secret in the app or any `EXPO_PUBLIC_*` variable. Anyone who obtains the preset can attempt uploads, so preset restrictions and account usage limits are important. Audio-guide buttons open the media URL externally; offline caching is not implemented. Booking and review collections have authenticated, owner-checked Firestore rules, but this project currently has no booking or review screens/forms to connect.

The `EXPO_PUBLIC_FIREBASE_*` values are Firebase web-app identifiers intended to be included in a client bundle; Firebase API keys are not authorization secrets. Firestore and Storage security rules enforce access. Never put a Firebase Admin SDK service-account JSON, private key, or other server credential in an Expo app or any `EXPO_PUBLIC_*` variable.

## APK Download
[Paste your Google Drive link here after building the APK]