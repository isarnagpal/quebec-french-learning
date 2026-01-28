// Reading Module - Complete Interactive System

class ReadingModule {
    constructor() {
        this.currentText = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.startTime = null;
    }
    
    loadText(textId, level) {
        const texts = window.allReadingTexts[level];
        this.currentText = texts.find(t => t.id === textId);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.startTime = new Date();
        this.render();
    }
    
    render() {
        const container = document.getElementById('readingModule');
        if (!this.currentText) {
            container.innerHTML = '<p>Chargement...</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="reading-container">
                <div class="reading-header">
                    <h3>${this.currentText.title}</h3>
                    <span class="badge bg-primary">${this.currentText.level || 'A1'}</span>
                </div>
                
                <div class="reading-text-box">
                    <p class="reading-text">${this.currentText.text}</p>
                </div>
                
                <div class="reading-questions" id="questionContainer">
                    ${this.renderQuestion()}
                </div>
                
                <div class="reading-progress">
                    Question ${this.currentQuestionIndex + 1} / ${this.currentText.questions.length}
                </div>
            </div>
        `;
    }
    
    renderQuestion() {
        if (this.currentQuestionIndex >= this.currentText.questions.length) {
            return this.renderResults();
        }
        
        const q = this.currentText.questions[this.currentQuestionIndex];
        return `
            <div class="question-card">
                <h5>${q.q || q.question}</h5>
                <div class="options">
                    ${q.options.map((opt, i) => `
                        <button class="btn btn-outline-primary btn-block mb-2 option-btn" 
                                onclick="readingModule.answerQuestion(${i})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    answerQuestion(answerIndex) {
        const q = this.currentText.questions[this.currentQuestionIndex];
        const correct = answerIndex === q.correct;
        
        if (correct) {
            this.score++;
        }
        
        this.answers.push({
            question: q.q || q.question,
            userAnswer: q.options[answerIndex],
            correctAnswer: q.options[q.correct],
            correct: correct
        });
        
        // Show feedback
        this.showFeedback(correct);
        
        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.currentText.questions.length) {
                this.render();
            } else {
                this.finishReading();
            }
        }, 1500);
    }
    
    showFeedback(correct) {
        const container = document.getElementById('questionContainer');
        container.innerHTML = `
            <div class="alert alert-${correct ? 'success' : 'danger'}">
                <h4>${correct ? '✅ Correct!' : '❌ Incorrect'}</h4>
                ${!correct ? '<p>La bonne réponse était: ' + 
                    this.currentText.questions[this.currentQuestionIndex].options[
                        this.currentText.questions[this.currentQuestionIndex].correct
                    ] + '</p>' : ''}
            </div>
        `;
    }
    
    finishReading() {
        const endTime = new Date();
        const duration = Math.round((endTime - this.startTime) / 1000 / 60); // minutes
        
        // Save progress
        this.saveProgress(duration);
        
        // Show results
        document.getElementById('questionContainer').innerHTML = this.renderResults();
    }
    
    renderResults() {
        const percentage = Math.round((this.score / this.currentText.questions.length) * 100);
        const passed = percentage >= 70;
        
        return `
            <div class="results-card">
                <h3>Résultats</h3>
                <div class="score-circle ${passed ? 'pass' : 'fail'}">
                    <div class="score-number">${percentage}%</div>
                </div>
                <p class="score-text">${this.score} / ${this.currentText.questions.length} correct</p>
                
                ${passed ? 
                    '<div class="alert alert-success">✅ Félicitations! Vous avez réussi!</div>' :
                    '<div class="alert alert-warning">⚠️ Réessayez pour améliorer votre score!</div>'
                }
                
                <div class="answer-review">
                    <h5>Révision des Réponses:</h5>
                    ${this.answers.map((a, i) => `
                        <div class="answer-item ${a.correct ? 'correct' : 'incorrect'}">
                            <strong>Q${i + 1}:</strong> ${a.question}<br>
                            <span class="user-answer">Votre réponse: ${a.userAnswer}</span><br>
                            ${!a.correct ? `<span class="correct-answer">Bonne réponse: ${a.correctAnswer}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="readingModule.nextText()">
                        Texte Suivant →
                    </button>
                    <button class="btn btn-secondary" onclick="backToDashboard()">
                        Retour au Dashboard
                    </button>
                </div>
            </div>
        `;
    }
    
    saveProgress(duration) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;
        
        user.progress.readingCompleted = (user.progress.readingCompleted || 0) + 1;
        user.progress.studyTimeMinutes = (user.progress.studyTimeMinutes || 0) + duration;
        user.progress.lastStudyDate = new Date().toISOString();
        
        // Update user in storage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex >= 0) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    }
    
    nextText() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const level = user.level || 'A1';
        const nextId = this.currentText.id + 1;
        
        const texts = window.allReadingTexts[level];
        if (texts.find(t => t.id === nextId)) {
            this.loadText(nextId, level);
        } else {
            alert('Vous avez complété tous les textes de ce niveau! Félicitations!');
            backToDashboard();
        }
    }
}

// Initialize global reading module
window.readingModule = new ReadingModule();

// Start reading function
window.startReading = function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const level = user.level || 'A1';
    
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('readingScreen').classList.remove('hidden');
    
    // Load first text of user's level
    readingModule.loadText(1, level);
};
