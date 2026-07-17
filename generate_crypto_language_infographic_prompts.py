from pathlib import Path

ROOT = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts")

QUALITY = """# OUTPUT QUALITY
* Ultra-HD 8K resolution
* Exact canvas size: 7680 x 4320 px
* Landscape orientation
* Premium, non-generic educational infographic
* Extremely sharp diagrams, labels, examples, tables, timelines and legends
* Print-quality educational graphics
* Professional school, college, university, museum and digital-learning quality
* No blurry text
* No incorrect facts
* No distorted scripts or symbols
* No watermarks
* No logos
* No stock-image appearance
* No unnecessary visual clutter"""

CRYPTO_ASSET = """# PREMIUM NON-GENERIC CRYPTOGRAPHY ASSET REQUIREMENTS
* Use cryptography-specific assets: plaintext/ciphertext blocks, keys, modular arithmetic wheels, number-theory diagrams, hash chains, Merkle trees, protocol message flows, attack models, entropy meters and security assumption panels.
* Every visual element must teach a specific primitive, protocol step, key relation, mathematical rule, attack surface, trust boundary or security property.
* Show threat model, assumptions and adversary capability where relevant.
* Anchor every label to a visible object: key, nonce, IV, block, hash, signature, certificate, prime, modulus, curve point, message, transcript or attacker.
* Distinguish encryption, hashing, encoding, signing, authentication and key exchange.
* Avoid generic padlock wallpaper, hacker silhouettes, fake binary rain and impossible security claims.

# CRYPTOGRAPHY ACCURACY AND LABEL QA
* Verify all formulas, protocol arrows, key directions, public/private key roles, nonce requirements, padding notes and security claims.
* Do not present obsolete or broken schemes as secure unless clearly labelled historical or insecure.
* State assumptions such as secure randomness, authenticated channel, hardness assumption, unique nonce, trusted CA, side-channel resistance or quantum threat.
* Do not provide instructions for wrongdoing; keep attack sections educational and defensive.
* Keep arrows protocol-accurate and directionally meaningful.

# NEGATIVE PROMPT
No generic lock icons as the main content, no fake equations, no impossible “unbreakable” claims, no malware instructions, no misleading key flow, no unreadable tiny protocol transcripts, no stock hacker imagery, no watermarks, no logos."""

LANG_ASSET = """# PREMIUM NON-GENERIC LANGUAGE ASSET REQUIREMENTS
* Use language-specific assets: sentence maps, grammar trees, morphology tables, word roots, phonetic diagrams, script panels, annotated passages, rhetorical devices, timelines, reading-comprehension maps and writing-process boards.
* Every visual element must teach a specific rule, pattern, sound, word form, sentence structure, literary technique, comprehension strategy or writing skill.
* Anchor every label to visible text, phrase, clause, word, syllable, script character, punctuation mark, paragraph, stanza or diagram node.
* Include clear examples in the target language/script when relevant, with readable typography and no script distortion.
* Show common mistakes and corrected examples.
* Avoid generic books/pens/blackboards as the main content.

# LANGUAGE ACCURACY AND LABEL QA
* Verify spelling, grammar, punctuation, script forms, transliteration and examples.
* Keep examples age-appropriate and culturally respectful.
* Distinguish formal, informal, literary and spoken usage where relevant.
* Do not mix scripts accidentally.
* Avoid overly dense paragraphs; use clean annotated examples.

# NEGATIVE PROMPT
No fake script, no misspelled example words, no random book clip art, no unreadable paragraphs, no distorted letters, no culturally insensitive examples, no watermarks, no logos."""

VARIANTS = [
    ("01_Concept_Map", "Concept Map and Foundations", "Foundation to intermediate", "Build intuition with definitions, core vocabulary, visual models and simple examples."),
    ("02_Methods_Examples_and_Practice", "Methods, Examples and Practice", "Intermediate", "Teach rules, procedures, worked examples, comparison panels and practice patterns."),
    ("03_Advanced_View_and_Applications", "Advanced View and Applications", "Advanced school to postgraduate", "Connect the topic to deeper analysis, real-world use, research, literature, security or professional communication."),
]


