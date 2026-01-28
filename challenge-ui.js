// Daily Challenge UI Component
// Displays daily challenges with progress tracking

class ChallengeUI {
    constructor(challengeService) {
        this.challengeService = challengeService;
    }

    /**
     * Render challenge card for dashboard
     */
    renderDashboardCard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const challenges = this.challengeService.getTodayChallenges();
        const completedCount = challenges.filter(c => c.completed).length;
        const totalCount = challenges.length;
        const percentage = this.challengeService.getCompletionPercentage();

        container.innerHTML = `
            <div class="daily-challenge-card">
                <div class="challenge-card-header">
                    <div>
                        <h4><i class="bi bi-calendar-check"></i> Daily Challenges</h4>
                        <p class="challenge-date">${this.getFormattedDate()}</p>
                    </div>
                    <div class="challenge-completion-badge ${percentage === 100 ? 'complete' : ''}">
                        ${completedCount}/${totalCount}
                    </div>
                </div>

                <div class="challenge-progress-bar">
                    <div class="progress">
                        <div class="progress-bar ${percentage === 100 ? 'bg-success' : 'bg-primary'}" 
                             role="progressbar" 
                             style="width: ${percentage}%">
                        </div>
                    </div>
                </div>

                <div class="challenges-list">
                    ${challenges.map(challenge => this.renderChallengeItem(challenge)).join('')}
                </div>

                ${percentage === 100 ? `
                    <div class="all-complete-message">
                        <i class="bi bi-trophy-fill"></i>
                        <strong>All challenges complete!</strong>
                        <span>You earned ${this.challengeService.getTotalXPToday()} XP today!</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render individual challenge item
     */
    renderChallengeItem(challenge) {
        const progress = challenge.progress || 0;
        const target = challenge.target;
        const percentage = Math.round((progress / target) * 100);
        const completed = challenge.completed;

        return `
            <div class="challenge-item ${completed ? 'completed' : ''}">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-content">
                    <div class="challenge-header">
                        <h5 class="challenge-name">${challenge.name}</h5>
                        ${completed ? '<i class="bi bi-check-circle-fill text-success"></i>' : ''}
                    </div>
                    <p class="challenge-description">${challenge.description}</p>
                    
                    ${!completed ? `
                        <div class="challenge-progress">
                            <div class="progress-bar-small">
                                <div class="progress-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="progress-text">${progress}/${target}</span>
                        </div>
                    ` : `
                        <div class="challenge-completed-text">
                            <i class="bi bi-star-fill"></i> +${challenge.xpReward} XP earned
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Render full challenge page
     */
    renderFullPage(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const challenges = this.challengeService.getTodayChallenges();
        const stats = this.challengeService.getStats();
        const completedCount = challenges.filter(c => c.completed).length;

        container.innerHTML = `
            <div class="challenges-page">
                <!-- Header -->
                <div class="challenges-header">
                    <div>
                        <h2><i class="bi bi-calendar-check"></i> Daily Challenges</h2>
                        <p class="text-muted">${this.getFormattedDate()}</p>
                    </div>
                    <div class="challenges-stats-mini">
                        <div class="stat-badge">
                            <i class="bi bi-trophy"></i>
                            ${completedCount}/${challenges.length} Complete
                        </div>
                        <div class="stat-badge">
                            <i class="bi bi-star-fill"></i>
                            ${this.challengeService.getTotalXPToday()} XP Today
                        </div>
                    </div>
                </div>

                <!-- Progress Overview -->
                <div class="challenge-progress-overview">
                    <div class="progress-circle">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e9ecef" stroke-width="10"/>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#0066CC" stroke-width="10"
                                    stroke-dasharray="${this.challengeService.getCompletionPercentage() * 2.827}, 282.7"
                                    transform="rotate(-90 50 50)"/>
                        </svg>
                        <div class="progress-text">
                            <div class="progress-percentage">${this.challengeService.getCompletionPercentage()}%</div>
                            <div class="progress-label">Complete</div>
                        </div>
                    </div>
                </div>

                <!-- Today's Challenges -->
                <div class="todays-challenges">
                    <h4>Today's Challenges</h4>
                    <div class="challenges-grid">
                        ${challenges.map(challenge => this.renderChallengeCard(challenge)).join('')}
                    </div>
                </div>

                <!-- Challenge History Stats -->
                <div class="challenge-history">
                    <h4><i class="bi bi-graph-up"></i> Your Progress</h4>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">📅</div>
                            <div class="stat-value">${stats.totalDays}</div>
                            <div class="stat-label">Active Days</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">✅</div>
                            <div class="stat-value">${stats.totalChallengesCompleted}</div>
                            <div class="stat-label">Challenges Done</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">⭐</div>
                            <div class="stat-value">${stats.totalXPEarned}</div>
                            <div class="stat-label">Total XP</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-value">${stats.averageChallengesPerDay}</div>
                            <div class="stat-label">Avg per Day</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render challenge as full card
     */
    renderChallengeCard(challenge) {
        const progress = challenge.progress || 0;
        const target = challenge.target;
        const percentage = Math.round((progress / target) * 100);
        const completed = challenge.completed;

        return `
            <div class="challenge-card ${completed ? 'completed' : ''}">
                <div class="challenge-card-icon ${completed ? 'pulse' : ''}">${challenge.icon}</div>
                
                <h5 class="challenge-card-title">${challenge.name}</h5>
                <p class="challenge-card-description">${challenge.description}</p>
                
                ${!completed ? `
                    <div class="challenge-card-progress">
                        <div class="progress">
                            <div class="progress-bar bg-primary" 
                                 role="progressbar" 
                                 style="width: ${percentage}%">
                            </div>
                        </div>
                        <div class="progress-info">
                            <span>${progress} / ${target}</span>
                            <span>${percentage}%</span>
                        </div>
                    </div>
                    <div class="challenge-card-reward">
                        <i class="bi bi-star"></i> ${challenge.xpReward} XP
                    </div>
                ` : `
                    <div class="challenge-completed-badge">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Completed!</span>
                    </div>
                    <div class="challenge-card-reward earned">
                        <i class="bi bi-star-fill"></i> +${challenge.xpReward} XP
                    </div>
                `}
            </div>
        `;
    }

    /**
     * Show compact widget
     */
    renderWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const challenges = this.challengeService.getTodayChallenges();
        const nextChallenge = challenges.find(c => !c.completed);
        const allComplete = this.challengeService.areAllChallengesCompleted();

        container.innerHTML = `
            <div class="challenge-widget">
                <div class="widget-header">
                    <h5><i class="bi bi-calendar-check"></i> Daily Challenge</h5>
                    ${allComplete ? 
                        '<span class="badge bg-success">Complete!</span>' : 
                        '<span class="badge bg-primary">Active</span>'
                    }
                </div>

                ${nextChallenge ? `
                    <div class="next-challenge">
                        <div class="challenge-icon-large">${nextChallenge.icon}</div>
                        <h6>${nextChallenge.name}</h6>
                        <p>${nextChallenge.description}</p>
                        <div class="challenge-progress">
                            <div class="progress">
                                <div class="progress-bar" 
                                     style="width: ${Math.round((nextChallenge.progress / nextChallenge.target) * 100)}%">
                                </div>
                            </div>
                            <span class="progress-text">
                                ${nextChallenge.progress}/${nextChallenge.target}
                            </span>
                        </div>
                        <div class="challenge-reward-widget">
                            <i class="bi bi-star"></i> ${nextChallenge.xpReward} XP
                        </div>
                    </div>
                ` : `
                    <div class="all-complete">
                        <i class="bi bi-trophy-fill text-success"></i>
                        <h6>All Done!</h6>
                        <p>You've completed all challenges today!</p>
                        <div class="xp-earned">
                            +${this.challengeService.getTotalXPToday()} XP earned 🎉
                        </div>
                    </div>
                `}

                <div class="widget-footer">
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="showChallenges()">
                        View All Challenges
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get formatted date
     */
    getFormattedDate() {
        const today = new Date();
        return today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Update UI when progress changes
     */
    update() {
        // Refresh all rendered components
        this.renderDashboardCard('dailyChallengeCard');
        this.renderWidget('challengeWidget');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeUI;
} else {
    window.ChallengeUI = ChallengeUI;
}
