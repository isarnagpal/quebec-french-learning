// Gamification System for Quebec French Learning App
// Complete achievement, challenge, and progression tracking system

class GamificationSystem {
    constructor(userProgress) {
        this.userProgress = userProgress || {};
        this.achievements = this.loadAchievements();
        this.stats = this.loadStats();
    }

    /**
     * Load user statistics
     */
    loadStats() {
        const stored = localStorage.getItem('gamificationStats');
        const defaultStats = {
            totalStudyMinutes: 0,
            wordsLearned: 0,
            lessonsCompleted: 0,
            perfectScores: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: null,
            studyDays: [],
            fastestLesson: null,
            totalXP: 0,
            level: 1
        };
        
        return stored ? JSON.parse(stored) : defaultStats;
    }

    /**
     * Save statistics
     */
    saveStats() {
        localStorage.setItem('gamificationStats', JSON.stringify(this.stats));
    }

    /**
     * Load achievement progress
     */
    loadAchievements() {
        const stored = localStorage.getItem('userAchievements');
        const defaultAchievements = {};
        
        // Initialize all achievements as locked
        ACHIEVEMENTS.forEach(achievement => {
            defaultAchievements[achievement.id] = {
                unlocked: false,
                unlockedAt: null,
                progress: 0,
                notified: false
            };
        });
        
        return stored ? { ...defaultAchievements, ...JSON.parse(stored) } : defaultAchievements;
    }

    /**
     * Save achievements
     */
    saveAchievements() {
        localStorage.setItem('userAchievements', JSON.stringify(this.achievements));
    }

    /**
     * Record study session
     */
    recordStudySession(minutes) {
        this.stats.totalStudyMinutes += minutes;
        this.updateStreak();
        this.checkAchievements();
        this.saveStats();
    }

    /**
     * Record word learned
     */
    recordWordLearned() {
        this.stats.wordsLearned++;
        this.checkAchievements();
        this.saveStats();
    }

    /**
     * Record lesson completed
     */
    recordLessonCompleted(timeSeconds, score) {
        this.stats.lessonsCompleted++;
        
        // Track perfect scores
        if (score === 100) {
            this.stats.perfectScores++;
        }
        
        // Track fastest lesson
        if (!this.stats.fastestLesson || timeSeconds < this.stats.fastestLesson) {
            this.stats.fastestLesson = timeSeconds;
        }
        
        this.checkAchievements();
        this.saveStats();
    }

    /**
     * Update streak tracking
     */
    updateStreak() {
        const today = new Date().toDateString();
        
        if (this.stats.lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            if (this.stats.lastStudyDate === yesterdayStr) {
                // Continue streak
                this.stats.currentStreak++;
            } else if (this.stats.lastStudyDate !== null) {
                // Streak broken
                this.stats.currentStreak = 1;
            } else {
                // First day
                this.stats.currentStreak = 1;
            }
            
            // Update longest streak
            if (this.stats.currentStreak > this.stats.longestStreak) {
                this.stats.longestStreak = this.stats.currentStreak;
            }
            
            // Record study day
            this.stats.lastStudyDate = today;
            if (!this.stats.studyDays.includes(today)) {
                this.stats.studyDays.push(today);
            }
        }
    }

