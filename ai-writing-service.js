// AI Writing Feedback Service for Quebec French Learning
// Supports OpenAI GPT-4 and Anthropic Claude

class AIWritingService {
    constructor(config) {
        this.provider = config?.provider || 'openai';
        this.openaiKey = config?.openaiKey || null;
        this.claudeKey = config?.claudeKey || null;
        this.model = config?.model || 'gpt-4o-mini'; // Cost-effective model
        this.enabled = !!(this.openaiKey || this.claudeKey);
        this.maxTokens = 2000;
    }

    /**
     * Main method: Analyze French writing
     * @param {string} text - Student's French text
     * @param {string} userLevel - CEFR level (A1, A2, B1, B2, C1)
     * @returns {Promise<Object>} Detailed feedback
     */
    async analyzeFrenchWriting(text, userLevel = 'A2') {
        if (!this.enabled) {
            throw new Error('AI service not configured. Please add API key to ai-config.js');
        }

        if (!text || text.trim().length < 10) {
            throw new Error('Text too short. Please write at least 10 characters.');
        }

        try {
            const prompt = this.buildPrompt(text, userLevel);
            
            let response;
            if (this.provider === 'openai') {
                response = await this.callOpenAI(prompt);
            } else if (this.provider === 'claude') {
                response = await this.callClaude(prompt);
            } else {
                throw new Error(`Unknown AI provider: ${this.provider}`);
            }

            return this.parseResponse(response);

        } catch (error) {
            console.error('Error analyzing writing:', error);
            throw error;
        }
    }

    /**
     * Build the AI prompt for Quebec French analysis
     */
    buildPrompt(text, level) {
        const systemPrompt = `You are an expert Quebec French language teacher with deep knowledge of:
- Quebec French vs International French differences
- Common Quebec expressions and slang
- Anglicisms used in Quebec
- Quebec cultural context
- CEFR language levels (A1-C2)

Your role:
- Provide constructive, encouraging feedback
- Explain errors in simple English
- Suggest Quebec-specific alternatives when appropriate
- Be culturally sensitive
- Adjust feedback complexity to student level
- Always respond in valid JSON format`;

        const userPrompt = `Analyze this French text written by a ${level} level student:

"${text}"

Provide detailed feedback in this EXACT JSON format:
{
    "overallScore": 85,
    "scores": {
        "grammar": 80,
        "vocabulary": 85,
        "structure": 90,
        "quebecAccuracy": 85
    },
    "errors": [
        {
            "type": "grammar",
            "original": "je va",
            "correction": "je vais",
            "explanation": "Verb 'aller' conjugates to 'vais' with 'je' (first person singular)",
            "position": { "start": 0, "end": 5 },
            "severity": "high"
        }
    ],
    "suggestions": [
        "Consider using 'fin de semaine' instead of 'weekend' for more authentic Quebec French",
        "Try varying sentence structure for more natural flow"
    ],
    "strengths": [
        "Good use of passé composé",
        "Appropriate use of Quebec expression 'dépanneur'"
    ],
    "correctedText": "Corrected version with all errors fixed",
    "quebecNotes": [
        "You used 'dépanneur' correctly - this is a Quebec-specific term!",
        "Consider saying 'fin de semaine' instead of 'weekend'"
    ],
    "encouragement": "Great effort! Your verb conjugation is improving."
}

Important:
1. Identify ALL grammar, vocabulary, and structure errors
2. Flag France French vs Quebec French differences
3. Suggest Quebec alternatives for anglicisms
4. Be specific with error locations
5. Provide encouragement appropriate to their level
6. Return ONLY valid JSON, no additional text
7. Score honestly but encouragingly`;

        return { systemPrompt, userPrompt };
    }

