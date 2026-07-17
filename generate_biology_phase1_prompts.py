from pathlib import Path

BASE = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts")

QUALITY = """# OUTPUT QUALITY
* Ultra-HD 8K resolution
* Exact canvas size: 7680 x 4320 px
* Landscape orientation
* Extremely sharp scientific illustration
* Print-quality educational graphics
* Crisp, correctly spelled labels
* Professional medical-college, biology-classroom and science-museum quality
* No blurry or distorted text
* No scientific or anatomical errors
* No watermarks
* No logos
* No stock-image appearance
* No unnecessary visual clutter"""

FINAL = """# FINAL RENDERING REQUIREMENTS
Produce one visually rich, scientifically accurate and professionally composed 8K infographic suitable for school biology, college biology, medical and nursing education, hospital awareness displays, science museums, digital learning applications and large-format printing.

Prioritise scientific accuracy, clear visual storytelling, sharp labelling, readable typography, balanced composition and premium 8K presentation."""


def prompt(spec):
    return f"""Act as a senior medical infographic designer, biology illustrator, anatomy editor and scientific-visualization specialist.

Create exactly ONE premium, highly detailed educational infographic about {spec['about']}.

# INFOGRAPHIC TITLE
{spec['title']}

# MAIN SUBTITLE
{spec['subtitle']}

{QUALITY}

# VISUAL STYLE
Use a premium modern scientific-infographic style combining realistic three-dimensional anatomy or molecular structure, clean vector-style educational diagrams, transparent cutaways, colour-coded systems, microscopic detail panels, glass-like information panels, precise annotation lines, subtle gradients, balanced spacing and strong visual hierarchy.

Use consistent colour coding:
{spec['colors']}

# BACKGROUND
Create a sophisticated white-to-light-blue clinical/scientific gradient background with subtle grid lines, faint molecular or anatomical patterns, soft glows related to the topic and generous negative space.

# CENTRAL HERO ILLUSTRATION
Place a large, scientifically accurate central illustration.

Show and clearly label:
{spec['central']}

# REQUIRED EDUCATIONAL PANELS
Create well-organized supporting panels covering:
{spec['panels']}

# PROCESS OR PATHWAY DIAGRAM
Include a clear step-by-step pathway or sequence:
{spec['process']}

# KEY FACTS PANEL
Create a clean statistics and key-facts panel with icons. Include concise, evidence-based facts only. Avoid exaggerated claims, unsupported numbers and misleading simplifications.

# COMMON CONDITIONS, ERRORS OR APPLICATIONS
Include a neutral educational panel covering:
{spec['conditions']}

Use careful wording. Medical topics must include that symptoms, causes and treatments vary and professional evaluation is required for diagnosis.

# COMPOSITION
Use a premium, structured layout:
* Top: title, subtitle and short introduction
* Centre: large hero illustration
* Upper left: main anatomy or structure labels
* Upper right: key functions and mechanisms
* Lower left: microscopic or molecular detail
* Lower right: pathway, comparison or clinical/application panel
* Bottom strip: key facts, health/safety notes, myths and common misconceptions

Specific composition guidance:
{spec['composition']}

# TYPOGRAPHY
* Bold modern sans-serif font
* Large, highly legible main title
* Clear uppercase section headings
* Large readable body text
* Consistent label size
* Correct scientific terminology
* No spelling mistakes
* No text overlapping diagrams
* Use short captions rather than dense paragraphs
* Preserve scientific symbols and punctuation correctly

# SCIENTIFIC ACCURACY REQUIREMENTS
{spec['accuracy']}

{FINAL}
"""