CRYPTO = [
    ("Classical_Ciphers", "CLASSICAL CIPHERS", "Caesar, substitution, Vigenere, transposition, frequency analysis and historical cryptanalysis", "plaintext alphabet, shifted alphabet, substitution table, Vigenere square, transposition grid, frequency histogram"),
    ("Modular_Arithmetic", "MODULAR ARITHMETIC FOR CRYPTOGRAPHY", "congruences, modular inverse, exponentiation, Euler theorem, Fermat theorem and cyclic groups", "modular clock, congruence equations, inverse table, exponentiation ladder, group cycle"),
    ("Randomness_Entropy_and_Keys", "RANDOMNESS, ENTROPY AND KEYS", "secure randomness, entropy, key space, brute force, passwords, salts and key generation", "entropy meter, key-space cube, random generator, password cracking timeline, salt panel"),
    ("Symmetric_Encryption", "SYMMETRIC ENCRYPTION", "shared-key encryption, block ciphers, stream ciphers, modes, IVs, nonces and authenticated encryption", "plaintext blocks, secret key, AES round concept, CBC/CTR/GCM mode panels, nonce warning"),
    ("AES_Block_Cipher", "AES BLOCK CIPHER", "AES state matrix, substitution, permutation, mix columns, key schedule and rounds", "4x4 state matrix, S-box, shift rows, mix columns, round key, round flow"),
    ("Hash_Functions", "CRYPTOGRAPHIC HASH FUNCTIONS", "one-way functions, collision resistance, preimage resistance, SHA family, hashing files and password storage", "message input, compression function, digest output, avalanche effect, collision panel"),
    ("Message_Authentication_Codes", "MESSAGE AUTHENTICATION CODES", "MACs, HMAC, integrity, authenticity, shared keys and tamper detection", "message, shared key, HMAC block, tag, verification flow, tampered message warning"),
    ("Public_Key_Cryptography", "PUBLIC-KEY CRYPTOGRAPHY", "public/private keys, trapdoor functions, encryption, signatures and trust models", "key pair, public key directory, private key vault, message flow, attacker model"),
    ("RSA", "RSA CRYPTOSYSTEM", "prime generation, modulus, public/private exponents, encryption, signatures, padding and security assumptions", "two primes, modulus n, phi/lambda panel, public exponent, private exponent, OAEP/PSS padding"),
    ("Diffie_Hellman_Key_Exchange", "DIFFIE-HELLMAN KEY EXCHANGE", "shared secret creation, discrete logarithm problem, man-in-the-middle risk and authenticated variants", "Alice/Bob exchange, public parameters, exponentiation arrows, shared secret match, MITM panel"),
    ("Elliptic_Curve_Cryptography", "ELLIPTIC CURVE CRYPTOGRAPHY", "elliptic curve groups, point addition, scalar multiplication, ECDH, ECDSA and smaller keys", "elliptic curve, point addition line, scalar multiplication hops, curve point labels"),
    ("Digital_Signatures", "DIGITAL SIGNATURES", "signing, verification, non-repudiation, RSA-PSS, ECDSA, EdDSA and signature misuse risks", "message hash, private-key signing, signature, public-key verification, valid/invalid panels"),
    ("Certificates_and_PKI", "CERTIFICATES AND PKI", "certificate authorities, certificate chains, TLS certificates, identity binding and revocation", "root CA, intermediate CA, server certificate, chain validation, browser trust panel"),
    ("TLS_SSL_Handshake", "TLS HANDSHAKE", "secure web connections, key exchange, certificates, session keys, forward secrecy and authenticated encryption", "client hello, server hello, certificate, key exchange, session keys, encrypted channel"),
    ("Password_Security", "PASSWORD SECURITY", "password hashing, salts, pepper, KDFs, bcrypt, scrypt, Argon2 and password attacks", "password input, salt, KDF work factor, stored hash, attacker database, rate limiting"),
    ("Key_Management", "KEY MANAGEMENT", "key generation, storage, rotation, wrapping, HSMs, access control and lifecycle management", "key lifecycle timeline, HSM, key vault, rotation cycle, access policy, audit log"),
    ("Cryptographic_Protocols", "CRYPTOGRAPHIC PROTOCOLS", "protocol goals, transcripts, authentication, replay protection, nonces and formal reasoning", "message sequence chart, nonce, transcript hash, adversary on channel, replay attack panel"),
    ("Zero_Knowledge_Proofs", "ZERO-KNOWLEDGE PROOFS", "proving knowledge without revealing secrets, commitments, interactive proofs, zk-SNARK concepts and applications", "prover/verifier, hidden witness, commitment, challenge-response, proof object"),
    ("Secret_Sharing", "SECRET SHARING", "Shamir secret sharing, thresholds, polynomial shares, reconstruction and distributed trust", "secret point, polynomial curve, shares, threshold reconstruction, insufficient shares warning"),
    ("Merkle_Trees_and_Blockchains", "MERKLE TREES AND BLOCKCHAINS", "hash trees, inclusion proofs, block headers, tamper evidence and blockchain structure", "leaf hashes, Merkle root, inclusion path, block chain, tamper change propagation"),
    ("Cryptocurrencies_Basics", "CRYPTOCURRENCY CRYPTOGRAPHY", "wallet keys, addresses, transactions, signatures, mining/validation and consensus overview", "wallet key pair, address, signed transaction, mempool, block, validator/miner flow"),
    ("Post_Quantum_Cryptography", "POST-QUANTUM CRYPTOGRAPHY", "quantum threats, Shor algorithm risk, lattice cryptography, hash-based signatures and migration", "quantum computer threat panel, lattice grid, Kyber-style KEM concept, migration timeline"),
    ("Cryptanalysis_Basics", "CRYPTANALYSIS BASICS", "attack models, brute force, frequency analysis, chosen plaintext, side channels and responsible disclosure", "attack taxonomy tree, ciphertext-only panel, oracle model, timing leak graph, defence checklist"),
    ("Side_Channel_Attacks", "SIDE-CHANNEL ATTACKS", "timing, power, cache, electromagnetic leaks, constant-time programming and hardware defences", "device, power trace, timing graph, cache access pattern, masking/constant-time defence"),
    ("Privacy_Preserving_Cryptography", "PRIVACY-PRESERVING CRYPTOGRAPHY", "secure multiparty computation, homomorphic encryption, private set intersection and differential privacy links", "multiple parties, encrypted computation box, secret inputs, shared output, privacy boundary"),
    ("Homomorphic_Encryption", "HOMOMORPHIC ENCRYPTION", "computing on encrypted data, ciphertext operations, noise growth, bootstrapping and privacy applications", "encrypted numbers, operation on ciphertext, decrypted result, noise meter, bootstrapping loop"),
    ("Secure_Multiparty_Computation", "SECURE MULTIPARTY COMPUTATION", "joint computation without revealing private inputs, shares, garbled circuits and privacy guarantees", "three parties, secret shares, computation circuit, output only, adversary model"),
    ("Authentication_and_2FA", "AUTHENTICATION AND TWO-FACTOR SECURITY", "something you know, have and are; OTP, TOTP, WebAuthn, phishing resistance and account recovery", "login flow, password, authenticator app, hardware key, biometric sensor, phishing site warning"),
    ("Encoding_vs_Encryption", "ENCODING VS ENCRYPTION VS HASHING", "Base64, encryption, hashing, signing, obfuscation and common security misconceptions", "same message through encoding/encryption/hash/signing pipelines, reversible/nonreversible labels"),
    ("Applied_Cryptography_Mistakes", "APPLIED CRYPTOGRAPHY MISTAKES", "nonce reuse, weak randomness, ECB mode, homebrew crypto, bad padding, key reuse and secure design principles", "mistake checklist, ECB penguin concept, nonce reuse warning, secure library panel"),
]


