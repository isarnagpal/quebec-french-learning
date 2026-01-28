// Writing Module - Essay submission and basic feedback

class WritingModule {
    constructor() {
        this.currentPrompt = null;
        this.startTime = null;
    }
    
    start(level) {
        const prompts = window.writingPrompts[level] || window.writingPrompts.A1;
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const completed = user.progress.writingCompleted || 0;
        
        // Get next prompt
        this.currentPrompt = prompts[completed % prompts.length];
        this.startTime = new Date();
        this.render();
    }
    
    render() {
        const container = document.getElementById('writingModule');
        container.innerHTML = `
            <div class="writing-container">
                <div class="prompt-card">
                    <h4>📝 Sujet d'écriture</h4>
                    <p class="prompt-text">${this.currentPrompt.prompt}</p>
                    <div class="word-count-target">
                        <small>Objectif: ${this.currentPrompt.minWords}-${this.currentPrompt.maxWords} mots</small>
                    </div>
                </div>
                
                <div class="writing-area">
                    <textarea id="writingTextarea" class="form-control" rows="15" 
                              placeholder="Commencez à écrire ici..."></textarea>
                    <div class="writing-stats">
                        <span id="wordCount">0</span> mots
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary btn-lg" onclick="writingModule.submit()">
                        ✅ Soumettre
                    </button>
                    <button class="btn btn-secondary" onclick="backToDashboard()">
                        ← Retour
                    </button>
                </div>
            </div>
        `;
        
        // Add word counter
        document.getElementById('writingTextarea').addEventListener('input', (e) => {
            const words = e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length;
            document.getElementById('wordCount').textContent = words;
        });
    }
    
    submit() {
        const text = document.getElementById('writingTextarea').value;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        
        if (words < this.currentPrompt.minWords) {
            alert(`Trop court! Minimum ${this.currentPrompt.minWords} mots requis.`);
            return;
        }
        
        // Simple feedback (can be enhanced with AI later)
        const feedback = this.generateFeedback(text, words);
        this.saveAndShowResults(text, words, feedback);
    }
    
    generateFeedback(text, words) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const avgWordsPerSentence = Math.round(words / sentences);
        
        let feedback = {
            wordCount: words,
            sentenceCount: sentences,
            avgLength: avgWordsPerSentence,
            comments: []
        };
        
        if (words >= this.currentPrompt.minWords && words <= this.currentPrompt.maxWords) {
            feedback.comments.push("✅ Longueur appropriée");
        }
        
        if (avgWordsPerSentence > 20) {
            feedback.comments.push("💡 Vos phrases sont longues. Essayez de les raccourcir.");
        } else if (avgWordsPerSentence < 5) {
            feedback.comments.push("💡 Vos phrases sont très courtes. Essayez de les développer.");
        } else {
            feedback.comments.push("✅ Structure des phrases bien équilibrée");
        }
        
        // Check for accent marks (basic check)
        if (/[éèêëàâäôöùûüçî]/.test(text)) {
            feedback.comments.push("✅ Bonne utilisation des accents français");
        }
        
        return feedback;
    }
    
    saveAndShowResults(text, words, feedback) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        // Save to history
        const writings = JSON.parse(localStorage.getItem(`writings_${user.id}`) || '[]');
        writings.push({
            date: new Date().toISOString(),
            prompt: this.currentPrompt.prompt,
            text: text,
            words: words,
            feedback: feedback
        });
        localStorage.setItem(`writings_${user.id}`, JSON.stringify(writings));
        
        // Update progress
        user.progress.writingCompleted = (user.progress.writingCompleted || 0) + 1;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex >= 0) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        // Show results
        this.showResults(feedback);
    }
    
    showResults(feedback) {
        const container = document.getElementById('writingModule');
        container.innerHTML = `
            <div class="writing-results">
                <h3>✅ Texte Soumis!</h3>
                
                <div class="feedback-card">
                    <h5>📊 Statistiques</h5>
                    <ul>
                        <li>Nombre de mots: ${feedback.wordCount}</li>
                        <li>Nombre de phrases: ${feedback.sentenceCount}</li>
                        <li>Longueur moyenne: ${feedback.avgLength} mots/phrase</li>
                    </ul>
                </div>
                
                <div class="feedback-card">
                    <h5>💬 Commentaires</h5>
                    <ul>
                        ${feedback.comments.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="alert alert-info">
                    <strong>💡 Conseil:</strong> Relisez votre texte à voix haute pour détecter les erreurs!
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="writingModule.nextPrompt()">
                        Prochain Sujet →
                    </button>
                    <button class="btn btn-secondary" onclick="backToDashboard()">
                        ← Retour au Dashboard
                    </button>
                </div>
            </div>
        `;
    }
    
    nextPrompt() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.start(user.level || 'A1');
    }
}

// Listening Module

class ListeningModule {
    constructor() {
        this.currentAudio = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
    }
    
    start(level) {
        const audios = window.listeningContent[level] || window.listeningContent.A1;
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const completed = user.progress.listeningCompleted || 0;
        
        this.currentAudio = audios[completed % audios.length];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.render();
    }
    