    /**
     * Check and unlock achievements
     */
    checkAchievements() {
        const now = Date.now();
        const hour = new Date().getHours();
        
        ACHIEVEMENTS.forEach(achievement => {
            if (this.achievements[achievement.id].unlocked) {
                return; // Already unlocked
            }
            
            let shouldUnlock = false;
            let progress = 0;
            
            switch (achievement.condition.type) {
                case 'first_lesson':
                    shouldUnlock = this.stats.lessonsCompleted >= 1;
                    progress = Math.min(100, this.stats.lessonsCompleted * 100);
                    break;
                    
                case 'early_bird':
                    shouldUnlock = hour < 9 && this.stats.lessonsCompleted > 0;
                    break;
                    
                case 'night_owl':
                    shouldUnlock = hour >= 22 && this.stats.lessonsCompleted > 0;
                    break;
                    
                case 'streak':
                    const target = achievement.condition.days;
                    shouldUnlock = this.stats.currentStreak >= target;
                    progress = Math.min(100, (this.stats.currentStreak / target) * 100);
                    break;
                    
                case 'words_learned':
                    const wordTarget = achievement.condition.count;
                    shouldUnlock = this.stats.wordsLearned >= wordTarget;
                    progress = Math.min(100, (this.stats.wordsLearned / wordTarget) * 100);
                    break;
                    
                case 'perfect_scores':
                    const perfectTarget = achievement.condition.count;
                    shouldUnlock = this.stats.perfectScores >= perfectTarget;
                    progress = Math.min(100, (this.stats.perfectScores / perfectTarget) * 100);
                    break;
                    
                case 'fast_lesson':
                    shouldUnlock = this.stats.fastestLesson && 
                                  this.stats.fastestLesson <= achievement.condition.seconds;
                    break;
                    
                case 'marathon':
                    // Check if studied for required minutes in one day
                    shouldUnlock = this.stats.totalStudyMinutes >= achievement.condition.minutes;
                    progress = Math.min(100, (this.stats.totalStudyMinutes / achievement.condition.minutes) * 100);
                    break;
                    
                case 'level':
                    shouldUnlock = this.stats.level >= achievement.condition.level;
                    progress = Math.min(100, (this.stats.level / achievement.condition.level) * 100);
                    break;
            }
            
            // Update progress
            this.achievements[achievement.id].progress = Math.round(progress);
            
            // Unlock if condition met
            if (shouldUnlock && !this.achievements[achievement.id].unlocked) {
                this.unlockAchievement(achievement.id);
            }
        });
        
        this.saveAchievements();
    }

    /**
     * Unlock an achievement
     */
    unlockAchievement(achievementId) {
        this.achievements[achievementId] = {
            unlocked: true,
            unlockedAt: Date.now(),
            progress: 100,
            notified: false
        };
        
        // Award XP bonus
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) {
            this.awardXP(achievement.xpReward);
        }
        
        this.saveAchievements();
        
        // Trigger notification
        this.notifyAchievementUnlocked(achievementId);
    }

    /**
     * Award XP
     */
    awardXP(amount) {
        this.stats.totalXP += amount;
        
        // Calculate level (every 100 XP = 1 level)
        const newLevel = Math.floor(this.stats.totalXP / 100) + 1;
        
        if (newLevel > this.stats.level) {
            this.stats.level = newLevel;
            this.notifyLevelUp(newLevel);
        }
        
        this.saveStats();
    }

    /**
     * Show achievement unlock notification
     */
    notifyAchievementUnlocked(achievementId) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>Achievement Unlocked!</h4>
                    <p><strong>${achievement.name}</strong></p>
                    <p class="text-muted">${achievement.description}</p>
                    <p class="achievement-xp">+${achievement.xpReward} XP</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Mark as notified
        this.achievements[achievementId].notified = true;
        this.saveAchievements();
    }

    /**
     * Show level up notification
     */
    notifyLevelUp(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h2>Level Up!</h2>
                <p class="level-number">Level ${level}</p>
                <p>Keep up the great work!</p>
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
     * Get all achievements with status
     */
    getAllAchievements() {
        return ACHIEVEMENTS.map(achievement => ({
            ...achievement,
            ...this.achievements[achievement.id]
        }));
    }

    /**
     * Get unlocked achievements count
     */
    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    /**
     * Get total achievements count
     */
    getTotalCount() {
        return ACHIEVEMENTS.length;
    }

    /**
     * Get completion percentage
     */
    getCompletionPercentage() {
        return Math.round((this.getUnlockedCount() / this.getTotalCount()) * 100);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
} else {
    window.GamificationSystem = GamificationSystem;
}
