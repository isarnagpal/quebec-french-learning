# AI Writing Feedback System - Implementation Plan
## Quebec French Learning App

### Overview
Provide intelligent, detailed feedback on user's French writing using AI (OpenAI GPT-4 or Anthropic Claude).

---

## Architecture

### Option 1: OpenAI GPT-4o (RECOMMENDED)
**Pros:**
- Excellent French language understanding
- Good at Quebec French nuances
- Affordable ($0.005/1K input tokens, $0.015/1K output)
- Easy API integration
- Structured output support

**Cons:**
- Requires API key
- Internet dependency

### Option 2: Anthropic Claude 3.5 Sonnet
**Pros:**
- Excellent reasoning
- Very accurate feedback
- Good French support

**Cons:**
- More expensive
- API key required

**RECOMMENDATION: OpenAI GPT-4o-mini for cost-effectiveness**

---

## Features to Implement

### 1. Grammar Checking
- Verb conjugation errors
- Agreement (gender, number)
- Tense usage
- Preposition errors

### 2. Vocabulary Suggestions
- More appropriate word choices
- Quebec-specific alternatives
- Register/formality level
- Synonyms for variety

### 3. Sentence Structure
- Word order issues
- Sentence complexity
- Flow and coherence
- Quebec vs France French

### 4. Quebec French Specific
- Identify anglicisms
- Suggest Quebec expressions
- Quebec vs International French differences
- Cultural appropriateness

### 5. Scoring System
- Overall quality score (0-100)
- Category breakdown:
  - Grammar: 0-100
  - Vocabulary: 0-100
  - Structure: 0-100
  - Quebec appropriateness: 0-100

### 6. Detailed Feedback
- Inline error highlighting
- Explanations in English
- Corrections with examples
- Improvement suggestions

---

## Implementation

### Files to Create:

1. **ai-service.js** - OpenAI/Claude API integration
2. **ai-config-template.js** - Config template
3. **writing-feedback-ui.js** - UI component
4. **prompts.js** - AI prompts for Quebec French
5. **AI-WRITING-DOCUMENTATION.md** - Documentation

### API Structure:

```javascript
// ai-service.js
class AIWritingService {
    async analyzeFrenchWriting(text, userLevel = 'A2') {
        const prompt = this.buildPrompt(text, userLevel);
        const response = await this.callOpenAI(prompt);
        return this.parseResponse(response);
    }
    
    buildPrompt(text, level) {
        return `
You are a Quebec French language teacher. Analyze this student writing:

Level: ${level}
Text: "${text}"

Provide detailed feedback in this JSON format:
{
    "overallScore": 0-100,
    "scores": {
        "grammar": 0-100,
        "vocabulary": 0-100,
        "structure": 0-100,
        "quebecAccuracy": 0-100
    },
    "errors": [
        {
            "type": "grammar|vocabulary|structure",
            "original": "text",
            "correction": "corrected text",
            "explanation": "Why this is wrong",
            "position": { "start": 0, "end": 5 }
        }
    ],
    "suggestions": [
        "Use more Quebec expressions",
        "Vary your vocabulary"
    ],
    "strengths": [
        "Good verb conjugation",
        "Appropriate tone"
    ],
    "correctedText": "Fully corrected version"
}

Focus on Quebec French specifics!
        `;
    }
}
```

### UI Component:

```javascript
// writing-feedback-ui.js
class WritingFeedbackUI {
    constructor(aiService) {
        this.aiService = aiService;
        this.currentText = '';
    }
    
    async analyzeFeedback() {
        // Show loading
        this.showLoading();
        
        // Get AI feedback
        const feedback = await this.aiService.analyzeFrenchWriting(
            this.currentText,
            this.userLevel
        );
        
        // Display results
        this.displayScore(feedback.overallScore);
        this.highlightErrors(feedback.errors);
        this.showSuggestions(feedback.suggestions);
        this.showCorrection(feedback.correctedText);
    }
}
```

---

## Prompt Engineering

### System Prompt:
```
You are an expert Quebec French language teacher with deep knowledge of:
- Quebec French vs International French differences
- Common anglicisms used in Quebec
- Quebec cultural context
- CEFR language levels (A1-C2)

Your role:
- Provide constructive, encouraging feedback
- Explain errors in simple English
- Suggest Quebec-specific alternatives
- Be culturally sensitive
- Adjust feedback to student level
```

### User Prompt Template:
```
Analyze this French text written by a [LEVEL] student:

"{TEXT}"

Provide:
1. Overall score (0-100) with justification
2. Detailed error analysis (grammar, vocab, structure)
3. Quebec French specific feedback
4. Suggestions for improvement
5. Corrected version
6. Positive reinforcement (what they did well)

Format: JSON
Language: Feedback in English, examples in French
Focus: Quebec French authenticity
```

---

## Cost Analysis

### OpenAI GPT-4o-mini Pricing:
- **Input**: $0.15/1M tokens (~$0.0001.5 per 1000 tokens)
- **Output**: $0.60/1M tokens (~$0.0006 per 1000 tokens)

### Typical Usage:
- Average writing: 100-500 words (~150-750 tokens)
- Prompt: ~500 tokens
- Response: ~1000 tokens
- **Cost per analysis: ~$0.0015 (less than 1 penny!)**

### Monthly Estimates:
- 100 analyses/month = $0.15
- 1000 analyses/month = $1.50
- 10,000 analyses/month = $15

**Conclusion**: Very affordable even for high usage!

---

## Features

### Basic Features (MVP):
- ✅ Text input area
- ✅ "Analyze" button
- ✅ Overall score display
- ✅ Error highlighting
- ✅ Corrected version
- ✅ Suggestions list

### Advanced Features (Future):
- Real-time feedback (as you type)
- Progress tracking over time
- Comparison with previous writings
- Difficulty level auto-detection
- Quebec vs France French toggle
- Voice feedback (TTS for corrections)

---

## Next Steps:

1. ✅ Research AI options (DONE)
2. ⏳ Implement ai-service.js
3. ⏳ Create prompt templates
4. ⏳ Build UI component
5. ⏳ Integrate with writing module
6. ⏳ Test with various writing samples
7. ⏳ Document API setup

**Estimated time: 4-6 hours**

---

## Security

**IMPORTANT**: Never commit API keys!

Add to `.gitignore`:
```
ai-config.js
openai-config.js
claude-config.js
```

Create template:
```javascript
// ai-config-template.js
const AI_CONFIG = {
    provider: "openai", // or "claude"
    openaiKey: "YOUR_KEY_HERE",
    model: "gpt-4o-mini",
    enabled: true
};
```

---

## Testing Plan

### Test Cases:
1. **Perfect writing** → High score, positive feedback
2. **Beginner errors** → Detailed corrections, encouragement
3. **Quebec vs France** → Identify differences, suggest Quebec alternatives
4. **Anglicisms** → Flag and correct (e.g., "weekend" → "fin de semaine")
5. **Complex structures** → Advanced feedback for intermediate+

### Sample Texts:
```javascript
const testCases = [
    {
        text: "Je suis allé au dépanneur pour acheter du lait.",
        level: "A2",
        expected: "High score, recognize Quebec term 'dépanneur'"
    },
    {
        text: "Je va au magasin hier.", // Errors
        level: "A1",
        expected: "Identify 'va' → 'vais', 'hier' with future"
    },
    {
        text: "On va faire un party cette fin de semaine!",
        level: "B1",
        expected: "Recognize Quebec expressions, suggest alternatives"
    }
];
```

---

Ready to implement!
