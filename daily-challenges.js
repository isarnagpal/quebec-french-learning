// Daily Challenges System for Quebec French Learning App
// Generates daily challenges and tracks completion

class DailyChallengeService {
    constructor() {
        this.challenges = this.generateDailyChallenges();
        this.completedChallenges = this.loadCompletedChallenges();
    }

    /**
     * Generate daily challenges
     */
    generateDailyChallenges() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('dailyChallenges');
        const storedData = stored ? JSON.parse(stored) : null;
        
        // Check if we need to generate new challenges
        if (storedData && storedData.date === today) {
            return storedData.challenges;
        }
        
        // Generate new challenges for today
        const allChallenges = this.getAllChallengeTemplates();
        const selectedChallenges = this.selectRandomChallenges(allChallenges, 3);
        
        const challengesWithProgress = selectedChallenges.map(challenge => ({
            ...challenge,
            progress: 0,
            completed: false,
            completedAt: null
        }));
        
        // Save to localStorage
        localStorage.setItem('dailyChallenges', JSON.stringify({
            date: today,
            challenges: challengesWithProgress
        }));
        
        return challengesWithProgress;
    }

    /**
     * Get all challenge templates
     */
    getAllChallengeTemplates() {
        return [
            // Vocabulary Challenges
            {
                id: 'learn_20_words',
                name: 'Word Master',
                description: 'Learn 20 new words',
                icon: '📚',
                xpReward: 100,
                type: 'vocabulary',
                target: 20,
                trackingKey: 'wordsLearned'
            },
            {
                id: 'learn_10_words',
                name: 'Quick Learner',
                description: 'Learn 10 new words',
                icon: '📝',
                xpReward: 50,
                type: 'vocabulary',
                target: 10,
                trackingKey: 'wordsLearned'
            },
            {
                id: 'review_30_words',
                name: 'Review Master',
                description: 'Review 30 vocabulary words',
                icon: '🔄',
                xpReward: 75,
                type: 'vocabulary',
                target: 30,
                trackingKey: 'wordsReviewed'
            },
            
            // Reading Challenges
            {
                id: 'complete_5_readings',
                name: 'Book Worm',
                description: 'Complete 5 reading exercises',
                icon: '📖',
                xpReward: 100,
                type: 'reading',
                target: 5,
                trackingKey: 'readingsCompleted'
            },
            {
                id: 'complete_3_readings',
                name: 'Reader',
                description: 'Complete 3 reading exercises',
                icon: '📄',
                xpReward: 60,
                type: 'reading',
                target: 3,
                trackingKey: 'readingsCompleted'
            },
            
            // Writing Challenges
            {
                id: 'write_3_paragraphs',
                name: 'Writer',
                description: 'Write 3 paragraphs in French',
                icon: '✍️',
                xpReward: 150,
                type: 'writing',
                target: 3,
                trackingKey: 'paragraphsWritten'
            },
            {
                id: 'write_1_essay',
                name: 'Essayist',
                description: 'Write a complete essay',
                icon: '📝',
                xpReward: 200,
                type: 'writing',
                target: 1,
                trackingKey: 'essaysWritten'
            },
            
            // Listening Challenges
            {
                id: 'listen_10_clips',
                name: 'Good Listener',
                description: 'Listen to 10 audio clips',
                icon: '🎧',
                xpReward: 80,
                type: 'listening',
                target: 10,
                trackingKey: 'audioClipsListened'
            },
            {
                id: 'listen_5_clips',
                name: 'Attentive',
                description: 'Listen to 5 audio clips',
                icon: '👂',
                xpReward: 50,
                type: 'listening',
                target: 5,
                trackingKey: 'audioClipsListened'
            },
            
            // Practice Challenges
            {
                id: 'perfect_quiz',
                name: 'Perfectionist',
                description: 'Get 100% on a quiz',
                icon: '💯',
                xpReward: 120,
                type: 'practice',
                target: 1,
                trackingKey: 'perfectQuizzes'
            },
            {
                id: 'complete_5_exercises',
                name: 'Practice Makes Perfect',
                description: 'Complete 5 exercises',
                icon: '💪',
                xpReward: 100,
                type: 'practice',
                target: 5,
                trackingKey: 'exercisesCompleted'
            },
            
            // Time Challenges
            {
                id: 'study_30_minutes',
                name: 'Dedicated',
                description: 'Study for 30 minutes',
                icon: '⏰',
                xpReward: 80,
                type: 'time',
                target: 30,
                trackingKey: 'minutesStudied'
            },
            {
                id: 'study_60_minutes',
                name: 'Marathon',
                description: 'Study for 60 minutes',
                icon: '🏃',
                xpReward: 150,
                type: 'time',
                target: 60,
                trackingKey: 'minutesStudied'
            },
            
            // Quebec-Specific Challenges
            {
                id: 'learn_quebec_words',
                name: 'Québécois',
                description: 'Learn 10 Quebec-specific words',
                icon: '🍁',
                xpReward: 120,
                type: 'quebec',
                target: 10,
                trackingKey: 'quebecWordsLearned'
            },
            {
                id: 'quebec_culture',
                name: 'Culture Buff',
                description: 'Complete Quebec culture lesson',
                icon: '🎿',
                xpReward: 100,
                type: 'quebec',
                target: 1,
                trackingKey: 'cultureLessonsCompleted'
            }
        ];
    }

    /**
     * Select random challenges
     */
    selectRandomChallenges(templates, count) {
        const shuffled = [...templates].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Update challenge progress
     */
    updateProgress(trackingKey, amount = 1) {
        this.challenges = this.generateDailyChallenges(); // Refresh if needed
        
        let updated = false;
        
        this.challenges.forEach(challenge => {
            if (challenge.trackingKey === trackingKey && !challenge.completed) {
                challenge.progress = Math.min(challenge.progress + amount, challenge.target);
                
                // Check if completed
                if (challenge.progress >= challenge.target && !challenge.completed) {
                    this.completeChallenge(challenge);
                    updated = true;
                }
            }
        });
        
        // Save updated challenges
        const today = new Date().toDateString();
        localStorage.setItem('dailyChallenges', JSON.stringify({
            date: today,
            challenges: this.challenges
        }));
        
        return updated;
    }

    /**
     * Complete a challenge
     */
    completeChallenge(challenge) {
        challenge.completed = true;
        challenge.completedAt = Date.now();
        
        // Award XP
        this.awardChallengeXP(challenge.xpReward);
        
        // Show notification
        this.notifyChallengeComplete(challenge);
        
        // Track completion
        const today = new Date().toDateString();
        if (!this.completedChallenges[today]) {
            this.completedChallenges[today] = [];
        }
        this.completedChallenges[today].push({
            id: challenge.id,
            name: challenge.name,
            xpReward: challenge.xpReward,
            completedAt: challenge.completedAt
        });
        
        localStorage.setItem('completedDailyChallenges', JSON.stringify(this.completedChallenges));
    }

    /**
     * Load completed challenges
     */
    loadCompletedChallenges() {
        const stored = localStorage.getItem('completedDailyChallenges');
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Award challenge XP
     */
    awardChallengeXP(amount) {
        // Trigger event for gamification system
        window.dispatchEvent(new CustomEvent('challengeXPAwarded', {
            detail: { xp: amount }
        }));
    }

    /**
     * Show challenge completion notification
     */
    notifyChallengeComplete(challenge) {
        const notification = document.createElement('div');
        notification.className = 'challenge-notification';
        notification.innerHTML = `
            <div class="challenge-notification-content">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-info">
                    <h4>Daily Challenge Complete!</h4>
                    <p><strong>${challenge.name}</strong></p>
                    <p class="challenge-xp">+${challenge.xpReward} XP 🎉</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Get today's challenges
     */
    getTodayChallenges() {
        return this.challenges;
    }

    /**
     * Get completed count for today
     */
    getCompletedCountToday() {
        const today = new Date().toDateString();
        return this.completedChallenges[today] ? this.completedChallenges[today].length : 0;
    }

    /**
     * Get total XP earned today from challenges
     */
    getTotalXPToday() {
        const today = new Date().toDateString();
        if (!this.completedChallenges[today]) return 0;
        
        return this.completedChallenges[today].reduce((total, challenge) => {
            return total + challenge.xpReward;
        }, 0);
    }

    /**
     * Check if all challenges completed today
     */
    areAllChallengesCompleted() {
        return this.challenges.every(c => c.completed);
    }

    /**
     * Get completion percentage
     */
    getCompletionPercentage() {
        if (this.challenges.length === 0) return 0;
        const completed = this.challenges.filter(c => c.completed).length;
        return Math.round((completed / this.challenges.length) * 100);
    }

    /**
     * Get challenge statistics
     */
    getStats() {
        const totalDays = Object.keys(this.completedChallenges).length;
        const totalChallengesCompleted = Object.values(this.completedChallenges)
            .reduce((total, day) => total + day.length, 0);
        const totalXPEarned = Object.values(this.completedChallenges)
            .reduce((total, day) => {
                return total + day.reduce((dayTotal, challenge) => dayTotal + challenge.xpReward, 0);
            }, 0);
        
        return {
            totalDays,
            totalChallengesCompleted,
            totalXPEarned,
            averageChallengesPerDay: totalDays > 0 ? (totalChallengesCompleted / totalDays).toFixed(1) : 0
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DailyChallengeService;
} else {
    window.DailyChallengeService = DailyChallengeService;
}
