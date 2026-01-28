// Progress Visualizations using Chart.js
// Displays charts and graphs for learning progress

class ProgressVisualizations {
    constructor(gamificationSystem, streakSystem, challengeService) {
        this.gamificationSystem = gamificationSystem;
        this.streakSystem = streakSystem;
        this.challengeService = challengeService;
        this.charts = {};
    }

    /**
     * Initialize Chart.js (must be loaded externally)
     */
    checkChartJS() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded. Include: https://cdn.jsdelivr.net/npm/chart.js');
            return false;
        }
        return true;
    }

    /**
     * Render all charts
     */
    renderAllCharts(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !this.checkChartJS()) return;

        container.innerHTML = `
            <div class="progress-visualizations">
                <h2><i class="bi bi-graph-up"></i> Your Progress</h2>
                
                <!-- Charts Grid -->
                <div class="charts-grid">
                    <!-- Activity Heatmap -->
                    <div class="chart-card wide">
                        <h4>Activity Heatmap</h4>
                        <div id="activityHeatmap"></div>
                    </div>

                    <!-- XP Over Time -->
                    <div class="chart-card">
                        <h4>XP Earned Over Time</h4>
                        <canvas id="xpChart"></canvas>
                    </div>

                    <!-- Words Learned -->
                    <div class="chart-card">
                        <h4>Words Learned</h4>
                        <canvas id="wordsChart"></canvas>
                    </div>

                    <!-- Study Time -->
                    <div class="chart-card">
                        <h4>Daily Study Time</h4>
                        <canvas id="studyTimeChart"></canvas>
                    </div>

                    <!-- Topic Mastery -->
                    <div class="chart-card">
                        <h4>Topic Mastery</h4>
                        <canvas id="topicMasteryChart"></canvas>
                    </div>

                    <!-- Performance -->
                    <div class="chart-card">
                        <h4>Quiz Performance</h4>
                        <canvas id="performanceChart"></canvas>
                    </div>

                    <!-- Study Time Distribution -->
                    <div class="chart-card">
                        <h4>Best Study Times</h4>
                        <canvas id="studyTimeDistChart"></canvas>
                    </div>
                </div>
            </div>
        `;

        this.renderActivityHeatmap();
        this.renderXPChart();
        this.renderWordsChart();
        this.renderStudyTimeChart();
        this.renderTopicMasteryChart();
        this.renderPerformanceChart();
        this.renderStudyTimeDistribution();
    }

    /**
     * Render activity heatmap (GitHub-style)
     */
    renderActivityHeatmap() {
        const container = document.getElementById('activityHeatmap');
        if (!container) return;

        const calendar = this.streakSystem.calendar || [];
        const weeks = this.getWeeksData(calendar);

        let html = '<div class="heatmap-container">';
        html += '<div class="heatmap-grid">';

        weeks.forEach((week, weekIndex) => {
            html += '<div class="heatmap-week">';
            week.forEach((day, dayIndex) => {
                const intensity = day.studied ? 'high' : 'none';
                const title = day.date ? `${day.date}: ${day.studied ? 'Studied' : 'No activity'}` : '';
                html += `<div class="heatmap-day ${intensity}" title="${title}"></div>`;
            });
            html += '</div>';
        });

        html += '</div>';
        html += '<div class="heatmap-legend">';
        html += '<span>Less</span>';
        html += '<div class="heatmap-day none"></div>';
        html += '<div class="heatmap-day low"></div>';
        html += '<div class="heatmap-day medium"></div>';
        html += '<div class="heatmap-day high"></div>';
        html += '<span>More</span>';
        html += '</div>';
        html += '</div>';

        container.innerHTML = html;
    }

    /**
     * Get weeks data for heatmap
     */
    getWeeksData(calendar) {
        const weeks = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); // Last 52 weeks

        let currentWeek = [];
        let currentDate = new Date(startDate);

        // Align to Sunday
        while (currentDate.getDay() !== 0) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        for (let i = 0; i < 52 * 7; i++) {
            const dateString = currentDate.toISOString().split('T')[0];
            const studied = calendar.includes(dateString);

            currentWeek.push({
                date: dateString,
                studied: studied
            });

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return weeks;
    }

    /**
     * Render XP over time chart
     */
    renderXPChart() {
        const ctx = document.getElementById('xpChart');
        if (!ctx) return;

        const data = this.getXPOverTimeData();

        this.charts.xp = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'XP Earned',
                    data: data.values,
                    borderColor: '#0066CC',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * Render words learned chart
     */
    renderWordsChart() {
        const ctx = document.getElementById('wordsChart');
        if (!ctx) return;

        const data = this.getWordsLearnedData();

        this.charts.words = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Words Learned',
                    data: data.values,
                    backgroundColor: '#34C759',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * Render study time chart
     */
    renderStudyTimeChart() {
        const ctx = document.getElementById('studyTimeChart');
        if (!ctx) return;

        const data = this.getStudyTimeData();

        this.charts.studyTime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Minutes',
                    data: data.values,
                    borderColor: '#FF9500',
                    backgroundColor: 'rgba(255, 149, 0, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * Render topic mastery chart
     */
    renderTopicMasteryChart() {
        const ctx = document.getElementById('topicMasteryChart');
        if (!ctx) return;

        const data = this.getTopicMasteryData();

        this.charts.topicMastery = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#0066CC',
                        '#34C759',
                        '#FF9500',
                        '#FF3B30',
                        '#5856D6',
                        '#007AFF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    /**
     * Render performance chart
     */
    renderPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const data = this.getPerformanceData();

        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Accuracy %',
                    data: data.values,
                    borderColor: '#5856D6',
                    backgroundColor: 'rgba(88, 86, 214, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    /**
     * Render study time distribution
     */
    renderStudyTimeDistribution() {
        const ctx = document.getElementById('studyTimeDistChart');
        if (!ctx) return;

        const data = this.getStudyTimeDistributionData();

        this.charts.studyTimeDist = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sessions',
                    data: data.values,
                    backgroundColor: '#007AFF',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * Get XP over time data (last 30 days)
     */
    getXPOverTimeData() {
        const labels = [];
        const values = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            values.push(Math.floor(Math.random() * 200)); // Mock data
        }

        return { labels, values };
    }

    /**
     * Get words learned data (last 7 days)
     */
    getWordsLearnedData() {
        const labels = [];
        const values = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            values.push(Math.floor(Math.random() * 30)); // Mock data
        }

        return { labels, values };
    }

    /**
     * Get study time data
     */
    getStudyTimeData() {
        return this.getWordsLearnedData(); // Similar structure
    }

    /**
     * Get topic mastery data
     */
    getTopicMasteryData() {
        return {
            labels: ['A1 Basics', 'A2 Elementary', 'B1 Intermediate', 'B2 Advanced', 'Listening', 'Writing'],
            values: [85, 72, 45, 20, 60, 55]
        };
    }

    /**
     * Get performance data
     */
    getPerformanceData() {
        const labels = [];
        const values = [];
        
        for (let i = 14; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            values.push(65 + Math.floor(Math.random() * 30)); // 65-95% accuracy
        }

        return { labels, values };
    }

    /**
     * Get study time distribution data
     */
    getStudyTimeDistributionData() {
        return {
            labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
            values: [15, 25, 35, 10]
        };
    }

    /**
     * Destroy all charts (cleanup)
     */
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }

    /**
     * Update charts with new data
     */
    updateCharts() {
        this.destroyCharts();
        this.renderAllCharts('progressVisualizationsContainer');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressVisualizations;
} else {
    window.ProgressVisualizations = ProgressVisualizations;
}
