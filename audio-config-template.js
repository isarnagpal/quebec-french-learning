// Audio Config Template for Quebec French Learning App
// 
// INSTRUCTIONS:
// 1. Copy this file to "audio-config.js"
// 2. Add audio-config.js to .gitignore (DON'T COMMIT YOUR KEYS!)
// 3. Get free Azure Speech API key from:
//    https://azure.microsoft.com/services/cognitive-services/text-to-speech/
// 4. Free tier includes 0.5 million characters per month
//
// HOW TO GET AZURE SPEECH KEY:
// 1. Go to https://portal.azure.com
// 2. Create a free account (no credit card required for free tier)
// 3. Create a "Speech" resource
// 4. Go to "Keys and Endpoint"
// 5. Copy "KEY 1" and "Location/Region"
// 6. Paste below

const AUDIO_CONFIG = {
    // Your Azure Speech API Key (keep this secret!)
    azureKey: "PASTE_YOUR_KEY_HERE",  // e.g., "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
    
    // Azure region (find this in Azure Portal)
    azureRegion: "canadacentral",  // or your region: eastus, westus, etc.
    
    // Voice settings (don't change unless you know what you're doing)
    voiceName: "fr-CA-SylvieNeural",  // Quebec French voice
    
    // Enable audio system
    enabled: true  // Set to false to disable audio temporarily
};

// Export for use in the app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AUDIO_CONFIG;
} else {
    window.AUDIO_CONFIG = AUDIO_CONFIG;
}
