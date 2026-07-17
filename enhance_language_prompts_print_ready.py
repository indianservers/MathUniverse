from pathlib import Path
import re
import textwrap


ROOT = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts")


LANG_CONFIG = {
    "English": {
        "display": "English Language and Literature",
        "script_note": "Use clean academic English typography, IPA only where needed, precise punctuation marks, and readable annotated excerpts.",
        "formula": "Include formula panels such as S = NP + VP, paragraph = topic sentence + evidence + explanation + link, argument = claim + reason + evidence + warrant, and phoneme-to-grapheme mapping where relevant.",
        "assets": [
            "syntax trees with color-coded subject, predicate, object, complement, modifier",
            "annotated literary excerpts with margin notes, metaphor arrows, rhythm beats, and theme tags",
            "writing workshop desk with draft layers, revision symbols, rubric bands, and checklist overlays",
            "phonetics mouth cross-section, IPA tiles, stress marks, intonation contour graphs",
            "library timeline wall with period-specific books, author portraits as neutral silhouettes, and genre maps",
        ],
    },
    "Hindi": {
        "display": "Hindi Bhasha, Vyakaran and Sahitya",
        "script_note": "Render Devanagari accurately with a proper Hindi font; preserve matras, conjuncts, nukta, headline/shirorekha, spacing, and punctuation. No broken glyphs.",
        "formula": "Include formula panels such as वाक्य = कर्ता + कर्म + क्रिया, संधि = पूर्व पद + उत्तर पद -> नया रूप, समास = पद1 + पद2 -> समस्त पद, अलंकार = कथन + प्रभाव, रस = स्थायी भाव + विभाव + अनुभाव.",
        "assets": [
            "Devanagari glyph-construction grid with baseline, headline, matra placement, and stroke-order arrows",
            "barahkhadi and matra wall chart using large crisp letters and example words",
            "vyakaran flowcharts for sangya, sarvanam, visheshan, kriya, ling, vachan, karak",
            "annotated Hindi poem/prose manuscript with chhand beats, alankar callouts, and meaning layers",
            "Hindi literature timeline with Bhakti, Riti, Adhunik, Chhayavad, Pragativad, and contemporary panels",
        ],
    },
    "Telugu": {
        "display": "Telugu Bhasha, Vyakaranam and Sahityam",
        "script_note": "Render Telugu script accurately with a proper Telugu font; preserve guninthalu, ottulu, vowel signs, spacing, punctuation, and rounded glyph anatomy. No malformed letters.",
        "formula": "Include formula panels such as వాక్యం = కర్త + కర్మ + క్రియ, సంధి = పూర్వ పదం + ఉత్తర పదం -> కొత్త రూపం, సమాసం = పదం1 + పదం2 -> సమస్త పదం, అలంకారం = వ్యక్తీకరణ + ప్రభావం.",
        "assets": [
            "Telugu glyph anatomy grid showing base consonant, vowel sign, gunintham, ottu, and stroke direction",
            "guninthalu and ottulu reference wall with large crystal-clear characters and example words",
            "vyakaranam trees for namavachakam, sarvanamam, visheshanam, kriya, vibhakti, vachakam",
            "annotated Telugu padyam/gadyam page with chandassu beats, alankaram tags, bhava notes, and meanings",
            "Telugu literature timeline with Nannaya, Tikkana, Errana, Sri Krishna Devaraya, Gurajada, Sri Sri, and modern writing",
        ],
    },
}