SPECS = [
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "01_Human_Brain.txt",
        "about": "the HUMAN BRAIN",
        "title": "THE HUMAN BRAIN",
        "subtitle": "An illustrated guide to brain anatomy, functional regions, neural communication, protection and brain health",
        "colors": "* Frontal lobe blue\n* Parietal lobe yellow\n* Temporal lobe green\n* Occipital lobe purple\n* Cerebellum orange\n* Brainstem red\n* Limbic system magenta\n* Motor pathways cyan\n* Sensory pathways gold\n* Arterial blood red\n* Venous drainage blue",
        "central": "* Cerebrum\n* Cerebral cortex\n* Left and right cerebral hemispheres\n* Corpus callosum\n* Thalamus\n* Hypothalamus\n* Pituitary gland\n* Hippocampus\n* Amygdala\n* Basal ganglia\n* Ventricles\n* Cerebellum\n* Midbrain\n* Pons\n* Medulla oblongata\n* Spinal cord",
        "panels": "* Four major lobes and their functions\n* Left and right hemispheres with an accuracy note\n* Limbic system\n* Brainstem vital functions\n* Cerebellum and coordination\n* Motor and sensory cortex\n* Language network\n* Neuron and synapse\n* Grey matter and white matter\n* Meninges and cerebrospinal fluid\n* Cerebral blood supply and blood-brain barrier\n* EEG waves, memory, development and neuroplasticity",
        "process": "* Sensory input reaches cortex\n* Neurons integrate signals\n* Action potentials travel along axons\n* Neurotransmitters cross synapses\n* Motor commands descend through spinal pathways\n* Feedback refines movement and perception",
        "conditions": "* Stroke\n* Epilepsy\n* Migraine\n* Dementia\n* Parkinson's disease\n* Multiple sclerosis\n* Traumatic brain injury\n* Meningitis\n* Brain tumour warning signs\n* FAST stroke warning panel",
        "composition": "Keep the external/cutaway brain dominant. Place neuron and synapse panels at lower left and vascular/protection panels at lower right.",
        "accuracy": "* Keep cerebellum behind and below cerebrum\n* Do not reverse hemispheres\n* Do not use the false 10 percent brain usage claim\n* Do not reduce behaviour to simple left-brain/right-brain myths\n* Show myelin on axons, not dendrites\n* Distinguish grey and white matter clearly",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "02_Human_Heart.txt",
        "about": "the HUMAN HEART",
        "title": "THE HUMAN HEART",
        "subtitle": "An illustrated guide to cardiac anatomy, blood flow, valves, electrical conduction, coronary circulation and heart health",
        "colors": "* Oxygenated blood bright red\n* Deoxygenated blood blue\n* Valves white-gold\n* Conduction system yellow\n* Coronary arteries red\n* Coronary veins blue\n* Myocardium deep red\n* Pericardium translucent silver",
        "central": "* Right atrium\n* Right ventricle\n* Left atrium\n* Left ventricle\n* Interventricular septum\n* Superior vena cava\n* Inferior vena cava\n* Pulmonary trunk and arteries\n* Pulmonary veins\n* Aorta\n* Apex\n* Myocardium\n* Endocardium\n* Pericardium",
        "panels": "* Four chambers\n* Tricuspid, pulmonary, mitral and aortic valves\n* Chordae tendineae and papillary muscles\n* SA node, AV node, bundle of His and Purkinje fibres\n* ECG P wave, QRS complex and T wave\n* Coronary arteries and veins\n* Cardiac cycle\n* Heart rate, stroke volume and cardiac output",
        "process": "* Body tissues to venae cavae\n* Right atrium\n* Tricuspid valve\n* Right ventricle\n* Pulmonary valve\n* Lungs\n* Pulmonary veins\n* Left atrium\n* Mitral valve\n* Left ventricle\n* Aortic valve\n* Body tissues",
        "conditions": "* Coronary artery disease\n* Heart attack\n* Heart failure\n* Arrhythmia\n* Hypertension\n* Valve disease\n* Emergency signs such as chest pressure, shortness of breath, sweating, nausea, fainting and pain radiating to arm, jaw or back",
        "composition": "Use the central cutaway heart as the anchor. Put blood-flow sequence on the left and conduction/ECG on the right.",
        "accuracy": "* Do not mix oxygenated and deoxygenated blood flow\n* Keep valve placement correct\n* Show pulmonary arteries carrying deoxygenated blood and pulmonary veins carrying oxygenated blood\n* Do not show coronary vessels randomly connected\n* Avoid implying heart attack symptoms are identical in all people",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "03_Human_Kidney.txt",
        "about": "the HUMAN KIDNEY",
        "title": "THE HUMAN KIDNEY",
        "subtitle": "An illustrated guide to kidney anatomy, nephron function, filtration, urine formation, blood pressure regulation and kidney health",
        "colors": "* Renal artery red\n* Renal vein blue\n* Urine pathway yellow-gold\n* Cortex tan\n* Medulla deep rose\n* Renal pelvis pale yellow\n* Nephron tubules teal\n* Glomerulus red-purple\n* Collecting duct orange",
        "central": "* Renal capsule\n* Cortex\n* Medulla\n* Renal pyramids\n* Renal columns\n* Minor and major calyces\n* Renal pelvis\n* Ureter\n* Renal artery\n* Renal vein\n* Segmental arteries\n* Renal papilla",
        "panels": "* Nephron anatomy\n* Afferent and efferent arterioles\n* Glomerulus and Bowman's capsule\n* Proximal tubule, loop of Henle, distal tubule and collecting duct\n* Peritubular capillaries and vasa recta\n* Glomerular filtration barrier\n* Water, electrolyte and acid-base balance\n* RAAS blood-pressure regulation\n* Erythropoietin and vitamin D activation",
        "process": "* Blood enters glomerulus\n* Filtration moves small solutes into Bowman's space\n* Useful molecules are reabsorbed\n* Additional waste is secreted\n* Loop of Henle concentrates filtrate\n* Collecting duct adjusts water balance\n* Urine drains to calyces, renal pelvis and ureter",
        "conditions": "* Kidney stones\n* Urinary tract infection\n* Acute kidney injury\n* Chronic kidney disease\n* Glomerulonephritis\n* Diabetic kidney disease\n* Warning signs such as blood in urine, swelling, reduced urine output, severe flank pain and fever with urinary symptoms",
        "composition": "Place the kidney cutaway in the centre, nephron and filtration barrier on the left, urine formation and homeostasis panels on the right.",
        "accuracy": "* Show cortex outside medulla\n* Keep urine flow separate from blood flow\n* Do not show red blood cells normally entering tubules\n* Show kidneys as homeostatic and endocrine organs, not only waste filters",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "04_Human_Lungs_and_Respiration.txt",
        "about": "the HUMAN LUNGS AND RESPIRATION",
        "title": "THE HUMAN LUNGS AND RESPIRATION",
        "subtitle": "An illustrated guide to airway anatomy, breathing mechanics, alveolar gas exchange, oxygen transport and respiratory health",
        "colors": "* Inhaled air cyan\n* Carbon dioxide grey\n* Oxygen-rich blood red\n* Oxygen-poor blood blue\n* Bronchi warm tan\n* Alveoli pale pink\n* Diaphragm purple\n* Mucus amber",
        "central": "* Nose and nasal cavity\n* Pharynx\n* Larynx\n* Trachea\n* Right and left lungs\n* Main bronchi\n* Bronchioles\n* Alveoli\n* Pleura\n* Ribs\n* Diaphragm\n* Pulmonary arteries and veins",
        "panels": "* Inhalation and exhalation mechanics\n* Diaphragm and rib movement\n* Alveolar gas exchange\n* Surfactant and alveolar cells\n* Oxygen transport by haemoglobin\n* Carbon dioxide transport\n* Airway defence through mucus, cilia and cough\n* Lung volumes and spirometry overview",
        "process": "* Air enters nose or mouth\n* Passes through pharynx, larynx and trachea\n* Branches through bronchi and bronchioles\n* Reaches alveoli\n* Oxygen diffuses into capillaries\n* Carbon dioxide diffuses into alveoli\n* Exhalation removes carbon dioxide-rich air",
        "conditions": "* Asthma\n* Pneumonia\n* Bronchitis\n* COPD\n* Tuberculosis\n* Pulmonary embolism\n* Lung cancer\n* Warning signs such as severe shortness of breath, blue lips, chest pain, coughing blood, confusion and high fever with breathing difficulty",
        "composition": "Use transparent lungs and airway tree centrally. Put breathing mechanics left and alveolar gas exchange right.",
        "accuracy": "* Do not reverse oxygen and carbon dioxide diffusion\n* Keep pulmonary arteries blue and pulmonary veins red\n* Show right lung with three lobes and left lung with two lobes when lobes are visible\n* Do not show alveoli without capillary networks",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "05_Digestive_System.txt",
        "about": "the HUMAN DIGESTIVE SYSTEM",
        "title": "THE HUMAN DIGESTIVE SYSTEM",
        "subtitle": "An illustrated guide to digestive organs, food breakdown, nutrient absorption, gut motility, microbiome support and digestive health",
        "colors": "* Food path orange\n* Enzymes purple\n* Bile green\n* Pancreatic secretions blue\n* Absorbed nutrients gold\n* Blood vessels red-blue\n* Lymphatic lacteals pale green",
        "central": "* Mouth\n* Teeth\n* Tongue\n* Salivary glands\n* Pharynx\n* Oesophagus\n* Stomach\n* Liver\n* Gallbladder\n* Pancreas\n* Duodenum\n* Jejunum\n* Ileum\n* Cecum\n* Appendix\n* Colon\n* Rectum\n* Anus",
        "panels": "* Mechanical and chemical digestion\n* Stomach acid and enzymes\n* Liver bile production\n* Gallbladder bile storage\n* Pancreatic enzymes and bicarbonate\n* Small-intestine villi and microvilli\n* Large-intestine water absorption\n* Gut microbiome\n* Peristalsis and sphincters",
        "process": "* Ingestion\n* Chewing and salivary enzymes\n* Swallowing\n* Stomach churning and acid digestion\n* Enzyme action in small intestine\n* Nutrient absorption\n* Water absorption in colon\n* Elimination",
        "conditions": "* GERD\n* Peptic ulcer disease\n* Gallstones\n* Hepatitis\n* Pancreatitis\n* Celiac disease\n* Inflammatory bowel disease\n* Irritable bowel syndrome\n* Colorectal cancer warning signs such as blood in stool, black stools, unexplained weight loss and persistent severe pain",
        "composition": "Show the full digestive pathway centrally with accessory organs beside it. Use villus absorption as the microscopic lower panel.",
        "accuracy": "* Do not show most absorption in the stomach\n* Keep accessory organs separate from the hollow digestive tract\n* Show most nutrient absorption in the small intestine\n* Avoid portraying all gut bacteria as harmful",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "06_Human_Nervous_System.txt",
        "about": "the HUMAN NERVOUS SYSTEM",
        "title": "THE HUMAN NERVOUS SYSTEM",
        "subtitle": "An illustrated guide to the central nervous system, peripheral nerves, sensory pathways, motor control, autonomic regulation and neural communication",
        "colors": "* CNS blue-violet\n* Sensory pathways gold\n* Motor pathways cyan\n* Sympathetic system red-orange\n* Parasympathetic system green\n* Reflex arc yellow\n* Myelin white-blue",
        "central": "* Brain\n* Cerebellum\n* Brainstem\n* Spinal cord\n* Cranial nerves\n* Spinal nerves\n* Brachial plexus\n* Sciatic nerve\n* Median nerve\n* Ulnar nerve\n* Radial nerve\n* Femoral nerve\n* Tibial nerve",
        "panels": "* CNS versus PNS\n* Somatic and autonomic divisions\n* Sympathetic, parasympathetic and enteric systems\n* Neuron structure\n* Glial cells\n* Sensory pathways\n* Motor pathways\n* Reflex arc\n* Autonomic effects on organs",
        "process": "* Receptors detect stimuli\n* Sensory neurons carry signals to CNS\n* Interneurons process information\n* Motor neurons carry commands to muscles or glands\n* Reflex arcs can produce rapid protective responses\n* Brain feedback refines voluntary action",
        "conditions": "* Neuropathy\n* Multiple sclerosis\n* Spinal cord injury\n* Stroke\n* Epilepsy\n* Meningitis\n* Parkinson's disease\n* Migraine\n* Warning signs such as sudden weakness, seizure, severe headache, neck stiffness with fever and loss of sensation",
        "composition": "Use a full-body nerve map centrally, with classification tree on one side and reflex/sensory/motor pathways on the other.",
        "accuracy": "* Distinguish CNS from PNS\n* Show sensory and motor directions correctly\n* Do not imply nerves are hollow tubes\n* Show myelin on axons\n* Avoid assigning complex behaviours to single nerves",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "07_Endocrine_System.txt",
        "about": "the HUMAN ENDOCRINE SYSTEM",
        "title": "THE HUMAN ENDOCRINE SYSTEM",
        "subtitle": "An illustrated guide to hormone-producing glands, feedback loops, metabolism, growth, stress response, reproduction and homeostasis",
        "colors": "* Hypothalamus violet\n* Pituitary magenta\n* Thyroid blue\n* Parathyroids teal\n* Thymus light green\n* Adrenal glands orange\n* Pancreas yellow\n* Ovaries pink\n* Testes indigo\n* Hormone transport red-purple",
        "central": "* Hypothalamus\n* Pituitary gland\n* Pineal gland\n* Thyroid gland\n* Parathyroid glands\n* Thymus\n* Adrenal glands\n* Pancreas\n* Ovaries\n* Testes\n* Placenta as pregnancy-specific",
        "panels": "* Hormone transport through blood\n* Hypothalamus-pituitary axes\n* Thyroid regulation\n* Adrenal stress response\n* Blood glucose control\n* Growth hormone\n* Melatonin and circadian rhythm\n* Reproductive hormones\n* Endocrine versus nervous signalling",
        "process": "* Hypothalamus releases regulatory hormones\n* Pituitary releases tropic hormones\n* Target gland secretes hormone\n* Hormone reaches target tissues through blood\n* Physiological response occurs\n* Negative feedback adjusts further release",
        "conditions": "* Diabetes mellitus\n* Hypothyroidism\n* Hyperthyroidism\n* Cushing syndrome\n* Addison disease\n* Growth disorders\n* PCOS\n* Warning signs such as extreme thirst, unexplained weight change, severe fatigue, heat or cold intolerance and confusion with very high or low blood sugar",
        "composition": "Use a full-body gland map centrally. Put feedback loops and glucose control in large readable panels.",
        "accuracy": "* Do not place glands randomly\n* Do not imply one hormone has only one effect\n* Distinguish endocrine from exocrine secretion\n* Avoid vague wellness claims about hormone balance",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "08_Immune_System.txt",
        "about": "the HUMAN IMMUNE SYSTEM",
        "title": "THE HUMAN IMMUNE SYSTEM",
        "subtitle": "An illustrated guide to immune organs, innate defense, adaptive immunity, antibodies, inflammation, vaccines and immune memory",
        "colors": "* Innate immunity orange\n* Adaptive immunity blue\n* Antibodies gold\n* Pathogens red\n* Lymphatics green\n* Inflammation pink-red\n* Memory cells purple\n* Vaccines teal",
        "central": "* Bone marrow\n* Thymus\n* Spleen\n* Lymph nodes\n* Lymphatic vessels\n* Tonsils\n* Skin barrier\n* Mucous membranes\n* Gut-associated lymphoid tissue",
        "panels": "* Physical and chemical barriers\n* Inflammation\n* Fever\n* Phagocytosis\n* Complement\n* Natural killer cells\n* Dendritic cells\n* T cells and B cells\n* Antibody structure\n* Immune memory\n* Vaccination concept",
        "process": "* Barrier blocks entry\n* Innate cells detect invaders\n* Dendritic cells present antigen\n* Helper T cells coordinate response\n* B cells produce antibodies\n* Cytotoxic T cells kill infected cells\n* Memory cells support faster future responses",
        "conditions": "* Allergy\n* Autoimmune disease\n* Immunodeficiency\n* Chronic inflammation\n* Transplant rejection\n* Infection warning signs such as high fever, confusion, rapidly spreading rash, breathing difficulty and severe dehydration",
        "composition": "Place lymphatic/immune organs centrally, innate immunity left, adaptive immunity right, antibodies and vaccination along the bottom.",
        "accuracy": "* Do not portray all microbes as harmful\n* Do not claim vaccines provide instant complete protection\n* Distinguish innate and adaptive immunity\n* Show antibodies binding and tagging rather than acting like weapons",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "09_Reproductive_System.txt",
        "about": "the HUMAN REPRODUCTIVE SYSTEM",
        "title": "THE HUMAN REPRODUCTIVE SYSTEM",
        "subtitle": "An illustrated guide to reproductive anatomy, gamete production, hormones, menstrual cycle, fertilization, pregnancy basics and reproductive health",
        "colors": "* Female reproductive organs rose\n* Male reproductive organs blue\n* Hormones purple\n* Ovulation gold\n* Fertilization teal\n* Pregnancy development green\n* Blood flow red-blue",
        "central": "* Ovaries\n* Fallopian tubes\n* Uterus\n* Endometrium\n* Cervix\n* Vagina\n* Vulva\n* Testes\n* Epididymis\n* Vas deferens\n* Seminal vesicles\n* Prostate gland\n* Urethra\n* Penis",
        "panels": "* Gamete production\n* Egg and sperm structure\n* HPG axis\n* FSH and LH\n* Estrogen and progesterone\n* Testosterone\n* Menstrual cycle phases\n* Fertilization and implantation\n* Puberty, contraception, STI prevention and reproductive health",
        "process": "* Gametes form through meiosis\n* Ovulation releases an egg\n* Sperm travel through reproductive tract\n* Fertilization usually occurs in fallopian tube\n* Zygote divides\n* Blastocyst reaches uterus\n* Implantation may occur in endometrium",
        "conditions": "* STI education\n* Infertility\n* PCOS\n* Endometriosis\n* Menstrual disorders\n* Testicular and prostate health\n* Warning signs such as severe pelvic pain, abnormal bleeding, testicular lump, painful urination, unusual discharge and pregnancy complications",
        "composition": "Use respectful balanced anatomy diagrams. Keep cycle, hormones and fertilization in separate clean panels.",
        "accuracy": "* Do not show fertilization primarily in the uterus\n* Do not imply all cycles are exactly 28 days\n* Keep presentation clinical and respectful\n* Avoid implying hormones determine all traits or behaviours",
    },
    {
        "category": "01_Human_Anatomy_and_Physiology",
        "file": "10_Skeletal_and_Muscular_System.txt",
        "about": "the SKELETAL AND MUSCULAR SYSTEMS",
        "title": "THE SKELETAL AND MUSCULAR SYSTEMS",
        "subtitle": "An illustrated guide to bones, joints, muscles, movement, posture, bone remodeling, muscle contraction and musculoskeletal health",
        "colors": "* Bones ivory\n* Cartilage blue-white\n* Tendons silver\n* Ligaments teal\n* Skeletal muscle red\n* Actin pink\n* Myosin purple\n* Nerves yellow\n* Blood vessels red-blue",
        "central": "* Skull\n* Vertebral column\n* Ribs\n* Sternum\n* Clavicle\n* Scapula\n* Humerus\n* Radius\n* Ulna\n* Pelvis\n* Femur\n* Patella\n* Tibia\n* Fibula\n* Major muscle groups\n* Tendons\n* Joints",
        "panels": "* Long-bone structure\n* Compact and spongy bone\n* Bone marrow\n* Synovial joint anatomy\n* Hinge, ball-and-socket, pivot and gliding joints\n* Muscle fibre hierarchy\n* Sarcomere structure\n* Sliding-filament mechanism\n* Agonist-antagonist muscle pairs",
        "process": "* Motor neuron activates muscle fibre\n* Calcium signal exposes binding sites\n* Myosin binds actin\n* Power stroke shortens sarcomere\n* Tendon pulls bone\n* Joint movement occurs\n* Sensory feedback refines posture and force",
        "conditions": "* Fracture\n* Osteoporosis\n* Arthritis\n* Sprain\n* Strain\n* Tendon injury\n* Muscular dystrophy\n* Scoliosis\n* Warning signs such as deformity, inability to bear weight, numbness after injury, open fracture and sudden weakness",
        "composition": "Use a half-skeleton half-muscle full-body figure centrally, with bone/joint details left and muscle contraction right.",
        "accuracy": "* Muscles pull bones through tendons; they do not push bones\n* Ligaments connect bone to bone\n* Tendons connect muscle to bone\n* Show cartilage at joint surfaces\n* Avoid impossible joint directions",
    },
]

