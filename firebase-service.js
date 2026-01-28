// Firebase Service - Handles all Firebase interactions
// Authentication, Realtime Database sync, and offline support

class FirebaseService {
    constructor() {
        this.app = null;
        this.auth = null;
        this.database = null;
        this.currentUser = null;
        this.syncStatus = 'offline'; // offline, syncing, synced, error
        this.syncListeners = [];
        this.offlineQueue = [];
        this.lastSyncTime = null;
        
        // Check if Firebase SDK is loaded
        this.isFirebaseLoaded = typeof firebase !== 'undefined';
    }
    
    // Initialize Firebase
    async initialize() {
        if (!this.isFirebaseLoaded) {
            console.warn('Firebase SDK not loaded. Running in offline mode.');
            return false;
        }
        
        try {
            // Initialize Firebase app
            if (!firebase.apps.length) {
                this.app = firebase.initializeApp(firebaseConfig);
            } else {
                this.app = firebase.app();
            }
            
            // Initialize services
            this.auth = firebase.auth();
            this.database = firebase.database();
            
            // Enable offline persistence
            this.database.ref('.info/connected').on('value', (snapshot) => {
                this.updateSyncStatus(snapshot.val() ? 'synced' : 'offline');
            });
            
            // Listen for auth state changes
            this.auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    this.setupUserSync(user.uid);
                    this.processOfflineQueue();
                }
            });
            
            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.updateSyncStatus('error');
            return false;
        }
    }
    
    // Register for sync status updates
    onSyncStatusChange(callback) {
        this.syncListeners.push(callback);
    }
    
    updateSyncStatus(status) {
        this.syncStatus = status;
        this.syncListeners.forEach(callback => callback(status));
    }
    
    // ============ AUTHENTICATION ============
    
    // Sign up with email and password
    async signUp(email, password, name, level) {
        try {
            if (!this.isFirebaseLoaded) {
                return this.fallbackSignUp(email, password, name, level);
            }
            
            this.updateSyncStatus('syncing');
            
            // Create Firebase user
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update profile
            await user.updateProfile({ displayName: name });
            
            // Create user data in database
            const userData = {
                id: user.uid,
                name: name,
                email: email,
                level: level,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                progress: {
                    readingCompleted: 0,
                    vocabMastered: 0,
                    writingCompleted: 0,
                    listeningCompleted: 0,
                    speakingCompleted: 0,
                    studyTimeMinutes: 0,
                    streak: 0,
                    lastStudyDate: null,
                    readingProgress: {},
                    vocabProgress: {},
                    writingProgress: {},
                    listeningProgress: {},
                    speakingProgress: {}
                },
                achievements: [],
                xp: 0,
                level_system: {
                    currentLevel: 1,
                    currentXP: 0,
                    nextLevelXP: 100
                }
            };
            
            await this.database.ref(`users/${user.uid}`).set(userData);
            
            this.updateSyncStatus('synced');
            this.lastSyncTime = Date.now();
            
            return { success: true, user: userData };
        } catch (error) {
            this.updateSyncStatus('error');
            return { success: false, error: error.message };
        }
    }
    
    // Sign in with email and password
    async signIn(email, password) {
        try {
            if (!this.isFirebaseLoaded) {
                return this.fallbackSignIn(email, password);
            }
            
            this.updateSyncStatus('syncing');
            
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get user data from database
            const snapshot = await this.database.ref(`users/${user.uid}`).once('value');
            const userData = snapshot.val();
            
            this.updateSyncStatus('synced');
            this.lastSyncTime = Date.now();
            
            return { success: true, user: userData };
        } catch (error) {
            this.updateSyncStatus('error');
            return { success: false, error: error.message };
        }
    }
    
    // Sign in with Google
    async signInWithGoogle() {
        try {
            if (!this.isFirebaseLoaded) {
                alert('Google Sign-In requires Firebase. Running in offline mode.');
                return { success: false, error: 'Firebase not available' };
            }
            
            this.updateSyncStatus('syncing');
            
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await this.auth.signInWithPopup(provider);
            const user = result.user;
            
            // Check if user exists in database
            const snapshot = await this.database.ref(`users/${user.uid}`).once('value');
            
            if (!snapshot.exists()) {
                // Create new user
                const userData = {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    level: 'A1',
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                    progress: {
                        readingCompleted: 0,
                        vocabMastered: 0,
                        writingCompleted: 0,
                        listeningCompleted: 0,
                        speakingCompleted: 0,
                        studyTimeMinutes: 0,
                        streak: 0,
                        lastStudyDate: null,
                        readingProgress: {},
                        vocabProgress: {},
                        writingProgress: {},
                        listeningProgress: {},
                        speakingProgress: {}
                    },
                    achievements: [],
                    xp: 0,
                    level_system: {
                        currentLevel: 1,
                        currentXP: 0,
                        nextLevelXP: 100
                    }
                };
                
                await this.database.ref(`users/${user.uid}`).set(userData);
            }
            
            const userDataSnapshot = await this.database.ref(`users/${user.uid}`).once('value');
            const userData = userDataSnapshot.val();
            
            this.updateSyncStatus('synced');
            this.lastSyncTime = Date.now();
            
            return { success: true, user: userData };
        } catch (error) {
            this.updateSyncStatus('error');
            return { success: false, error: error.message };
        }
    }
    
    // Sign out
    async signOut() {
        try {
            if (this.isFirebaseLoaded) {
                await this.auth.signOut();
            }
            localStorage.removeItem('currentUser');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ============ DATA SYNC ============
    
    // Setup real-time sync for user data
    setupUserSync(userId) {
        if (!this.isFirebaseLoaded) return;
        
        const userRef = this.database.ref(`users/${userId}`);
        
        // Listen for changes from other devices
        userRef.on('value', (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                // Update local storage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // Notify app of data change
                window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
            }
        });
    }
    
    // Update user progress
    async updateProgress(userId, progressData) {
        try {
            if (!this.isFirebaseLoaded) {
                return this.fallbackUpdateProgress(userId, progressData);
            }
            
            this.updateSyncStatus('syncing');
            
            const updates = {};
            for (const [key, value] of Object.entries(progressData)) {
                updates[`users/${userId}/progress/${key}`] = value;
            }
            
            await this.database.ref().update(updates);
            
            this.updateSyncStatus('synced');
            this.lastSyncTime = Date.now();
            
            return { success: true };
        } catch (error) {
            // Queue for later if offline
            this.offlineQueue.push({
                type: 'updateProgress',
                userId,
                data: progressData,
                timestamp: Date.now()
            });
            
            this.updateSyncStatus('offline');
            return { success: false, error: error.message, queued: true };
        }
    }
    
    // Update reading progress
    async updateReadingProgress(userId, textId, completed, score) {
        return this.updateProgress(userId, {
            [`readingProgress/${textId}`]: {
                completed,
                score,
                timestamp: Date.now()
            },
            readingCompleted: firebase.database.ServerValue.increment(completed ? 1 : 0)
        });
    }
    
    // Update vocabulary progress
    async updateVocabularyProgress(userId, wordId, mastered, nextReview) {
        return this.updateProgress(userId, {
            [`vocabProgress/${wordId}`]: {
                mastered,
                nextReview,
                timestamp: Date.now()
            },
            vocabMastered: firebase.database.ServerValue.increment(mastered ? 1 : 0)
        });
    }
    
    // Update writing progress
    async updateWritingProgress(userId, promptId, completed, text, feedback, score) {
        return this.updateProgress(userId, {
            [`writingProgress/${promptId}`]: {
                completed,
                text,
                feedback,
                score,
                timestamp: Date.now()
            },
            writingCompleted: firebase.database.ServerValue.increment(completed ? 1 : 0)
        });
    }
    
    // Add XP and check level up
    async addXP(userId, amount, reason) {
        try {
            if (!this.isFirebaseLoaded) {
                return this.fallbackAddXP(userId, amount, reason);
            }
            
            const userRef = this.database.ref(`users/${userId}`);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val();
            
            const newXP = (userData.xp || 0) + amount;
            const levelSystem = userData.level_system || { currentLevel: 1, currentXP: 0, nextLevelXP: 100 };
            
            let newLevel = levelSystem.currentLevel;
            let newLevelXP = levelSystem.currentXP + amount;
            let nextLevelXP = levelSystem.nextLevelXP;
            
            // Check for level up
            while (newLevelXP >= nextLevelXP) {
                newLevelXP -= nextLevelXP;
                newLevel++;
                nextLevelXP = Math.floor(nextLevelXP * 1.5);
            }
            
            await userRef.update({
                xp: newXP,
                'level_system/currentLevel': newLevel,
                'level_system/currentXP': newLevelXP,
                'level_system/nextLevelXP': nextLevelXP
            });
            
            return { 
                success: true, 
                levelUp: newLevel > levelSystem.currentLevel,
                newLevel,
                totalXP: newXP
            };
        } catch (error) {
            this.offlineQueue.push({
                type: 'addXP',
                userId,
                amount,
                reason,
                timestamp: Date.now()
            });
            return { success: false, error: error.message, queued: true };
        }
    }
    
    // Add achievement
    async addAchievement(userId, achievementId, achievementData) {
        try {
            if (!this.isFirebaseLoaded) {
                return this.fallbackAddAchievement(userId, achievementId, achievementData);
            }
            
            const achievementRef = this.database.ref(`users/${userId}/achievements/${achievementId}`);
            await achievementRef.set({
                ...achievementData,
                unlockedAt: firebase.database.ServerValue.TIMESTAMP
            });
            
            return { success: true };
        } catch (error) {
            this.offlineQueue.push({
                type: 'addAchievement',
                userId,
                achievementId,
                data: achievementData,
                timestamp: Date.now()
            });
            return { success: false, error: error.message, queued: true };
        }
    }
    
    // Process offline queue when back online
    async processOfflineQueue() {
        if (!this.isFirebaseLoaded || this.offlineQueue.length === 0) return;
        
        console.log(`Processing ${this.offlineQueue.length} offline actions...`);
        
        const queue = [...this.offlineQueue];
        this.offlineQueue = [];
        
        for (const action of queue) {
            try {
                switch (action.type) {
                    case 'updateProgress':
                        await this.updateProgress(action.userId, action.data);
                        break;
                    case 'addXP':
                        await this.addXP(action.userId, action.amount, action.reason);
                        break;
                    case 'addAchievement':
                        await this.addAchievement(action.userId, action.achievementId, action.data);
                        break;
                }
            } catch (error) {
                console.error('Error processing offline action:', error);
                this.offlineQueue.push(action); // Re-queue if failed
            }
        }
    }
    
    // ============ FALLBACK METHODS (LocalStorage) ============
    
    fallbackSignUp(email, password, name, level) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email already exists' };
        }
        
        const userData = {
            id: Date.now().toString(),
            name,
            email,
            password, // In production, never store plain passwords!
            level,
            createdAt: new Date().toISOString(),
            progress: {
                readingCompleted: 0,
                vocabMastered: 0,
                writingCompleted: 0,
                listeningCompleted: 0,
                speakingCompleted: 0,
                studyTimeMinutes: 0,
                streak: 0,
                lastStudyDate: null,
                readingProgress: {},
                vocabProgress: {},
                writingProgress: {},
                listeningProgress: {},
                speakingProgress: {}
            },
            achievements: [],
            xp: 0,
            level_system: {
                currentLevel: 1,
                currentXP: 0,
                nextLevelXP: 100
            }
        };
        
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        return { success: true, user: userData };
    }
    
    fallbackSignIn(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            return { success: true, user };
        } else {
            return { success: false, error: 'Invalid email or password' };
        }
    }
    
    fallbackUpdateProgress(userId, progressData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            for (const [key, value] of Object.entries(progressData)) {
                const keys = key.split('/');
                let target = users[userIndex].progress;
                
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!target[keys[i]]) target[keys[i]] = {};
                    target = target[keys[i]];
                }
                
                target[keys[keys.length - 1]] = value;
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            return { success: true };
        }
        
        return { success: false, error: 'User not found' };
    }
    
    fallbackAddXP(userId, amount, reason) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            const user = users[userIndex];
            const newXP = (user.xp || 0) + amount;
            const levelSystem = user.level_system || { currentLevel: 1, currentXP: 0, nextLevelXP: 100 };
            
            let newLevel = levelSystem.currentLevel;
            let newLevelXP = levelSystem.currentXP + amount;
            let nextLevelXP = levelSystem.nextLevelXP;
            
            while (newLevelXP >= nextLevelXP) {
                newLevelXP -= nextLevelXP;
                newLevel++;
                nextLevelXP = Math.floor(nextLevelXP * 1.5);
            }
            
            user.xp = newXP;
            user.level_system = { currentLevel: newLevel, currentXP: newLevelXP, nextLevelXP };
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            return { 
                success: true, 
                levelUp: newLevel > levelSystem.currentLevel,
                newLevel,
                totalXP: newXP
            };
        }
        
        return { success: false, error: 'User not found' };
    }
    
    fallbackAddAchievement(userId, achievementId, achievementData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            if (!users[userIndex].achievements) {
                users[userIndex].achievements = {};
            }
            
            users[userIndex].achievements[achievementId] = {
                ...achievementData,
                unlockedAt: Date.now()
            };
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            return { success: true };
        }
        
        return { success: false, error: 'User not found' };
    }
}

// Create global instance
const firebaseService = new FirebaseService();

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    firebaseService.initialize();
});