NEW_TOPICS = {
    "English": [
        ("26_Spelling_and_Phonics", "Spelling and Phonics", "phoneme-grapheme mapping, silent letters, syllable rules, prefixes, suffixes, and spelling traps", "A phonics laboratory wall with sound waves entering letter tiles, mouth-position mini diagrams, syllable blocks, and corrected misspelling before/after cards."),
        ("27_Note_Making_and_Summarising", "Note Making, Summary and Precis", "Cornell notes, mind maps, precis compression, paraphrase boundaries, and main-idea hierarchy", "A split-page study desk showing source paragraph, highlighted keywords, margin symbols, condensed summary card, and compression ratio gauge."),
        ("28_Visual_Text_and_Media_Literacy", "Visual Text and Media Literacy", "posters, cartoons, advertisements, charts, headlines, bias, framing, and multimodal reading", "A media-analysis control room with billboard, infographic, news headline, political cartoon, and callout arrows for audience, purpose, tone, and bias."),
        ("29_Critical_Reasoning_and_Fallacies", "Critical Reasoning and Fallacies", "claims, assumptions, inference, evidence strength, and fallacies including straw man, ad hominem, false cause, and slippery slope", "A logic courtroom where claims, evidence, warrants, counterclaims, and fallacy warning signs are arranged like exhibits."),
        ("30_Editing_and_Proofreading", "Editing and Proofreading Symbols", "copyediting marks, grammar correction, punctuation repair, style consistency, and final proof checklist", "A professional editor's manuscript with standard proofreading symbols, colored correction layers, style guide tabs, and final print approval stamp."),
        ("31_CV_Resume_and_Applications", "CV, Resume and Job Applications", "resume sections, achievement bullets, cover letter structure, professional tone, and ATS keywords", "A clean recruitment dashboard showing resume anatomy, STAR bullet formula, cover-letter paragraph map, and ATS keyword scanner."),
        ("32_IELTS_TOEFL_Academic_English", "IELTS, TOEFL and Academic English", "listening, speaking, reading, writing task types, scoring rubrics, coherence, cohesion, and academic vocabulary", "An exam command center with four skill stations, band-score meter, essay outline grid, speaking cue card, and listening waveform notes."),
        ("33_Rhetoric_and_Stylistics", "Rhetoric and Stylistics", "ethos, pathos, logos, diction, tone, register, parallelism, antithesis, repetition, and rhetorical questions", "A speech-stage infographic with three rhetoric pillars, tone slider, sentence-style waveform, and annotated examples from formal and persuasive writing."),
        ("34_World_Literature_Periods", "World Literature and Literary Periods", "classical, medieval, renaissance, romantic, realist, modernist, postcolonial, and contemporary literature", "A global literary timeline map with book spines, period bands, genre icons, cultural context tags, and representative text silhouettes."),
        ("35_Digital_Writing_and_AI_Literacy", "Digital Writing and AI Literacy", "emails, blogs, captions, prompts, source checking, citation ethics, and responsible AI-assisted writing", "A digital writing studio showing prompt draft, fact-check panel, citation tracker, plagiarism warning, tone selector, and publish-ready article preview."),
    ],
    "Hindi": [
        ("26_Apathit_Gadyansh", "अपठित गद्यांश", "मुख्य विचार, शीर्षक, शब्दार्थ, संदर्भ, प्रश्नोत्तर रणनीति, और अनुमान", "A Hindi reading desk with an unseen prose passage, highlighted मुख्य विचार, प्रश्न arrows, संदर्भ notes, and answer-construction flow."),
        ("27_Apathit_Padyansh", "अपठित पद्यांश", "भावार्थ, रस, अलंकार, छंद संकेत, कवि-दृष्टि, प्रतीक, और पंक्ति-व्याख्या", "A poetry-analysis scroll with Devanagari couplets, rhythm beats, भावार्थ layers, रस color wash, and अलंकार tags."),
        ("28_Soochna_Notice_Vigyapan", "सूचना, नोटिस और विज्ञापन लेखन", "format, heading, date, body, issuing authority, persuasive copy, and visual hierarchy", "A school notice board and advertisement design table with correct Hindi formats, stamp, date, authority line, and layout boxes."),
        ("29_Report_Samvad_Aur_Patrakarita", "रिपोर्ट, संवाद और पत्रकारिता लेखन", "headline, byline, 5W1H, direct speech, dialogue punctuation, objectivity, and media ethics", "A newsroom infographic with 5W1H wheel, Hindi headline strip, reporter notebook, dialogue bubbles, and fact-check checklist."),
        ("30_Chhand_Ras_Advanced", "छंद और रस उन्नत अध्ययन", "मात्रा गणना, वर्णिक छंद, मात्रिक छंद, स्थायी भाव, विभाव, अनुभाव, संचारी भाव", "A classical poetry meter board with laghu-guru symbols, matra counter, rasa mandala, and sample couplet scanning grid."),
        ("31_Shuddh_Ashuddh_Vakya", "शुद्ध-अशुद्ध वाक्य और वर्तनी", "वर्तनी, लिंग, वचन, कारक, क्रिया-सामंजस्य, विराम चिह्न, और सामान्य त्रुटियां", "A correction workshop showing incorrect Hindi sentences transforming into correct forms with red marks, rule tags, and before/after cards."),
        ("32_Tatsam_Tadbhav_Deshaj_Videshi", "तत्सम, तद्भव, देशज और विदेशी शब्द", "word origin, Sanskrit roots, sound change, regional usage, borrowed words, and vocabulary classification", "A word-origin museum with four labeled galleries, etymology arrows, example word artifacts, and Sanskrit-to-Hindi transformation path."),
        ("33_Hindi_Bhasha_Boli_Charitra", "हिंदी भाषा, बोली और इतिहास", "भाषा परिवार, बोलियां, खड़ी बोली, अवधी, ब्रज, भोजपुरी, राजस्थानी, और विकास-यात्रा", "A map of North India with dialect zones, language-family tree, timeline ribbons, and labeled speech examples."),
        ("34_Hindi_Anuvad_Kala", "हिंदी अनुवाद कला", "literal vs sense translation, register, idiom transfer, cultural context, glossary, and back-translation QA", "A translation studio with source and target panels, idiom bridge, register dial, glossary bank, and quality-control checklist."),
        ("35_Hindi_Project_and_Portfolio_Work", "हिंदी परियोजना और पोर्टफोलियो कार्य", "research question, survey, interview, bibliography, creative presentation, and viva preparation", "A student project wall with research cards, interview audio icons, bibliography shelf, infographic poster, and presentation rubric."),
    ],
    "Telugu": [
        ("26_Apathita_Gadyam", "అపఠిత గద్యం", "main idea, title, vocabulary, inference, reference, question-answer strategy, and evidence selection", "A Telugu reading table with unseen prose, highlighted ముఖ్య భావం, answer arrows, vocabulary margin notes, and evidence tags."),
        ("27_Apathita_Padyam", "అపఠిత పద్యం", "భావార్థం, రసం, అలంకారం, ఛందస్సు, ప్రతీక, కవి దృష్టి, and line explanation", "A Telugu padyam manuscript with chandassu beat marks, bhava color layers, alankaram callouts, and line-by-line meaning strips."),
        ("28_Notice_Report_Dialogue_Writing", "ప్రకటన, నివేదిక మరియు సంభాషణ రచన", "notice format, report 5W1H, dialogue punctuation, headline, objectivity, and layout", "A Telugu school notice board plus newsroom desk showing correct format blocks, 5W1H wheel, dialogue bubbles, and approval stamp."),
        ("29_Chandassu_Advanced", "ఛందస్సు ఉన్నత అధ్యయనం", "గణాలు, యతి, ప్రాస, మాత్రలు, వృత్తాలు, and poem scanning", "A classical Telugu meter board with gana patterns, yati/prasa alignment, matra counter, and sample padyam scanning grid."),
        ("30_Rasalu_and_Bhava_Analysis", "రసాలు మరియు భావ విశ్లేషణ", "స్థాయి భావం, విభావం, అనుభావం, వ్యభిచారి భావం, and rasa interpretation", "A rasa mandala with Telugu labels, emotion-color rings, literary scene miniatures, and evidence callouts from poetry."),
        ("31_Shuddha_Asuddha_Padalu", "శుద్ధ-అశుద్ధ పదాలు మరియు వాక్యాలు", "spelling, grammar agreement, vibhakti, tense consistency, punctuation, and common mistakes", "A correction studio with Telugu wrong-to-right sentence transformations, red proof marks, rule tiles, and final clean copy."),
        ("32_Tatsama_Tadbhava_Deshya_Anyadesya", "తత్సమ, తద్భవ, దేశ్య, అన్యదేశ్య పదాలు", "word origin, Sanskrit borrowing, sound change, native Telugu words, foreign words, and classification", "A word-origin gallery with four Telugu-labeled sections, etymology paths, example word cards, and transformation arrows."),
        ("33_Telugu_Bhasha_Boli_Charitra", "తెలుగు భాష, మాండలికాలు మరియు చరిత్ర", "Dravidian family, regional dialects, script evolution, literary history, and modern Telugu", "A map of Telugu-speaking regions with dialect zones, script-evolution timeline, language-family tree, and sample speech ribbons."),
        ("34_Nudi_Karalu_and_Idiomatic_Telugu", "నుడికారాలు మరియు సామెతలు", "idioms, proverbs, contextual meaning, literal vs intended meaning, and usage in writing", "A Telugu idiom marketplace with proverb signboards, literal-image contrast panels, usage examples, and meaning arrows."),
        ("35_Telugu_Project_and_Portfolio_Work", "తెలుగు ప్రాజెక్ట్ మరియు పోర్ట్‌ఫోలియో పని", "research topic, survey, interview, bibliography, creative poster, and viva preparation", "A student project wall with Telugu research cards, interview notes, bibliography shelf, infographic poster, and presentation rubric."),
    ],
}