SPECS += [
    {
        "category": "02_Cell_Biology",
        "file": "01_Animal_Cell.txt",
        "about": "the ANIMAL CELL",
        "title": "THE ANIMAL CELL",
        "subtitle": "An illustrated guide to eukaryotic cell structure, organelles, membranes, energy production, protein processing and cellular communication",
        "colors": "* Plasma membrane blue\n* Nucleus purple\n* Nucleolus dark violet\n* Mitochondria orange\n* Rough ER teal\n* Smooth ER cyan\n* Golgi pink\n* Lysosomes red\n* Peroxisomes yellow\n* Ribosomes black\n* Cytoskeleton green",
        "central": "* Plasma membrane\n* Cytoplasm\n* Nucleus\n* Nuclear envelope and pores\n* Nucleolus\n* Chromatin\n* Mitochondria\n* Rough ER\n* Smooth ER\n* Ribosomes\n* Golgi apparatus\n* Vesicles\n* Lysosomes\n* Peroxisomes\n* Centrosome and centrioles\n* Cytoskeleton",
        "panels": "* Organelle functions\n* Membrane structure\n* Phospholipid bilayer\n* Diffusion, osmosis and active transport\n* Protein trafficking from DNA to RNA to ribosome to ER to Golgi\n* Cell signalling receptors\n* Cytoskeleton transport\n* Animal versus plant cell comparison",
        "process": "* DNA instructions are transcribed\n* mRNA exits nucleus\n* Ribosome translates protein\n* Rough ER folds protein\n* Vesicle transports protein to Golgi\n* Golgi modifies and sorts protein\n* Secretory vesicle fuses with membrane",
        "conditions": "* Organelle dysfunction examples\n* Lysosomal storage disease concept\n* Mitochondrial disease concept\n* Cancer as cell-cycle dysregulation\n* Viral entry as membrane interaction\n* Laboratory applications such as cell culture and microscopy",
        "composition": "Make the 3D animal-cell cutaway dominant, with organelle function labels around the perimeter and membrane/protein pathway panels below.",
        "accuracy": "* Do not include cell wall or chloroplasts\n* Show ribosomes both free and on rough ER\n* Keep organelles in plausible scale relationships\n* Do not imply mitochondria are the only energy-related cell structure",
    },
    {
        "category": "02_Cell_Biology",
        "file": "02_Plant_Cell.txt",
        "about": "the PLANT CELL",
        "title": "THE PLANT CELL",
        "subtitle": "An illustrated guide to plant-cell organelles, cell wall support, chloroplasts, photosynthesis, vacuoles, plasmodesmata and cellular function",
        "colors": "* Cell wall green\n* Plasma membrane blue\n* Chloroplasts emerald\n* Vacuole light cyan\n* Nucleus purple\n* Mitochondria orange\n* ER teal\n* Golgi pink\n* Plasmodesmata yellow\n* Starch granules cream",
        "central": "* Cell wall\n* Plasma membrane\n* Cytoplasm\n* Nucleus\n* Nucleolus\n* Chloroplasts\n* Central vacuole\n* Tonoplast\n* Mitochondria\n* Rough ER\n* Smooth ER\n* Ribosomes\n* Golgi apparatus\n* Peroxisomes\n* Cytoskeleton\n* Plasmodesmata\n* Starch grains",
        "panels": "* Cell wall layers and cellulose microfibrils\n* Turgor pressure\n* Chloroplast structure\n* Photosynthesis equation\n* Central vacuole functions\n* Plasmodesmata communication\n* Plant versus animal cell comparison\n* Mitochondria and respiration in plants",
        "process": "* Water enters vacuole\n* Turgor pressure supports cell shape\n* Chloroplasts capture light energy\n* Carbon dioxide is fixed into sugars\n* Mitochondria release usable energy\n* Plasmodesmata allow cell-to-cell communication",
        "conditions": "* Plasmolysis under hypertonic conditions\n* Wilting as loss of turgor\n* Chlorosis as reduced chlorophyll appearance\n* Plant pathogen entry concepts\n* Agricultural relevance of plant-cell structure",
        "composition": "Use a rectangular plant-cell cutaway centrally, chloroplast/photosynthesis panel right and wall/vacuole/turgor panel left.",
        "accuracy": "* Do not show plant cells as lacking mitochondria\n* Do not make centrioles a defining plant-cell feature\n* Keep photosynthesis in chloroplasts and respiration in mitochondria\n* Do not say plants get food directly from soil",
    },
    {
        "category": "02_Cell_Biology",
        "file": "03_Cell_Membrane_and_Transport.txt",
        "about": "the CELL MEMBRANE AND TRANSPORT",
        "title": "CELL MEMBRANE AND TRANSPORT",
        "subtitle": "An illustrated guide to the phospholipid bilayer, membrane proteins, diffusion, osmosis, active transport, endocytosis and exocytosis",
        "colors": "* Phospholipid heads blue\n* Fatty-acid tails yellow\n* Cholesterol orange\n* Channel proteins purple\n* Carrier proteins teal\n* Pumps red\n* ATP gold\n* Water cyan\n* Ions green\n* Vesicles pink",
        "central": "* Hydrophilic heads\n* Hydrophobic tails\n* Cholesterol\n* Integral proteins\n* Peripheral proteins\n* Glycoproteins\n* Glycolipids\n* Carbohydrate chains\n* Cytoskeleton attachment\n* Extracellular matrix",
        "panels": "* Fluid mosaic model\n* Simple diffusion\n* Facilitated diffusion\n* Osmosis through aquaporins\n* Active transport pumps\n* Sodium-potassium pump\n* Cotransport\n* Endocytosis\n* Exocytosis\n* Tonicity in animal and plant cells",
        "process": "* Molecules encounter membrane\n* Small nonpolar molecules diffuse through bilayer\n* Polar molecules use channels or carriers\n* Pumps use ATP to move substances against gradients\n* Vesicles bud inward during endocytosis\n* Vesicles fuse outward during exocytosis",
        "conditions": "* Cystic fibrosis as ion-channel concept\n* Dehydration and osmotic balance\n* Drug transport across membranes\n* Receptor-mediated viral entry concept\n* Membrane defects and cell signalling errors",
        "composition": "Make the membrane cross-section span the centre. Use passive transport left, active transport right, and vesicle transport along the bottom.",
        "accuracy": "* Osmosis is net water movement, not solute movement\n* Do not show polar molecules freely crossing hydrophobic core\n* Mark ATP use only where energy is required\n* Distinguish passive transport from active transport",
    },
    {
        "category": "02_Cell_Biology",
        "file": "04_Mitosis_Cell_Division.txt",
        "about": "MITOSIS",
        "title": "MITOSIS: CELL DIVISION",
        "subtitle": "An illustrated guide to chromosome duplication, mitotic stages, spindle fibres, cytokinesis and accurate daughter-cell formation",
        "colors": "* Chromosomes purple\n* Kinetochores gold\n* Spindle fibres green\n* Centrosomes orange\n* Nuclear envelope blue\n* Cytoplasm pale cyan\n* Cleavage furrow red-pink",
        "central": "* Interphase\n* Prophase\n* Prometaphase\n* Metaphase\n* Anaphase\n* Telophase\n* Cytokinesis\n* Sister chromatids\n* Centromere\n* Kinetochore\n* Spindle apparatus\n* Centrosomes",
        "panels": "* Cell cycle overview\n* Chromosome structure\n* Spindle apparatus\n* Metaphase plate\n* Sister chromatid separation\n* Animal cytokinesis by cleavage furrow\n* Plant cytokinesis by cell plate\n* Checkpoints and error prevention",
        "process": "* DNA replicates before mitosis\n* Chromosomes condense\n* Nuclear envelope breaks down\n* Spindle attaches to kinetochores\n* Chromosomes align\n* Sister chromatids separate\n* Nuclei reform\n* Cytoplasm divides",
        "conditions": "* Cancer as uncontrolled cell division concept\n* Nondisjunction as chromosome-separation error\n* Tissue repair and growth\n* Asexual reproduction in some organisms\n* Laboratory microscopy of onion root tip mitosis",
        "composition": "Use a large circular or horizontal stage timeline. Add chromosome anatomy and spindle mechanics as enlarged side panels.",
        "accuracy": "* Do not confuse mitosis with meiosis\n* Do not show crossing over in mitosis\n* Mitosis produces genetically similar daughter cells with same chromosome number\n* Sister chromatids separate during anaphase",
    },
    {
        "category": "02_Cell_Biology",
        "file": "05_Meiosis_and_Gamete_Formation.txt",
        "about": "MEIOSIS AND GAMETE FORMATION",
        "title": "MEIOSIS AND GAMETE FORMATION",
        "subtitle": "An illustrated guide to chromosome reduction, crossing over, independent assortment, genetic variation and haploid gametes",
        "colors": "* Maternal chromosomes magenta\n* Paternal chromosomes blue\n* Crossing-over regions gold\n* Spindle fibres green\n* Nuclei violet\n* Gametes teal\n* Chromosome errors red",
        "central": "* Meiosis I\n* Meiosis II\n* Homologous chromosomes\n* Tetrads\n* Chiasmata\n* Crossing over\n* Metaphase I alignment\n* Homolog separation\n* Sister chromatid separation\n* Four haploid gametes",
        "panels": "* Prophase I to telophase II\n* Crossing over\n* Independent assortment\n* Haploid versus diploid\n* Spermatogenesis\n* Oogenesis\n* Genetic variation\n* Nondisjunction",
        "process": "* Diploid cell replicates DNA\n* Homologous chromosomes pair\n* Crossing over exchanges segments\n* Homologs separate in meiosis I\n* Sister chromatids separate in meiosis II\n* Four genetically different haploid cells form",
        "conditions": "* Nondisjunction\n* Aneuploidy concepts\n* Infertility evaluation context\n* Genetic diversity\n* Chromosomal disorders explained with respectful neutral wording",
        "composition": "Use a two-division timeline with Meiosis I and Meiosis II clearly separated. Put variation mechanisms in large callouts.",
        "accuracy": "* No DNA replication between meiosis I and meiosis II\n* Crossing over occurs in prophase I\n* Homologs separate in meiosis I\n* Sister chromatids separate in meiosis II\n* Meiosis does not produce identical cells",
    },
    {
        "category": "02_Cell_Biology",
        "file": "06_Cellular_Respiration.txt",
        "about": "CELLULAR RESPIRATION",
        "title": "CELLULAR RESPIRATION",
        "subtitle": "An illustrated guide to glycolysis, pyruvate oxidation, Krebs cycle, electron transport chain, chemiosmosis and ATP production",
        "colors": "* Glucose gold\n* Pyruvate orange\n* Acetyl-CoA pink\n* NADH blue\n* FADH2 purple\n* Electrons yellow-white\n* Protons green\n* ATP bright gold\n* Oxygen red\n* Carbon dioxide grey",
        "central": "* Cytoplasm\n* Mitochondrion\n* Outer membrane\n* Inner membrane\n* Cristae\n* Intermembrane space\n* Matrix\n* Electron transport chain complexes\n* ATP synthase",
        "panels": "* Glycolysis\n* Pyruvate oxidation\n* Krebs cycle\n* Electron transport chain\n* Proton gradient\n* Chemiosmosis\n* ATP synthase\n* Oxygen as final electron acceptor\n* Fermentation comparison",
        "process": "* Glucose is split in glycolysis\n* Pyruvate enters mitochondrion\n* Acetyl-CoA enters Krebs cycle\n* NADH and FADH2 carry electrons\n* Electron transport pumps protons\n* ATP synthase produces ATP\n* Oxygen combines with electrons and protons to form water",
        "conditions": "* Lactic acid fermentation during limited oxygen\n* Mitochondrial disease concept\n* Cyanide blocking ETC concept\n* Exercise metabolism\n* Diabetes energy-use context",
        "composition": "Make the mitochondrion cutaway central, with glycolysis outside it and ETC/ATP synthase enlarged on the inner membrane.",
        "accuracy": "* Glycolysis occurs in cytoplasm\n* Use approximate ATP yield language\n* Oxygen does not directly produce ATP\n* Carbon dioxide is released during pyruvate oxidation and Krebs cycle, not glycolysis",
    },
    {
        "category": "02_Cell_Biology",
        "file": "07_Photosynthesis.txt",
        "about": "PHOTOSYNTHESIS",
        "title": "PHOTOSYNTHESIS",
        "subtitle": "An illustrated guide to chloroplast structure, light reactions, Calvin cycle, carbon fixation, glucose production and plant energy flow",
        "colors": "* Sunlight yellow\n* Chlorophyll green\n* Water blue\n* Oxygen red\n* Carbon dioxide grey\n* Glucose gold\n* ATP orange\n* NADPH purple\n* Thylakoid membrane emerald\n* Stroma light green",
        "central": "* Chloroplast outer membrane\n* Inner membrane\n* Stroma\n* Thylakoids\n* Grana\n* Chlorophyll\n* Thylakoid lumen\n* Starch grain\n* Leaf stomata\n* Xylem\n* Phloem",
        "panels": "* Overall photosynthesis equation\n* Light reactions\n* Photosystem II\n* Water splitting\n* Electron transport\n* Photosystem I\n* ATP and NADPH production\n* Calvin cycle\n* Carbon fixation by Rubisco\n* Sugar transport",
        "process": "* Light excites chlorophyll\n* Water is split and oxygen released\n* Electrons move through thylakoid membrane\n* Proton gradient drives ATP synthase\n* NADPH forms\n* Calvin cycle fixes carbon dioxide\n* G3P contributes to glucose and other carbohydrates",
        "conditions": "* Limiting factors such as light, carbon dioxide, temperature and water\n* Stomatal closure during water stress\n* Chlorosis concept\n* Agriculture and crop productivity applications",
        "composition": "Use a chloroplast cutaway centrally. Place light reactions on the thylakoid side and Calvin cycle in the stroma side.",
        "accuracy": "* Oxygen released comes from water splitting\n* Calvin cycle occurs in stroma\n* Plants perform cellular respiration too\n* Do not say plants get food directly from soil",
    },
    {
        "category": "02_Cell_Biology",
        "file": "08_Stem_Cells_and_Differentiation.txt",
        "about": "STEM CELLS AND DIFFERENTIATION",
        "title": "STEM CELLS AND DIFFERENTIATION",
        "subtitle": "An illustrated guide to potency, self-renewal, cell fate, tissue repair, embryonic development, adult stem cells and regenerative medicine",
        "colors": "* Totipotent cells gold\n* Pluripotent cells violet\n* Multipotent cells blue\n* Progenitor cells teal\n* Specialized cells green\n* Gene regulation magenta\n* Clinical applications orange",
        "central": "* Early embryonic cell\n* Pluripotent stem cell\n* Adult stem cell\n* Progenitor cell\n* Neuron\n* Muscle cell\n* Blood cell\n* Epithelial cell\n* Bone cell\n* Germ cell\n* Cell niche",
        "panels": "* Self-renewal\n* Differentiation\n* Potency hierarchy\n* Embryonic stem cells\n* Adult stem cells\n* Induced pluripotent stem cells\n* Gene expression changes\n* Signalling molecules\n* Tissue repair examples\n* Regenerative medicine research",
        "process": "* Stem cell receives niche signals\n* Gene-expression pattern changes\n* Potency narrows\n* Progenitor cell forms\n* Specialized cell develops\n* Mature cell performs tissue-specific function\n* Some tissues renew through resident stem cells",
        "conditions": "* Bone marrow transplantation\n* Disease modelling\n* Drug testing\n* Tissue engineering research\n* Risks of unproven stem-cell clinics\n* Tumour formation as a safety concern",
        "composition": "Make a branching cell-fate tree the centrepiece. Put potency hierarchy left and clinical/research applications right.",
        "accuracy": "* Do not claim stem cells cure all diseases\n* Distinguish adult, embryonic and induced pluripotent stem cells\n* Do not show differentiation as always reversible\n* Keep clinical claims cautious and evidence-based",
    },
    {
        "category": "02_Cell_Biology",
        "file": "09_Cancer_Cell_Biology.txt",
        "about": "CANCER CELL BIOLOGY",
        "title": "CANCER CELL BIOLOGY",
        "subtitle": "An illustrated guide to uncontrolled cell division, mutations, tumour growth, angiogenesis, invasion, metastasis and cancer treatment concepts",
        "colors": "* Normal cells blue\n* Cancer cells red-purple\n* DNA mutations yellow\n* Blood vessels red-blue\n* Immune cells green\n* Extracellular matrix grey\n* Metastasis arrows orange\n* Treatments teal",
        "central": "* Normal tissue\n* Abnormal cell growth\n* Benign tumour\n* Malignant tumour\n* Basement membrane invasion\n* Angiogenesis\n* Blood vessel entry\n* Lymphatic spread\n* Distant colonisation",
        "panels": "* Oncogenes\n* Tumour suppressor genes\n* DNA repair failure\n* Cell-cycle checkpoints\n* Apoptosis evasion\n* Angiogenesis\n* Invasion and metastasis\n* Tumour microenvironment\n* Immune evasion\n* Treatment concepts",
        "process": "* DNA mutation affects growth control\n* Cell divides abnormally\n* Additional changes accumulate\n* Tumour gains blood supply\n* Cells invade nearby tissue\n* Some enter blood or lymph\n* Surviving cells may colonise distant tissue",
        "conditions": "* Cancer screening concepts\n* Biopsy and pathology\n* Imaging and staging\n* Surgery, radiation, chemotherapy, targeted therapy, immunotherapy and hormone therapy as treatment categories\n* Warning signs presented cautiously without diagnosis claims",
        "composition": "Use tumour progression centrally, mutation/checkpoint panels left and metastasis/microenvironment panels right.",
        "accuracy": "* Not all tumours are cancer\n* Cancer is many diseases, not one disease with one cause\n* Do not imply metastasis is random teleportation\n* Avoid cure guarantees or fear-based visuals",
    },
    {
        "category": "02_Cell_Biology",
        "file": "10_Microscopy_and_Cell_Discovery.txt",
        "about": "MICROSCOPY AND CELL DISCOVERY",
        "title": "MICROSCOPY AND CELL DISCOVERY",
        "subtitle": "An illustrated guide to microscope parts, magnification, resolution, sample preparation, cell theory and modern imaging methods",
        "colors": "* Light path yellow\n* Lenses blue\n* Specimen green\n* Cells purple\n* Electron microscopy grey\n* Fluorescence magenta\n* Labels black-blue\n* Safety notes orange",
        "central": "* Eyepiece\n* Objective lenses\n* Revolving nosepiece\n* Stage\n* Stage clips\n* Condenser\n* Iris diaphragm\n* Light source\n* Coarse-focus knob\n* Fine-focus knob\n* Arm\n* Base\n* Slide and coverslip",
        "panels": "* Magnification formula\n* Resolution concept\n* Optical path\n* Wet mount preparation\n* Staining\n* Onion epidermis, cheek cell and pond-water examples\n* Cell theory timeline\n* Brightfield, phase contrast, fluorescence, confocal, SEM and TEM comparison\n* Biological scale ladder",
        "process": "* Prepare specimen\n* Place sample on slide\n* Add stain if needed\n* Use coverslip safely\n* Start with low-power objective\n* Adjust focus and light\n* Increase magnification\n* Record labelled observations",
        "conditions": "* Lab safety\n* Sample contamination\n* Lens cleaning\n* Limits of light microscopy\n* Viruses requiring electron microscopy or indirect methods\n* Historical discovery of cells and microorganisms",
        "composition": "Use a labelled compound microscope centrally, with optical path and magnification left, cell-theory timeline and microscopy types right.",
        "accuracy": "* Do not confuse magnification with resolution\n* Do not show viruses as visible with basic classroom light microscopes\n* Electron micrographs may be false-coloured only if labelled\n* No one microscope type is best for every specimen",
    },
]

