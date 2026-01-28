// Enhanced Streak System with Freeze and Recovery
// Tracks study streaks with advanced features

class StreakSystem {
    constructor() {
        this.streak = this.loadStreak();
        this.calendar = this.loadCalendar();
    }

    /**
     * Load streak data
     */
    loadStreak() {
        const stored = localStorage.getItem('streakData');
        const defaultStreak = {
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: null,
            freezesAvailable: 1,
            freezesUsed: 0,
            lastFreezeReset: new Date().toISOString(),
            canRecover: false,
            recoveryDeadline: null
        };
        
        const data = stored ? JSON.parse(stored) : defaultStreak;
        
        // Check if we need to reset monthly freeze
        this.checkFreezeReset(data);
        
        return data;
    }

    /**
     * Save streak data
     */
    saveStreak() {
        localStorage.setItem('streakData', JSON.stringify(this.streak));
    }

    /**
     * Load calendar data (study days)
     */
    loadCalendar() {
        const stored = localStorage.getItem('streakCalendar');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Save calendar data
     */
    saveCalendar() {
        localStorage.setItem('streakCalendar', JSON.stringify(this.calendar));
    }

    /**
     * Check and reset monthly freeze
     */
    checkFreezeReset(data) {
        const lastReset = new Date(data.lastFreezeReset);
        const now = new Date();
        
        // Reset on first of month
        if (now.getMonth() !== lastReset.getMonth() || 
            now.getFullYear() !== lastReset.getFullYear()) {
            data.freezesAvailable = 1;
            data.freezesUsed = 0;
            data.lastFreezeReset = now.toISOString();
        }
    }

    /**
     * Record study session
     */
    recordStudy() {
        const today = this.getTodayString();
        const yesterday = this.getYesterdayString();
        
        // Check if already studied today
        if (this.streak.lastStudyDate === today) {
            return { updated: false, streak: this.streak.currentStreak };
        }

        // Add to calendar
        if (!this.calendar.includes(today)) {
            this.calendar.push(today);
            this.saveCalendar();
        }

        // Update streak logic
        if (this.streak.lastStudyDate === yesterday) {
            // Continue streak
            this.streak.currentStreak++;
            this.streak.canRecover = false;
            this.streak.recoveryDeadline = null;
        } else if (this.streak.lastStudyDate === null) {
            // First day
            this.streak.currentStreak = 1;
        } else {
            // Streak broken - check recovery
            if (this.streak.canRecover && this.canRecoverNow()) {
                // Recovery successful
                this.streak.currentStreak++;
                this.streak.canRecover = false;
                this.streak.recoveryDeadline = null;
            } else {
                // Start new streak
                this.streak.currentStreak = 1;
                this.streak.canRecover = false;
                this.streak.recoveryDeadline = null;
            }
        }

        // Update longest streak
        if (this.streak.currentStreak > this.streak.longestStreak) {
            this.streak.longestStreak = this.streak.currentStreak;
        }

        this.streak.lastStudyDate = today;
        this.saveStreak();

        return { 
            updated: true, 
            streak: this.streak.currentStreak,
            milestone: this.checkMilestone(this.streak.currentStreak)
        };
    }

    /**
     * Check if streak is in danger
     */
    checkStreakDanger() {
        if (!this.streak.lastStudyDate) return false;
        
        const yesterday = this.getYesterdayString();
        const today = this.getTodayString();
        
        // If last study was yesterday and today not studied yet
        return this.streak.lastStudyDate === yesterday && 
               !this.calendar.includes(today);
    }

    /**
     * Use streak freeze
     */
    useFreeze() {
        if (this.streak.freezesAvailable <= 0) {
            return { success: false, message: 'No freezes available this month' };
        }

        // Set up recovery window
        this.streak.canRecover = true;
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + 24);
        this.streak.recoveryDeadline = deadline.toISOString();
        
        this.streak.freezesAvailable--;
        this.streak.freezesUsed++;
        
        // Add yesterday to calendar if needed
        const yesterday = this.getYesterdayString();
        if (!this.calendar.includes(yesterday)) {
            this.calendar.push(yesterday);
            this.saveCalendar();
        }

        this.saveStreak();

        return { 
            success: true, 
            message: 'Streak frozen! You have 24 hours to study and maintain your streak.',
            deadline: this.streak.recoveryDeadline
        };
    }

    /**
     * Check if recovery is still possible
     */
    canRecoverNow() {
        if (!this.streak.canRecover) return false;
        if (!this.streak.recoveryDeadline) return false;

        const deadline = new Date(this.streak.recoveryDeadline);
        const now = new Date();

        return now < deadline;
    }

    /**
     * Get streak status
     */
    getStatus() {
        return {
            currentStreak: this.streak.currentStreak,
            longestStreak: this.streak.longestStreak,
            freezesAvailable: this.streak.freezesAvailable,
            freezesUsed: this.streak.freezesUsed,
            inDanger: this.checkStreakDanger(),
            canRecover: this.canRecoverNow(),
            recoveryDeadline: this.streak.recoveryDeadline,
            nextMilestone: this.getNextMilestone(),
            daysUntilMilestone: this.getDaysUntilMilestone()
        };
    }

    /**
     * Get streak calendar data
     */
    getCalendarData(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        
        const calendarData = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            calendarData.push({ day: null, studied: false, isToday: false });
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateString === this.getTodayString();
            const studied = this.calendar.includes(dateString);
            
            calendarData.push({
                day,
                studied,
                isToday,
                date: dateString
            });
        }
        
        return calendarData;
    }

    /**
     * Check for milestone
     */
    checkMilestone(streak) {
        const milestones = [3, 7, 14, 30, 50, 100, 365];
        return milestones.includes(streak) ? streak : null;
    }

    /**
     * Get next milestone
     */
    getNextMilestone() {
        const milestones = [3, 7, 14, 30, 50, 100, 365];
        for (let milestone of milestones) {
            if (this.streak.currentStreak < milestone) {
                return milestone;
            }
        }
        return 365; // Max milestone
    }

    /**
     * Get days until next milestone
     */
    getDaysUntilMilestone() {
        return this.getNextMilestone() - this.streak.currentStreak;
    }

    /**
     * Get today's date string
     */
    getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    /**
     * Get yesterday's date string
     */
    getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    /**
     * Get total study days
     */
    getTotalStudyDays() {
        return this.calendar.length;
    }

    /**
     * Get study days this week
     */
    getStudyDaysThisWeek() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            weekDays.push(day.toISOString().split('T')[0]);
        }
        
        return this.calendar.filter(date => weekDays.includes(date)).length;
    }

    /**
     * Get study days this month
     */
    getStudyDaysThisMonth() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        return this.calendar.filter(date => {
            const d = new Date(date);
            return d.getFullYear() === year && d.getMonth() === month;
        }).length;
    }

    /**
     * Calculate streak stats
     */
    getStats() {
        return {
            currentStreak: this.streak.currentStreak,
            longestStreak: this.streak.longestStreak,
            totalStudyDays: this.getTotalStudyDays(),
            studyDaysThisWeek: this.getStudyDaysThisWeek(),
            studyDaysThisMonth: this.getStudyDaysThisMonth(),
            freezesAvailable: this.streak.freezesAvailable,
            freezesUsed: this.streak.freezesUsed
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StreakSystem;
} else {
    window.StreakSystem = StreakSystem;
}