VARIANTS = [
    ("01_Concept_Map.txt", "Concept Map", "Build a panoramic map of the concept, its subparts, rules, examples, exceptions, and memory anchors."),
    ("02_Methods_Examples_and_Practice.txt", "Methods, Examples and Practice", "Show worked examples, guided practice, common mistakes, model answers, and student-facing correction cues."),
    ("03_Advanced_View_and_Applications.txt", "Advanced View and Applications", "Connect the topic to examinations, literature, public communication, academic work, and real-world language use."),
]


def compact_title_from_folder(folder: str) -> str:
    name = re.sub(r"^\d+_", "", folder)
    return name.replace("_", " ")


def build_enhancement_block(language: str, topic: str) -> str:
    cfg = LANG_CONFIG[language]
    assets = "\n".join(f"- {item}" for item in cfg["assets"])
    return f"""

# PRINT-READY VISUAL FEAST EXPANSION
Upgrade this prompt from generic classroom chart to premium educational infographic suitable for A3 poster printing, textbook plate, smart-board slide, and high-resolution app asset. Make the output image rich but academically clean: layered diagrams, accurate labels, example panels, rule cards, error-correction panels, and guided visual hierarchy.

# SPECIFIC IMAGE ASSET PLAN
Topic focus: {topic}
Mandatory premium assets to include where relevant:
{assets}
- one central hero diagram that teaches the concept at a glance
- at least 6 precise labeled callouts, not decorative filler
- 3 miniature worked examples with correct answer structure
- a misconception/error clinic panel with before -> after correction
- a quick-reference formula/rule strip for fast revision

# LANGUAGE FORMULAS / STRUCTURE PANELS
{cfg["formula"]}
For every formula, show one clean example, one counterexample or common error, and one corrected final form. Use arrows, brackets, color grouping, and numbered steps so the learner can follow the transformation visually.

# TYPOGRAPHY AND SCRIPT RENDERING QA
{cfg["script_note"]}
Use print-safe margins, 300 DPI thinking, sharp vector-like letterforms, consistent baseline grids, generous line spacing, and strong contrast. Do not allow tiny unreadable text, fake letters, random placeholder paragraphs, broken accents, distorted script, or mixed-up grammar labels.

# IMAGE RICHNESS AND ACCURACY RULES
Every visual object must teach something specific: book pages must contain meaningful short excerpts, boards must contain real rules/examples, charts must have correct labels, and timelines/maps must use accurate category names. Prefer labeled educational diagrams, manuscript details, classroom artifacts, exam answer sheets, glossary cards, phonetic/grammar trees, literature timelines, and rubric panels over generic students, books, or abstract backgrounds.

# NEGATIVE PROMPT
No generic stock classroom, no random text, no fake Hindi/Telugu/English letters, no blurry poster, no overcrowded microscopic labels, no incorrect grammar formulas, no decorative-only icons, no AI hallucinated author names, no unreadable fonts, no misspelled headings, no low-resolution screenshots, no one-note flat background.
""".strip()