ENGLISH = [
    ("Parts_of_Speech", "PARTS OF SPEECH", "nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions and interjections", "sentence with colour-coded words, grammar wheel, example table"),
    ("Sentence_Structure", "SENTENCE STRUCTURE", "subjects, predicates, objects, complements, phrases, clauses and sentence types", "sentence tree, clause blocks, subject-predicate map"),
    ("Tenses_and_Aspect", "TENSES AND ASPECT", "present, past, future, simple, continuous, perfect and perfect continuous forms", "tense timeline, verb conjugation table, example sentence grid"),
    ("Active_and_Passive_Voice", "ACTIVE AND PASSIVE VOICE", "voice transformation, agent, object focus, tense preservation and usage", "active-passive transformation arrows, agent/object labels"),
    ("Direct_and_Indirect_Speech", "DIRECT AND INDIRECT SPEECH", "reported speech, tense backshift, pronouns, time expressions and punctuation", "speech bubble to reported sentence flow, quote marks panel"),
    ("Punctuation", "PUNCTUATION", "commas, periods, semicolons, colons, apostrophes, quotation marks, dashes and parentheses", "annotated paragraph, punctuation toolbox, before-after examples"),
    ("Vocabulary_and_Word_Formation", "VOCABULARY AND WORD FORMATION", "roots, prefixes, suffixes, synonyms, antonyms, collocations and word families", "word root tree, prefix/suffix blocks, synonym network"),
    ("Reading_Comprehension", "READING COMPREHENSION", "main idea, inference, context clues, tone, purpose, evidence and summary", "annotated passage, evidence arrows, inference ladder"),
    ("Writing_Process", "THE WRITING PROCESS", "planning, drafting, revising, editing, proofreading and publishing", "writing workflow board, draft layers, revision checklist"),
    ("Paragraph_Writing", "PARAGRAPH WRITING", "topic sentence, supporting details, coherence, transitions and concluding sentence", "paragraph anatomy, sentence role labels, transition map"),
    ("Essay_Writing", "ESSAY WRITING", "introduction, thesis, body paragraphs, evidence, analysis and conclusion", "essay structure pyramid, thesis-evidence-analysis chain"),
    ("Creative_Writing", "CREATIVE WRITING", "plot, character, setting, conflict, dialogue, imagery and narrative voice", "story arc, character map, setting mood board"),
    ("Figures_of_Speech", "FIGURES OF SPEECH", "simile, metaphor, personification, hyperbole, alliteration, irony and symbolism", "literal vs figurative panels, device examples"),
    ("Poetry_Analysis", "POETRY ANALYSIS", "rhyme, rhythm, meter, imagery, tone, theme, stanza and poetic devices", "annotated poem stanza, rhyme scheme, meter beats"),
    ("Drama_and_Theatre", "DRAMA AND THEATRE", "dialogue, stage directions, acts, scenes, conflict, monologue and dramatic irony", "stage layout, script annotation, character interaction map"),
    ("Novel_and_Short_Story_Analysis", "FICTION ANALYSIS", "plot, character, theme, point of view, setting, conflict and symbolism", "plot arc, POV camera, theme-symbol map"),
    ("Grammar_Common_Errors", "COMMON GRAMMAR ERRORS", "subject-verb agreement, fragments, run-ons, modifiers, pronoun reference and parallelism", "wrong/right sentence panels, error detector checklist"),
    ("Formal_Letter_and_Email", "FORMAL LETTER AND EMAIL WRITING", "format, tone, subject line, salutation, body, closing and professional etiquette", "email template, formal letter layout, tone scale"),
    ("Public_Speaking", "PUBLIC SPEAKING", "speech structure, audience, delivery, voice, body language and visual aids", "speaker stage, speech outline, delivery cues"),
    ("Debate_and_Argumentation", "DEBATE AND ARGUMENTATION", "claim, evidence, reasoning, rebuttal, fallacies and persuasive structure", "argument map, claim-evidence-reasoning chain, rebuttal panel"),
    ("Academic_Writing", "ACADEMIC WRITING", "research questions, thesis, citations, paraphrasing, evidence and formal style", "research paper structure, citation callouts, source integration"),
    ("Literary_Criticism", "LITERARY CRITICISM", "formalism, reader response, historical, feminist, postcolonial and psychoanalytic lenses", "critical lens wheel, text analysis layers"),
    ("Linguistics_Basics", "LINGUISTICS BASICS", "phonetics, phonology, morphology, syntax, semantics, pragmatics and discourse", "language levels stack, IPA mouth diagram, syntax tree"),
    ("Phonetics_and_Pronunciation", "PHONETICS AND PRONUNCIATION", "speech sounds, stress, intonation, IPA, articulation and connected speech", "mouth articulation diagram, IPA chart, stress pattern wave"),
    ("Business_Communication", "BUSINESS COMMUNICATION", "clarity, concision, reports, proposals, meetings, presentations and professional tone", "business communication dashboard, memo/report layouts"),
]


