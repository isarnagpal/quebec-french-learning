// Vocabulary Flashcard Module - Complete Spaced Repetition System

class VocabularyModule {
    constructor() {
        this.currentWord = null;
        this.wordQueue = [];
        this.session = {
            correct: 0,
            incorrect: 0,
            total: 0
        };
        this.showingAnswer = false;
        this.spacedRep = new SpacedRepetition();
    }
    
    start(level) {
        // Get words for this level
        const words = window.vocabularyDatabase[level] || window.vocabularyDatabase.A1;
        
        // Load user's word progress
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const wordProgress = JSON.parse(localStorage.getItem(`vocab_${user.id}`) || '{}');
        
        // Prepare queue with words due for review
        this.wordQueue = words.map(w => {
            const progress = wordProgress[w.id] || { mastery: 0, lastReviewed: null, nextReview: new Date() };
            return { ...w, ...progress };
        }).filter(w => new Date(w.nextReview) <= new Date())
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, 20); // 20 words per session
        
        if (this.wordQueue.length === 0) {
            // All words reviewed, add new ones
            this.wordQueue = words.slice(0, 20).map(w => ({
                ...w,
                mastery: 0,
                lastReviewed: null,
                nextReview: new Date()
            }));
        }
        
        this.session = { correct: 0, incorrect: 0, total: 0 };
        this.nextWord();
    }
    
    nextWord() {
        if (this.wordQueue.length === 0) {
            this.finishSession();
            return;
        }
        
        this.currentWord = this.wordQueue.shift();
        this.showingAnswer = false;
        this.session.total++;
        this.render();
    }
    
    render() {
        const container = document.getElementById('vocabularyModule');
        
        container.innerHTML = `
            <div class="flashcard-container">
                <div class="session-progress">
                    <div class="progress-stats">
                        <span class="stat-correct">✅ ${this.session.correct}</span>
                        <span class="stat-incorrect">❌ ${this.session.incorrect}</span>
                        <span class="stat-remaining">📚 ${this.wordQueue.length} restants</span>
                    </div>
                </div>
                
                <div class="flashcard ${this.showingAnswer ? 'flipped' : ''}" onclick="vocabularyModule.flip()">
                    <div class="flashcard-front">
                        <div class="word-french">
                            <h2>${this.currentWord.french}</h2>
                            <span class="category-badge">${this.currentWord.category}</span>
                        </div>
                        <p class="flip-hint">Cliquez pour révéler →</p>
                    </div>
                    
                    <div class="flashcard-back">
                        <div class="word-english">
                            <h2>${this.currentWord.english}</h2>
                        </div>
                        <div class="word-example">
                            <em>"${this.currentWord.example}"</em>
                        </div>
                    </div>
                </div>
                
                ${this.showingAnswer ? `
                    <div class="answer-buttons">
                        <button class="btn btn-danger btn-lg" onclick="vocabularyModule.markIncorrect()">
                            ❌ Je ne savais pas
                        </button>
                        <button class="btn btn-success btn-lg" onclick="vocabularyModule.markCorrect()">
                            ✅ Je savais!
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    flip() {
        this.showingAnswer = true;
        this.render();
    }
    
    markCorrect() {
        this.session.correct++;
        this.updateWordProgress(true);
        this.nextWord();
    }
    
    markIncorrect() {
        this.session.incorrect++;
        this.updateWordProgress(false);
        this.nextWord();
    }
    
    updateWordProgress(correct) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const wordProgress = JSON.parse(localStorage.getItem(`vocab_${user.id}`) || '{}');
        
        // Update with spaced repetition algorithm
        const updated = this.spacedRep.updateWordMastery(this.currentWord, correct);
        
        wordProgress[this.currentWord.id] = {
            mastery: updated.mastery,
            lastReviewed: updated.lastReviewed,
            nextReview: updated.nextReview
        };
        
        localStorage.setItem(`vocab_${user.id}`, JSON.stringify(wordProgress));
        
        // Update user's vocab count
        if (correct && updated.mastery >= 3) {
            user.progress.vocabMastered = (user.progress.vocabMastered || 0) + 1;
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex >= 0) {
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
        }
    }
    
    finishSession() {
        const container = document.getElementById('vocabularyModule');
        const percentage = Math.round((this.session.correct / this.session.total) * 100);
        
        container.innerHTML = `
            <div class="session-results">
                <h3>Session Terminée!</h3>
                
                <div class="result-circle">
                    <div class="result-percentage">${percentage}%</div>
                </div>
                
                <div class="result-stats">
                    <div class="stat-box correct">
                        <h4>${this.session.correct}</h4>
                        <p>Correctes</p>
                    </div>
                    <div class="stat-box incorrect">
                        <h4>${this.session.incorrect}</h4>
                        <p>Incorrectes</p>
                    </div>
                    <div class="stat-box total">
                        <h4>${this.session.total}</h4>
                        <p>Total</p>
                    </div>
                </div>
                
                ${percentage >= 80 ? 
                    '<div class="alert alert-success">🎉 Excellent travail! Votre vocabulaire s\'améliore!</div>' :
                    '<div class="alert alert-info">💪 Continuez à pratiquer! La répétition est la clé!</div>'
                }
                
                <div class="action-buttons">
                    <button class="btn btn-primary btn-lg" onclick="vocabularyModule.restart()">
                        🔄 Nouvelle Session
                    </button>
                    <button class="btn btn-secondary" onclick="backToDashboard()">
                        ← Retour au Dashboard
                    </button>
                </div>
            </div>
        `;
    }
    
    restart() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.start(user.level || 'A1');
    }
}

// Initialize global vocabulary module
window.vocabularyModule = new VocabularyModule();

// Start vocabulary function
window.startVocabulary = function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const level = user.level || 'A1';
    
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('vocabularyScreen').classList.remove('hidden');
    
    vocabularyModule.start(level);
};
