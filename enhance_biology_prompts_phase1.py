from pathlib import Path

BASE = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts")

PHASE1_CATEGORIES = {
    "01_Human_Anatomy_and_Physiology",
    "02_Cell_Biology",
    "03_Genetics_and_Molecular_Biology",
    "04_Microbiology",
    "05_Viruses_and_Infectious_Disease",
    "06_Human_Disease_and_Public_Health",
    "07_Sensory_and_ENT_Anatomy",
    "08_Plant_Biology",
    "09_Ecology_and_Environment",
}


def category_asset_focus(category: str) -> str:
    if category.startswith("01") or category.startswith("07"):
        return """* Use organ-specific anatomical assets: true 3D medical cutaways, labelled cross-sections, histology-style micro-insets and clinically accurate orientation markers.
* Include at least one realistic macro anatomy hero, one transparent sectional view and one microanatomy panel.
* Use authentic medical visual cues such as vessels, nerves, tissue layers, ducts, membranes, cavities and adjacent organs where relevant.
* Avoid generic floating organs, decorative body silhouettes without labels, vague glowing shapes or simplified cartoon anatomy."""
    if category.startswith("02") or category.startswith("03"):
        return """* Use molecular and cellular assets that look like textbook-grade scientific plates: organelle cutaways, membrane cross-sections, enzyme/protein shapes, chromosome or DNA details and pathway maps.
* Include scale cues, compartment labels and directional arrows for all molecular processes.
* Use realistic microscopy-inspired textures where helpful while keeping labels vector-crisp.
* Avoid generic colourful blobs, fictional organelles, random molecules or decorative DNA helices that do not explain the concept."""
    if category.startswith("04") or category.startswith("05"):
        return """* Use organism-specific microbiology assets: accurate bacterial envelopes, viral capsids/envelopes, parasite stages, culture plates, microscope fields, host-cell interfaces and immune-response panels.
* Include scale comparison against cells where relevant.
* Show transmission, replication or life-cycle routes as precise arrows with reservoirs, vectors, tissues or host cells clearly identified.
* Avoid monster-like pathogens, fear imagery, random spike balls and misleading pathogen sizes."""
    if category.startswith("06"):
        return """* Use disease-specific medical assets: affected organ anatomy, pathophysiology sequence, diagnostic panel, risk/complication panel and warning-sign strip.
* Include normal-versus-disease comparison whenever possible.
* Show mechanisms at tissue/cellular level rather than only symptom icons.
* Avoid frightening imagery, miracle-cure symbolism, vague red pain clouds or generic hospital clip art."""
    if category.startswith("08"):
        return """* Use botanical assets with real plant structures: root, stem, leaf, flower, vascular tissue, meristems, stomata, chloroplasts, pollen, seeds and soil/microbe interfaces.
* Include macro plant anatomy, tissue cross-section and cellular/molecular inset when relevant.
* Show species-appropriate forms instead of generic leaves and flowers.
* Avoid impossible plant anatomy, animal-like organs or decorative vines that do not teach the concept."""
    if category.startswith("09"):
        return """* Use ecosystem-specific assets: accurate organisms, habitat layers, climate or nutrient-cycle diagrams, maps, food webs and data-style panels.
* Include real ecological relationships such as arrows for energy flow, nutrient cycling, dispersal, predation, symbiosis or disturbance.
* Show scale from organism to ecosystem where useful.
* Avoid generic nature wallpaper, random animals placed together or arrows that imply false relationships."""
    return "* Use topic-specific scientific assets, not generic decorative biology imagery."


