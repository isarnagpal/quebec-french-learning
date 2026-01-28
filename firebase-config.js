// Firebase Configuration
// Quebec French Learning App

const firebaseConfig = {
    apiKey: "AIzaSyDVWpmjMGz1WWBfoxCYFfG8HM3YBonogww",
    authDomain: "quebec-french-learning.firebaseapp.com",
    databaseURL: "https://quebec-french-learning-default-rtdb.firebaseio.com",
    projectId: "quebec-french-learning",
    storageBucket: "quebec-french-learning.firebasestorage.app",
    messagingSenderId: "763157711652",
    appId: "1:763157711652:web:2475387691fc5037f081b1",
    measurementId: "G-BM82RFSQE7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const database = firebase.database();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.firebaseApp = firebase.app();
    window.firebaseAuth = auth;
    window.firebaseDatabase = database;
}

console.log('✅ Firebase initialized successfully!');
