// Streak UI Component
// Displays streak information, calendar, and freeze options

class StreakUI {
    constructor(streakSystem) {
        this.streakSystem = streakSystem;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
    }

    /**
     * Render streak widget for dashboard
     */
    renderWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const status = this.streakSystem.getStatus();
        const stats = this.streakSystem.getStats();

        container.innerHTML = `
            <div class="streak-widget">
                <div class="streak-header">
                    <h5><i class="bi bi-fire"></i> Study Streak</h5>
                    ${status.inDanger ? 
                        '<span class="badge bg-danger pulse">At Risk!</span>' : 
                        '<span class="badge bg-success">Active</span>'
                    }
                </div>

                <div class="streak-main">
                    <div class="streak-flame ${status.currentStreak > 0 ? 'active' : ''}">🔥</div>
                    <div class="streak-count">
                        <div class="streak-number">${status.currentStreak}</div>
                        <div class="streak-label">Day${status.currentStreak !== 1 ? 's' : ''}</div>
                    </div>
                </div>

                <div class="streak-progress">
                    <div class="progress-label">
                        Next milestone: ${status.nextMilestone} days
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-warning" 
                             style="width: ${(status.currentStreak / status.nextMilestone) * 100}%">
                        </div>
                    </div>
                    <div class="progress-text">
                        ${status.daysUntilMilestone} day${status.daysUntilMilestone !== 1 ? 's' : ''} to go
                    </div>
                </div>

                <div class="streak-stats-mini">
                    <div class="stat-mini">
                        <div class="stat-mini-icon">🏆</div>
                        <div class="stat-mini-text">
                            <div class="stat-mini-value">${stats.longestStreak}</div>
                            <div class="stat-mini-label">Best</div>
                        </div>
                    </div>
                    <div class="stat-mini">
                        <div class="stat-mini-icon">❄️</div>
                        <div class="stat-mini-text">
                            <div class="stat-mini-value">${stats.freezesAvailable}</div>
                            <div class="stat-mini-label">Freezes</div>
                        </div>
                    </div>
                </div>

                ${status.inDanger && stats.freezesAvailable > 0 ? `
                    <div class="streak-warning">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <span>Your streak is at risk!</span>
                        <button class="btn btn-sm btn-warning" onclick="useStreakFreeze()">
                            Use Freeze ❄️
                        </button>
                    </div>
                ` : ''}

                ${status.canRecover ? `
                    <div class="streak-recovery">
                        <i class="bi bi-clock"></i>
                        <span>Recovery window active!</span>
                        <div class="recovery-deadline">
                            Study before ${new Date(status.recoveryDeadline).toLocaleTimeString()}
                        </div>
                    </div>
                ` : ''}

                <div class="widget-footer">
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="showStreakCalendar()">
                        View Calendar
                    </button>
                </div>
            </div>
        `;

