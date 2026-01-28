# Audio/TTS System Implementation Plan
## Quebec French Learning App

### Research: Best Quebec French TTS Options

#### Option 1: Azure TTS (RECOMMENDED) ⭐
**Pros:**
- Has **Quebec French voice "Sylvie"** (fr-CA-Sylvie)
- High quality neural voices
- Good pronunciation
- Pay-as-you-go pricing (~$15/million characters)
- Free tier: 0.5M characters/month
- REST API easy to integrate

**Cons:**
- Requires Azure account
- Network dependency

**Implementation:**
```javascript
// Azure TTS endpoint
const AZURE_TTS_KEY = "YOUR_KEY_HERE";
const AZURE_REGION = "canadacentral";
const AZURE_ENDPOINT = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

// Quebec French voice
const VOICE_NAME = "fr-CA-SylvieNeural";
```

#### Option 2: Google Cloud TTS
**Pros:**
- Has fr-CA (Canadian French) voices
- Good quality
- Generous free tier

**Cons:**
- No specific "Quebec" accent designation
- More generic Canadian French

#### Option 3: ElevenLabs
**Pros:**
- Highest quality
- Natural-sounding
- Can clone voices

**Cons:**
- Expensive ($5-330/month)
- Limited free tier
- May not have Quebec-specific French

**RECOMMENDATION: Azure TTS with Sylvie voice**

---

### Implementation Architecture

#### 1. Audio Cache System
- Store generated audio locally (IndexedDB)
- Reduce API calls
- Offline playback support

#### 2. Audio Player Component
```javascript
class QuebecAudioPlayer {
    constructor() {
        this.currentAudio = null;
        this.playbackRate = 1.0;
        this.cache = new AudioCache();
    }
    
    async playWord(french, english) {
        // Check cache first
        let audio = await this.cache.get(french);
        
        if (!audio) {
            // Generate via Azure TTS
            audio = await this.generateAudio(french);
            await this.cache.set(french, audio);
        }
        
        await this.play(audio);
    }
    
    setSpeed(rate) {
        // 0.5x, 0.75x, 1x, 1.25x
        this.playbackRate = rate;
    }
}
```

#### 3. Pronunciation Practice Feature
- Record user's pronunciation
- Compare with native (future: speech recognition)
- Visual feedback

---

### Files to Create:

1. **audio-service.js** - Azure TTS integration
2. **audio-cache.js** - IndexedDB caching
3. **audio-player.js** - Playback controls UI
4. **audio-config-template.js** - Config template (no keys committed!)

---

### API Keys Management

**IMPORTANT:** Never commit API keys to Git!

Create `.env` or `audio-config.js` (add to .gitignore):
```javascript
// audio-config.js (DO NOT COMMIT!)
const AUDIO_CONFIG = {
    azureKey: "YOUR_AZURE_KEY_HERE",
    azureRegion: "canadacentral"
};
```

Create template file for users:
```javascript
// audio-config-template.js (COMMIT THIS!)
// Copy this to audio-config.js and add your Azure keys
const AUDIO_CONFIG = {
    azureKey: "PASTE_YOUR_AZURE_SPEECH_KEY_HERE",
    azureRegion: "canadacentral" // or your region
};

// Get free Azure key at: https://azure.microsoft.com/services/cognitive-services/text-to-speech/
// Free tier: 0.5M characters/month
```

---

### Next Steps:

1. ✅ Research TTS options (DONE - Azure recommended)
2. ⏳ Implement audio-service.js with Azure TTS
3. ⏳ Create audio-cache.js for offline support
4. ⏳ Build audio-player.js UI component
5. ⏳ Integrate with vocabulary module
6. ⏳ Add pronunciation practice
7. ⏳ Test with Quebec accent quality

**Estimated time remaining: 3-4 hours**
