// AI Writing Feedback UI Component
// Quebec French Learning App

class AIWritingUI {
    constructor(aiService, historyService) {
        this.aiService = aiService;
        this.historyService = historyService;
        this.currentText = '';
        this.currentLevel = 'A2';
        this.currentFeedback = null;
    }

    /**
     * Initialize the UI
     */
    init() {
        this.createUI();
        this.attachEventListeners();
        this.checkServiceAvailability();
        this.loadHistory();
    }

    /**
     * Create the main UI structure
     */
    createUI() {
        const container = document.getElementById('writing-feedback-container');
        if (!container) {
            console.error('Writing feedback container not found');
            return;
        }

        container.innerHTML = `
            <div class="writing-feedback-module">
                <!-- Header -->
                <div class="writing-header">
                    <h2><i class="bi bi-pencil-square"></i> AI Writing Feedback</h2>
                    <p class="text-muted">Get intelligent feedback on your Quebec French writing</p>
                </div>

                <!-- Service Status -->
                <div id="ai-service-status" class="alert alert-warning" style="display: none;">
                    <i class="bi bi-exclamation-triangle"></i>
                    <span id="status-message">AI service not configured</span>
                </div>

                <!-- Main Writing Interface -->
                <div class="row">
                    <!-- Left Column: Input -->
                    <div class="col-lg-6">
                        <div class="writing-input-panel card">
                            <div class="card-body">
                                <h5 class="card-title">Write in French</h5>
                                
                                <!-- Level Selector -->
                                <div class="mb-3">
                                    <label for="user-level-select" class="form-label">
                                        Your Level:
                                    </label>
                                    <select id="user-level-select" class="form-select">
                                        <option value="A1">A1 - Beginner</option>
                                        <option value="A2" selected>A2 - Elementary</option>
                                        <option value="B1">B1 - Intermediate</option>
                                        <option value="B2">B2 - Upper Intermediate</option>
                                        <option value="C1">C1 - Advanced</option>
                                    </select>
                                </div>

                                <!-- Text Area -->
                                <div class="mb-3">
                                    <textarea 
                                        id="french-text-input" 
                                        class="form-control writing-textarea"
                                        rows="12"
                                        placeholder="Écrivez votre texte en français ici... (minimum 10 caractères)&#10;&#10;Exemple: Je suis allé au dépanneur hier pour acheter du lait. Il faisait très froid, typique d'un hiver québécois!"
                                    ></textarea>
                                    <div class="text-end mt-1">
                                        <small class="text-muted">
                                            <span id="char-count">0</span> caractères
                                        </small>
                                    </div>
                                </div>

                                <!-- Cost Estimate -->
                                <div id="cost-estimate" class="alert alert-info" style="display: none;">
                                    <small>
                                        <i class="bi bi-info-circle"></i>
                                        Estimated cost: <strong id="cost-display">$0.001</strong>
                                    </small>
                                </div>

                                <!-- Action Buttons -->
                                <div class="d-grid gap-2">
                                    <button 
                                        id="analyze-btn" 
                                        class="btn btn-primary btn-lg"
                                        disabled
                                    >
                                        <i class="bi bi-magic"></i> Analyze My Writing
                                    </button>
                                    <button 
                                        id="clear-btn" 
                                        class="btn btn-outline-secondary"
                                    >
                                        <i class="bi bi-x-circle"></i> Clear
                                    </button>
                                </div>

                                <!-- Examples -->
                                <div class="mt-3">
                                    <button 
                                        class="btn btn-sm btn-outline-primary"
                                        id="load-example-btn"
                                    >
                                        <i class="bi bi-lightbulb"></i> Load Example Text
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Feedback -->
                    <div class="col-lg-6">
                        <!-- Loading State -->
                        <div id="feedback-loading" class="feedback-panel card" style="display: none;">
                            <div class="card-body text-center p-5">
                                <div class="spinner-border text-primary mb-3" role="status">
                                    <span class="visually-hidden">Analyzing...</span>
                                </div>
                                <h5>Analyzing your writing...</h5>
                                <p class="text-muted">This may take a few seconds</p>
                            </div>
                        </div>

                        <!-- Feedback Results -->
                        <div id="feedback-results" class="feedback-panel card" style="display: none;">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <i class="bi bi-clipboard-check"></i> Feedback
                                </h5>

                                <!-- Overall Score -->
                                <div class="overall-score-section mb-4">
                                    <div class="text-center">
                                        <div class="score-circle">
                                            <svg width="120" height="120">
                                                <circle cx="60" cy="60" r="50" fill="none" 
                                                    stroke="#e9ecef" stroke-width="10"/>
                                                <circle id="score-progress" cx="60" cy="60" r="50" 
                                                    fill="none" stroke="#0066CC" stroke-width="10"
                                                    stroke-dasharray="314" stroke-dashoffset="314"
                                                    transform="rotate(-90 60 60)"
                                                    style="transition: stroke-dashoffset 1s ease"/>
                                                <text x="60" y="70" text-anchor="middle" 
                                                    font-size="32" font-weight="bold" fill="#0066CC">
                                                    <tspan id="score-value">0</tspan>
                                                </text>
                                            </svg>
                                        </div>
                                        <h4 class="mt-2">Overall Score</h4>
                                        <p class="text-muted" id="score-message">Excellent work!</p>
                                    </div>
                                </div>

                                <!-- Category Scores -->
                                <div class="category-scores mb-4">
                                    <h6 class="mb-3">Detailed Scores</h6>
                                    <div id="category-scores-list">
                                        <!-- Populated dynamically -->
                                    </div>
                                </div>

                                <!-- Tabs for Different Feedback Sections -->
                                <ul class="nav nav-tabs" id="feedback-tabs" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link active" id="errors-tab" 
                                            data-bs-toggle="tab" data-bs-target="#errors-pane" 
                                            type="button" role="tab">
                                            <i class="bi bi-exclamation-circle"></i> 
                                            Errors (<span id="errors-count">0</span>)
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="suggestions-tab" 
                                            data-bs-toggle="tab" data-bs-target="#suggestions-pane" 
                                            type="button" role="tab">
                                            <i class="bi bi-lightbulb"></i> Suggestions
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="corrected-tab" 
                                            data-bs-toggle="tab" data-bs-target="#corrected-pane" 
                                            type="button" role="tab">
                                            <i class="bi bi-check-circle"></i> Corrected
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="quebec-tab" 
                                            data-bs-toggle="tab" data-bs-target="#quebec-pane" 
                                            type="button" role="tab">
                                            <i class="bi bi-flag"></i> Quebec Notes
                                        </button>
                                    </li>
                                </ul>

                                <div class="tab-content mt-3" id="feedback-tab-content">
                                    <!-- Errors Tab -->
                                    <div class="tab-pane fade show active" id="errors-pane" role="tabpanel">
                                        <div id="errors-list">
                                            <!-- Populated dynamically -->
                                        </div>
                                    </div>

                                    <!-- Suggestions Tab -->
                                    <div class="tab-pane fade" id="suggestions-pane" role="tabpanel">
                                        <div id="suggestions-list">
                                            <!-- Populated dynamically -->
                                        </div>
                                    </div>

                                    <!-- Corrected Text Tab -->
                                    <div class="tab-pane fade" id="corrected-pane" role="tabpanel">
                                        <div id="corrected-text" class="corrected-text-display">
                                            <!-- Populated dynamically -->
                                        </div>
                                        <button class="btn btn-sm btn-outline-primary mt-2" id="copy-corrected-btn">
                                            <i class="bi bi-clipboard"></i> Copy Corrected Text
                                        </button>
                                    </div>

                                    <!-- Quebec Notes Tab -->
                                    <div class="tab-pane fade" id="quebec-pane" role="tabpanel">
                                        <div id="quebec-notes-list">
                                            <!-- Populated dynamically -->
                                        </div>
                                    </div>
                                </div>

                                <!-- Encouragement -->
                                <div class="encouragement-section mt-4 p-3 bg-light rounded">
                                    <i class="bi bi-emoji-smile"></i>
                                    <strong>Encouragement:</strong>
                                    <p class="mb-0 mt-2" id="encouragement-text">
                                        Keep up the great work!
                                    </p>
                                </div>

                                <!-- Actions -->
                                <div class="mt-3 d-flex gap-2">
                                    <button class="btn btn-outline-primary" id="save-feedback-btn">
                                        <i class="bi bi-save"></i> Save to History
                                    </button>
                                    <button class="btn btn-outline-secondary" id="new-analysis-btn">
                                        <i class="bi bi-arrow-left"></i> New Analysis
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Placeholder when no feedback -->
                        <div id="feedback-placeholder" class="feedback-panel card">
                            <div class="card-body text-center p-5">
                                <i class="bi bi-pencil-square display-1 text-muted"></i>
                                <h5 class="mt-3">No Feedback Yet</h5>
                                <p class="text-muted">
                                    Write some French text and click "Analyze" to receive detailed feedback
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History Section -->
                <div class="history-section mt-5">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-clock-history"></i> Writing History
                            </h5>
                            
                            <!-- Statistics -->
                            <div class="row mb-3" id="history-stats">
                                <div class="col-md-3">
                                    <div class="stat-card">
                                        <div class="stat-value" id="stat-count">0</div>
                                        <div class="stat-label">Total Analyses</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="stat-card">
                                        <div class="stat-value" id="stat-avg">0</div>
                                        <div class="stat-label">Average Score</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="stat-card">
                                        <div class="stat-value" id="stat-improvement">0</div>
                                        <div class="stat-label">Improvement</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="stat-card">
                                        <button class="btn btn-outline-danger btn-sm" id="clear-history-btn">
                                            <i class="bi bi-trash"></i> Clear History
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- History List -->
                            <div id="history-list">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addStyles();
    }

    /**
     * Add custom styles
     */
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .writing-feedback-module {
                padding: 20px;
            }

            .writing-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .writing-textarea {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                resize: vertical;
                min-height: 200px;
            }

            .feedback-panel {
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .score-circle {
                display: inline-block;
            }

            .category-scores .progress {
                height: 25px;
                margin-bottom: 10px;
            }

            .error-item {
                padding: 15px;
                margin-bottom: 10px;
                border-left: 4px solid;
                background: #f8f9fa;
                border-radius: 4px;
            }

            .error-item.severity-high {
                border-left-color: #dc3545;
            }

            .error-item.severity-medium {
                border-left-color: #ffc107;
            }

            .error-item.severity-low {
                border-left-color: #17a2b8;
            }

            .error-original {
                text-decoration: line-through;
                color: #dc3545;
                font-weight: bold;
            }

            .error-correction {
                color: #28a745;
                font-weight: bold;
            }

            .suggestion-item {
                padding: 10px;
                margin-bottom: 8px;
                background: #e7f3ff;
                border-left: 3px solid #0066CC;
                border-radius: 4px;
            }

            .corrected-text-display {
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
            }

            .quebec-note-item {
                padding: 10px;
                margin-bottom: 8px;
                background: #fff3cd;
                border-left: 3px solid #ffc107;
                border-radius: 4px;
            }

            .encouragement-section {
                border-left: 4px solid #28a745;
            }

            .stat-card {
                text-align: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }

            .stat-value {
                font-size: 32px;
                font-weight: bold;
                color: #0066CC;
            }

            .stat-label {
                font-size: 14px;
                color: #6c757d;
            }

            .history-item {
                padding: 15px;
                margin-bottom: 10px;
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .history-item:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }

            .history-score {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                color: white;
            }

            .score-excellent { background-color: #28a745; }
            .score-good { background-color: #17a2b8; }
            .score-fair { background-color: #ffc107; }
            .score-poor { background-color: #dc3545; }

            @media (max-width: 768px) {
                .writing-feedback-module {
                    padding: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Text input
        const textInput = document.getElementById('french-text-input');
        if (textInput) {
            textInput.addEventListener('input', () => this.handleTextInput());
        }

        // Level selector
        const levelSelect = document.getElementById('user-level-select');
        if (levelSelect) {
            levelSelect.addEventListener('change', (e) => {
                this.currentLevel = e.target.value;
            });
        }

        // Analyze button
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeWriting());
        }

        // Clear button
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearInput());
        }

        // Example button
        const exampleBtn = document.getElementById('load-example-btn');
        if (exampleBtn) {
            exampleBtn.addEventListener('click', () => this.loadExample());
        }

        // Copy corrected text
        const copyBtn = document.getElementById('copy-corrected-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCorrectedText());
        }

        // Save feedback
        const saveBtn = document.getElementById('save-feedback-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveFeedback());
        }

        // New analysis
        const newBtn = document.getElementById('new-analysis-btn');
        if (newBtn) {
            newBtn.addEventListener('click', () => this.resetForNewAnalysis());
        }

        // Clear history
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
    }

    /**
     * Check if AI service is available
     */
    checkServiceAvailability() {
        const statusDiv = document.getElementById('ai-service-status');
        const statusMessage = document.getElementById('status-message');
        
        if (!this.aiService || !this.aiService.isAvailable()) {
            statusDiv.style.display = 'block';
            statusDiv.className = 'alert alert-warning';
            statusMessage.textContent = '⚠️ AI service not configured. Please add your API key to ai-config.js. See documentation for setup instructions.';
        } else {
            statusDiv.style.display = 'block';
            statusDiv.className = 'alert alert-success';
            statusMessage.textContent = `✓ AI service ready (${this.aiService.provider})`;
        }
    }

    /**
     * Handle text input changes
     */
    handleTextInput() {
        const textInput = document.getElementById('french-text-input');
        const analyzeBtn = document.getElementById('analyze-btn');
        const charCount = document.getElementById('char-count');
        
        this.currentText = textInput.value;
        charCount.textContent = this.currentText.length;

        // Enable/disable analyze button
        const canAnalyze = this.currentText.trim().length >= 10 && 
                          this.aiService && 
                          this.aiService.isAvailable();
        analyzeBtn.disabled = !canAnalyze;

        // Show cost estimate
        if (this.currentText.trim().length > 0 && this.aiService) {
            const cost = this.aiService.estimateCost(this.currentText);
            const costDisplay = document.getElementById('cost-display');
            const costEstimate = document.getElementById('cost-estimate');
            
            costDisplay.textContent = `$${cost.totalCost}`;
            costEstimate.style.display = 'block';
        }
    }

    /**
     * Analyze writing
     */
    async analyzeWriting() {
        // Validate
        if (!this.currentText || this.currentText.trim().length < 10) {
            alert('Please write at least 10 characters');
            return;
        }

        // Show loading
        this.showLoading();

        try {
            // Call AI service
            const feedback = await this.aiService.analyzeFrenchWriting(
                this.currentText,
                this.currentLevel
            );

            this.currentFeedback = feedback;
            
            // Display feedback
            this.displayFeedback(feedback);

        } catch (error) {
            console.error('Error analyzing writing:', error);
            this.showError(error.message);
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        document.getElementById('feedback-placeholder').style.display = 'none';
        document.getElementById('feedback-results').style.display = 'none';
        document.getElementById('feedback-loading').style.display = 'block';
    }

    /**
     * Display feedback results
     */
    displayFeedback(feedback) {
        // Hide loading, show results
        document.getElementById('feedback-loading').style.display = 'none';
        document.getElementById('feedback-placeholder').style.display = 'none';
        document.getElementById('feedback-results').style.display = 'block';

        // Overall score
        this.displayOverallScore(feedback.overallScore);

        // Category scores
        this.displayCategoryScores(feedback.scores);

        // Errors
        this.displayErrors(feedback.errors || []);

        // Suggestions
        this.displaySuggestions(feedback.suggestions || []);

        // Corrected text
        this.displayCorrectedText(feedback.correctedText || this.currentText);

        // Quebec notes
        this.displayQuebecNotes(feedback.quebecNotes || []);

        // Strengths
        this.displayStrengths(feedback.strengths || []);

        // Encouragement
        this.displayEncouragement(feedback.encouragement || 'Keep up the great work!');
    }

    /**
     * Display overall score with animation
     */
    displayOverallScore(score) {
        const scoreValue = document.getElementById('score-value');
        const scoreProgress = document.getElementById('score-progress');
        const scoreMessage = document.getElementById('score-message');

        // Animate score
        let current = 0;
        const target = Math.round(score);
        const duration = 1000;
        const increment = target / (duration / 16);

        const animate = () => {
            current += increment;
            if (current < target) {
                scoreValue.textContent = Math.round(current);
                requestAnimationFrame(animate);
            } else {
                scoreValue.textContent = target;
            }
        };
        animate();

        // Animate circle
        const circumference = 314;
        const offset = circumference - (score / 100) * circumference;
        scoreProgress.style.strokeDashoffset = offset;

        // Color coding
        if (score >= 90) {
            scoreProgress.style.stroke = '#28a745';
            scoreMessage.textContent = 'Excellent! 🎉';
        } else if (score >= 75) {
            scoreProgress.style.stroke = '#17a2b8';
            scoreMessage.textContent = 'Good work! 👍';
        } else if (score >= 60) {
            scoreProgress.style.stroke = '#ffc107';
            scoreMessage.textContent = 'Fair, keep improving! 💪';
        } else {
            scoreProgress.style.stroke = '#dc3545';
            scoreMessage.textContent = 'Needs work, but you\'re learning! 📚';
        }
    }

    /**
     * Display category scores
     */
    displayCategoryScores(scores) {
        const container = document.getElementById('category-scores-list');
        
        const categories = {
            grammar: { label: 'Grammar', icon: 'bi-check-circle' },
            vocabulary: { label: 'Vocabulary', icon: 'bi-book' },
            structure: { label: 'Structure', icon: 'bi-list-ul' },
            quebecAccuracy: { label: 'Quebec Accuracy', icon: 'bi-flag' }
        };

        let html = '';
        for (const [key, value] of Object.entries(scores)) {
            const category = categories[key] || { label: key, icon: 'bi-star' };
            const colorClass = value >= 75 ? 'bg-success' : value >= 60 ? 'bg-info' : 'bg-warning';
            
            html += `
                <div class="mb-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small>
                            <i class="bi ${category.icon}"></i> ${category.label}
                        </small>
                        <small class="fw-bold">${value}</small>
                    </div>
                    <div class="progress">
                        <div class="progress-bar ${colorClass}" 
                            role="progressbar" 
                            style="width: ${value}%"
                            aria-valuenow="${value}" 
                            aria-valuemin="0" 
                            aria-valuemax="100">
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    /**
     * Display errors
     */
    displayErrors(errors) {
        const container = document.getElementById('errors-list');
        const countSpan = document.getElementById('errors-count');
        
        countSpan.textContent = errors.length;

        if (errors.length === 0) {
            container.innerHTML = '<p class="text-muted">No errors found! Excellent work! 🎉</p>';
            return;
        }

        let html = '';
        errors.forEach((error, index) => {
            html += `
                <div class="error-item severity-${error.severity || 'medium'}">
                    <div class="d-flex justify-content-between">
                        <strong>${error.type || 'Error'}</strong>
                        <span class="badge bg-${this.getSeverityColor(error.severity)}">
                            ${error.severity || 'medium'}
                        </span>
                    </div>
                    <div class="mt-2">
                        <span class="error-original">${error.original}</span>
                        →
                        <span class="error-correction">${error.correction}</span>
                    </div>
                    <p class="mt-2 mb-0">
                        <small>${error.explanation}</small>
                    </p>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Display suggestions
     */
    displaySuggestions(suggestions) {
        const container = document.getElementById('suggestions-list');

        if (suggestions.length === 0) {
            container.innerHTML = '<p class="text-muted">No specific suggestions at this time.</p>';
            return;
        }

        let html = '<ul class="list-unstyled">';
        suggestions.forEach((suggestion, index) => {
            html += `
                <li class="suggestion-item">
                    <i class="bi bi-lightbulb"></i> ${suggestion}
                </li>
            `;
        });
        html += '</ul>';

        container.innerHTML = html;
    }

    /**
     * Display corrected text
     */
    displayCorrectedText(correctedText) {
        const container = document.getElementById('corrected-text');
        container.textContent = correctedText;
    }

    /**
     * Display Quebec notes
     */
    displayQuebecNotes(notes) {
        const container = document.getElementById('quebec-notes-list');

        if (notes.length === 0) {
            container.innerHTML = '<p class="text-muted">No Quebec-specific notes for this text.</p>';
            return;
        }

        let html = '<ul class="list-unstyled">';
        notes.forEach((note, index) => {
            html += `
                <li class="quebec-note-item">
                    <i class="bi bi-flag"></i> ${note}
                </li>
            `;
        });
        html += '</ul>';

        container.innerHTML = html;
    }

    /**
     * Display strengths
     */
    displayStrengths(strengths) {
        if (strengths.length === 0) return;

        const suggestionsContainer = document.getElementById('suggestions-list');
        let html = '<div class="strengths-section mb-3"><h6><i class="bi bi-star-fill text-warning"></i> Strengths:</h6><ul>';
        
        strengths.forEach(strength => {
            html += `<li>${strength}</li>`;
        });
        
        html += '</ul></div>' + suggestionsContainer.innerHTML;
        suggestionsContainer.innerHTML = html;
    }

    /**
     * Display encouragement
     */
    displayEncouragement(text) {
        const container = document.getElementById('encouragement-text');
        container.textContent = text;
    }

    /**
     * Show error
     */
    showError(message) {
        document.getElementById('feedback-loading').style.display = 'none';
        document.getElementById('feedback-results').style.display = 'none';
        document.getElementById('feedback-placeholder').style.display = 'block';

        alert(`Error: ${message}`);
    }

    /**
     * Helper: Get severity color
     */
    getSeverityColor(severity) {
        switch (severity) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'secondary';
        }
    }

    /**
     * Clear input
     */
    clearInput() {
        document.getElementById('french-text-input').value = '';
        this.currentText = '';
        this.handleTextInput();
    }

    /**
     * Load example text
     */
    loadExample() {
        const examples = [
            {
                level: 'A2',
                text: "Je va au dépanneur pour acheter du lait hier. Il faisait très froid comme toujours en hiver québécois. J'aime beaucoup la poutine et le sirop d'érable!"
            },
            {
                level: 'B1',
                text: "Cette fin de semaine, on va faire un party chez mon ami. Je suis arrivé au Québec il y a deux ans et je trouve que l'hiver est très rough, mais les gens sont super friendly!"
            },
            {
                level: 'B2',
                text: "L'adaptation à la vie québécoise a été un défi majeur pour moi. Bien que je parlais français, les expressions locales comme 'c'est ben correct' ou 'y fait frette' étaient complètement nouvelles. Maintenant, je me sens beaucoup plus à l'aise."
            }
        ];

        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        
        document.getElementById('french-text-input').value = randomExample.text;
        document.getElementById('user-level-select').value = randomExample.level;
        this.currentLevel = randomExample.level;
        this.handleTextInput();
    }

    /**
     * Copy corrected text to clipboard
     */
    copyCorrectedText() {
        const correctedText = document.getElementById('corrected-text').textContent;
        navigator.clipboard.writeText(correctedText).then(() => {
            const btn = document.getElementById('copy-corrected-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }

    /**
     * Save feedback to history
     */
    saveFeedback() {
        if (!this.currentFeedback || !this.historyService) return;

        this.historyService.saveFeedback(this.currentText, this.currentFeedback);
        this.loadHistory();
        
        alert('✓ Feedback saved to history!');
    }

    /**
     * Reset for new analysis
     */
    resetForNewAnalysis() {
        document.getElementById('feedback-results').style.display = 'none';
        document.getElementById('feedback-placeholder').style.display = 'block';
        this.clearInput();
    }

    /**
     * Load history
     */
    loadHistory() {
        if (!this.historyService) return;

        const stats = this.historyService.getStats();
        const history = this.historyService.getHistory();

        // Update stats
        document.getElementById('stat-count').textContent = stats.count;
        document.getElementById('stat-avg').textContent = stats.averageScore;
        
        const improvementElem = document.getElementById('stat-improvement');
        improvementElem.textContent = (stats.improvement > 0 ? '+' : '') + stats.improvement;
        improvementElem.style.color = stats.improvement > 0 ? '#28a745' : '#dc3545';

        // Display history
        const historyList = document.getElementById('history-list');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="text-muted">No history yet. Start analyzing your writing!</p>';
            return;
        }

        let html = '';
        history.slice(0, 10).forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString();
            const score = entry.feedback.overallScore;
            const scoreClass = score >= 90 ? 'score-excellent' : 
                              score >= 75 ? 'score-good' : 
                              score >= 60 ? 'score-fair' : 'score-poor';
            const preview = entry.text.substring(0, 100) + (entry.text.length > 100 ? '...' : '');

            html += `
                <div class="history-item" data-id="${entry.id}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="mb-2">
                                <span class="history-score ${scoreClass}">${score}</span>
                                <small class="text-muted ms-2">${date} • ${entry.level || 'A2'}</small>
                            </div>
                            <div class="text-muted small">${preview}</div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-history-btn" data-id="${entry.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        historyList.innerHTML = html;

        // Attach click handlers
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-history-btn')) {
                    this.loadHistoryItem(item.dataset.id);
                }
            });
        });

        historyList.querySelectorAll('.delete-history-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteHistoryItem(btn.dataset.id);
            });
        });
    }

    /**
     * Load history item
     */
    loadHistoryItem(id) {
        const entry = this.historyService.getFeedback(parseInt(id));
        if (!entry) return;

        this.currentText = entry.text;
        this.currentFeedback = entry.feedback;
        
        document.getElementById('french-text-input').value = entry.text;
        this.displayFeedback(entry.feedback);
        
        // Scroll to feedback
        document.getElementById('feedback-results').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Delete history item
     */
    deleteHistoryItem(id) {
        if (confirm('Delete this entry from history?')) {
            this.historyService.deleteFeedback(parseInt(id));
            this.loadHistory();
        }
    }

    /**
     * Clear all history
     */
    clearHistory() {
        if (confirm('Clear all writing history? This cannot be undone.')) {
            this.historyService.clearHistory();
            this.loadHistory();
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIWritingUI;
} else {
    window.AIWritingUI = AIWritingUI;
}