    /**
     * Call OpenAI API
     */
    async callOpenAI(prompt) {
        const endpoint = 'https://api.openai.com/v1/chat/completions';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openaiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: prompt.systemPrompt },
                    { role: 'user', content: prompt.userPrompt }
                ],
                max_tokens: this.maxTokens,
                temperature: 0.3, // Lower for more consistent feedback
                response_format: { type: "json_object" } // Enforce JSON
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(error)}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Call Anthropic Claude API
     */
    async callClaude(prompt) {
        const endpoint = 'https://api.anthropic.com/v1/messages';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.claudeKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: this.maxTokens,
                system: prompt.systemPrompt,
                messages: [
                    { role: 'user', content: prompt.userPrompt }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(error)}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    /**
     * Parse AI response into structured format
     */
    parseResponse(responseText) {
        try {
            const feedback = JSON.parse(responseText);
            
            // Validate required fields
            if (!feedback.overallScore || !feedback.scores || !feedback.errors) {
                throw new Error('Invalid response format from AI');
            }

            // Ensure all scores are 0-100
            feedback.overallScore = Math.max(0, Math.min(100, feedback.overallScore));
            for (const key in feedback.scores) {
                feedback.scores[key] = Math.max(0, Math.min(100, feedback.scores[key]));
            }

            // Add metadata
            feedback.timestamp = Date.now();
            feedback.provider = this.provider;
            feedback.model = this.model;

            return feedback;

        } catch (error) {
            console.error('Error parsing AI response:', error);
            console.error('Response text:', responseText);
            throw new Error('Failed to parse AI response. Please try again.');
        }
    }

    /**
     * Get quick score for a text (no detailed feedback)
     * Faster and cheaper for progress tracking
     */
    async quickScore(text, level = 'A2') {
        const prompt = {
            systemPrompt: "You are a Quebec French teacher. Provide only a numerical score (0-100) for this text.",
            userPrompt: `Score this ${level} level French text (0-100 only): "${text}"`
        };

        try {
            const response = await this.callOpenAI(prompt);
            const score = parseInt(response.trim());
            return isNaN(score) ? 50 : Math.max(0, Math.min(100, score));
        } catch (error) {
            console.error('Error getting quick score:', error);
            return null;
        }
    }

    /**
     * Check if service is available
     */
    isAvailable() {
        return this.enabled;
    }

    /**
     * Estimate cost for a text
     * Based on OpenAI gpt-4o-mini pricing
     */
    estimateCost(text) {
        // Rough estimate: ~1.3 tokens per word
        const inputTokens = (text.split(' ').length * 1.3) + 500; // +500 for prompt
        const outputTokens = 1000; // Average response
        
        // GPT-4o-mini pricing: $0.15/1M input, $0.60/1M output
        const inputCost = (inputTokens / 1000000) * 0.15;
        const outputCost = (outputTokens / 1000000) * 0.60;
        
        return {
            inputTokens: Math.round(inputTokens),
            outputTokens: outputTokens,
            totalCost: (inputCost + outputCost).toFixed(6),
            costInCents: ((inputCost + outputCost) * 100).toFixed(2)
        };
    }
}

// Feedback History Manager
class FeedbackHistoryService {
    constructor() {
        this.storageKey = 'quebecFrenchWritingHistory';
    }

    /**
     * Save feedback to history
     */
    saveFeedback(text, feedback) {
        const history = this.getHistory();
        
        const entry = {
            id: Date.now(),
            text: text,
            feedback: feedback,
            timestamp: Date.now(),
            level: feedback.level || 'A2'
        };

        history.unshift(entry); // Add to beginning
        
        // Keep only last 50 entries
        if (history.length > 50) {
            history.splice(50);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(history));
        
        return entry;
    }

    /**
     * Get all feedback history
     */
    getHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    /**
     * Get feedback by ID
     */
    getFeedback(id) {
        const history = this.getHistory();
        return history.find(entry => entry.id === id);
    }

    /**
     * Delete feedback entry
     */
    deleteFeedback(id) {
        const history = this.getHistory();
        const filtered = history.filter(entry => entry.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    }

    /**
     * Clear all history
     */
    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Get statistics
     */
    getStats() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            return {
                count: 0,
                averageScore: 0,
                improvement: 0
            };
        }

        const scores = history.map(e => e.feedback.overallScore);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        // Calculate improvement (last 5 vs first 5)
        const recent = scores.slice(0, Math.min(5, scores.length));
        const old = scores.slice(-Math.min(5, scores.length));
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const oldAvg = old.reduce((a, b) => a + b, 0) / old.length;
        const improvement = recentAvg - oldAvg;

        return {
            count: history.length,
            averageScore: Math.round(avgScore),
            improvement: Math.round(improvement),
            recentAverage: Math.round(recentAvg),
            oldAverage: Math.round(oldAvg)
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIWritingService, FeedbackHistoryService };
} else {
    window.AIWritingService = AIWritingService;
    window.FeedbackHistoryService = FeedbackHistoryService;
}
