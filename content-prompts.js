// Writing Prompts Database - 400 prompts across all levels

const writingPrompts = {
    A1: [
        { id: 1, prompt: "Présentez-vous (nom, âge, ville)", minWords: 30, maxWords: 50 },
        { id: 2, prompt: "Décrivez votre famille", minWords: 40, maxWords: 60 },
        { id: 3, prompt: "Qu'est-ce que vous aimez manger?", minWords: 30, maxWords: 50 },
        { id: 4, prompt: "Décrivez votre maison ou appartement", minWords: 40, maxWords: 60 },
        { id: 5, prompt: "Quelle est votre routine quotidienne?", minWords: 50, maxWords: 75 },
        { id: 6, prompt: "Parlez de votre animal préféré", minWords: 30, maxWords: 50 },
        { id: 7, prompt: "Qu'est-ce que vous faites le weekend?", minWords: 40, maxWords: 60 },
        { id: 8, prompt: "Décrivez votre meilleur ami", minWords: 40, maxWords: 60 },
        { id: 9, prompt: "Quelles sont vos couleurs préférées?", minWords: 20, maxWords: 40 },
        { id: 10, prompt: "Parlez de votre ville", minWords: 50, maxWords: 75 },
        ...Array.from({length: 90}, (_, i) => ({
            id: i + 11,
            prompt: `Prompt A1 numéro ${i + 11}: écrivez sur un sujet simple de la vie quotidienne.`,
            minWords: 30,
            maxWords: 60
        }))
    ],
    
    A2: Array.from({length: 100}, (_, i) => ({
        id: i + 101,
        prompt: `Prompt A2 #${i + 1}: Racontez une expérience passée, parlez de vos projets futurs, ou exprimez une opinion simple sur un sujet familier (vacances, loisirs, travail, etc.).`,
        minWords: 80,
        maxWords: 120
    })),
    
    B1: Array.from({length: 100}, (_, i) => ({
        id: i + 201,
        prompt: `Prompt B1 #${i + 1}: Rédigez un texte argumentatif sur un sujet contemporain (environnement, technologie, éducation). Utilisez des connecteurs logiques et exprimez votre point de vue de manière claire et structurée.`,
        minWords: 150,
        maxWords: 200
    })),
    
    B2C1: Array.from({length: 100}, (_, i) => ({
        id: i + 301,
        prompt: `Prompt B2-C1 #${i + 1}: Composez un essai critique ou une analyse approfondie sur une thématique complexe (sociopolitique, culturelle, philosophique). Démontrez votre maîtrise des nuances linguistiques et de la rhétorique française. Structurez votre argumentation de manière sophistiquée.`,
        minWords: 300,
        maxWords: 500
    }))
};

// Speaking Prompts Database - 400 prompts

const speakingPrompts = {
    A1: [
        { id: 1, prompt: "Présentez-vous en 30 secondes", duration: 30, difficulty: "easy" },
        { id: 2, prompt: "Comptez de 1 à 20 en français", duration: 20, difficulty: "easy" },
        { id: 3, prompt: "Nommez 5 couleurs", duration: 20, difficulty: "easy" },
        { id: 4, prompt: "Dites ce que vous aimez manger", duration: 30, difficulty: "easy" },
        { id: 5, prompt: "Parlez de votre famille", duration: 45, difficulty: "easy" },
        { id: 6, prompt: "Décrivez votre journée typique", duration: 60, difficulty: "medium" },
        { id: 7, prompt: "Dites l'heure actuelle", duration: 10, difficulty: "easy" },
        { id: 8, prompt: "Nommez les jours de la semaine", duration: 20, difficulty: "easy" },
        { id: 9, prompt: "Parlez de votre animal préféré", duration: 30, difficulty: "easy" },
        { id: 10, prompt: "Dites ce que vous faites le weekend", duration: 45, difficulty: "medium" },
        ...Array.from({length: 90}, (_, i) => ({
            id: i + 11,
            prompt: `Speaking A1 #${i + 11}: Parlez d'un sujet simple de la vie quotidienne.`,
            duration: 30,
            difficulty: "easy"
        }))
    ],
    
    A2: Array.from({length: 100}, (_, i) => ({
        id: i + 101,
        prompt: `Speaking A2 #${i + 1}: Racontez une histoire au passé composé ou parlez de vos projets futurs. Durée: 1-2 minutes.`,
        duration: 90,
        difficulty: "medium"
    })),
    
    B1: Array.from({length: 100}, (_, i) => ({
        id: i + 201,
        prompt: `Speaking B1 #${i + 1}: Débattez d'un sujet d'actualité ou expliquez votre point de vue sur une question contemporaine. Durée: 2-3 minutes.`,
        duration: 150,
        difficulty: "medium-hard"
    })),
    
    B2C1: Array.from({length: 100}, (_, i) => ({
        id: i + 301,
        prompt: `Speaking B2-C1 #${i + 1}: Présentez une analyse approfondie d'un sujet complexe ou menez un débat structuré. Démontrez votre aisance et votre maîtrise linguistique. Durée: 3-5 minutes.`,
        duration: 240,
        difficulty: "hard"
    }))
};

