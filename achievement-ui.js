// Achievement UI Component for Quebec French Learning App
// Displays achievements with progress tracking and unlock animations

class AchievementUI {
    constructor(gamificationSystem) {
        this.gamificationSystem = gamificationSystem;
        this.currentFilter = 'all';
    }

    /**
     * Render achievements grid
     */
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const achievements = this.gamificationSystem.getAllAchievements();
        const categories = this.getCategories(achievements);

        container.innerHTML = `
            <div class="achievements-container">
                <!-- Header -->
                <div class="achievements-header">
                    <h2>
                        <i class="bi bi-trophy-fill"></i>
                        Achievements
                    </h2>
                    <div class="achievements-stats">
                        <div class="stat-item">
                            <div class="stat-value">${this.gamificationSystem.getUnlockedCount()}</div>
                            <div class="stat-label">Unlocked</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${this.gamificationSystem.getTotalCount()}</div>
                            <div class="stat-label">Total</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${this.gamificationSystem.getCompletionPercentage()}%</div>
                            <div class="stat-label">Complete</div>
                        </div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="achievement-progress-bar">
                    <div class="progress">
                        <div class="progress-bar bg-success" 
                             role="progressbar" 
                             style="width: ${this.gamificationSystem.getCompletionPercentage()}%"
                             aria-valuenow="${this.gamificationSystem.getCompletionPercentage()}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            ${this.gamificationSystem.getCompletionPercentage()}%
                        </div>
                    </div>
                </div>

                <!-- Category Filter -->
                <div class="achievement-filters">
                    <button class="filter-btn active" data-filter="all">
                        All (${achievements.length})
                    </button>
                    ${categories.map(cat => `
                        <button class="filter-btn" data-filter="${cat.id}">
                            ${cat.icon} ${cat.name} (${cat.count})
                        </button>
                    `).join('')}
                </div>

                <!-- Achievements Grid -->
                <div class="achievements-grid" id="achievementsGrid">
                    ${this.renderAchievements(achievements)}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    /**
     * Render individual achievements
     */
    renderAchievements(achievements) {
        return achievements.map(achievement => {
            const unlocked = achievement.unlocked;
            const progress = achievement.progress || 0;
            const isNew = unlocked && !achievement.notified;

            return `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'} ${isNew ? 'new' : ''}" 
                     data-category="${achievement.category}">
                    <div class="achievement-icon-wrapper">
                        <div class="achievement-icon ${unlocked ? '' : 'grayscale'}">
                            ${achievement.icon}
                        </div>
                        ${unlocked ? '<div class="unlock-badge">✓</div>' : ''}
                        ${isNew ? '<div class="new-badge">NEW!</div>' : ''}
                    </div>
                    
                    <div class="achievement-content">
                        <h4 class="achievement-name">${achievement.name}</h4>
                        <p class="achievement-description">${achievement.description}</p>
                        
                        ${!unlocked ? `
                            <div class="achievement-progress">
                                <div class="progress-bar-small">
                                    <div class="progress-fill" style="width: ${progress}%"></div>
                                </div>
                                <span class="progress-text">${progress}%</span>
                            </div>
                        ` : `
                            <div class="achievement-unlock-date">
                                Unlocked ${this.formatDate(achievement.unlockedAt)}
                            </div>
                        `}
                        
                        <div class="achievement-reward">
                            <i class="bi bi-star-fill"></i> ${achievement.xpReward} XP
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Get categories with counts
     */
    getCategories(achievements) {
        const categoryMap = {};
        
        achievements.forEach(achievement => {
            if (!categoryMap[achievement.category]) {
                categoryMap[achievement.category] = {
                    id: achievement.category,
                    name: ACHIEVEMENT_CATEGORIES[achievement.category].name,
                    icon: ACHIEVEMENT_CATEGORIES[achievement.category].icon,
                    count: 0
                };
            }
            categoryMap[achievement.category].count++;
        });

        return Object.values(categoryMap);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                this.filterAchievements(filter);
            });
        });
    }

    /**
     * Filter achievements by category
     */
    filterAchievements(category) {
        const cards = document.querySelectorAll('.achievement-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'flex';
                setTimeout(() => card.classList.add('visible'), 10);
            } else {
                card.classList.remove('visible');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    /**
     * Format date
     */
    formatDate(timestamp) {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    /**
     * Show compact achievements widget (for dashboard)
     */
    renderWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const recentAchievements = this.gamificationSystem.getAllAchievements()
            .filter(a => a.unlocked)
            .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
            .slice(0, 3);

        container.innerHTML = `
            <div class="achievement-widget">
                <div class="widget-header">
                    <h5><i class="bi bi-trophy"></i> Recent Achievements</h5>
                    <span class="badge bg-primary">
                        ${this.gamificationSystem.getUnlockedCount()}/${this.gamificationSystem.getTotalCount()}
                    </span>
                </div>
                
                <div class="recent-achievements">
                    ${recentAchievements.length > 0 ? recentAchievements.map(achievement => `
                        <div class="recent-achievement-item">
                            <span class="achievement-icon-small">${achievement.icon}</span>
                            <div class="achievement-info-small">
                                <div class="achievement-name-small">${achievement.name}</div>
                                <div class="achievement-xp-small">+${achievement.xpReward} XP</div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="no-achievements">
                            <p class="text-muted">No achievements unlocked yet. Keep learning!</p>
                        </div>
                    `}
                </div>
                
                <div class="widget-footer">
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="showAchievements()">
                        View All Achievements
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Update achievement display (call when progress changes)
     */
    update() {
        const grid = document.getElementById('achievementsGrid');
        if (grid) {
            const achievements = this.gamificationSystem.getAllAchievements();
            grid.innerHTML = this.renderAchievements(achievements);
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementUI;
} else {
    window.AchievementUI = AchievementUI;
}
