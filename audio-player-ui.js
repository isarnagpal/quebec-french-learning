// Audio Player UI Component for Quebec French Learning
// Provides playback controls with speed adjustment

class AudioPlayerUI {
    constructor(audioService) {
        this.audioService = audioService;
        this.currentAudio = null;
        this.playbackRate = 1.0;
        this.isPlaying = false;
        
        this.createUI();
    }

    /**
     * Create audio player UI
     */
    createUI() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'audio-player-controls';
        this.container.innerHTML = `
            <div class="audio-controls">
                <button class="audio-btn play-btn" id="playAudioBtn" title="Play pronunciation">
                    🔊 Écouter
                </button>
                
                <div class="speed-control">
                    <label for="speedSelect">Vitesse:</label>
                    <select id="speedSelect" class="speed-select">
                        <option value="0.5">0.5x (Très lent)</option>
                        <option value="0.75">0.75x (Lent)</option>
                        <option value="1.0" selected>1.0x (Normal)</option>
                        <option value="1.25">1.25x (Rapide)</option>
                    </select>
                </div>

                <button class="audio-btn repeat-btn" id="repeatBtn" title="Repeat">
                    🔁
                </button>

                <div class="audio-status" id="audioStatus"></div>
            </div>

            <style>
                .audio-player-controls {
                    margin: 15px 0;
                    padding: 15px;
                    background: #f0f8ff;
                    border-radius: 8px;
                    border: 2px solid #4a90e2;
                }

                .audio-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .audio-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .play-btn {
                    background: #4a90e2;
                    color: white;
                    font-weight: bold;
                }

                .play-btn:hover {
                    background: #357abd;
                    transform: scale(1.05);
                }

                .play-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .repeat-btn {
                    background: #f0f0f0;
                    font-size: 20px;
                }

                .repeat-btn:hover {
                    background: #e0e0e0;
                }

                .speed-control {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .speed-select {
                    padding: 8px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    font-size: 14px;
                }

                .audio-status {
                    flex: 1;
                    text-align: right;
                    font-size: 14px;
                    color: #666;
                    min-width: 150px;
                }

                .audio-status.playing {
                    color: #4a90e2;
                    font-weight: bold;
                }

                .audio-status.error {
                    color: #e74c3c;
                }

                @media (max-width: 600px) {
                    .audio-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .audio-status {
                        text-align: center;
                        margin-top: 10px;
                    }
                }
            </style>
        `;

