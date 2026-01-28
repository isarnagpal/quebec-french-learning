// Stats Dashboard
// Calculates and displays comprehensive learning statistics

class StatsDashboard {
    constructor(gamificationSystem, streakSystem, challengeService) {
        this.gamificationSystem = gamificationSystem;
        this.streakSystem = streakSystem;
        this.challengeService = challengeService;
    }

    /**
     * Get all statistics
     */
    getAllStats() {
        const gamStats = this.gamificationSystem.stats;
        const streakStats = this.streakSystem.getStats();
        const challengeStats = this.challengeService.getStats();

        return {
            // Learning Progress
            totalStudyMinutes: gamStats.totalStudyMinutes || 0,
            totalStudyHours: Math.round((gamStats.totalStudyMinutes || 0) / 60 * 10) / 10,
            wordsLearned: gamStats.wordsLearned || 0,
            lessonsCompleted: gamStats.lessonsCompleted || 0,
            perfectScores: gamStats.perfectScores || 0,

            // XP & Level
            totalXP: gamStats.totalXP || 0,
            level: gamStats.level || 1,
            xpForNextLevel: this.calculateXPForNextLevel(gamStats.level || 1),
            xpProgress: this.calculateXPProgress(gamStats.totalXP || 0, gamStats.level || 1),

            // Streaks
            currentStreak: streakStats.currentStreak,
            longestStreak: streakStats.longestStreak,
            totalStudyDays: streakStats.totalStudyDays,
            studyDaysThisWeek: streakStats.studyDaysThisWeek,
            studyDaysThisMonth: streakStats.studyDaysThisMonth,

            // Challenges
            totalChallengesCompleted: challengeStats.totalChallengesCompleted,
            challengeXPEarned: challengeStats.totalXPEarned,
            averageChallengesPerDay: challengeStats.averageChallengesPerDay,

            // Achievements
            achievementsUnlocked: this.gamificationSystem.getUnlockedCount(),
            achievementsTotal: this.gamificationSystem.getTotalCount(),
            achievementsPercentage: this.gamificationSystem.getCompletionPercentage(),

            // Calculated Stats
            averageDailyXP: this.calculateAverageDailyXP(),
            averageStudyTime: this.calculateAverageStudyTime(),
            quizAccuracy: this.calculateQuizAccuracy(),
            wordsPerDay: this.calculateWordsPerDay(),
            mostProductiveTime: this.getMostProductiveTime(),
            learningVelocity: this.calculateLearningVelocity()
        };
    }

    /**
     * Calculate XP needed for next level
     */
    calculateXPForNextLevel(currentLevel) {
        if (currentLevel <= 10) return 100;
        if (currentLevel <= 25) return 200;
        if (currentLevel <= 50) return 500;
        return 1000;
    }

    /**
     * Calculate XP progress percentage
     */
    calculateXPProgress(totalXP, currentLevel) {
        const xpForThisLevel = this.calculateXPForLevelReached(currentLevel);
        const xpIntoCurrentLevel = totalXP - xpForThisLevel;
        const xpNeeded = this.calculateXPForNextLevel(currentLevel);
        
        return Math.round((xpIntoCurrentLevel / xpNeeded) * 100);
    }

    /**
     * Calculate total XP needed to reach a level
     */
    calculateXPForLevelReached(level) {
        let totalXP = 0;
        for (let i = 1; i < level; i++) {
            totalXP += this.calculateXPForNextLevel(i);
        }
        return totalXP;
    }

    /**
     * Calculate average daily XP
     */
    calculateAverageDailyXP() {
        const streakStats = this.streakSystem.getStats();
        const totalDays = streakStats.totalStudyDays || 1;
        const totalXP = this.gamificationSystem.stats.totalXP || 0;
        return Math.round(totalXP / totalDays);
    }

    /**
     * Calculate average study time
     */
    calculateAverageStudyTime() {
        const streakStats = this.streakSystem.getStats();
        const totalDays = streakStats.totalStudyDays || 1;
        const totalMinutes = this.gamificationSystem.stats.totalStudyMinutes || 0;
        return Math.round(totalMinutes / totalDays);
    }