TELUGU = [
    ("Telugu_Alphabet", "తెలుగు వర్ణమాల", "అచ్చులు, హల్లులు, గుణింతాలు, ఒత్తులు మరియు అక్షర నిర్మాణం", "తెలుగు అక్షర పట్టిక, అచ్చు-హల్లు రంగు కోడింగ్, గుణింతాల చార్ట్"),
    ("Guninthalu_and_Ottulu", "గుణింతాలు మరియు ఒత్తులు", "స్వరచిహ్నాలు, సంయుక్తాక్షరాలు, ఉచ్చారణ మరియు సరైన లేఖనం", "క, కా, కి వరుసలు, ఒత్తు రూపాలు, పద ఉదాహరణలు"),
    ("Telugu_Pronunciation", "తెలుగు ఉచ్చారణ", "స్వరాలు, వ్యంజనాలు, మహాప్రాణాలు, అల్పప్రాణాలు మరియు ధ్వని భేదాలు", "నోటి ఉచ్చారణ చిత్రం, ధ్వని వర్గీకరణ పట్టిక"),
    ("Telugu_Parts_of_Speech", "తెలుగు పదభేదాలు", "నామవాచకం, సర్వనామం, క్రియ, విశేషణం, అవ్యయం మరియు విభక్తులు", "రంగు కోడ్ చేసిన తెలుగు వాక్యం, పదభేద చార్ట్"),
    ("Telugu_Nouns_and_Cases", "నామవాచకాలు మరియు విభక్తులు", "లింగం, వచనం, విభక్తి ప్రత్యయాలు మరియు వాక్య వినియోగం", "నామవాచక విభక్తి పట్టిక, ఉదాహరణ వాక్యాలు"),
    ("Telugu_Verbs_and_Tenses", "తెలుగు క్రియలు మరియు కాలాలు", "వర్తమాన, భూత, భవిష్యత్ కాలాలు, క్రియారూపాలు మరియు ప్రయోగాలు", "కాలరేఖ, క్రియా రూపాల పట్టిక"),
    ("Telugu_Sentence_Structure", "తెలుగు వాక్య నిర్మాణం", "కర్త, కర్మ, క్రియ, విశేషణం, అవ్యయం మరియు పద క్రమం", "వాక్య నిర్మాణ చెట్టు, కర్త-కర్మ-క్రియ మ్యాప్"),
    ("Telugu_Sandhi", "సంధులు", "స్వరసంధి, వ్యంజనసంధి, విసర్గసంధి మరియు ఉదాహరణలు", "రెండు పదాల కలయిక బాణాలు, సంధి రకాలు"),
    ("Telugu_Samasalu", "సమాసాలు", "ద్వంద్వ, తత్పురుష, కర్మధారయ, బహువ్రీహి సమాసాల నిర్మాణం", "సమాస పద విభజన, రకం గుర్తింపు చార్ట్"),
    ("Telugu_Punctuation", "తెలుగు విరామ చిహ్నాలు", "పూర్ణవిరామం, అల్పవిరామం, ప్రశ్నార్థకం, ఆశ్చర్యార్థకం మరియు ఉల్లేఖనాలు", "ఉదాహరణ పేరా, విరామ చిహ్నాల పెట్టె"),
    ("Telugu_Vocabulary", "తెలుగు పదసంపద", "పర్యాయపదాలు, విరుద్ధపదాలు, నానార్థాలు, జాతీయాలు మరియు సామెతలు", "పద వృక్షం, పర్యాయ-విరుద్ధ నెట్‌వర్క్"),
    ("Telugu_Reading_Comprehension", "తెలుగు పఠన అవగాహన", "ముఖ్య భావం, సందర్భం, ఊహ, ప్రశ్నోత్తరాలు మరియు సారాంశం", "గుర్తులు పెట్టిన గద్య భాగం, ఆధార బాణాలు"),
    ("Telugu_Paragraph_Writing", "తెలుగు పేరా రచన", "ముఖ్య వాక్యం, సహాయక వివరాలు, క్రమబద్ధత మరియు ముగింపు", "పేరా నిర్మాణ చిత్రం, వాక్య పాత్రలు"),
    ("Telugu_Essay_Writing", "తెలుగు వ్యాస రచన", "ప్రారంభం, విషయం విస్తరణ, ఉదాహరణలు, ముగింపు మరియు శైలి", "వ్యాస నిర్మాణ పిరమిడ్, ఆలోచన మ్యాప్"),
    ("Telugu_Letter_Writing", "తెలుగు లేఖా రచన", "వ్యక్తిగత లేఖ, అధికారిక లేఖ, చిరునామా, సంభోదన మరియు ముగింపు", "లేఖ నమూనా, భాగాల లేబుళ్లు"),
    ("Telugu_Poetry", "తెలుగు పద్యము", "ఛందస్సు, యతి, ప్రాస, అలంకారాలు మరియు భావం", "పద్య పంక్తి విశ్లేషణ, యతి-ప్రాస గుర్తులు"),
    ("Telugu_Alankaralu", "అలంకారాలు", "ఉపమ, రూపకం, అతిశయోక్తి, శ్లేష మరియు ఇతర అలంకారాలు", "అలంకార ఉదాహరణలు, భావ-రూపం పోలిక"),
    ("Telugu_Prose_Analysis", "తెలుగు గద్య విశ్లేషణ", "పాత్రలు, సంఘటనలు, సందేశం, భాషా శైలి మరియు రచయిత దృక్కోణం", "గద్య భాగం, పాత్ర మ్యాప్, భావ చార్ట్"),
    ("Telugu_Grammar_Common_Errors", "తెలుగు సాధారణ దోషాలు", "అక్షర దోషాలు, విభక్తి దోషాలు, క్రియా దోషాలు మరియు వాక్య దోషాలు", "తప్పు-సరైన ఉదాహరణలు, దోష గుర్తింపు"),
    ("Telugu_Speech_and_Debate", "తెలుగు ప్రసంగం మరియు వాదన", "ప్రసంగ నిర్మాణం, వాదన, ఆధారాలు, శైలి మరియు వేదిక నైపుణ్యం", "ప్రసంగ రూపకల్పన, వాదన మ్యాప్"),
    ("Telugu_Literature_Timeline", "తెలుగు సాహిత్య చరిత్ర", "ప్రాచీన, మధ్యయుగ, ఆధునిక తెలుగు సాహిత్య ధోరణులు మరియు రచయితలు", "కాలరేఖ, రచయితల ప్యానెల్, సాహిత్య ప్రక్రియలు"),
    ("Telugu_Proverbs_and_Idioms", "సామెతలు మరియు జాతీయాలు", "అర్థం, సందర్భం, వినియోగం మరియు ఆధునిక ఉదాహరణలు", "సామెత-అర్థం-సందర్భం పట్టిక"),
    ("Telugu_Translation_Skills", "తెలుగు అనువాద నైపుణ్యాలు", "భావానువాదం, పదానువాదం, సందర్భం, శైలి మరియు సాంస్కృతిక భావాలు", "ఇంగ్లీష్-తెలుగు వాక్య జతలు, భావ మ్యాప్"),
    ("Telugu_Creative_Writing", "తెలుగు సృజనాత్మక రచన", "కథ, సంభాషణ, వర్ణన, పాత్ర చిత్రణ మరియు భావ వ్యక్తీకరణ", "కథా వక్రం, పాత్ర మ్యాప్, సంభాషణ ప్యానెల్"),
    ("Telugu_Academic_Writing", "తెలుగు విద్యా రచన", "వ్యాసం, నివేదిక, సూచనలు, ఆధారాలు మరియు అధికారిక శైలి", "నివేదిక నిర్మాణం, మూలాల చేర్పు, శైలి సూచనలు"),
]


