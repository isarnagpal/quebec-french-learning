// Achievement Definitions for Quebec French Learning App
// All available achievements with unlock conditions and rewards

const ACHIEVEMENTS = [
    // === BEGINNER ACHIEVEMENTS ===
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'beginner',
        xpReward: 50,
        condition: {
            type: 'first_lesson'
        }
    },
    
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Study before 9 AM',
        icon: '🌅',
        category: 'timing',
        xpReward: 25,
        condition: {
            type: 'early_bird'
        }
    },
    
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Study after 10 PM',
        icon: '🦉',
        category: 'timing',
        xpReward: 25,
        condition: {
            type: 'night_owl'
        }
    },
    
    // === STREAK ACHIEVEMENTS ===
    {
        id: 'consistent',
        name: 'Consistent',
        description: 'Study for 3 days in a row',
        icon: '🔥',
        category: 'streak',
        xpReward: 100,
        condition: {
            type: 'streak',
            days: 3
        }
    },
    
    {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Study for 7 days in a row',
        icon: '⭐',
        category: 'streak',
        xpReward: 250,
        condition: {
            type: 'streak',
            days: 7
        }
    },
    
    {
        id: 'committed',
        name: 'Committed',
        description: 'Study for 30 days in a row',
        icon: '💎',
        category: 'streak',
        xpReward: 1000,
        condition: {
            type: 'streak',
            days: 30
        }
    },
    
    {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Study for 100 days in a row',
        icon: '👑',
        category: 'streak',
        xpReward: 5000,
        condition: {
            type: 'streak',
            days: 100
        }
    },
    
    // === VOCABULARY ACHIEVEMENTS ===
    {
        id: 'word_explorer',
        name: 'Word Explorer',
        description: 'Learn 50 words',
        icon: '📝',
        category: 'vocabulary',
        xpReward: 100,
        condition: {
            type: 'words_learned',
            count: 50
        }
    },
    
    {
        id: 'century',
        name: 'Century',
        description: 'Learn 100 words',
        icon: '💯',
        category: 'vocabulary',
        xpReward: 200,
        condition: {
            type: 'words_learned',
            count: 100
        }
    },
    
    {
        id: 'word_master',
        name: 'Word Master',
        description: 'Learn 250 words',
        icon: '📚',
        category: 'vocabulary',
        xpReward: 500,
        condition: {
            type: 'words_learned',
            count: 250
        }
    },
    
    {
        id: 'polyglot',
        name: 'Polyglot',
        description: 'Learn 500 words',
        icon: '🌍',
        category: 'vocabulary',
        xpReward: 1000,
        condition: {
            type: 'words_learned',
            count: 500
        }
    },
    
    {
        id: 'vocabulary_master',
        name: 'Vocabulary Master',
        description: 'Learn 1000 words',
        icon: '🏆',
        category: 'vocabulary',
        xpReward: 2500,
        condition: {
            type: 'words_learned',
            count: 1000
        }
    },
    
    {
        id: 'word_god',
        name: 'Word God',
        description: 'Learn all 2000 words!',
        icon: '👑',
        category: 'vocabulary',
        xpReward: 10000,
        condition: {
            type: 'words_learned',
            count: 2000
        }
    },
    
    // === PERFECTION ACHIEVEMENTS ===
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Get 100% on 10 exercises',
        icon: '✨',
        category: 'performance',
        xpReward: 300,
        condition: {
            type: 'perfect_scores',
            count: 10
        }
    },
    
    {
        id: 'flawless',
        name: 'Flawless',
        description: 'Get 100% on 50 exercises',
        icon: '💫',
        category: 'performance',
        xpReward: 1000,
        condition: {
            type: 'perfect_scores',
            count: 50
        }
    },
    
    {
        id: 'untouchable',
        name: 'Untouchable',
        description: 'Get 100% on 100 exercises',
        icon: '🏅',
        category: 'performance',
        xpReward: 2500,
        condition: {
            type: 'perfect_scores',
            count: 100
        }
    },
    
    // === SPEED ACHIEVEMENTS ===
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a lesson in under 5 minutes',
        icon: '⚡',
        category: 'speed',
        xpReward: 200,
        condition: {
            type: 'fast_lesson',
            seconds: 300
        }
    },
    
    {
        id: 'lightning',
        name: 'Lightning',
        description: 'Complete a lesson in under 3 minutes',
        icon: '⚡⚡',
        category: 'speed',
        xpReward: 500,
        condition: {
            type: 'fast_lesson',
            seconds: 180
        }
    },
    
    // === TIME INVESTMENT ACHIEVEMENTS ===
    {
        id: 'dedicated_hour',
        name: 'Dedicated Hour',
        description: 'Study for 60 minutes in one day',
        icon: '⏰',
        category: 'time',
        xpReward: 300,
        condition: {
            type: 'marathon',
            minutes: 60
        }
    },
    
    {
        id: 'marathon',
        name: 'Marathon',
        description: 'Study for 120 minutes in one day',
        icon: '🎯',
        category: 'time',
        xpReward: 750,
        condition: {
            type: 'marathon',
            minutes: 120
        }
    },
    
    {
        id: 'ultra_marathon',
        name: 'Ultra Marathon',
        description: 'Study for 180 minutes in one day',
        icon: '💪',
        category: 'time',
        xpReward: 1500,
        condition: {
            type: 'marathon',
            minutes: 180
        }
    },
    
    // === LEVEL ACHIEVEMENTS ===
    {
        id: 'level_up_5',
        name: 'Rising Star',
        description: 'Reach level 5',
        icon: '⭐',
        category: 'level',
        xpReward: 100,
        condition: {
            type: 'level',
            level: 5
        }
    },
    
    {
        id: 'level_up_10',
        name: 'Level Up!',
        description: 'Reach level 10',
        icon: '🌟',
        category: 'level',
        xpReward: 250,
        condition: {
            type: 'level',
            level: 10
        }
    },
    
    {
        id: 'level_up_25',
        name: 'Expert',
        description: 'Reach level 25',
        icon: '💎',
        category: 'level',
        xpReward: 1000,
        condition: {
            type: 'level',
            level: 25
        }
    },
    
    {
        id: 'level_up_50',
        name: 'Master',
        description: 'Reach level 50',
        icon: '👑',
        category: 'level',
        xpReward: 5000,
        condition: {
            type: 'level',
            level: 50
        }
    },
    
    {
        id: 'level_up_100',
        name: 'Legend',
        description: 'Reach level 100',
        icon: '🏆',
        category: 'level',
        xpReward: 25000,
        condition: {
            type: 'level',
            level: 100
        }
    },
    
    // === QUEBEC-SPECIFIC ACHIEVEMENTS ===
    {
        id: 'french_fan',
        name: 'French Fan',
        description: 'Complete all A1 content',
        icon: '🇫🇷',
        category: 'completion',
        xpReward: 500,
        condition: {
            type: 'level_completion',
            level: 'A1'
        }
    },
    
    {
        id: 'intermediate',
        name: 'Intermediate',
        description: 'Complete all A2 content',
        icon: '📖',
        category: 'completion',
        xpReward: 750,
        condition: {
            type: 'level_completion',
            level: 'A2'
        }
    },
    
    {
        id: 'quebec_expert',
        name: 'Quebec Expert',
        description: 'Master Quebec-specific vocabulary',
        icon: '🍁',
        category: 'quebec',
        xpReward: 1500,
        condition: {
            type: 'quebec_words',
            count: 100
        }
    },
    
    {
        id: 'tabarnak',
        name: 'Vrai Québécois',
        description: 'Use 50 Quebec slang expressions',
        icon: '🎿',
        category: 'quebec',
        xpReward: 2000,
        condition: {
            type: 'quebec_slang',
            count: 50
        }
    }
];

// Achievement categories for filtering
const ACHIEVEMENT_CATEGORIES = {
    beginner: { name: 'Beginner', icon: '🎯' },
    timing: { name: 'Timing', icon: '⏰' },
    streak: { name: 'Streak', icon: '🔥' },
    vocabulary: { name: 'Vocabulary', icon: '📚' },
    performance: { name: 'Performance', icon: '✨' },
    speed: { name: 'Speed', icon: '⚡' },
    time: { name: 'Time Investment', icon: '⏱️' },
    level: { name: 'Leveling', icon: '⬆️' },
    completion: { name: 'Completion', icon: '✅' },
    quebec: { name: 'Quebec Special', icon: '🍁' }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES };
} else {
    window.ACHIEVEMENTS = ACHIEVEMENTS;
    window.ACHIEVEMENT_CATEGORIES = ACHIEVEMENT_CATEGORIES;
}