    /**
     * Calculate quiz accuracy
     */
    calculateQuizAccuracy() {
        const gamStats = this.gamificationSystem.stats;
        const totalQuizzes = gamStats.lessonsCompleted || 1;
        const perfectScores = gamStats.perfectScores || 0;
        // Mock calculation - would need actual quiz score data
        return Math.round(75 + (perfectScores / totalQuizzes) * 25);
    }

    /**
     * Calculate words per day
     */
    calculateWordsPerDay() {
        const streakStats = this.streakSystem.getStats();
        const totalDays = streakStats.totalStudyDays || 1;
        const wordsLearned = this.gamificationSystem.stats.wordsLearned || 0;
        return Math.round(wordsLearned / totalDays * 10) / 10;
    }

    /**
     * Get most productive time
     */
    getMostProductiveTime() {
        // Mock data - would need to track actual study times
        const times = ['Morning', 'Afternoon', 'Evening', 'Night'];
        return times[Math.floor(Math.random() * times.length)];
    }

    /**
     * Calculate learning velocity (progress rate)
     */
    calculateLearningVelocity() {
        const streakStats = this.streakSystem.getStats();
        const daysActive = streakStats.totalStudyDays || 1;
        const wordsLearned = this.gamificationSystem.stats.wordsLearned || 0;
        
        // Words per week
        const wordsPerWeek = Math.round((wordsLearned / daysActive) * 7);
        
        if (wordsPerWeek >= 100) return 'Excellent';
        if (wordsPerWeek >= 70) return 'Great';
        if (wordsPerWeek >= 50) return 'Good';
        if (wordsPerWeek >= 30) return 'Moderate';
        return 'Steady';
    }

    /**
     * Render stats dashboard
     */
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = this.getAllStats();