HINDI = [
    ("Hindi_Varnamala", "हिंदी वर्णमाला", "स्वर, व्यंजन, मात्राएँ, संयुक्ताक्षर और अक्षर निर्माण", "देवनागरी वर्णमाला तालिका, स्वर-व्यंजन रंग कोडिंग, मात्रा चार्ट"),
    ("Matra_and_Barahkhadi", "मात्राएँ और बारहखड़ी", "स्वर चिह्न, बारहखड़ी, उच्चारण और सही लेखन", "क, का, कि क्रम, मात्रा चिह्न, शब्द उदाहरण"),
    ("Hindi_Pronunciation", "हिंदी उच्चारण", "स्वर, व्यंजन, अल्पप्राण, महाप्राण, अनुनासिक और ध्वनि भेद", "मुख उच्चारण चित्र, ध्वनि वर्गीकरण तालिका"),
    ("Hindi_Parts_of_Speech", "हिंदी शब्द भेद", "संज्ञा, सर्वनाम, क्रिया, विशेषण, क्रिया विशेषण, संबंधबोधक और समुच्चयबोधक", "रंग-कोडित हिंदी वाक्य, शब्द भेद चक्र"),
    ("Hindi_Nouns_Gender_Number_Case", "संज्ञा, लिंग, वचन और कारक", "लिंग, वचन, कारक चिह्न, विभक्ति और वाक्य प्रयोग", "संज्ञा रूप तालिका, कारक मानचित्र"),
    ("Hindi_Verbs_and_Tenses", "हिंदी क्रिया और काल", "वर्तमान, भूत, भविष्य, क्रिया रूप, पक्ष और प्रयोग", "काल रेखा, क्रिया रूप तालिका"),
    ("Hindi_Sentence_Structure", "हिंदी वाक्य रचना", "कर्ता, कर्म, क्रिया, पद क्रम, वाक्य प्रकार और उपवाक्य", "वाक्य वृक्ष, कर्ता-कर्म-क्रिया मानचित्र"),
    ("Sandhi", "संधि", "स्वर संधि, व्यंजन संधि, विसर्ग संधि और उदाहरण", "दो शब्दों का मेल, संधि प्रकार तालिका"),
    ("Samas", "समास", "अव्ययीभाव, तत्पुरुष, कर्मधारय, द्वंद्व और बहुव्रीहि समास", "समास विग्रह, प्रकार पहचान चार्ट"),
    ("Hindi_Punctuation", "हिंदी विराम चिह्न", "पूर्ण विराम, अल्प विराम, प्रश्नवाचक, विस्मयादिबोधक और उद्धरण चिह्न", "चिह्नित अनुच्छेद, विराम चिह्न पेटी"),
    ("Hindi_Vocabulary", "हिंदी शब्द भंडार", "पर्यायवाची, विलोम, अनेकार्थक, मुहावरे और लोकोक्तियाँ", "शब्द वृक्ष, पर्याय-विलोम नेटवर्क"),
    ("Hindi_Reading_Comprehension", "हिंदी पठन बोध", "मुख्य विचार, संदर्भ, अनुमान, प्रमाण, प्रश्नोत्तर और सारांश", "चिह्नित गद्यांश, प्रमाण तीर"),
    ("Hindi_Paragraph_Writing", "हिंदी अनुच्छेद लेखन", "मुख्य वाक्य, सहायक विवरण, क्रमबद्धता और निष्कर्ष", "अनुच्छेद संरचना, वाक्य भूमिका लेबल"),
    ("Hindi_Essay_Writing", "हिंदी निबंध लेखन", "भूमिका, विषय विस्तार, उदाहरण, तर्क और उपसंहार", "निबंध पिरामिड, विचार मानचित्र"),
    ("Hindi_Letter_Writing", "हिंदी पत्र लेखन", "औपचारिक पत्र, अनौपचारिक पत्र, पता, संबोधन, विषय और समापन", "पत्र प्रारूप, भागों के लेबल"),
    ("Hindi_Poetry", "हिंदी कविता विश्लेषण", "छंद, तुक, लय, बिंब, रस, भाव और अलंकार", "कविता पंक्ति विश्लेषण, तुक योजना"),
    ("Alankar", "अलंकार", "उपमा, रूपक, अनुप्रास, अतिशयोक्ति, मानवीकरण और श्लेष", "अलंकार उदाहरण, अर्थ-चित्र तुलना"),
    ("Hindi_Prose_Analysis", "हिंदी गद्य विश्लेषण", "पात्र, कथानक, संदेश, भाषा शैली और लेखक दृष्टिकोण", "गद्यांश, पात्र मानचित्र, संदेश पैनल"),
    ("Hindi_Common_Errors", "हिंदी सामान्य अशुद्धियाँ", "वर्तनी, लिंग, वचन, कारक, क्रिया और वाक्य अशुद्धियाँ", "गलत-सही उदाहरण, अशुद्धि जाँच सूची"),
    ("Hindi_Speech_and_Debate", "हिंदी भाषण और वाद-विवाद", "भाषण संरचना, तर्क, प्रमाण, प्रत्युत्तर और प्रस्तुति कौशल", "भाषण रूपरेखा, तर्क मानचित्र"),
    ("Hindi_Literature_Timeline", "हिंदी साहित्य इतिहास", "आदिकाल, भक्तिकाल, रीतिकाल, आधुनिक काल और प्रमुख लेखक", "साहित्य कालरेखा, लेखक पैनल"),
    ("Hindi_Idioms_and_Proverbs", "मुहावरे और लोकोक्तियाँ", "अर्थ, संदर्भ, प्रयोग और उदाहरण", "मुहावरा-अर्थ-प्रयोग तालिका"),
    ("Hindi_Translation_Skills", "हिंदी अनुवाद कौशल", "भावानुवाद, शब्दानुवाद, संदर्भ, शैली और सांस्कृतिक अर्थ", "अंग्रेज़ी-हिंदी वाक्य जोड़े, भाव मानचित्र"),
    ("Hindi_Creative_Writing", "हिंदी सृजनात्मक लेखन", "कहानी, संवाद, वर्णन, पात्र निर्माण और कल्पना", "कहानी वक्र, पात्र मानचित्र, संवाद पैनल"),
    ("Hindi_Academic_Writing", "हिंदी अकादमिक लेखन", "रिपोर्ट, लेख, संदर्भ, प्रमाण, औपचारिक शैली और निष्कर्ष", "रिपोर्ट संरचना, स्रोत समावेशन"),
]