        this.attachWidgetListeners();
    }

    /**
     * Render full streak page with calendar
     */
    renderFullPage(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const status = this.streakSystem.getStatus();
        const stats = this.streakSystem.getStats();

        container.innerHTML = `
            <div class="streak-page">
                <!-- Header -->
                <div class="streak-page-header">
                    <h2><i class="bi bi-fire"></i> Study Streak</h2>
                    <div class="streak-status">
                        ${status.inDanger ? 
                            '<span class="badge bg-danger">⚠️ At Risk</span>' : 
                            '<span class="badge bg-success">✓ Active</span>'
                        }
                    </div>
                </div>

                <!-- Main Streak Display -->
                <div class="streak-hero">
                    <div class="streak-hero-flame">🔥</div>
                    <div class="streak-hero-count">${status.currentStreak}</div>
                    <div class="streak-hero-label">Day Streak</div>
                    
                    <div class="streak-hero-progress">
                        <div class="progress-track">
                            <div class="progress-fill" 
                                 style="width: ${(status.currentStreak / status.nextMilestone) * 100}%">
                            </div>
                        </div>
                        <div class="progress-milestone">
                            Next: ${status.nextMilestone} days (${status.daysUntilMilestone} to go)
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="streak-stats-grid">
                    <div class="streak-stat-card">
                        <div class="stat-card-icon">🔥</div>
                        <div class="stat-card-value">${stats.currentStreak}</div>
                        <div class="stat-card-label">Current Streak</div>
                    </div>
                    <div class="streak-stat-card">
                        <div class="stat-card-icon">🏆</div>
                        <div class="stat-card-value">${stats.longestStreak}</div>
                        <div class="stat-card-label">Longest Streak</div>
                    </div>
                    <div class="streak-stat-card">
                        <div class="stat-card-icon">📅</div>
                        <div class="stat-card-value">${stats.totalStudyDays}</div>
                        <div class="stat-card-label">Total Days</div>
                    </div>
                    <div class="streak-stat-card">
                        <div class="stat-card-icon">❄️</div>
                        <div class="stat-card-value">${stats.freezesAvailable}</div>
                        <div class="stat-card-label">Freezes Left</div>
                    </div>
                </div>

                <!-- Streak Protection -->
                <div class="streak-protection">
                    <h4><i class="bi bi-shield-fill"></i> Streak Protection</h4>
                    <div class="protection-info">
                        <div class="protection-item">
                            <div class="protection-icon">❄️</div>
                            <div class="protection-text">
                                <h5>Streak Freeze</h5>
                                <p>Save your streak if you miss a day. You get 1 freeze per month.</p>
                                <div class="protection-status">
                                    Available: ${stats.freezesAvailable} | Used: ${stats.freezesUsed}
                                </div>
                            </div>
                        </div>
                        ${status.inDanger && stats.freezesAvailable > 0 ? `
                            <button class="btn btn-warning btn-lg" onclick="useStreakFreeze()">
                                <i class="bi bi-shield-fill"></i> Use Freeze Now
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Calendar -->
                <div class="streak-calendar-section">
                    <div class="calendar-header">
                        <button class="btn btn-sm btn-outline-secondary" onclick="streakUI.previousMonth()">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <h4>${this.getMonthName(this.currentMonth)} ${this.currentYear}</h4>
                        <button class="btn btn-sm btn-outline-secondary" onclick="streakUI.nextMonth()">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="calendar-grid" id="streakCalendar">
                        ${this.renderCalendar()}
                    </div>
                    
                    <div class="calendar-legend">
                        <div class="legend-item">
                            <div class="legend-box studied"></div>
                            <span>Studied</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-box today"></div>
                            <span>Today</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-box empty"></div>
                            <span>Not Studied</span>
                        </div>
                    </div>
                </div>

                <!-- Weekly Summary -->
                <div class="weekly-summary">
                    <h4><i class="bi bi-graph-up"></i> This Week</h4>
                    <div class="week-stats">
                        <div class="week-stat">
                            <div class="week-stat-value">${stats.studyDaysThisWeek}</div>
                            <div class="week-stat-label">Days Studied</div>
                        </div>
                        <div class="week-stat">
                            <div class="week-stat-value">${Math.round((stats.studyDaysThisWeek / 7) * 100)}%</div>
                            <div class="week-stat-label">Completion</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachPageListeners();
    }

    /**
     * Render calendar
     */
    renderCalendar() {
        const calendarData = this.streakSystem.getCalendarData(this.currentYear, this.currentMonth);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let html = '<div class="calendar-weekdays">';
        weekdays.forEach(day => {
            html += `<div class="weekday">${day}</div>`;
        });
        html += '</div><div class="calendar-days">';

        calendarData.forEach(dayData => {
            if (dayData.day === null) {
                html += '<div class="calendar-day empty"></div>';
            } else {
                const classes = ['calendar-day'];
                if (dayData.studied) classes.push('studied');
                if (dayData.isToday) classes.push('today');
                
                html += `
                    <div class="${classes.join(' ')}" title="${dayData.date}">
                        <span class="day-number">${dayData.day}</span>
                        ${dayData.studied ? '<div class="study-indicator">✓</div>' : ''}
                    </div>
                `;
            }
        });

        html += '</div>';
        return html;
    }

    /**
     * Navigate to previous month
     */
    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateCalendar();
    }

    /**
     * Navigate to next month
     */
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.updateCalendar();
    }

    /**
     * Update calendar display
     */
    updateCalendar() {
        const calendar = document.getElementById('streakCalendar');
        if (calendar) {
            calendar.innerHTML = this.renderCalendar();
        }
        
        // Update month/year header
        const header = document.querySelector('.calendar-header h4');
        if (header) {
            header.textContent = `${this.getMonthName(this.currentMonth)} ${this.currentYear}`;
        }
    }

    /**
     * Get month name
     */
    getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    }

    /**
     * Attach widget event listeners
     */
    attachWidgetListeners() {
        // Freeze button handler set via onclick
    }

    /**
     * Attach page event listeners
     */
    attachPageListeners() {
        // Month navigation handlers set via onclick
    }

    /**
     * Update widget
     */
    update() {
        this.renderWidget('streakWidget');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StreakUI;
} else {
    window.StreakUI = StreakUI;
}