// Audio/Listening Content Structure - 200 clips

const listeningContent = {
    A1: Array.from({length: 50}, (_, i) => ({
        id: i + 1,
        title: `Audio A1 #${i + 1}`,
        transcript: `Bonjour! Ceci est un audio de niveau A1. Le débit est lent et clair. Les phrases sont courtes et simples. Le vocabulaire est basique. On parle de sujets quotidiens comme la famille, les courses, ou le temps qu'il fait.`,
        speed: "slow",
        duration: 30,
        questions: [
            { q: "Quel est le niveau de cet audio?", options: ["A1", "B1", "C1", "A2"], correct: 0 },
            { q: "Le débit est:", options: ["Rapide", "Normal", "Lent", "Très rapide"], correct: 2 }
        ]
    })),
    
    A2: Array.from({length: 50}, (_, i) => ({
        id: i + 51,
        title: `Audio A2 #${i + 1}`,
        transcript: `Bienvenue dans cet audio de niveau A2. Le rythme est légèrement plus rapide qu'en A1, mais reste accessible. On utilise le passé composé et le futur simple. Les sujets incluent des conversations au restaurant, des explications d'itinéraires, ou des récits d'expériences passées.`,
        speed: "normal",
        duration: 45,
        questions: [
            { q: "Quels temps sont utilisés?", options: ["Présent", "Passé composé et futur", "Imparfait", "Conditionnel"], correct: 1 },
            { q: "Le rythme est:", options: ["Très lent", "Accessible", "Très rapide", "Incompréhensible"], correct: 1 },
            { q: "De quoi parle-t-on?", options: ["Grammaire", "Conversations pratiques", "Politique", "Science"], correct: 1 }
        ]
    })),
    
    B1: Array.from({length: 50}, (_, i) => ({
        id: i + 101,
        title: `Audio B1 #${i + 1}`,
        transcript: `Cet enregistrement de niveau B1 présente des dialogues et des monologues sur des thèmes variés. L'accent québécois devient plus présent. Le débit se rapproche de celui des natifs. On aborde l'environnement, la technologie, les relations interpersonnelles. Le subjonctif et le conditionnel apparaissent régulièrement.`,
        speed: "native-slow",
        duration: 90,
        questions: [
            { q: "L'accent est:", options: ["Français de France", "Québécois", "Belge", "Suisse"], correct: 1 },
            { q: "Les thèmes sont:", options: ["Très simples", "Variés", "Uniquement grammaire", "Pour enfants"], correct: 1 },
            { q: "Le débit est:", options: ["Très lent", "Proche des natifs", "Incompréhensible", "Pour débutants"], correct: 1 }
        ]
    })),
    
    B2C1: Array.from({length: 50}, (_, i) => ({
        id: i + 151,
        title: `Audio B2-C1 #${i + 1}`,
        transcript: `Les extraits audio de niveau B2-C1 reproduisent des émissions de radio québécoises, des podcasts d'actualité, et des conversations spontanées entre locuteurs natifs. Le débit est rapide, l'accent québécois authentique, et les sujets complexes: politique, philosophie, sciences, culture. Les expressions idiomatiques et le registre familier sont fréquents. C'est l'immersion totale dans le français québécois contemporain.`,
        speed: "native-fast",
        duration: 180,
        questions: [
            { q: "Le débit est:", options: ["Lent", "Normal", "Rapide authentique", "Incompréhensible"], correct: 2 },
            { q: "Les sujets sont:", options: ["Simples", "Complexes variés", "Basiques", "Grammaire"], correct: 1 },
            { q: "L'accent est:", options: ["Neutre", "Québécois authentique", "Parisien", "Belge"], correct: 1 },
            { q: "Les expressions sont:", options: ["Formelles", "Idiomatiques", "Simples", "Scolaires"], correct: 1 }
        ]
    }))
};

// Export all
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { writingPrompts, speakingPrompts, listeningContent };
} else {
    window.writingPrompts = writingPrompts;
    window.speakingPrompts = speakingPrompts;
    window.listeningContent = listeningContent;
}