        container.innerHTML = `
            <div class="stats-dashboard">
                <div class="dashboard-header">
                    <h2><i class="bi bi-graph-up"></i> Your Statistics</h2>
                    <div class="last-updated">Updated: ${new Date().toLocaleTimeString()}</div>
                </div>

                <!-- Key Metrics -->
                <div class="key-metrics">
                    <div class="metric-card primary">
                        <div class="metric-icon">⭐</div>
                        <div class="metric-content">
                            <div class="metric-value">${stats.level}</div>
                            <div class="metric-label">Level</div>
                            <div class="metric-progress">
                                <div class="progress-mini">
                                    <div class="progress-fill" style="width: ${stats.xpProgress}%"></div>
                                </div>
                                <span class="progress-text-mini">${stats.xpProgress}% to next</span>
                            </div>
                        </div>
                    </div>

                    <div class="metric-card success">
                        <div class="metric-icon">🔥</div>
                        <div class="metric-content">
                            <div class="metric-value">${stats.currentStreak}</div>
                            <div class="metric-label">Day Streak</div>
                            <div class="metric-subtext">Best: ${stats.longestStreak}</div>
                        </div>
                    </div>

                    <div class="metric-card info">
                        <div class="metric-icon">📚</div>
                        <div class="metric-content">
                            <div class="metric-value">${stats.wordsLearned}</div>
                            <div class="metric-label">Words Learned</div>
                            <div class="metric-subtext">${stats.wordsPerDay} per day</div>
                        </div>
                    </div>

                    <div class="metric-card warning">
                        <div class="metric-icon">⏱️</div>
                        <div class="metric-content">
                            <div class="metric-value">${stats.totalStudyHours}h</div>
                            <div class="metric-label">Study Time</div>
                            <div class="metric-subtext">${stats.averageStudyTime} min/day</div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Stats Grid -->
                <div class="detailed-stats">
                    <h3>Detailed Statistics</h3>
                    
                    <div class="stats-section">
                        <h4><i class="bi bi-book"></i> Learning Progress</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-name">Total XP</div>
                                <div class="stat-value">${stats.totalXP.toLocaleString()}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Lessons Completed</div>
                                <div class="stat-value">${stats.lessonsCompleted}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Perfect Scores</div>
                                <div class="stat-value">${stats.perfectScores}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Quiz Accuracy</div>
                                <div class="stat-value">${stats.quizAccuracy}%</div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-section">
                        <h4><i class="bi bi-calendar-check"></i> Study Habits</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-name">Total Study Days</div>
                                <div class="stat-value">${stats.totalStudyDays}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">This Week</div>
                                <div class="stat-value">${stats.studyDaysThisWeek}/7 days</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">This Month</div>
                                <div class="stat-value">${stats.studyDaysThisMonth} days</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Best Time</div>
                                <div class="stat-value">${stats.mostProductiveTime}</div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-section">
                        <h4><i class="bi bi-trophy"></i> Achievements & Challenges</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-name">Achievements</div>
                                <div class="stat-value">${stats.achievementsUnlocked}/${stats.achievementsTotal}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Completion</div>
                                <div class="stat-value">${stats.achievementsPercentage}%</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Challenges Done</div>
                                <div class="stat-value">${stats.totalChallengesCompleted}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Challenge XP</div>
                                <div class="stat-value">${stats.challengeXPEarned}</div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-section">
                        <h4><i class="bi bi-speedometer2"></i> Performance Metrics</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-name">Average Daily XP</div>
                                <div class="stat-value">${stats.averageDailyXP}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Words Per Day</div>
                                <div class="stat-value">${stats.wordsPerDay}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Learning Velocity</div>
                                <div class="stat-value">${stats.learningVelocity}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-name">Avg Study Time</div>
                                <div class="stat-value">${stats.averageStudyTime} min</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Insights -->
                <div class="stats-insights">
                    <h3><i class="bi bi-lightbulb"></i> Insights</h3>
                    <div class="insights-list">
                        ${this.generateInsights(stats).map(insight => `
                            <div class="insight-item ${insight.type}">
                                <i class="bi ${insight.icon}"></i>
                                <span>${insight.message}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate personalized insights
     */
    generateInsights(stats) {
        const insights = [];

        if (stats.currentStreak >= 7) {
            insights.push({
                type: 'success',
                icon: 'bi-check-circle',
                message: `Amazing! You've maintained a ${stats.currentStreak}-day streak. Keep it up!`
            });
        }

        if (stats.wordsPerDay > 20) {
            insights.push({
                type: 'success',
                icon: 'bi-graph-up-arrow',
                message: `Excellent pace! You're learning ${stats.wordsPerDay} words per day.`
            });
        }

        if (stats.quizAccuracy >= 90) {
            insights.push({
                type: 'success',
                icon: 'bi-star-fill',
                message: `Outstanding! Your quiz accuracy is ${stats.quizAccuracy}%.`
            });
        }

        if (stats.achievementsPercentage >= 50) {
            insights.push({
                type: 'info',
                icon: 'bi-trophy',
                message: `You've unlocked ${stats.achievementsPercentage}% of all achievements!`
            });
        }

        if (stats.studyDaysThisWeek < 5) {
            insights.push({
                type: 'warning',
                icon: 'bi-calendar-week',
                message: `You studied ${stats.studyDaysThisWeek} days this week. Try to reach 5!`
            });
        }

        if (stats.learningVelocity === 'Excellent') {
            insights.push({
                type: 'success',
                icon: 'bi-rocket',
                message: `Your learning velocity is ${stats.learningVelocity}! You're on fire! 🔥`
            });
        }

        return insights;
    }

    /**
     * Render compact widget
     */
    renderWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = this.getAllStats();

        container.innerHTML = `
            <div class="stats-widget">
                <div class="widget-header">
                    <h5><i class="bi bi-graph-up"></i> Quick Stats</h5>
                </div>

                <div class="widget-stats">
                    <div class="widget-stat">
                        <div class="widget-stat-icon">⭐</div>
                        <div class="widget-stat-info">
                            <div class="widget-stat-value">Level ${stats.level}</div>
                            <div class="widget-stat-label">${stats.totalXP} XP</div>
                        </div>
                    </div>
                    <div class="widget-stat">
                        <div class="widget-stat-icon">📚</div>
                        <div class="widget-stat-info">
                            <div class="widget-stat-value">${stats.wordsLearned}</div>
                            <div class="widget-stat-label">Words Learned</div>
                        </div>
                    </div>
                    <div class="widget-stat">
                        <div class="widget-stat-icon">🔥</div>
                        <div class="widget-stat-info">
                            <div class="widget-stat-value">${stats.currentStreak}</div>
                            <div class="widget-stat-label">Day Streak</div>
                        </div>
                    </div>
                </div>

                <div class="widget-footer">
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="showStats()">
                        View Full Stats
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Update dashboard
     */
    update() {
        this.render('statsDashboard');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsDashboard;
} else {
    window.StatsDashboard = StatsDashboard;
}