def enhance_existing_file(path: Path, language: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if "# PRINT-READY VISUAL FEAST EXPANSION" in text:
        return False
    topic = compact_title_from_folder(path.parent.name)
    block = build_enhancement_block(language, topic)
    marker = "# FINAL RENDERING REQUIREMENTS"
    if marker in text:
        text = text.replace(marker, block + "\n\n" + marker, 1)
    else:
        text = text.rstrip() + "\n\n" + block + "\n"
    path.write_text(text, encoding="utf-8")
    return True


def build_new_prompt(language: str, title: str, scope: str, hero: str, variant_title: str, variant_focus: str) -> str:
    cfg = LANG_CONFIG[language]
    block = build_enhancement_block(language, title)
    return f"""Act as a senior educational infographic designer, language pedagogy expert, print-layout art director, and examiner.

Create a detailed, print-ready infographic text prompt for: {cfg["display"]} - {title} - {variant_title}.

# CORE LEARNING GOAL
Teach {scope}. The infographic must be specific enough for a designer or image model to create a premium visual learning asset, not a generic poster.

# CENTRAL HERO VISUAL
{hero}

# VARIANT FOCUS
{variant_focus}

# REQUIRED CONTENT PANELS
1. Definition and scope panel with short exact wording.
2. Rule/formula panel with arrows, brackets, and step numbers.
3. Worked example panel with correct answer construction.
4. Common mistakes panel showing wrong -> corrected form.
5. Exam/application panel showing how the concept appears in school, college, competitive exam, academic, or communication settings.
6. Memory anchor panel using a precise visual mnemonic that does not distort the subject.

{block}

# FINAL RENDERING REQUIREMENTS
Landscape A3 educational infographic, 16:9 compatible crop, clean premium editorial style, sharp text, strong information hierarchy, rich but disciplined color palette, labeled diagrams, accurate examples, app-ready and print-ready. The final asset should look like a top-tier textbook plate plus modern interactive learning poster.
"""


def create_new_topics(language: str) -> int:
    base = ROOT / language
    made = 0
    for folder, title, scope, hero in NEW_TOPICS[language]:
        topic_dir = base / folder
        topic_dir.mkdir(parents=True, exist_ok=True)
        for filename, variant_title, variant_focus in VARIANTS:
            path = topic_dir / filename
            if path.exists():
                continue
            prompt = build_new_prompt(language, title, scope, hero, variant_title, variant_focus)
            path.write_text(prompt, encoding="utf-8")
            made += 1
    return made


def main():
    rows = []
    for language in ("Hindi", "Telugu", "English"):
        base = ROOT / language
        enhanced = 0
        for path in base.rglob("*.txt"):
            if enhance_existing_file(path, language):
                enhanced += 1
        created = create_new_topics(language)
        folders = sum(1 for p in base.iterdir() if p.is_dir())
        files = sum(1 for _ in base.rglob("*.txt"))
        rows.append((language, enhanced, created, folders, files))

    print("Language prompt expansion complete:")
    for language, enhanced, created, folders, files in rows:
        print(f"{language}: enhanced={enhanced}, created={created}, folders={folders}, files={files}")


if __name__ == "__main__":
    main()