def universal_block(category: str) -> str:
    return f"""

# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS
{category_asset_focus(category)}
* Every major visual element must teach a specific structure, mechanism, pathway, disease step, ecological relationship or experimental result.
* Use custom scientific illustration assets rather than stock-photo-style compositions.
* Make labels anatomically and biologically anchored: every label line must point to a visible structure, cell, molecule, tissue, organism or process step.
* Add a small scale, orientation or context cue where useful: anterior/posterior, proximal/distal, cellular scale, molecular scale, life-cycle host, habitat layer, timeline or magnification.
* Maintain consistent lighting, perspective and colour logic across all panels.
* Keep the central hero illustration visually dominant, but reserve enough negative space for readable labels.

# ADVANCED SCIENTIFIC ACCURACY AND LABEL QA
* Before final rendering, verify every label against the visible drawing.
* Do not invent structures, pathways, organisms, symptoms, treatments, statistics or disease claims.
* Do not use oversimplified myths unless they appear in a clearly marked MYTHS AND FACTS panel.
* Keep arrows directional and biologically meaningful; do not use decorative arrows that imply false flow.
* Use cautious language for medical, ecological and biotechnology claims.
* When uncertainty or variability matters, show it explicitly with wording such as varies by species, varies by person, depends on context or requires professional evaluation.
* Check spelling of all anatomical, medical, botanical, microbiological and molecular terms.
* Ensure text does not overlap tissue structures, pathways, legends, graphs or icon panels.

# NEGATIVE PROMPT
No generic stock illustration, no random decorative DNA, no fake anatomy, no fictional organs, no incorrect arrows, no unlabeled blobs, no cluttered label nests, no unreadable tiny text, no sensational disease imagery, no gore, no miracle-cure claims, no misleading statistics, no pseudo-scientific wellness language, no watermarks, no logos, no cropped-off diagrams.
"""


TEMPLATE_QUALITY = """# OUTPUT QUALITY
* Ultra-HD 8K resolution
* Exact canvas size: 7680 x 4320 px
* Landscape orientation
* Premium, non-generic scientific infographic
* Extremely sharp anatomical, cellular, molecular or ecological illustration
* Crisp labels, precise leader lines and readable legends
* Professional medical-college, biology-classroom and science-museum quality
* No blurry text, no watermarks, no logos, no stock-image appearance"""


def make_missing_prompt(title, subtitle, central, panels, process, accuracy, category):
    return f"""Act as a senior medical infographic designer, biology illustrator, anatomy editor and scientific-visualization specialist.

Create exactly ONE premium, highly detailed educational infographic about {title}.

# INFOGRAPHIC TITLE
{title}

# MAIN SUBTITLE
{subtitle}

{TEMPLATE_QUALITY}

# VISUAL STYLE
Use a premium, high-end scientific visualization style with a realistic central hero illustration, transparent cutaways, clean vector panels, microscopic or molecular insets, glass-like information panels, precise labels and a strict colour legend.

# CENTRAL HERO ILLUSTRATION
Show and clearly label:
{central}

# REQUIRED EDUCATIONAL PANELS
Include:
{panels}

# PROCESS OR PATHWAY DIAGRAM
Show this sequence clearly:
{process}

# COMPOSITION
Top title and subtitle. Centre large hero illustration. Left side normal structure or baseline mechanism. Right side functional pathway or disease/ecological progression. Bottom strip key facts, warning signs or misconceptions.

# SCIENTIFIC ACCURACY REQUIREMENTS
{accuracy}

{universal_block(category)}

# FINAL RENDERING REQUIREMENTS
Produce one premium, accurate, readable 8K infographic suitable for medical education, school biology, college biology, digital learning and large-format printing.
"""