def make_prompt(subject, title, subtitle, level, focus, central, panels, flow, asset_block):
    return f"""Act as a senior {subject} infographic designer, curriculum expert, educational illustrator and visual learning specialist.

Create exactly ONE premium, highly detailed educational infographic about {title}.

# INFOGRAPHIC TITLE
{title}

# MAIN SUBTITLE
{subtitle}

# TARGET LEVEL
{level}

{QUALITY}

# VISUAL STYLE
Use a premium modern educational-infographic style combining clean vector diagrams, crisp typography, annotated examples, colour-coded structures, comparison tables, timelines, flowcharts, practice panels and strong visual hierarchy.

# CORE FOCUS
{focus}

# CENTRAL HERO VISUAL
Show a large, accurate central visual using:
{central}

# REQUIRED EDUCATIONAL PANELS
Include:
{panels}

# STEP-BY-STEP LEARNING FLOW
Show this sequence clearly:
{flow}

# APPLICATIONS OR CONNECTIONS
Include:
* School and college learning
* Exam preparation
* Practical communication or real-world use
* Common mistakes and corrected examples
* Quick review and practice prompt

# COMPOSITION
Top: title, subtitle and level label.
Centre: large hero diagram, text map, protocol flow or annotated example.
Upper left: key definitions and notation.
Upper right: rules, formulas, patterns or framework.
Lower left: worked examples or analysis.
Lower right: applications, mistakes, security/literary/context notes.
Bottom strip: key facts, glossary, common mistakes and quick practice.

# TYPOGRAPHY
* Bold modern sans-serif headings
* Large readable examples
* Correct script rendering
* Consistent notation and labels
* No text overlapping diagrams
* Clean spacing and readable line length

{asset_block}

# FINAL RENDERING REQUIREMENTS
Produce one visually rich, accurate and professionally composed 8K infographic suitable for classroom teaching, self-study, digital learning, exam preparation and large-format printing.
"""


