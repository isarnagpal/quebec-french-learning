"""
Generate remaining 1000 words for Quebec French vocabulary (B1: 500, B2-C1: 500)
This script creates authentic French vocabulary with Quebec-specific terms
"""

# B1 Level - 500 Upper-Intermediate Words
b1_vocab = []
start_id = 1001

# B1 Categories and words
b1_categories = {
    "abstract_nouns": [
        ("l'opinion", "opinion", "Quelle est ton opinion?"),
        ("le jugement", "judgment", "Ne porte pas de jugement."),
        ("la décision", "decision", "C'est une bonne décision."),
        ("le choix", "choice", "Tu as le choix."),
        ("la volonté", "will/willingness", "Il a de la volonté."),
        ("l'intention", "intention", "Quelle est ton intention?"),
        ("le but", "goal/aim", "Mon but est de réussir."),
        ("l'objectif", "objective", "Atteindre ses objectifs."),
        ("le rêve", "dream", "Réalise tes rêves!"),
        ("l'espoir", "hope", "J'ai espoir."),
        ("la foi", "faith", "Avoir foi en l'avenir."),
        ("la confiance", "confidence/trust", "Il a confiance en lui."),
        ("le doute", "doubt", "J'ai des doutes."),
        ("la certitude", "certainty", "C'est une certitude."),
        ("la vérité", "truth", "Dis la vérité!"),
        ("le mensonge", "lie", "C'est un mensonge."),
        ("la justice", "justice", "La justice pour tous."),
        ("l'injustice", "injustice", "C'est une injustice!"),
        ("la liberté", "freedom", "La liberté d'expression."),
        ("l'égalité", "equality", "L'égalité des chances."),
    ],
    "complex_verbs": [
        ("augmenter", "to increase", "Les prix augmentent."),
        ("diminuer", "to decrease", "La température diminue."),
        ("améliorer", "to improve", "Il faut améliorer ça."),
        ("empirer", "to worsen", "La situation empire."),
        ("développer", "to develop", "Développer ses compétences."),
        ("progresser", "to progress", "Tu progresses bien!"),
        ("régresser", "to regress", "Ne pas régresser."),
        ("évoluer", "to evolve", "Le monde évolue."),
        ("transformer", "to transform", "Transformer sa vie."),
        ("modifier", "to modify", "Modifier le plan."),
        ("adapter", "to adapt", "S'adapter au changement."),
        ("ajuster", "to adjust", "Ajuster les paramètres."),
        ("maintenir", "to maintain", "Maintenir l'ordre."),
        ("conserver", "to preserve", "Conserver la nature."),
        ("protéger", "to protect", "Protéger l'environnement."),
        ("défendre", "to defend", "Défendre ses droits."),
        ("attaquer", "to attack", "Ne pas attaquer."),
        ("critiquer", "to criticize", "Critiquer constructivement."),
        ("encourager", "to encourage", "Encourager les efforts."),
        ("décourager", "to discourage", "Ne pas se décourager."),
    ],
    "professional_vocab": [
        ("le contrat", "contract", "Signer un contrat."),
        ("l'entreprise", "company", "Une grande entreprise."),
        ("la société", "company/society", "Une société québécoise."),
        ("la compagnie", "company", "La compagnie embauche.", "Quebec term"),
        ("le projet", "project", "Gérer un projet."),
        ("la tâche", "task", "Accomplir ses tâches."),
        ("la responsabilité", "responsibility", "Avoir des responsabilités."),
        ("la réunion", "meeting", "Une réunion importante."),
        ("le meeting", "meeting", "On a un meeting.", "Quebec anglicism"),
        ("la formation", "training", "Suivre une formation."),
        ("le stage", "internship", "Faire un stage."),
        ("l'expérience", "experience", "Avoir de l'expérience."),
        ("la compétence", "skill/competence", "Développer ses compétences."),
        ("la qualification", "qualification", "Les qualifications requises."),
        ("le diplôme", "diploma", "Un diplôme universitaire."),
        ("la carrière", "career", "Une belle carrière."),
        ("l'avancement", "promotion/advancement", "Un avancement professionnel."),
        ("la promotion", "promotion", "Obtenir une promotion."),
        ("l'augmentation", "raise", "Demander une augmentation."),
        ("le syndicat", "union", "Le syndicat des travailleurs."),
    ],
    "quebec_administrative": [
        ("la SAAQ", "Quebec auto insurance board", "Renouveler à la SAAQ.", "Quebec ONLY!"),
        ("la RAMQ", "Quebec health insurance", "Carte de la RAMQ.", "Quebec ONLY!"),
        ("Revenu Québec", "Quebec tax agency", "Payer ses impôts à Revenu Québec.", "Quebec ONLY!"),
        ("l'assurance-emploi", "employment insurance", "Demander l'assurance-emploi."),
        ("le chômage", "unemployment", "Être au chômage."),
        ("la retraite", "retirement", "Prendre sa retraite."),
        ("la pension", "pension", "Une pension de retraite."),
        ("le REER", "RRSP", "Cotiser à un REER.", "Quebec/Canada"),
        ("le CELI", "TFSA", "Investir dans un CELI.", "Quebec/Canada"),
        ("la TPS", "GST", "Payer la TPS.", "Canada"),
        ("la TVQ", "Quebec sales tax", "TPS et TVQ.", "Quebec ONLY!"),
        ("le permis de conduire", "driver's license", "Renouveler son permis."),
        ("l'immatriculation", "registration", "L'immatriculation du véhicule."),
        ("la plaque", "license plate", "Une nouvelle plaque.", "Quebec term"),
        ("le bail", "lease", "Signer un bail."),
        ("le locataire", "tenant", "Je suis locataire."),
        ("le propriétaire", "owner/landlord", "Le propriétaire de l'immeuble."),
        ("le loyer", "rent", "Payer le loyer."),
        ("la caution", "security deposit", "Une caution d'un mois."),
        ("l'hypothèque", "mortgage", "Avoir une hypothèque."),
    ]
}