MISSING_PROMPTS = [
    ("01_Human_Anatomy_and_Physiology", "11_Human_Liver.txt", "THE HUMAN LIVER", "An illustrated guide to liver anatomy, lobules, bile flow, portal circulation, metabolism, detoxification and liver health", "* Right lobe\n* Left lobe\n* Hepatic artery\n* Portal vein\n* Hepatic vein\n* Bile ducts\n* Gallbladder\n* Liver lobule\n* Hepatocytes\n* Sinusoids\n* Kupffer cells\n* Central vein", "* Liver lobule microanatomy\n* Dual blood supply\n* Bile production\n* Glucose storage and release\n* Protein metabolism\n* Urea formation\n* Drug metabolism\n* Fat metabolism\n* Regeneration\n* Jaundice and cirrhosis overview", "* Blood enters through portal vein and hepatic artery\n* Sinusoids deliver blood past hepatocytes\n* Hepatocytes process nutrients and toxins\n* Bile flows toward bile ducts\n* Blood exits through central and hepatic veins", "* Do not portray detoxification as a vague cleanse\n* Keep blood flow and bile flow directions distinct\n* Do not show bile entering blood vessels\n* Medical liver disease requires professional evaluation"),
    ("01_Human_Anatomy_and_Physiology", "12_Human_Pancreas.txt", "THE HUMAN PANCREAS", "An illustrated guide to endocrine and exocrine pancreas, insulin, glucagon, digestive enzymes, ducts and pancreatic health", "* Pancreas head\n* Body\n* Tail\n* Pancreatic duct\n* Duodenum\n* Islets of Langerhans\n* Beta cells\n* Alpha cells\n* Acinar cells\n* Blood vessels\n* Bile duct junction", "* Endocrine versus exocrine function\n* Insulin and glucagon\n* Blood glucose control\n* Digestive enzyme secretion\n* Bicarbonate secretion\n* Pancreatitis overview\n* Diabetes connection\n* Pancreatic cancer warning context", "* Food enters intestine\n* Pancreas releases enzymes and bicarbonate into ducts\n* Islets sense blood glucose\n* Beta cells release insulin when glucose rises\n* Alpha cells release glucagon when glucose falls", "* Do not mix pancreatic duct contents with blood hormone release\n* Insulin lowers blood glucose and glucagon raises it\n* Pancreatic enzymes act in small intestine\n* Avoid treatment or dosing advice"),
    ("01_Human_Anatomy_and_Physiology", "13_Spleen_and_Lymph_Nodes.txt", "SPLEEN AND LYMPH NODES", "An illustrated guide to lymphoid organs, immune surveillance, blood filtration, lymph flow and infection response", "* Spleen\n* Red pulp\n* White pulp\n* Splenic artery\n* Splenic vein\n* Lymph node cortex\n* Paracortex\n* Medulla\n* Germinal centre\n* Afferent lymphatic\n* Efferent lymphatic\n* Immune cells", "* Spleen blood filtering\n* Old red-cell removal\n* Platelet storage concept\n* Lymph node antigen filtering\n* B cells and T cells\n* Germinal centres\n* Swollen lymph nodes\n* Vaccination and immune memory context", "* Lymph enters node through afferent vessels\n* Immune cells sample antigens\n* Activated lymphocytes multiply\n* Filtered lymph exits efferent vessel\n* Blood passes through spleen for immune surveillance and red-cell quality control", "* Lymph nodes swell for many reasons\n* Spleen filters blood, lymph nodes filter lymph\n* Avoid implying every swollen node is cancer\n* Infection diagnosis requires clinical context"),
    ("01_Human_Anatomy_and_Physiology", "14_Urinary_Bladder_and_Urination.txt", "URINARY BLADDER AND URINATION", "An illustrated guide to bladder anatomy, ureters, urethra, sphincters, micturition reflex and urinary health", "* Kidneys\n* Ureters\n* Bladder wall\n* Detrusor muscle\n* Trigone\n* Internal urethral sphincter\n* External urethral sphincter\n* Urethra\n* Pelvic floor\n* Stretch receptors\n* Spinal cord reflex pathway", "* Urine storage\n* Micturition reflex\n* Voluntary control\n* Pelvic floor\n* Male and female urethral anatomy comparison\n* Urinary tract infection overview\n* Incontinence concept\n* Warning signs", "* Urine flows from kidneys through ureters\n* Bladder fills and stretches\n* Stretch receptors signal spinal cord and brain\n* Detrusor contracts\n* Sphincters relax in coordinated urination\n* Urine exits through urethra", "* Do not show urine stored in kidneys as the main reservoir\n* Keep ureters and urethra distinct\n* Avoid shame-based language\n* Medical evaluation is required for urinary symptoms"),
    ("05_Viruses_and_Infectious_Disease", "11_Dengue_Virus_and_Mosquito_Transmission.txt", "DENGUE VIRUS AND MOSQUITO TRANSMISSION", "An illustrated guide to dengue virus, Aedes mosquitoes, human infection, immune response, warning signs and prevention", "* Dengue virion\n* Aedes mosquito\n* Human skin bite\n* Bloodstream\n* Immune cells\n* Capillary leakage concept\n* Platelets\n* Fever timeline\n* Larval breeding sites\n* Prevention icons", "* Dengue virus structure\n* Four serotypes concept\n* Mosquito life cycle\n* Transmission cycle\n* Symptoms\n* Warning signs\n* Severe dengue concept\n* Vector control\n* Avoiding mosquito bites\n* Community prevention", "* Infected mosquito bites human\n* Virus enters bloodstream\n* Virus infects susceptible cells\n* Immune response causes fever and body pain\n* Some cases develop warning signs\n* Another mosquito can acquire virus from infected blood", "* Do not show dengue spreading directly by casual contact\n* Aedes mosquitoes commonly bite during daytime\n* Avoid specific medical treatment advice\n* Warning signs need urgent medical evaluation"),
    ("05_Viruses_and_Infectious_Disease", "12_Hepatitis_Viruses_A_B_C_D_E.txt", "HEPATITIS VIRUSES A, B, C, D AND E", "An illustrated guide to viral hepatitis types, liver infection, transmission routes, prevention, testing and chronic disease", "* Liver\n* Hepatocytes\n* HAV\n* HBV\n* HCV\n* HDV\n* HEV\n* Blood route\n* Food-water route\n* Vaccine shield\n* Chronic infection timeline", "* Hepatitis A-E comparison\n* Transmission routes\n* Acute versus chronic infection\n* Liver inflammation\n* Jaundice\n* Cirrhosis risk\n* Liver cancer risk\n* Vaccines for A and B\n* Testing and treatment concepts", "* Virus enters through food-water or blood/body-fluid route depending on type\n* Virus reaches liver\n* Immune response inflames hepatocytes\n* Acute symptoms may occur\n* Some types can become chronic\n* Chronic inflammation can lead to fibrosis or cancer", "* Do not imply all hepatitis viruses spread the same way\n* HAV and HEV are commonly faecal-oral; HBV/HCV are blood/body-fluid related\n* Vaccines exist for hepatitis A and B, not all types\n* Testing is required to identify type"),
    ("05_Viruses_and_Infectious_Disease", "13_Rabies_Virus.txt", "RABIES VIRUS", "An illustrated guide to rabies transmission, nerve spread, brain infection, vaccination, post-exposure prevention and emergency care", "* Rabies virion\n* Animal bite wound\n* Peripheral nerve\n* Spinal cord\n* Brain\n* Salivary gland\n* Vaccine syringe\n* Immunoglobulin concept\n* Dog/bat reservoir icons", "* Lyssavirus structure\n* Animal reservoirs\n* Bite transmission\n* Neural spread\n* Encephalitis\n* Symptoms overview\n* Pre-exposure vaccination\n* Post-exposure prophylaxis concept\n* Animal vaccination\n* One Health prevention", "* Infected saliva enters bite wound\n* Virus replicates locally\n* Virus travels along peripheral nerves\n* Virus reaches brain\n* Virus spreads to salivary glands\n* Transmission risk continues through bites", "* Rabies is a medical emergency after exposure\n* Do not wait for symptoms after a suspicious bite\n* Post-exposure care must be professional and urgent\n* Avoid portraying all animals as dangerous"),
    ("05_Viruses_and_Infectious_Disease", "14_Cholera_and_Waterborne_Disease.txt", "CHOLERA AND WATERBORNE DISEASE", "An illustrated guide to Vibrio cholerae, contaminated water, intestinal toxin action, dehydration and prevention", "* Vibrio cholerae\n* Contaminated water\n* Small intestine\n* Enterocyte\n* Cholera toxin\n* Chloride channel\n* Water loss arrows\n* Oral rehydration solution\n* Sanitation icons", "* Waterborne transmission\n* Vibrio shape\n* Toxin mechanism\n* Secretory diarrhoea\n* Dehydration\n* Oral rehydration therapy concept\n* Water treatment\n* Sanitation\n* Outbreak control\n* Vaccination context", "* Contaminated water or food is consumed\n* Bacteria reach small intestine\n* Toxin alters ion transport\n* Chloride and water secretion increase\n* Severe watery diarrhoea can cause dehydration\n* Rehydration replaces fluid and electrolytes", "* Do not show cholera toxin invading the bloodstream as the main mechanism\n* Rehydration is central but medical care may be needed\n* Prevention relies on safe water and sanitation\n* Avoid stigmatizing affected communities"),
    ("06_Human_Disease_and_Public_Health", "21_COPD_and_Emphysema.txt", "COPD AND EMPHYSEMA", "An illustrated guide to chronic bronchitis, emphysema, airway obstruction, alveolar damage, symptoms and prevention", "* Healthy airway\n* Inflamed bronchiole\n* Mucus\n* Damaged alveoli\n* Loss of elastic recoil\n* Air trapping\n* Cigarette smoke exposure icon\n* Spirometry curve\n* Oxygen exchange panel", "* COPD definition\n* Chronic bronchitis\n* Emphysema\n* Airflow obstruction\n* Gas exchange impairment\n* Spirometry\n* Exacerbations\n* Smoking and air pollution risk\n* Pulmonary rehabilitation concept\n* Prevention", "* Irritants inflame airways\n* Mucus and narrowing obstruct airflow\n* Alveolar walls break down\n* Elastic recoil decreases\n* Air trapping develops\n* Oxygen and carbon dioxide exchange worsen", "* Do not present COPD as only a smoker disease\n* Damage patterns vary\n* Spirometry is needed for diagnosis\n* Severe breathlessness requires urgent care"),
    ("06_Human_Disease_and_Public_Health", "22_Epilepsy_and_Seizures.txt", "EPILEPSY AND SEIZURES", "An illustrated guide to abnormal electrical activity, seizure types, EEG, triggers, first aid and treatment concepts", "* Brain cortex\n* Neuron network\n* Abnormal electrical discharge\n* EEG waveform\n* Focal seizure map\n* Generalized seizure map\n* Synapse\n* Anti-seizure medication concept\n* Safety icon", "* Seizure versus epilepsy\n* Focal and generalized seizures\n* EEG recording\n* Excitation-inhibition balance\n* Common triggers\n* First-aid safety panel\n* Diagnosis overview\n* Medication/surgery/device concepts\n* Stigma reduction", "* Neuronal network becomes hyperexcitable\n* Synchronous electrical activity spreads locally or broadly\n* Symptoms depend on brain regions involved\n* EEG may record abnormal patterns\n* Evaluation identifies cause and treatment options", "* Do not put objects in a person's mouth during seizure\n* Not all seizures involve convulsions\n* Emergency care is needed for prolonged seizure or injury\n* Use respectful non-stigmatizing language"),
    ("06_Human_Disease_and_Public_Health", "23_Parkinsons_Disease.txt", "PARKINSON'S DISEASE", "An illustrated guide to dopamine neurons, basal ganglia circuits, movement symptoms, non-motor symptoms and care", "* Substantia nigra\n* Dopamine pathway\n* Basal ganglia\n* Striatum\n* Lewy body concept\n* Motor cortex\n* Tremor icon\n* Gait panel\n* Medication concept\n* Deep brain stimulation concept", "* Dopamine and movement circuits\n* Bradykinesia\n* Resting tremor\n* Rigidity\n* Postural instability\n* Non-motor symptoms\n* Diagnosis overview\n* Medication and therapy categories\n* Exercise and support\n* Research directions", "* Dopamine-producing neurons decline\n* Basal ganglia signalling changes\n* Movement initiation and control become impaired\n* Motor and non-motor symptoms develop\n* Treatment aims to improve function and quality of life", "* Parkinsonism has multiple causes\n* Do not imply tremor is always Parkinson's\n* Avoid cure claims\n* Diagnosis is clinical and specialist-guided"),
    ("06_Human_Disease_and_Public_Health", "24_Sickle_Cell_Disease.txt", "SICKLE CELL DISEASE", "An illustrated guide to haemoglobin mutation, sickled red cells, vaso-occlusion, anaemia, inheritance and care", "* Normal red blood cell\n* Sickled red blood cell\n* Haemoglobin S\n* Blood vessel blockage\n* Oxygen tension\n* Bone pain icon\n* Spleen\n* Inheritance Punnett square\n* Newborn screening icon", "* Autosomal recessive inheritance\n* Haemoglobin S polymerization\n* Sickling triggers\n* Vaso-occlusive crisis\n* Haemolytic anaemia\n* Infection risk\n* Stroke risk\n* Newborn screening\n* Treatment categories\n* Genetic counselling", "* Low oxygen or stress promotes HbS polymerization\n* Red cells sickle and become rigid\n* Cells block small vessels\n* Pain and tissue injury can occur\n* Sickled cells break down early\n* Chronic anaemia develops", "* Use non-stigmatizing language\n* Sickle trait and disease are different\n* Pain crises require appropriate medical care\n* Avoid implying it affects only one population"),
    ("09_Ecology_and_Environment", "11_Climate_Change_and_Biology.txt", "CLIMATE CHANGE AND BIOLOGY", "An illustrated guide to warming, species ranges, phenology, coral bleaching, disease vectors, crops and ecosystem resilience", "* Greenhouse gases\n* Temperature graph\n* Species range map\n* Flowering calendar\n* Coral reef\n* Mosquito range\n* Crop field\n* Heat-stress animal\n* Conservation corridor", "* Climate versus weather\n* Range shifts\n* Phenology mismatch\n* Heat stress\n* Ocean warming and acidification\n* Vector-borne disease changes\n* Agriculture impacts\n* Adaptation and resilience\n* Mitigation and conservation", "* Greenhouse gases alter heat balance\n* Average temperatures and extremes shift\n* Organisms respond through movement, timing changes or stress\n* Species interactions change\n* Ecosystems reorganize\n* Conservation planning supports resilience", "* Do not treat climate as one local weather event\n* Avoid unsupported certainty for specific local outcomes\n* Show uncertainty and variability\n* Include adaptation and mitigation without doom-only framing"),
]


def add_block_if_missing(path: Path, category: str):
    text = path.read_text(encoding="utf-8")
    if "# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS" in text:
        return False
    marker = "# FINAL RENDERING REQUIREMENTS"
    block = universal_block(category)
    if marker in text:
        text = text.replace(marker, block + "\n" + marker, 1)
    else:
        text = text.rstrip() + block + "\n"
    path.write_text(text, encoding="utf-8")
    return True


def main():
    enhanced = 0
    for category in PHASE1_CATEGORIES:
        folder = BASE / category
        if not folder.exists():
            continue
        for path in folder.glob("*.txt"):
            if add_block_if_missing(path, category):
                enhanced += 1

    created = 0
    for category, filename, title, subtitle, central, panels, process, accuracy in MISSING_PROMPTS:
        folder = BASE / category
        folder.mkdir(parents=True, exist_ok=True)
        path = folder / filename
        if not path.exists():
            path.write_text(make_missing_prompt(title, subtitle, central, panels, process, accuracy, category), encoding="utf-8")
            created += 1

    print(f"Enhanced existing phase-1 files: {enhanced}")
    print(f"Created missing concept files: {created}")
    print(f"Total text files now: {len(list(BASE.rglob('*.txt')))}")


if __name__ == "__main__":
    main()