def create_library(base, subject, topics, asset_block):
    created = 0
    for idx, (slug, title, summary, central) in enumerate(topics, 1):
        folder = base / f"{idx:02d}_{slug}"
        folder.mkdir(parents=True, exist_ok=True)
        for v_idx, (v_slug, v_name, level, focus) in enumerate(VARIANTS, 1):
            panels = "* Definition panel\n* Annotated example\n* Rule or structure map\n* Common mistakes\n* Practice prompt\n* Application/context panel"
            flow = "* Introduce the concept\n* Show the basic structure\n* Annotate examples\n* Compare correct and incorrect usage\n* Apply to a short task\n* Summarise key takeaways"
            if subject == "Cryptography":
                panels = "* Threat model\n* Definition panel\n* Mathematical or protocol diagram\n* Worked toy example\n* Attack/defence notes\n* Common implementation mistakes"
                flow = "* Define the security goal\n* Show the inputs, keys and outputs\n* Walk through the primitive or protocol\n* Show verification or decryption where relevant\n* Explain the threat model\n* Summarise safe-use requirements"
            path = folder / f"{v_idx:02d}_{v_slug}.txt"
            path.write_text(make_prompt(subject, title, f"{v_name}: {summary}", level, focus, central, panels, flow, asset_block), encoding="utf-8")
            created += 1
    return created


def main():
    counts = {
        "Cryptography": create_library(ROOT / "Cryptography", "Cryptography", CRYPTO, CRYPTO_ASSET),
        "English": create_library(ROOT / "English", "English language", ENGLISH, LANG_ASSET),
        "Telugu": create_library(ROOT / "Telugu", "Telugu language", TELUGU, LANG_ASSET),
        "Hindi": create_library(ROOT / "Hindi", "Hindi language", HINDI, LANG_ASSET),
    }
    for name, count in counts.items():
        print(f"Created {count} {name} infographic prompt files")


if __name__ == "__main__":
    main()
