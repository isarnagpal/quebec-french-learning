// Firebase Configuration for Quebec French Learning App
// Replace with your actual Firebase config from Firebase Console

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com"
};

// Instructions to set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project called "quebec-french-learning"
// 3. Enable Authentication (Email/Password and Google providers)
// 4. Enable Realtime Database
// 5. Copy your config from Project Settings > General > Your apps
// 6. Replace the values above with your actual config
// 7. Update Realtime Database rules:
/*
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