    render() {
        const container = document.getElementById('listeningModule');
        container.innerHTML = `
            <div class="listening-container">
                <h4>🎧 ${this.currentAudio.title}</h4>
                
                <div class="audio-player">
                    <p class="audio-info">Durée: ${this.currentAudio.duration}s | Vitesse: ${this.currentAudio.speed}</p>
                    <div class="alert alert-info">
                        <strong>📝 Transcription:</strong><br>
                        ${this.currentAudio.transcript}
                    </div>
                    <p><em>Note: Audio TTS sera implémenté avec Web Speech API</em></p>
                    <button class="btn btn-primary mb-3" onclick="listeningModule.playAudio()">
                        🔊 Écouter l'audio
                    </button>
                </div>
                
                <div id="listeningQuestions">
                    ${this.renderQuestion()}
                </div>
            </div>
        `;
    }
    
    playAudio() {
        // Use Web Speech API for TTS
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentAudio.transcript);
            utterance.lang = 'fr-FR';
            utterance.rate = this.currentAudio.speed === 'slow' ? 0.7 : 1.0;
            speechSynthesis.speak(utterance);
        } else {
            alert('Web Speech API non supportée dans ce navigateur');
        }
    }
    
    renderQuestion() {
        if (this.currentQuestionIndex >= this.currentAudio.questions.length) {
            return this.renderResults();
        }
        
        const q = this.currentAudio.questions[this.currentQuestionIndex];
        return `
            <div class="question-card">
                <h5>${q.q}</h5>
                <div class="options">
                    ${q.options.map((opt, i) => `
                        <button class="btn btn-outline-primary btn-block mb-2" 
                                onclick="listeningModule.answer(${i})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    answer(index) {
        const q = this.currentAudio.questions[this.currentQuestionIndex];
        if (index === q.correct) {
            this.score++;
            alert('✅ Correct!');
        } else {
            alert('❌ Incorrect. La bonne réponse: ' + q.options[q.correct]);
        }
        
        this.currentQuestionIndex++;
        this.render();
    }
    
    renderResults() {
        const percentage = Math.round((this.score / this.currentAudio.questions.length) * 100);
        
        // Save progress
        const user = JSON.parse(localStorage.getItem('currentUser'));
        user.progress.listeningCompleted = (user.progress.listeningCompleted || 0) + 1;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex >= 0) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        return `
            <div class="results-card">
                <h3>Score: ${percentage}%</h3>
                <p>${this.score} / ${this.currentAudio.questions.length} correct</p>
                <button class="btn btn-primary" onclick="listeningModule.next()">
                    Suivant →
                </button>
                <button class="btn btn-secondary" onclick="backToDashboard()">
                    ← Retour
                </button>
            </div>
        `;
    }
    
    next() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.start(user.level || 'A1');
    }
}

// Speaking Module

class SpeakingModule {
    constructor() {
        this.currentPrompt = null;
        this.recording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
    }
    
    start(level) {
        const prompts = window.speakingPrompts[level] || window.speakingPrompts.A1;
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const completed = user.progress.speakingCompleted || 0;
        
        this.currentPrompt = prompts[completed % prompts.length];
        this.render();
    }
    
    render() {
        const container = document.getElementById('speakingModule');
        container.innerHTML = `
            <div class="speaking-container">
                <h4>🗣️ Exercice de Prononciation</h4>
                
                <div class="prompt-card">
                    <p class="prompt-text">${this.currentPrompt.prompt}</p>
                    <small>Durée suggérée: ${this.currentPrompt.duration} secondes</small>
                </div>
                
                <div class="recording-controls">
                    <button id="recordBtn" class="btn btn-danger btn-lg" onclick="speakingModule.toggleRecording()">
                        🎤 Commencer l'enregistrement
                    </button>
                    <div id="recordingStatus" class="mt-3"></div>
                    <audio id="playback" controls class="mt-3 hidden"></audio>
                </div>
                
                <div class="action-buttons mt-4">
                    <button class="btn btn-primary" onclick="speakingModule.save()">
                        ✅ Terminer
                    </button>
                    <button class="btn btn-secondary" onclick="backToDashboard()">
                        ← Retour
                    </button>
                </div>
            </div>
        `;
    }
    
    async toggleRecording() {
        if (!this.recording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];
                
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };
                
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const playback = document.getElementById('playback');
                    playback.src = audioUrl;
                    playback.classList.remove('hidden');
                };
                
                this.mediaRecorder.start();
                this.recording = true;
                document.getElementById('recordBtn').innerHTML = '⏹️ Arrêter l\'enregistrement';
                document.getElementById('recordingStatus').innerHTML = '<div class="alert alert-danger">🔴 Enregistrement en cours...</div>';
            } catch (error) {
                alert('Erreur: Impossible d\'accéder au microphone. ' + error.message);
            }
        } else {
            this.mediaRecorder.stop();
            this.recording = false;
            document.getElementById('recordBtn').innerHTML = '🎤 Commencer l\'enregistrement';
            document.getElementById('recordingStatus').innerHTML = '<div class="alert alert-success">✅ Enregistrement terminé! Écoutez votre enregistrement ci-dessous.</div>';
        }
    }
    
    save() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        user.progress.speakingCompleted = (user.progress.speakingCompleted || 0) + 1;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex >= 0) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        alert('✅ Excellent travail! Continuez à pratiquer votre prononciation!');
        backToDashboard();
    }
}

// Initialize modules
window.writingModule = new WritingModule();
window.listeningModule = new ListeningModule();
window.speakingModule = new SpeakingModule();

// Start functions
window.startWriting = function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('writingScreen').classList.remove('hidden');
    writingModule.start(user.level || 'A1');
};

window.startListening = function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('listeningScreen').classList.remove('hidden');
    listeningModule.start(user.level || 'A1');
};

window.startSpeaking = function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('speakingScreen').classList.remove('hidden');
    speakingModule.start(user.level || 'A1');
};