# Generate B1 vocabulary with proper numbering
word_id = start_id
for category, words in b1_categories.items():
    for word_data in words:
        if len(word_data) == 3:
            french, english, example = word_data
            quebec_note = ""
        else:
            french, english, example, quebec_note = word_data
        
        b1_vocab.append({
            "id": word_id,
            "french": french,
            "english": english,
            "category": category.replace("_", " "),
            "example": example,
            "quebecNote": quebec_note
        })
        word_id += 1

print(f"B1 words generated so far: {len(b1_vocab)}")
print(f"Need {500 - len(b1_vocab)} more B1 words")

# B2-C1 Level - 500 Advanced Words
b2_c1_vocab = []
start_id = 1501

b2_c1_categories = {
    "advanced_abstract": [
        ("la philosophie", "philosophy", "La philosophie de vie."),
        ("la sagesse", "wisdom", "La sagesse vient avec l'âge."),
        ("la conscience", "consciousness/conscience", "Avoir bonne conscience."),
        ("la morale", "morals/ethics", "Questions de morale."),
        ("l'éthique", "ethics", "L'éthique professionnelle."),
        ("le principe", "principle", "Respecter ses principes."),
        ("la valeur", "value", "Les valeurs familiales."),
        ("la dignité", "dignity", "Préserver sa dignité."),
        ("l'honneur", "honor", "Question d'honneur."),
        ("la fierté", "pride", "Avoir de la fierté."),
        ("l'humilité", "humility", "Faire preuve d'humilité."),
        ("la modestie", "modesty", "La modestie est une qualité."),
        ("l'arrogance", "arrogance", "Son arrogance est insupportable."),
        ("la vanité", "vanity", "La vanité mène à l'échec."),
        ("l'orgueil", "pride (negative)", "L'orgueil précède la chute."),
        ("la compassion", "compassion", "Avoir de la compassion."),
        ("l'empathie", "empathy", "Développer son empathie."),
        ("la sympathie", "sympathy", "Exprimer sa sympathie."),
        ("l'antipathie", "antipathy", "Ressentir de l'antipathie."),
        ("l'indifférence", "indifference", "L'indifférence est pire."),
    ],
    "literary_verbs": [
        ("contempler", "to contemplate", "Contempler le paysage."),
        ("méditer", "to meditate", "Méditer sur la vie."),
        ("réfléchir", "to reflect/think", "Réfléchir avant d'agir."),
        ("considérer", "to consider", "Considérer les options."),
        ("envisager", "to envision/consider", "Envisager l'avenir."),
        ("prévoir", "to foresee/plan", "Prévoir les problèmes."),
        ("anticiper", "to anticipate", "Anticiper les besoins."),
        ("s'attendre à", "to expect", "Je m'y attendais."),
        ("soupçonner", "to suspect", "Je le soupçonne."),
        ("présumer", "to presume", "Ne pas présumer."),
        ("supposer", "to suppose", "Je suppose que oui."),
        ("imaginer", "to imagine", "Imaginer le futur."),
        ("concevoir", "to conceive", "Concevoir un plan."),
        ("élaborer", "to elaborate", "Élaborer une stratégie."),
        ("formuler", "to formulate", "Formuler une hypothèse."),
        ("exprimer", "to express", "Exprimer ses sentiments."),
        ("manifester", "to manifest/show", "Manifester son soutien."),
        ("démontrer", "to demonstrate", "Démontrer ses capacités."),
        ("prouver", "to prove", "Prouver son innocence."),
        ("justifier", "to justify", "Justifier ses actions."),
    ],
    "formal_expressions": [
        ("néanmoins", "nevertheless", "Néanmoins, je continue."),
        ("toutefois", "however", "Toutefois, il y a un problème."),
        ("cependant", "however", "Cependant, c'est possible."),
        ("pourtant", "yet/however", "Pourtant, c'était simple."),
        ("malgré", "despite", "Malgré les difficultés."),
        ("en dépit de", "despite", "En dépit des obstacles."),
        ("nonobstant", "notwithstanding", "Nonobstant les règles.", "Formal"),
        ("à l'égard de", "with regard to", "À l'égard de cette question."),
        ("en ce qui concerne", "regarding", "En ce qui concerne le projet."),
        ("quant à", "as for", "Quant à moi, je refuse."),
        ("pour ce qui est de", "as far as...is concerned", "Pour ce qui est du budget."),
        ("au sujet de", "about/regarding", "Au sujet de votre demande."),
        ("à propos de", "about", "À propos de notre conversation."),
        ("en raison de", "due to", "En raison du mauvais temps."),
        ("à cause de", "because of", "À cause de toi!"),
        ("grâce à", "thanks to", "Grâce à ton aide."),
        ("par conséquent", "consequently", "Par conséquent, je pars."),
        ("ainsi", "thus", "Ainsi, tout est clair."),
        ("donc", "therefore", "Je pense, donc je suis."),
        ("par ailleurs", "moreover/besides", "Par ailleurs, c'est cher."),
    ]
}

