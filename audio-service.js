// Audio Service for Quebec French Learning App
// Uses Azure Cognitive Services TTS with Quebec French voice (Sylvie)

class QuebecAudioService {
    constructor(config) {
        this.azureKey = config?.azureKey || null;
        this.azureRegion = config?.azureRegion || 'canadacentral';
        this.voiceName = 'fr-CA-SylvieNeural'; // Quebec French voice
        this.cache = new AudioCacheService();
        this.enabled = !!this.azureKey;
    }

    /**
     * Get Azure TTS endpoint
     */
    getEndpoint() {
        return `https://${this.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    }

    /**
     * Generate SSML for Azure TTS
     * @param {string} text - Text to convert to speech
     * @param {number} rate - Speech rate (0.5 to 2.0)
     */
    generateSSML(text, rate = 1.0) {
        // Convert rate to percentage (1.0 = 100%, 0.5 = 50%, etc.)
        const ratePercent = Math.round(rate * 100);
        
        return `
            <speak version='1.0' xml:lang='fr-CA'>
                <voice xml:lang='fr-CA' name='${this.voiceName}'>
                    <prosody rate='${ratePercent}%'>
                        ${text}
                    </prosody>
                </voice>
            </speak>
        `.trim();
    }

    /**
     * Generate audio from Azure TTS API
     * @param {string} text - Text to speak
     * @param {number} rate - Speech rate
     * @returns {Promise<Blob>} Audio blob
     */
    async generateAudio(text, rate = 1.0) {
        if (!this.enabled) {
            throw new Error('Azure TTS not configured. Please add your API key to audio-config.js');
        }

        const ssml = this.generateSSML(text, rate);
        const endpoint = this.getEndpoint();

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': this.azureKey,
                    'Content-Type': 'application/ssml+xml',
                    'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
                },
                body: ssml
            });

            if (!response.ok) {
                throw new Error(`Azure TTS API error: ${response.status} ${response.statusText}`);
            }

            const audioBlob = await response.blob();
            return audioBlob;

        } catch (error) {
            console.error('Error generating audio:', error);
            throw error;
        }
    }

    /**
     * Play audio for a word (with caching)
     * @param {string} french - French word
     * @param {number} rate - Speech rate
     * @returns {Promise<Audio>} Audio element
     */
    async playWord(french, rate = 1.0) {
        try {
            // Create cache key including rate
            const cacheKey = `${french}_${rate}`;
            
            // Check cache first
            let audioBlob = await this.cache.get(cacheKey);
            
            if (!audioBlob) {
                console.log(`Generating audio for: ${french}`);
                audioBlob = await this.generateAudio(french, rate);
                await this.cache.set(cacheKey, audioBlob);
            } else {
                console.log(`Using cached audio for: ${french}`);
            }

            // Create audio element and play
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            await audio.play();
            
            // Clean up URL when done
            audio.addEventListener('ended', () => {
                URL.revokeObjectURL(audioUrl);
            });

            return audio;

        } catch (error) {
            console.error(`Error playing audio for "${french}":`, error);
            throw error;
        }
    }

    /**
     * Play audio for a sentence
     * @param {string} sentence - French sentence
     * @param {number} rate - Speech rate
     * @returns {Promise<Audio>}
     */
    async playSentence(sentence, rate = 1.0) {
        return await this.playWord(sentence, rate);
    }

    /**
     * Pre-cache audio for multiple words (for offline use)
     * @param {Array<string>} words - List of French words
     * @param {Function} progressCallback - Progress callback (current, total)
     */
    async precacheWords(words, progressCallback = null) {
        console.log(`Pre-caching ${words.length} words...`);
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            
            try {
                // Check if already cached
                const cached = await this.cache.get(word);
                if (!cached) {
                    await this.generateAudio(word, 1.0);
                    await this.cache.set(`${word}_1.0`, audioBlob);
                }
                
                if (progressCallback) {
                    progressCallback(i + 1, words.length);
                }
                
                // Small delay to avoid rate limiting
                await this.delay(100);
                
            } catch (error) {
                console.error(`Failed to cache "${word}":`, error);
            }
        }
        
        console.log('Pre-caching complete!');
    }

    /**
     * Clear audio cache
     */
    async clearCache() {
        await this.cache.clear();
        console.log('Audio cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {Promise<Object>}
     */
    async getCacheStats() {
        return await this.cache.getStats();
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Audio Cache Service using IndexedDB
class AudioCacheService {
    constructor() {
        this.dbName = 'QuebecFrenchAudio';
        this.storeName = 'audioCache';
        this.dbVersion = 1;
        this.db = null;
    }

    /**
     * Initialize IndexedDB
     */
    async init() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    /**
     * Get audio from cache
     * @param {string} key - Cache key
     * @returns {Promise<Blob|null>}
     */
    async get(key) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result;
                if (result && result.blob) {
                    resolve(result.blob);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Save audio to cache
     * @param {string} key - Cache key
     * @param {Blob} blob - Audio blob
     */
    async set(key, blob) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const item = {
                key: key,
                blob: blob,
                timestamp: Date.now()
            };

            const request = store.put(item);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear all cached audio
     */
    async clear() {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get cache statistics
     */
    async getStats() {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.count();

            request.onsuccess = () => {
                resolve({
                    count: request.result,
                    dbName: this.dbName
                });
            };

            request.onerror = () => reject(request.error);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuebecAudioService, AudioCacheService };
} else {
    window.QuebecAudioService = QuebecAudioService;
    window.AudioCacheService = AudioCacheService;
}