SPECS += [
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "01_DNA_Structure.txt",
        "about": "DNA STRUCTURE",
        "title": "DNA STRUCTURE",
        "subtitle": "An illustrated guide to the double helix, nucleotides, base pairing, antiparallel strands, genes, chromosomes and genetic information storage",
        "colors": "* Adenine green\n* Thymine red\n* Cytosine blue\n* Guanine yellow\n* Sugar-phosphate backbone violet\n* Hydrogen bonds white\n* Histones orange\n* Chromosomes purple",
        "central": "* DNA double helix\n* Sugar-phosphate backbone\n* Deoxyribose sugar\n* Phosphate group\n* Nitrogenous bases\n* Base pairs\n* Hydrogen bonds\n* Major groove\n* Minor groove\n* Antiparallel strands",
        "panels": "* Nucleotide structure\n* Purines and pyrimidines\n* A-T and C-G base pairing\n* DNA packaging\n* Histones and nucleosomes\n* Chromatin\n* Chromosome anatomy\n* Gene concept\n* Telomeres and centromere\n* DNA as information storage",
        "process": "* DNA sequence stores information\n* Genes are transcribed into RNA\n* RNA helps direct protein synthesis\n* Proteins contribute to cell structure and function\n* DNA is copied before cell division",
        "conditions": "* Mutation concept\n* Genetic variation\n* DNA damage and repair overview\n* Inherited disease concept\n* Biotechnology uses such as sequencing and genetic testing",
        "composition": "Make the double helix central and large. Put nucleotide/base pairing details left and DNA packaging/chromosome scale right.",
        "accuracy": "* Do not show uracil in DNA\n* A pairs with T and C pairs with G\n* Show strands as antiparallel\n* Avoid implying one gene always equals one simple trait\n* Condensed chromosomes are not present in that form at all times",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "02_DNA_Replication.txt",
        "about": "DNA REPLICATION",
        "title": "DNA REPLICATION",
        "subtitle": "An illustrated guide to semiconservative copying, replication forks, DNA polymerase, leading and lagging strands, Okazaki fragments and proofreading",
        "colors": "* Parental DNA dark blue\n* New DNA bright cyan\n* Helicase orange\n* Primase purple\n* DNA polymerase green\n* Ligase red\n* RNA primers pink\n* Okazaki fragments yellow\n* Proofreading gold",
        "central": "* Origin of replication\n* Replication bubble\n* Replication fork\n* Parental strands\n* Daughter strands\n* Leading strand\n* Lagging strand\n* 5 prime end\n* 3 prime end\n* Okazaki fragments",
        "panels": "* Helicase\n* Single-strand binding proteins\n* Topoisomerase\n* Primase\n* DNA polymerase\n* Sliding clamp\n* DNA ligase\n* Semiconservative model\n* Proofreading\n* Eukaryotic multiple origins and telomeres",
        "process": "* Helicase unwinds DNA\n* Primase lays RNA primers\n* DNA polymerase adds nucleotides 5 prime to 3 prime\n* Leading strand grows continuously\n* Lagging strand grows in fragments\n* Primers are replaced\n* Ligase seals nicks\n* Proofreading corrects many errors",
        "conditions": "* Replication errors\n* Mutations\n* DNA repair defects\n* Cancer risk concept\n* Antiviral and antibiotic targets involving replication enzymes",
        "composition": "Use a replication bubble with two forks centrally, enzyme callouts around it and semiconservative model at the bottom.",
        "accuracy": "* DNA polymerase adds to the 3 prime end\n* Do not make both strands continuous\n* Do not omit primers\n* Ligase seals fragments; it does not synthesize the whole strand",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "03_Transcription_and_RNA.txt",
        "about": "TRANSCRIPTION AND RNA",
        "title": "TRANSCRIPTION AND RNA",
        "subtitle": "An illustrated guide to RNA synthesis, RNA polymerase, promoters, mRNA processing, RNA types and gene expression",
        "colors": "* DNA blue\n* Template strand dark blue\n* Coding strand light blue\n* RNA red-orange\n* RNA polymerase green\n* Promoter gold\n* Introns grey\n* Exons purple\n* 5 prime cap teal\n* Poly-A tail pink",
        "central": "* Promoter\n* Transcription start site\n* Template strand\n* Coding strand\n* RNA polymerase\n* Transcription bubble\n* Nascent RNA\n* Terminator region\n* 5 prime and 3 prime ends",
        "panels": "* Initiation\n* Elongation\n* Termination\n* RNA base pairing\n* mRNA processing\n* 5 prime cap\n* Splicing\n* Poly-A tail\n* mRNA export\n* mRNA, rRNA, tRNA, miRNA and snRNA",
        "process": "* Transcription factors help recruit RNA polymerase\n* RNA polymerase opens DNA locally\n* RNA nucleotides pair with template strand\n* RNA grows 5 prime to 3 prime\n* Transcript terminates\n* Eukaryotic pre-mRNA is processed\n* Mature mRNA exits nucleus",
        "conditions": "* Splicing errors\n* Gene-expression changes\n* Viral RNA concepts\n* RNA interference\n* RNA-based biotechnology and diagnostics",
        "composition": "Make the transcription bubble central, with RNA processing as a right-side pipeline and RNA-type icons along the bottom.",
        "accuracy": "* RNA uses uracil, not thymine\n* Do not confuse transcription with translation\n* RNA polymerase does not require a primer like DNA polymerase\n* Distinguish coding and template strands",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "04_Translation_and_Protein_Synthesis.txt",
        "about": "TRANSLATION AND PROTEIN SYNTHESIS",
        "title": "TRANSLATION AND PROTEIN SYNTHESIS",
        "subtitle": "An illustrated guide to ribosomes, mRNA codons, tRNA anticodons, amino acids, peptide bonds and polypeptide formation",
        "colors": "* mRNA orange\n* Ribosome purple\n* tRNA teal\n* Amino acids multicolour\n* Start codon green\n* Stop codons red\n* Peptide bond gold\n* Growing polypeptide pink",
        "central": "* Small ribosomal subunit\n* Large ribosomal subunit\n* A site\n* P site\n* E site\n* mRNA codons\n* tRNA anticodons\n* Amino acids\n* Growing polypeptide chain",
        "panels": "* Initiation\n* Elongation\n* Translocation\n* Termination\n* Codon table\n* AUG start codon\n* Stop codons UAA, UAG and UGA\n* tRNA charging\n* Aminoacyl-tRNA synthetase\n* Protein folding and modification",
        "process": "* Ribosome binds mRNA\n* Start codon sets reading frame\n* tRNA anticodon pairs with codon\n* Peptide bond forms\n* Ribosome translocates\n* Stop codon recruits release factor\n* Polypeptide releases and folds",
        "conditions": "* Mutations affecting protein sequence\n* Misfolded proteins\n* Antibiotics targeting bacterial ribosomes\n* Genetic code applications\n* Biotechnology protein production",
        "composition": "Use a large ribosome cutaway centrally. Put translation stages left and genetic code/protein folding right.",
        "accuracy": "* Do not show DNA directly translated by ribosomes\n* Do not read codons backward\n* Stop codons do not code for amino acids\n* The genetic code is degenerate, with multiple codons for many amino acids",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "05_Gene_Expression_and_Regulation.txt",
        "about": "GENE EXPRESSION AND REGULATION",
        "title": "GENE EXPRESSION AND REGULATION",
        "subtitle": "An illustrated guide to how cells control DNA access, transcription, RNA processing, translation and protein activity",
        "colors": "* DNA blue\n* Chromatin purple\n* Transcription factors gold\n* Enhancers green\n* Silencers red\n* mRNA orange\n* Ribosome violet\n* Proteins teal\n* Epigenetic marks pink",
        "central": "* Chromatin state\n* Promoter\n* Enhancer\n* Silencer\n* Transcription factors\n* RNA polymerase\n* Pre-mRNA\n* Mature mRNA\n* Ribosome\n* Protein\n* Proteasome",
        "panels": "* Epigenetic regulation\n* Transcriptional control\n* Post-transcriptional regulation\n* Alternative splicing\n* mRNA stability\n* microRNA\n* Translational control\n* Protein modification\n* Ubiquitination and degradation\n* Cell specialization",
        "process": "* Chromatin opens or closes\n* Regulatory proteins bind DNA\n* Transcription begins or is reduced\n* RNA is processed\n* mRNA export and stability are controlled\n* Translation rate varies\n* Protein activity is modified\n* Protein degradation ends signal",
        "conditions": "* Cancer gene regulation changes\n* Developmental disorders\n* Environmental influence on gene activity\n* Drug targets in gene regulation\n* Cell differentiation and reprogramming",
        "composition": "Use a DNA-to-RNA-to-protein pipeline centrally, with regulation points marked like switches.",
        "accuracy": "* Genes are not simply always on or off\n* Epigenetic marks influence gene activity without changing DNA sequence\n* Avoid one-gene-one-trait oversimplification\n* Regulation is context-dependent and multi-level",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "06_Mendelian_Genetics.txt",
        "about": "MENDELIAN GENETICS",
        "title": "MENDELIAN GENETICS",
        "subtitle": "An illustrated guide to inheritance patterns, alleles, dominance, segregation, independent assortment, Punnett squares and probability",
        "colors": "* Dominant allele purple\n* Recessive allele green\n* Parental generation blue\n* F1 generation teal\n* F2 generation gold\n* Chromosomes pink-blue\n* Probability markers orange",
        "central": "* Parent generation\n* Gametes\n* F1 generation\n* F2 generation\n* Alleles\n* Genotypes\n* Phenotypes\n* Homozygous dominant\n* Heterozygous\n* Homozygous recessive\n* Punnett square",
        "panels": "* Gene and allele definitions\n* Dominant and recessive inheritance\n* Law of segregation\n* Law of independent assortment\n* Monohybrid cross\n* Dihybrid cross\n* Genotype versus phenotype\n* Carrier concept\n* Probability versus certainty\n* Non-Mendelian inheritance preview",
        "process": "* Allele pairs separate during gamete formation\n* Fertilization combines alleles\n* Offspring genotype influences phenotype\n* Expected ratios emerge over many offspring\n* Different genes on different chromosomes can assort independently",
        "conditions": "* Carrier screening concept\n* Simple Mendelian disorder examples with careful wording\n* Incomplete dominance\n* Codominance\n* Multiple alleles\n* Polygenic traits and environmental influence",
        "composition": "Use pea-plant inheritance and Punnett squares as the main visual, with probability notes large and clear.",
        "accuracy": "* Not all traits follow simple dominance\n* Ratios are probabilities, not guarantees for small families\n* Distinguish genotype and phenotype\n* Avoid reducing complex human traits to single genes",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "07_Mutations_and_DNA_Repair.txt",
        "about": "MUTATIONS AND DNA REPAIR",
        "title": "MUTATIONS AND DNA REPAIR",
        "subtitle": "An illustrated guide to DNA changes, mutation types, causes, cellular repair systems, effects on proteins and genetic variation",
        "colors": "* Normal DNA blue\n* Mutation site red\n* Repair enzymes green\n* UV damage yellow\n* Chemical mutagens orange\n* Repaired DNA cyan\n* Protein effects purple",
        "central": "* Base substitution\n* Insertion\n* Deletion\n* Duplication\n* Inversion\n* Translocation\n* Silent mutation\n* Missense mutation\n* Nonsense mutation\n* Frameshift mutation",
        "panels": "* Causes of mutation\n* Replication errors\n* UV radiation\n* Ionizing radiation\n* Chemical mutagens\n* Reactive oxygen species\n* Proofreading\n* Mismatch repair\n* Base excision repair\n* Nucleotide excision repair\n* Double-strand break repair",
        "process": "* DNA damage or copying error occurs\n* Cell detects abnormal structure\n* Repair proteins are recruited\n* Damaged base or strand segment is removed or corrected\n* DNA polymerase fills gap when needed\n* Ligase seals backbone\n* Unrepaired changes may become mutations after replication",
        "conditions": "* Cancer risk from accumulated mutations\n* Inherited repair disorders\n* Genetic variation\n* Beneficial, neutral and harmful mutations\n* Somatic versus germline mutation consequences",
        "composition": "Use highlighted DNA damage centrally, mutation types left and repair pathways right.",
        "accuracy": "* Not all mutations are harmful\n* Somatic mutations are not automatically inherited\n* Repair is highly effective but not perfect\n* Mutation effects depend on location and biological context",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "08_Chromosomes_and_Karyotype.txt",
        "about": "CHROMOSOMES AND KARYOTYPES",
        "title": "CHROMOSOMES AND KARYOTYPES",
        "subtitle": "An illustrated guide to chromosome structure, homologous pairs, autosomes, sex chromosomes, karyotyping and chromosomal variation",
        "colors": "* Autosomes blue-grey\n* Sex chromosomes purple\n* Chromatids teal\n* Centromeres gold\n* Telomeres red\n* Homologous pairs alternating light/dark\n* Abnormality highlights orange",
        "central": "* Human karyotype\n* 22 pairs of autosomes\n* Sex chromosomes\n* Sister chromatids\n* Centromere\n* p arm\n* q arm\n* Telomeres\n* Homologous chromosomes\n* Chromatin packaging",
        "panels": "* Typical human somatic chromosome number\n* Chromosome anatomy\n* Homologous pairs and alleles\n* DNA packaging\n* Karyotyping process\n* Metaphase chromosomes\n* Banding pattern\n* Sorting by size and centromere position\n* Trisomy, monosomy, deletion, duplication, inversion and translocation",
        "process": "* Cells are collected\n* Dividing cells are prepared\n* Chromosomes are stained\n* Metaphase chromosomes are imaged\n* Chromosomes are arranged into pairs\n* Specialist interprets number and structure",
        "conditions": "* Prenatal testing context\n* Cancer cytogenetics\n* Infertility evaluation\n* Genetic diagnosis\n* Chromosomal variation explained respectfully and neutrally",
        "composition": "Make the karyotype grid central. Place chromosome anatomy left and karyotyping workflow right.",
        "accuracy": "* Do not confuse chromosomes with chromatids\n* Do not imply all people have identical karyotypes\n* Keep sex chromosome language biologically accurate and respectful\n* Interpretation requires trained professionals",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "09_CRISPR_and_Gene_Editing.txt",
        "about": "CRISPR AND GENE EDITING",
        "title": "CRISPR AND GENE EDITING",
        "subtitle": "An illustrated guide to guide RNA, Cas enzymes, DNA targeting, repair pathways, applications, limits, ethics and safety",
        "colors": "* DNA blue\n* Guide RNA red-orange\n* Cas enzyme green\n* Target sequence gold\n* PAM site purple\n* DNA cut red\n* Repair pathways teal\n* Edited sequence cyan\n* Ethics panel grey",
        "central": "* Cas protein\n* Guide RNA\n* Target DNA\n* PAM sequence\n* Complementary base pairing\n* Cut site\n* DNA break\n* Edited sequence\n* Repair template when used",
        "panels": "* Guide RNA design\n* Delivery methods\n* Target recognition\n* Cas nuclease action\n* Non-homologous end joining\n* Homology-directed repair\n* Base editing\n* Prime editing\n* Screening and verification\n* Applications and ethics",
        "process": "* Design guide RNA\n* Deliver editing components\n* Locate target sequence near PAM\n* Cas enzyme cuts or modifies DNA\n* Cell repairs DNA\n* Desired and unintended edits are checked\n* Edited cells or organisms are evaluated",
        "conditions": "* Research gene function\n* Crop improvement\n* Disease modelling\n* Cell therapy research\n* Diagnostics\n* Off-target edits\n* Delivery challenges\n* Germline editing ethics\n* Gene-drive ecological concerns",
        "composition": "Use Cas-guide RNA-DNA complex centrally, repair pathways below, applications and ethics on the sides.",
        "accuracy": "* CRISPR is not always perfectly precise\n* Do not show it as a magical eraser\n* Distinguish research use from approved clinical treatment\n* Do not imply germline editing is routine medical care",
    },
    {
        "category": "03_Genetics_and_Molecular_Biology",
        "file": "10_Epigenetics.txt",
        "about": "EPIGENETICS",
        "title": "EPIGENETICS",
        "subtitle": "An illustrated guide to DNA methylation, histone modification, chromatin accessibility, gene regulation, development and environmental influence",
        "colors": "* DNA blue\n* Histones purple\n* Methyl groups red\n* Acetyl groups green\n* Open chromatin gold\n* Closed chromatin grey\n* Active gene teal\n* Silenced gene muted violet\n* Environmental factors orange",
        "central": "* DNA\n* Histone proteins\n* Nucleosome\n* Chromatin fibre\n* Open chromatin\n* Closed chromatin\n* Promoter\n* Gene\n* DNA methylation\n* Histone acetylation\n* Transcription machinery",
        "panels": "* DNA methylation\n* Histone acetylation\n* Histone methylation\n* Chromatin remodelling\n* Non-coding RNA regulation\n* Gene accessibility\n* Development and cell identity\n* Environmental influences\n* Cellular memory\n* Inheritance caution",
        "process": "* Cell receives developmental or environmental signal\n* Regulatory enzymes add or remove epigenetic marks\n* Chromatin accessibility changes\n* Transcription machinery binds more or less easily\n* Gene expression changes\n* Some marks may be copied during cell division",
        "conditions": "* Cancer epigenetic changes\n* Developmental biology\n* Ageing\n* Nutrition and stress as context-dependent influences\n* Drug targets such as epigenetic modifiers\n* Transgenerational claims handled cautiously",
        "composition": "Use open-versus-closed chromatin as the central contrast, with mechanisms left and development/environment panels right.",
        "accuracy": "* Epigenetics does not change DNA sequence\n* Lifestyle cannot simply switch any gene on or off at will\n* Avoid deterministic or guilt-based claims\n* Human transgenerational inheritance is complex and should not be overstated",
    },
]


def main():
    for spec in SPECS:
        folder = BASE / spec["category"]
        folder.mkdir(parents=True, exist_ok=True)
        (folder / spec["file"]).write_text(prompt(spec), encoding="utf-8")
    print(f"Created {len(SPECS)} prompt files in {BASE}")
    for category in sorted({s["category"] for s in SPECS}):
        count = len(list((BASE / category).glob("*.txt")))
        print(f"{category}: {count} text files")


if __name__ == "__main__":
    main()