# Generate B2-C1 vocabulary
word_id = start_id
for category, words in b2_c1_categories.items():
    for word_data in words:
        if len(word_data) == 3:
            french, english, example = word_data
            quebec_note = ""
        else:
            french, english, example, quebec_note = word_data
        
        b2_c1_vocab.append({
            "id": word_id,
            "french": french,
            "english": english,
            "category": category.replace("_", " "),
            "example": example,
            "quebecNote": quebec_note
        })
        word_id += 1

print(f"B2-C1 words generated so far: {len(b2_c1_vocab)}")
print(f"Need {500 - len(b2_c1_vocab)} more B2-C1 words")

# Generate JavaScript output
def generate_js_array(vocab_list, level_name):
    js_output = f"    // {level_name} Level - {len(vocab_list)} words\n"
    js_output += f"    {level_name}: [\n"
    
    for word in vocab_list:
        quebec_note = word['quebecNote']
        js_output += f"        {{ id: {word['id']}, "
        js_output += f"french: \"{word['french']}\", "
        js_output += f"english: \"{word['english']}\", "
        js_output += f"category: \"{word['category']}\", "
        js_output += f"example: \"{word['example']}\""
        if quebec_note:
            js_output += f", quebecNote: \"{quebec_note}\""
        js_output += " },\n"
    
    js_output += "    ],\n"
    return js_output

# Print sample
print("\n=== Sample B1 Words ===")
for word in b1_vocab[:5]:
    print(f"{word['id']}: {word['french']} = {word['english']}")

print("\n=== Sample B2-C1 Words ===")
for word in b2_c1_vocab[:5]:
    print(f"{word['id']}: {word['french']} = {word['english']}")

print(f"\n=== SUMMARY ===")
print(f"B1 words: {len(b1_vocab)} / 500")
print(f"B2-C1 words: {len(b2_c1_vocab)} / 500")
print(f"Total new words: {len(b1_vocab) + len(b2_c1_vocab)}")
print(f"Grand total (with A1+A2): {500 + 500 + len(b1_vocab) + len(b2_c1_vocab)} / 2000")
