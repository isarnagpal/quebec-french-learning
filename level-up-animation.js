// Level Up Animation & XP Notification System
// Provides visual feedback for XP gains and level ups

class LevelUpAnimation {
    constructor() {
        this.isAnimating = false;
    }

    /**
     * Show XP gain notification
     */
    showXPGain(amount, reason = '') {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <div class="xp-notification-content">
                <div class="xp-icon">⭐</div>
                <div class="xp-text">
                    <span class="xp-amount">+${amount} XP</span>
                    ${reason ? `<span class="xp-reason">${reason}</span>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Animate out
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    }

    /**
     * Show level up animation with confetti
     */
    showLevelUp(level, xpForNextLevel) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-modal">
                <div class="confetti-container" id="confettiContainer"></div>
                
                <div class="level-up-content">
                    <div class="level-up-badge pulse">
                        <div class="badge-inner">
                            <div class="level-number">${level}</div>
                        </div>
                    </div>
                    
                    <h2 class="level-up-title">Level Up!</h2>
                    <p class="level-up-subtitle">You reached Level ${level}</p>
                    
                    <div class="level-up-stats">
                        <div class="stat-item">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-text">
                                <div class="stat-value">Level ${level}</div>
                                <div class="stat-label">Current Level</div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">⭐</div>
                            <div class="stat-text">
                                <div class="stat-value">${xpForNextLevel} XP</div>
                                <div class="stat-label">To Next Level</div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-lg level-up-continue" onclick="closeLevelUp()">
                        Continue Learning! 🚀
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Trigger confetti
        this.createConfetti('confettiContainer');

        // Animate in
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);

        // Play sound if available
        this.playLevelUpSound();

        // Auto-close function
        window.closeLevelUp = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                this.isAnimating = false;
                delete window.closeLevelUp;
            }, 500);
        };
    }

    /**
     * Create confetti animation
     */
    createConfetti(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
            
            container.appendChild(confetti);
        }
    }

    /**
     * Show streak milestone celebration
     */
    showStreakMilestone(days) {
        const overlay = document.createElement('div');
        overlay.className = 'streak-milestone-overlay';
        overlay.innerHTML = `
            <div class="streak-milestone-modal">
                <div class="streak-icon-large">🔥</div>
                <h2 class="streak-title">${days} Day Streak!</h2>
                <p class="streak-subtitle">You're on fire! Keep it up!</p>
                
                <div class="streak-stats">
                    <div class="streak-stat">
                        <div class="streak-stat-value">${days}</div>
                        <div class="streak-stat-label">Days in a row</div>
                    </div>
                </div>
                
                <button class="btn btn-primary btn-lg" onclick="closeStreakMilestone()">
                    Continue 🚀
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        setTimeout(() => overlay.classList.add('show'), 10);

        window.closeStreakMilestone = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                delete window.closeStreakMilestone;
            }, 500);
        };

        // Auto close after 5 seconds
        setTimeout(() => {
            if (window.closeStreakMilestone) {
                window.closeStreakMilestone();
            }
        }, 5000);
    }

    /**
     * Show achievement unlock animation (enhanced)
     */
    showAchievementUnlock(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-unlock-notification';
        notification.innerHTML = `
            <div class="achievement-unlock-content">
                <div class="unlock-glow"></div>
                <div class="achievement-unlock-icon pulse">${achievement.icon}</div>
                <div class="achievement-unlock-text">
                    <h4>Achievement Unlocked!</h4>
                    <h5>${achievement.name}</h5>
                    <p>${achievement.description}</p>
                    <div class="achievement-unlock-xp">
                        <i class="bi bi-star-fill"></i> +${achievement.xpReward} XP
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Play sound
        this.playAchievementSound();

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    /**
     * Show challenge complete animation
     */
    showChallengeComplete(challenge) {
        const notification = document.createElement('div');
        notification.className = 'challenge-complete-notification';
        notification.innerHTML = `
            <div class="challenge-complete-content">
                <div class="challenge-complete-icon">${challenge.icon}</div>
                <div class="challenge-complete-text">
                    <h4>Challenge Complete! 🎉</h4>
                    <h5>${challenge.name}</h5>
                    <div class="challenge-complete-xp">
                        <i class="bi bi-star-fill"></i> +${challenge.xpReward} XP
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    /**
     * Update XP progress bar with animation
     */
    animateXPBar(currentXP, xpForNextLevel, level) {
        const xpBar = document.getElementById('xpProgressBar');
        const xpText = document.getElementById('xpProgressText');
        const levelBadge = document.getElementById('currentLevel');

        if (!xpBar) return;

        const percentage = (currentXP / xpForNextLevel) * 100;

        // Animate progress bar
        xpBar.style.width = percentage + '%';
        xpBar.classList.add('animating');

        // Update text
        if (xpText) {
            xpText.textContent = `${currentXP} / ${xpForNextLevel} XP`;
        }

        // Update level badge
        if (levelBadge) {
            levelBadge.textContent = level;
            levelBadge.classList.add('pulse');
            setTimeout(() => levelBadge.classList.remove('pulse'), 600);
        }

        // Remove animation class
        setTimeout(() => {
            xpBar.classList.remove('animating');
        }, 600);
    }

    /**
     * Play level up sound (if audio enabled)
     */
    playLevelUpSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLXiTYIGWi78OScTgwNUKzn87ZoHwQ9kdvzxnwuBSh+zPLaizsIFGK56+qgUBELTKXh8bllHgU2jtryyH8yByt80fDaiTwHFWS56+mnUhELTqfk87RnHwQ9k9v0xXwuBSh90fLaizwHFmS66+mnUhELT6jl87NnHgU8lNvzxnwuBSh80fLaizwHFWS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBQ==');
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Ignore audio play errors
            });
        } catch (e) {
            // Audio not available
        }
    }

    /**
     * Play achievement sound
     */
    playAchievementSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLXiTYIGWi78OScTgwNUKzn87ZoHwQ9kdvzxnwuBSh+zPLaizsIFGK56+qgUBELTKXh8bllHgU2jtryyH8yByt80fDaiTwHFWS56+mnUhELTqfk87RnHwQ9k9v0xXwuBSh90fLaizwHFmS66+mnUhELT6jl87NnHgU8lNvzxnwuBSh80fLaizwHFWS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBSh90fLaizwHFmS66+mnUhELTqfk87RnHgU9k9v0xXwuBQ==');
            audio.volume = 0.5;
            audio.play().catch(() => {});
        } catch (e) {
            // Audio not available
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelUpAnimation;
} else {
    window.LevelUpAnimation = LevelUpAnimation;
}
