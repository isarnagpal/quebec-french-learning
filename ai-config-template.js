// AI Config Template for Quebec French Learning App
//
// INSTRUCTIONS:
// 1. Copy this file to "ai-config.js"
// 2. Add ai-config.js to .gitignore (DON'T COMMIT YOUR KEYS!)
// 3. Choose one of: OpenAI or Claude
// 4. Get API key and paste below
//
// OPTION 1: OpenAI (RECOMMENDED - most affordable)
// - Get key: https://platform.openai.com/api-keys
// - Model: gpt-4o-mini (fast + cheap)
// - Cost: ~$0.001 per analysis (~1000 analyses for $1)
// - Free trial: $5 credit for new accounts
//
// OPTION 2: Anthropic Claude (Higher quality, more expensive)
// - Get key: https://console.anthropic.com/
// - Model: claude-3-5-sonnet
// - Cost: ~$0.015 per analysis (~70 analyses for $1)
// - Free trial: Limited

const AI_CONFIG = {
    // Choose provider: "openai" or "claude"
    provider: "openai",
    
    // === OPENAI SETTINGS ===
    // Paste your OpenAI API key here
    openaiKey: "PASTE_YOUR_OPENAI_KEY_HERE",  // e.g., "sk-proj-..."
    
    // Model (don't change unless you know what you're doing)
    model: "gpt-4o-mini",  // Fast and affordable ($0.15/1M input tokens)
    // Other options: "gpt-4o", "gpt-4-turbo"
    
    // === CLAUDE SETTINGS (if using Claude) ===
    claudeKey: "PASTE_YOUR_CLAUDE_KEY_HERE",  // e.g., "sk-ant-..."
    // Model: claude-3-5-sonnet-20241022 (set in code)
    
    // Enable/disable AI features
    enabled: true,  // Set to false to disable temporarily
    
    // Advanced settings
    maxTokens: 2000,  // Maximum response length
    temperature: 0.3  // Lower = more consistent, Higher = more creative
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
} else {
    window.AI_CONFIG = AI_CONFIG;
}

// PRICING REFERENCE (as of 2024):
//
// OpenAI GPT-4o-mini:
// - Input: $0.150 / 1M tokens
// - Output: $0.600 / 1M tokens
// - Typical cost per analysis: $0.001 (1/10th of a cent!)
// - 100 writings = $0.10
// - 1000 writings = $1.00
//
// Claude 3.5 Sonnet:
// - Input: $3.00 / 1M tokens
// - Output: $15.00 / 1M tokens
// - Typical cost per analysis: $0.015 (1.5 cents)
// - 100 writings = $1.50
// - 1000 writings = $15.00
//
// RECOMMENDATION: Start with OpenAI gpt-4o-mini for cost-effectiveness!
