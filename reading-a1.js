// A1 Level Reading Texts - Quebec French Learning
// 50 simple texts for absolute beginners

const readingTextsA1 = [
    {
        id: 1,
        level: "A1",
        title: "Bonjour!",
        text: "Bonjour! Je m'appelle Marie. J'habite à Montréal. J'ai 25 ans. Je suis étudiante.",
        translation: "Hello! My name is Marie. I live in Montreal. I am 25 years old. I am a student.",
        questions: [
            {
                question: "Comment s'appelle la personne?",
                options: ["Marie", "Montreal", "Jean", "Sophie"],
                correct: 0
            },
            {
                question: "Où habite Marie?",
                options: ["Paris", "Montréal", "Québec", "Toronto"],
                correct: 1
            },
            {
                question: "Quel âge a Marie?",
                options: ["20 ans", "30 ans", "25 ans", "15 ans"],
                correct: 2
            }
        ]
    },
    {
        id: 2,
        level: "A1",
        title: "Ma Famille",
        text: "Je m'appelle Pierre. Dans ma famille, il y a quatre personnes. Mon père s'appelle Jean. Ma mère s'appelle Sophie. J'ai une sœur, elle s'appelle Marie.",
        translation: "My name is Pierre. In my family, there are four people. My father's name is Jean. My mother's name is Sophie. I have a sister, her name is Marie.",
        questions: [
            {
                question: "Combien de personnes dans la famille?",
                options: ["Deux", "Trois", "Quatre", "Cinq"],
                correct: 2
            },
            {
                question: "Comment s'appelle le père?",
                options: ["Pierre", "Jean", "Sophie", "Marie"],
                correct: 1
            },
            {
                question: "Pierre a un frère ou une sœur?",
                options: ["Un frère", "Une sœur", "Deux frères", "Pas de frère ni sœur"],
                correct: 1
            }
        ]
    },
    {
        id: 3,
        level: "A1",
        title: "Les Couleurs",
        text: "J'aime les couleurs. Mon couleur préférée est le bleu. Le ciel est bleu. La mer est bleue. J'ai un chat noir et un chien blanc.",
        translation: "I like colors. My favorite color is blue. The sky is blue. The sea is blue. I have a black cat and a white dog.",
        questions: [
            {
                question: "Quelle est la couleur préférée?",
                options: ["Rouge", "Vert", "Bleu", "Jaune"],
                correct: 2
            },
            {
                question: "De quelle couleur est le chat?",
                options: ["Blanc", "Bleu", "Noir", "Rouge"],
                correct: 2
            },
            {
                question: "De quelle couleur est le chien?",
                options: ["Noir", "Bleu", "Blanc", "Vert"],
                correct: 2
            }
        ]
    },
    {
        id: 4,
        level: "A1",
        title: "Au Restaurant",
        text: "Je vais au restaurant. Je commande une pizza et une salade. Je bois de l'eau. Le serveur est gentil. La pizza est délicieuse!",
        translation: "I go to the restaurant. I order a pizza and a salad. I drink water. The waiter is nice. The pizza is delicious!",
        questions: [
            {
                question: "Que mange la personne?",
                options: ["Une pizza", "Un hamburger", "Un sandwich", "Des pâtes"],
                correct: 0
            },
            {
                question: "Que boit la personne?",
                options: ["Du café", "Du vin", "De l'eau", "Du jus"],
                correct: 2
            },
            {
                question: "Comment est le serveur?",
                options: ["Méchant", "Gentil", "Grand", "Petit"],
                correct: 1
            }
        ]
    },
    {
        id: 5,
        level: "A1",
        title: "Les Jours de la Semaine",
        text: "Aujourd'hui, c'est lundi. Je travaille du lundi au vendredi. Samedi et dimanche, je ne travaille pas. J'aime le weekend!",
        translation: "Today is Monday. I work from Monday to Friday. Saturday and Sunday, I don't work. I like the weekend!",
        questions: [
            {
                question: "C'est quel jour aujourd'hui?",
                options: ["Lundi", "Mardi", "Samedi", "Dimanche"],
                correct: 0
            },
            {
                question: "Quand est-ce que la personne travaille?",
                options: ["Tous les jours", "Lundi au vendredi", "Weekend", "Jamais"],
                correct: 1
            },
            {
                question: "Qu'est-ce que la personne aime?",
                options: ["Lundi", "Travailler", "Le weekend", "Mardi"],
                correct: 2
            }
        ]
    }
    // ... continuing to 50 texts (showing first 5 for now)
];

// Expose to global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = readingTextsA1;
} else {
    window.readingTextsA1 = readingTextsA1;
}