        return this.container;
    }

    /**
     * Attach to a DOM element
     * @param {string|HTMLElement} target - Target element or selector
     */
    attachTo(target) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        
        if (!element) {
            console.error('Target element not found');
            return;
        }

        element.appendChild(this.container);
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Play button
        const playBtn = this.container.querySelector('#playAudioBtn');
        playBtn.addEventListener('click', () => this.playCurrentWord());

        // Repeat button
        const repeatBtn = this.container.querySelector('#repeatBtn');
        repeatBtn.addEventListener('click', () => this.playCurrentWord());

        // Speed control
        const speedSelect = this.container.querySelector('#speedSelect');
        speedSelect.addEventListener('change', (e) => {
            this.playbackRate = parseFloat(e.target.value);
            this.updateStatus(`Vitesse: ${e.target.value}x`);
        });
    }

    /**
     * Set the word to play
     * @param {string} french - French word
     * @param {string} english - English translation (optional)
     */
    setWord(french, english = '') {
        this.currentWord = french;
        this.currentTranslation = english;
    }

    /**
     * Play current word
     */
    async playCurrentWord() {
        if (!this.currentWord) {
            this.updateStatus('Aucun mot sélectionné', 'error');
            return;
        }

        if (this.isPlaying) {
            this.updateStatus('Lecture en cours...', 'playing');
            return;
        }

        try {
            this.isPlaying = true;
            this.updateStatus('Lecture...', 'playing');
            this.disableButton(true);

            await this.audioService.playWord(this.currentWord, this.playbackRate);
            
            this.updateStatus('✓ Terminé');
            
        } catch (error) {
            console.error('Error playing audio:', error);
            this.updateStatus('❌ Erreur audio', 'error');
            
            // Show helpful error message if API key is missing
            if (error.message.includes('not configured')) {
                alert('Configuration audio requise!\n\nVeuillez configurer votre clé API Azure dans audio-config.js\n\nInstructions dans audio-config-template.js');
            }
            
        } finally {
            this.isPlaying = false;
            this.disableButton(false);
        }
    }

    /**
     * Update status message
     */
    updateStatus(message, type = '') {
        const statusEl = this.container.querySelector('#audioStatus');
        statusEl.textContent = message;
        statusEl.className = 'audio-status';
        
        if (type) {
            statusEl.classList.add(type);
        }

        // Clear status after 3 seconds
        if (!type || type !== 'error') {
            setTimeout(() => {
                statusEl.textContent = '';
            }, 3000);
        }
    }

    /**
     * Disable/enable play button
     */
    disableButton(disabled) {
        const playBtn = this.container.querySelector('#playAudioBtn');
        playBtn.disabled = disabled;
    }

    /**
     * Show cache stats
     */
    async showCacheStats() {
        try {
            const stats = await this.audioService.getCacheStats();
            this.updateStatus(`Cache: ${stats.count} audios`);
        } catch (error) {
            console.error('Error getting cache stats:', error);
        }
    }

    /**
     * Clear audio cache
     */
    async clearCache() {
        if (confirm('Effacer tous les audios en cache?')) {
            try {
                await this.audioService.clearCache();
                this.updateStatus('Cache effacé ✓');
            } catch (error) {
                console.error('Error clearing cache:', error);
                this.updateStatus('Erreur', 'error');
            }
        }
    }
}

// Vocabulary integration: Add audio button to vocabulary cards
function addAudioToVocabulary(audioPlayerUI) {
    // Add play button to each vocabulary card
    document.querySelectorAll('.vocab-card').forEach(card => {
        const french = card.dataset.french;
        const english = card.dataset.english;

        // Create audio button
        const audioBtn = document.createElement('button');
        audioBtn.className = 'vocab-audio-btn';
        audioBtn.innerHTML = '🔊';
        audioBtn.title = 'Écouter la prononciation';
        
        audioBtn.addEventListener('click', async () => {
            try {
                audioPlayerUI.setWord(french, english);
                await audioPlayerUI.playCurrentWord();
            } catch (error) {
                console.error('Error playing word:', error);
            }
        });

        // Add to card
        const cardHeader = card.querySelector('.vocab-word');
        if (cardHeader) {
            cardHeader.appendChild(audioBtn);
        }
    });
}

// Initialize audio system
async function initializeAudioSystem() {
    try {
        // Check if config exists
        if (typeof AUDIO_CONFIG === 'undefined') {
            console.warn('Audio config not found. Please create audio-config.js from template.');
            return null;
        }

        // Create audio service
        const audioService = new QuebecAudioService(AUDIO_CONFIG);
        
        // Create UI
        const audioPlayerUI = new AudioPlayerUI(audioService);
        
        // Attach to page
        const playerContainer = document.getElementById('audioPlayerContainer');
        if (playerContainer) {
            audioPlayerUI.attachTo(playerContainer);
        }

        // Add to vocabulary cards
        addAudioToVocabulary(audioPlayerUI);

        console.log('Audio system initialized successfully!');
        return { audioService, audioPlayerUI };
        
    } catch (error) {
        console.error('Error initializing audio system:', error);
        return null;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioPlayerUI, addAudioToVocabulary, initializeAudioSystem };
} else {
    window.AudioPlayerUI = AudioPlayerUI;
    window.addAudioToVocabulary = addAudioToVocabulary;
    window.initializeAudioSystem = initializeAudioSystem;
}
