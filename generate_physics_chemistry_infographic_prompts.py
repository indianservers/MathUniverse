from pathlib import Path

ROOT = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts")
PHYSICS_BASE = ROOT / "Physics"
CHEMISTRY_BASE = ROOT / "Chemistry"

QUALITY = """# OUTPUT QUALITY
* Ultra-HD 8K resolution
* Exact canvas size: 7680 x 4320 px
* Landscape orientation
* Premium, non-generic scientific infographic
* Extremely sharp diagrams, formulas, labels, axes, apparatus and legends
* Print-quality educational graphics
* Professional school, college, university, laboratory and science-museum quality
* No blurry text
* No incorrect formulas
* No distorted symbols
* No watermarks
* No logos
* No stock-image appearance
* No unnecessary visual clutter"""

PHYSICS_ASSET = """# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS
* Use topic-specific physics assets: force diagrams, motion graphs, ray diagrams, field lines, circuit schematics, wavefronts, energy-level diagrams, apparatus setups, free-body diagrams, spacetime diagrams, vector plots or data graphs.
* Every visual element must teach a definition, law, theorem, mechanism, experiment, graph relation, model or application.
* Anchor every label to a visible object: vector, mass, lens, mirror, wave crest, charge, circuit element, field line, apparatus part, axis, particle, energy level or equation term.
* Include units, axis labels, scale marks, sign conventions, assumptions, idealizations and legends where relevant.
* Show multiple representations when helpful: physical setup, mathematical equation, graph, vector diagram and real-world application.
* Avoid generic space/science wallpaper, random atoms, decorative equations, incorrect arrows or impossible apparatus.

# PHYSICS ACCURACY AND LABEL QA
* Verify every formula, vector direction, unit, graph shape, circuit connection, ray path, field-line direction and sign convention.
* State assumptions such as frictionless surface, constant acceleration, small-angle approximation, ideal gas, ideal lens, point charge, inertial frame or steady-state current.
* Keep arrows physically meaningful; do not use decorative arrows that imply false force, energy flow, current direction or causality.
* Distinguish scalar and vector quantities clearly.
* Use SI units unless another system is explicitly labelled.

# NEGATIVE PROMPT
No generic science clip art, no fake formulas, no wrong vector directions, no incorrect circuit wiring, no impossible ray diagrams, no unlabelled axes, no unreadable tiny equations, no decorative particles without meaning, no stock-photo style, no watermarks, no logos."""

CHEM_ASSET = """# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS
* Use topic-specific chemistry assets: molecular structures, reaction mechanisms, periodic trends, orbital diagrams, energy profiles, lab apparatus, titration curves, crystal lattices, spectroscopy plots, equilibrium diagrams or industrial process flows.
* Every visual element must teach a structure, reaction, bonding pattern, mechanism step, measurement, trend, apparatus function or application.
* Anchor every label to a visible atom, bond, ion, orbital, reagent, product, flask, electrode, spectrum peak, lattice point, axis or equation term.
* Include states of matter, charges, coefficients, units, conditions, catalysts, pH, temperature, pressure, concentration and safety cues where relevant.
* Show multiple representations when helpful: particle model, symbolic equation, macroscopic observation, graph and real-world use.
* Avoid generic bubbling flasks, random molecules, impossible bonds, unbalanced equations or decorative periodic-table fragments.

# CHEMISTRY ACCURACY AND LABEL QA
* Verify every formula, charge, oxidation state, reaction arrow, mechanism arrow, stoichiometric coefficient, pH relation, orbital filling, geometry and equilibrium expression.
* Balance chemical equations where shown.
* State assumptions such as ideal solution, dilute solution, standard state, strong acid/base, closed system, catalyst present or equilibrium established.
* Keep mechanism arrows chemically meaningful; electron-pushing arrows must start at electron sources.
* Use IUPAC-style terminology where appropriate and avoid unsupported safety or health claims.

# NEGATIVE PROMPT
No generic lab clip art, no fake molecules, no impossible valence, no unbalanced equations, no wrong charges, no incorrect orbital filling, no unreadable tiny labels, no random chemical symbols, no stock-photo style, no watermarks, no logos."""


VARIANTS = [
    (
        "01_Concept_Map",
        "Concept Map and Foundations",
        "Class 6 to Class 10 bridge",
        "Build intuition through definitions, core vocabulary, visual models and simple examples.",
        "* Definition panel\n* Notation and units key\n* Visual model\n* Simple worked example\n* Common misconceptions\n* Quick review strip",
        "* Introduce the idea\n* Define the key quantities\n* Show the visual model\n* Work a simple example\n* Highlight a common mistake\n* Summarise the rule",
    ),
    (
        "02_Laws_Methods_and_Problem_Solving",
        "Laws, Methods and Problem Solving",
        "Class 9 to undergraduate bridge",
        "Teach formulas, method selection, experimental interpretation and exam-style reasoning.",
        "* Formula panel with assumptions\n* Step-by-step worked problem\n* Method-selection flowchart\n* Graph or data panel\n* Error traps\n* Check-your-answer panel",
        "* Read the problem or experiment\n* Identify known and unknown quantities\n* Choose the correct law, formula or model\n* Substitute with units\n* Solve step by step\n* Check magnitude, sign, units and physical/chemical meaning",
    ),
    (
        "03_Advanced_View",
        "Advanced View, Theory and Applications",
        "Senior secondary to postgraduate",
        "Connect the topic to deeper theory, modelling, computation, laboratory practice or research applications.",
        "* Formal law or theory statement\n* Derivation or mechanism sketch\n* Advanced graph/model\n* Experimental or computational panel\n* Applications\n* Limitations and assumptions",
        "* State assumptions\n* Present the formal model\n* Derive or justify the key relation\n* Interpret graphically or microscopically\n* Apply to an advanced problem\n* Note limitations, edge cases or approximations",
    ),
]


PHYSICS = [
    ("Units_Measurement_and_Dimensions", "UNITS, MEASUREMENT AND DIMENSIONS", "SI units, measurement uncertainty, significant figures, dimensional analysis and scientific notation", "measuring instruments, SI base units, derived units, vernier caliper, micrometer, error bars, dimensional formula table"),
    ("Motion_in_One_Dimension", "MOTION IN ONE DIMENSION", "position, displacement, velocity, acceleration, motion graphs and kinematic equations", "number line, moving object, displacement vector, velocity-time graph, acceleration-time graph, kinematic equation panel"),
    ("Motion_in_Two_Dimensions_and_Projectiles", "MOTION IN TWO DIMENSIONS AND PROJECTILES", "vectors, projectile motion, relative motion, circular motion basics and trajectory analysis", "projectile arc, horizontal and vertical components, velocity vectors, range, maximum height, relative motion diagram"),
    ("Forces_and_Newtons_Laws", "FORCES AND NEWTON'S LAWS", "free-body diagrams, inertia, net force, action-reaction pairs, friction and connected bodies", "free-body diagram, normal force, weight, tension, friction, acceleration vector, pulley system"),
    ("Work_Energy_and_Power", "WORK, ENERGY AND POWER", "work, kinetic energy, potential energy, conservation of energy, power and efficiency", "roller-coaster energy diagram, work-force graph, energy bar chart, power meter, conservative/nonconservative forces"),
    ("Momentum_Collisions_and_Centre_of_Mass", "MOMENTUM, COLLISIONS AND CENTRE OF MASS", "linear momentum, impulse, conservation, elastic/inelastic collisions and centre of mass", "two carts colliding, impulse-time graph, before/after momentum vectors, centre-of-mass marker"),
    ("Rotational_Motion_and_Torque", "ROTATIONAL MOTION AND TORQUE", "angular displacement, angular velocity, torque, moment of inertia, angular momentum and rolling", "rotating wheel, torque lever arm, angular vectors, rolling cylinder, moment of inertia comparison"),
    ("Gravitation_and_Orbits", "GRAVITATION AND ORBITS", "Newtonian gravitation, gravitational field, orbital motion, satellites, escape velocity and Kepler laws", "planet-satellite orbit, gravitational field vectors, ellipse with foci, escape trajectory, Kepler law panel"),
    ("Fluids_Pressure_and_Buoyancy", "FLUIDS, PRESSURE AND BUOYANCY", "pressure, density, Pascal law, Archimedes principle, Bernoulli equation and fluid flow", "fluid column, hydraulic press, floating object, streamline flow, Bernoulli tube, pressure gauges"),
    ("Thermal_Physics_and_Heat_Transfer", "THERMAL PHYSICS AND HEAT TRANSFER", "temperature, heat, specific heat, phase change, conduction, convection, radiation and thermal equilibrium", "molecular motion, heating curve, conduction rod, convection loop, radiation waves, calorimeter"),
    ("Thermodynamics", "THERMODYNAMICS", "internal energy, work, heat, first and second laws, heat engines, entropy and refrigerators", "piston-cylinder, PV diagram, heat engine cycle, Carnot cycle, entropy arrow, refrigerator flow"),
    ("Oscillations_and_SHM", "OSCILLATIONS AND SIMPLE HARMONIC MOTION", "periodic motion, springs, pendulums, restoring force, energy exchange and resonance", "spring-mass oscillator, pendulum, sinusoidal graph, phase diagram, resonance curve"),
    ("Waves_and_Sound", "WAVES AND SOUND", "wave properties, superposition, interference, standing waves, sound intensity, Doppler effect and resonance", "transverse wave, longitudinal wave, standing wave, tuning fork, Doppler wavefronts, decibel scale"),
    ("Ray_Optics", "RAY OPTICS", "reflection, refraction, mirrors, lenses, image formation, prisms and optical instruments", "ray diagram, concave mirror, convex lens, prism dispersion, focal length, eye/camera model"),
    ("Wave_Optics", "WAVE OPTICS", "Huygens principle, interference, diffraction, polarization and Young double-slit experiment", "double slit, interference fringes, diffraction pattern, wavefronts, polarizer pair"),
    ("Electrostatics", "ELECTROSTATICS", "electric charge, Coulomb law, electric field, potential, capacitors and Gauss law", "point charges, field lines, equipotential curves, capacitor plates, Gaussian surface"),
    ("Current_Electricity_and_Circuits", "CURRENT ELECTRICITY AND CIRCUITS", "current, voltage, resistance, Ohm law, series-parallel circuits, Kirchhoff laws and electrical power", "circuit schematic, resistors, battery, ammeter, voltmeter, series/parallel panels, I-V graph"),
    ("Magnetism_and_Electromagnetic_Induction", "MAGNETISM AND ELECTROMAGNETIC INDUCTION", "magnetic fields, Lorentz force, motors, generators, Faraday law, Lenz law and transformers", "magnetic field lines, moving charge, coil, magnet, generator, transformer, induced current arrows"),
    ("Electromagnetic_Waves", "ELECTROMAGNETIC WAVES", "EM spectrum, wave propagation, polarization, energy, communication and radiation safety", "EM spectrum bar, electric/magnetic field oscillations, antenna, wavelength-frequency scale"),
    ("AC_Circuits_and_Electronics", "AC CIRCUITS AND ELECTRONICS", "alternating current, RMS values, reactance, impedance, resonance, diodes, transistors and logic gates", "sine-wave voltage, RLC circuit, phasor diagram, diode curve, transistor switch, logic gate panel"),
    ("Modern_Physics_and_Relativity", "MODERN PHYSICS AND RELATIVITY", "special relativity, time dilation, mass-energy equivalence, photoelectric effect and quantum ideas", "spacetime diagram, light clock, photoelectric apparatus, photon-electron interaction"),
    ("Quantum_Mechanics_Basics", "QUANTUM MECHANICS BASICS", "wave-particle duality, uncertainty, wavefunctions, probability density, operators and energy quantization", "wave packet, double-slit quantum panel, probability cloud, energy well, uncertainty relation"),
    ("Atomic_Physics", "ATOMIC PHYSICS", "atomic models, spectra, Bohr model, orbitals, transitions, ionization and lasers", "hydrogen atom energy levels, spectral lines, electron transition arrows, orbital cloud"),
    ("Nuclear_Physics_and_Radioactivity", "NUCLEAR PHYSICS AND RADIOACTIVITY", "nuclear structure, alpha beta gamma decay, half-life, fission, fusion and radiation detection", "nucleus, decay emissions, half-life curve, Geiger counter, fission chain reaction, fusion panel"),
    ("Particle_Physics", "PARTICLE PHYSICS", "standard model particles, fundamental forces, conservation laws, accelerators and detectors", "standard model chart, particle collision, detector layers, quark structure, Feynman-style interaction"),
    ("Solid_State_Physics_and_Semiconductors", "SOLID STATE PHYSICS AND SEMICONDUCTORS", "crystals, band theory, conductors, insulators, semiconductors, doping and p-n junctions", "crystal lattice, band diagram, doped silicon, p-n junction, depletion region, LED/solar cell panel"),
    ("Astrophysics_and_Cosmology", "ASTROPHYSICS AND COSMOLOGY", "stars, galaxies, black holes, expansion, cosmic microwave background and the life cycle of the universe", "star life cycle, galaxy, black hole lensing, expanding universe grid, CMB map"),
    ("Experimental_Physics_and_Data", "EXPERIMENTAL PHYSICS AND DATA", "measurement design, sensors, uncertainty, calibration, graph fitting, residuals and reproducibility", "lab apparatus, sensor, data table, fitted graph, residual plot, uncertainty bars, calibration curve"),
    ("Computational_Physics", "COMPUTATIONAL PHYSICS", "numerical simulation, modelling, finite differences, Monte Carlo methods and computational experiments", "simulation grid, time-step loop, particle simulation, numerical error graph, algorithm flowchart"),
    ("Biophysics_and_Medical_Physics", "BIOPHYSICS AND MEDICAL PHYSICS", "physics in living systems, biomechanics, diffusion, imaging, radiation therapy and medical devices", "MRI scanner, ultrasound wave, X-ray attenuation, biomechanics lever, diffusion gradient, radiation dose panel"),
]


CHEMISTRY = [
    ("Matter_Atoms_and_Molecules", "MATTER, ATOMS AND MOLECULES", "states of matter, atoms, molecules, ions, mixtures, pure substances and particle models", "particle model of solid/liquid/gas, atom, molecule, ion, mixture separation panel"),
    ("Atomic_Structure", "ATOMIC STRUCTURE", "protons, neutrons, electrons, isotopes, orbitals, quantum numbers and electron configuration", "nucleus, electron cloud, isotope comparison, orbital diagrams, quantum number table"),
    ("Periodic_Table_and_Periodic_Trends", "PERIODIC TABLE AND PERIODIC TRENDS", "groups, periods, valence electrons, atomic radius, ionization energy, electronegativity and reactivity", "periodic table heatmap, trend arrows, group panels, valence shell diagrams"),
    ("Chemical_Bonding", "CHEMICAL BONDING", "ionic, covalent and metallic bonding, Lewis structures, polarity, bond energy and lattice formation", "ionic lattice, covalent molecule, metallic sea model, Lewis structures, polarity arrows"),
    ("Molecular_Geometry_and_VSEPR", "MOLECULAR GEOMETRY AND VSEPR", "electron domains, molecular shapes, bond angles, lone pairs, polarity and hybridization basics", "3D molecular shapes, lone pair clouds, bond angle labels, polarity vector panel"),
    ("Stoichiometry_and_Mole_Concept", "STOICHIOMETRY AND MOLE CONCEPT", "moles, molar mass, balanced equations, limiting reagent, yield and concentration calculations", "balanced reaction, mole bridge, limiting reagent visual, product yield scale, molarity flask"),
    ("Chemical_Reactions_Types", "CHEMICAL REACTION TYPES", "synthesis, decomposition, displacement, double displacement, combustion, precipitation and redox overview", "reaction classification flowchart, particle-level before/after panels, precipitate formation"),
    ("States_of_Matter_and_Gases", "STATES OF MATTER AND GASES", "gas laws, kinetic molecular theory, pressure, volume, temperature and ideal gas equation", "gas particles in piston, PV graph, Charles/Boyle panels, ideal gas equation"),
    ("Solutions_and_Colligative_Properties", "SOLUTIONS AND COLLIGATIVE PROPERTIES", "solubility, concentration, dilution, electrolytes, osmosis, boiling point elevation and freezing point depression", "solute-solvent particles, concentration flask, dilution diagram, osmotic membrane, colligative graph"),
    ("Acids_Bases_and_pH", "ACIDS, BASES AND pH", "Arrhenius, Bronsted-Lowry and Lewis acids/bases, pH, buffers, neutralization and titration", "pH scale, acid-base particle transfer, buffer system, titration curve, indicator colours"),
    ("Chemical_Equilibrium", "CHEMICAL EQUILIBRIUM", "dynamic equilibrium, equilibrium constant, reaction quotient, Le Chatelier principle and equilibrium shifts", "reversible reaction vessel, forward/reverse arrows, concentration graph, equilibrium shift panels"),
    ("Thermochemistry", "THERMOCHEMISTRY", "enthalpy, heat, calorimetry, exothermic and endothermic reactions, Hess law and bond energies", "energy profile, calorimeter, heat flow arrows, Hess law cycle, bond-breaking/forming panel"),
    ("Chemical_Kinetics", "CHEMICAL KINETICS", "reaction rates, collision theory, activation energy, catalysts, rate laws and mechanisms", "reaction coordinate diagram, catalyst pathway, collision particles, rate graph, mechanism steps"),
    ("Redox_and_Electrochemistry", "REDOX AND ELECTROCHEMISTRY", "oxidation, reduction, oxidation states, galvanic cells, electrolysis, batteries and corrosion", "galvanic cell, anode/cathode, salt bridge, electron flow, electrolysis cell, corrosion panel"),
    ("Organic_Chemistry_Basics", "ORGANIC CHEMISTRY BASICS", "carbon bonding, functional groups, naming, isomerism and reaction families", "carbon skeletons, functional group chart, isomer comparison, nomenclature labels"),
    ("Hydrocarbons_and_Aromaticity", "HYDROCARBONS AND AROMATICITY", "alkanes, alkenes, alkynes, benzene, aromatic stability and hydrocarbon reactions", "alkane/alkene/alkyne structures, benzene ring, pi bonds, aromatic electron cloud"),
    ("Alcohols_Ethers_Aldehydes_and_Ketones", "ALCOHOLS, ETHERS, ALDEHYDES AND KETONES", "oxygen-containing functional groups, oxidation, reduction, nucleophilic addition and uses", "functional group structures, oxidation ladder, carbonyl polarity, reaction arrows"),
    ("Carboxylic_Acids_and_Derivatives", "CARBOXYLIC ACIDS AND DERIVATIVES", "carboxylic acids, esters, amides, acid chlorides, anhydrides and acyl substitution", "carboxyl group, esterification setup, derivative reactivity ladder, mechanism inset"),
    ("Amines_and_Biomolecules", "AMINES AND BIOMOLECULES", "amines, amino acids, peptides, carbohydrates, lipids, nucleic acids and biological chemistry", "amine structure, amino acid zwitterion, peptide bond, glucose ring, DNA nucleotide"),
    ("Reaction_Mechanisms_and_Electron_Pushing", "REACTION MECHANISMS AND ELECTRON PUSHING", "curved arrows, nucleophiles, electrophiles, intermediates, transition states and mechanism logic", "nucleophile-electrophile diagram, curved arrows, carbocation, transition state, energy profile"),
    ("Stereochemistry", "STEREOCHEMISTRY", "chirality, enantiomers, diastereomers, R/S configuration, optical activity and stereochemical reactions", "chiral carbon, mirror-image molecules, Fischer projection, wedge-dash bonds, polarimeter"),
    ("Coordination_Chemistry", "COORDINATION CHEMISTRY", "complex ions, ligands, coordination number, geometry, crystal field splitting and colour", "metal complex, ligands, octahedral/tetrahedral shapes, d-orbital splitting, colour absorption"),
    ("Inorganic_Chemistry_and_Metallurgy", "INORGANIC CHEMISTRY AND METALLURGY", "metals, ores, extraction, transition elements, alloys, corrosion and industrial inorganic chemistry", "ore to metal flow, blast furnace, alloy lattice, transition metal ions, corrosion cell"),
    ("Analytical_Chemistry", "ANALYTICAL CHEMISTRY", "qualitative and quantitative analysis, titration, chromatography, spectroscopy and calibration", "burette titration, chromatography column/TLC plate, calibration curve, spectroscopy peaks"),
    ("Spectroscopy_and_Structure_Determination", "SPECTROSCOPY AND STRUCTURE DETERMINATION", "IR, NMR, UV-Vis, mass spectrometry and molecular identification", "IR spectrum, NMR spectrum, mass spectrum, UV-Vis absorbance graph, unknown molecule puzzle"),
    ("Polymer_Chemistry", "POLYMER CHEMISTRY", "monomers, polymerization, addition and condensation polymers, properties, recycling and biopolymers", "monomer to polymer chain, crosslinking, plastic types, condensation byproduct, recycling loop"),
    ("Materials_Chemistry_and_Nanomaterials", "MATERIALS CHEMISTRY AND NANOMATERIALS", "crystals, ceramics, composites, nanoparticles, graphene, catalysts and material properties", "crystal lattice, nanoparticle, graphene sheet, composite layers, surface area panel"),
    ("Environmental_Chemistry", "ENVIRONMENTAL CHEMISTRY", "air, water and soil chemistry, pollutants, greenhouse gases, acid rain, ozone and remediation", "atmospheric chemistry, water pollutant, acid rain cycle, ozone layer, remediation process"),
    ("Medicinal_Chemistry_and_Drug_Molecules", "MEDICINAL CHEMISTRY AND DRUG MOLECULES", "drug structure, target binding, pharmacophores, SAR, ADME and molecular optimization", "drug molecule in binding pocket, pharmacophore map, SAR table, ADME flow, toxicity warning"),
    ("Computational_Chemistry", "COMPUTATIONAL CHEMISTRY", "molecular modelling, quantum calculations, molecular dynamics, docking and chemical data", "molecule model, electron density surface, docking pose, simulation trajectory, energy plot"),
]


def create_library(base: Path, concepts, asset_block: str, subject: str):
    created = 0
    for idx, (slug, title, summary, central_assets) in enumerate(concepts, 1):
        folder = base / f"{idx:02d}_{slug}"
        folder.mkdir(parents=True, exist_ok=True)
        for v_idx, (v_slug, v_name, level, focus, panels, process) in enumerate(VARIANTS, 1):
            path = folder / f"{v_idx:02d}_{v_slug}.txt"
            text = f"""Act as a senior {subject} infographic designer, scientific illustrator, curriculum designer and visualization specialist.

Create exactly ONE premium, highly detailed educational infographic about {title}.

# INFOGRAPHIC TITLE
{title}

# MAIN SUBTITLE
{v_name}: {summary}

# TARGET LEVEL
{level}

{QUALITY}

# VISUAL STYLE
Use a premium modern {subject.lower()}-infographic style combining clean vector diagrams, precise scientific notation, colour-coded steps, annotated examples, real apparatus or model panels, graph/data views, subtle depth where useful and strong visual hierarchy.

# CORE FOCUS
{focus}

# CENTRAL HERO VISUAL
Show a large, scientifically accurate central visual using:
{central_assets}

# REQUIRED EDUCATIONAL PANELS
Include:
{panels}

# STEP-BY-STEP EXPLANATION, PROOF, DERIVATION OR WORKFLOW
Show this sequence clearly:
{process}

# APPLICATIONS OR CONNECTIONS
Include:
* School and college curriculum connections
* Competitive exam preparation where relevant
* Laboratory, engineering, medical, environmental, industrial or research applications
* Common misconceptions and safety/assumption notes

# COMPOSITION
Top: title, subtitle and level label.
Centre: large hero diagram, apparatus, model or molecular/physical system.
Upper left: key definitions and notation.
Upper right: formulas, laws, equations, trends or theory summary.
Lower left: worked example, derivation, mechanism or experiment.
Lower right: real-world application, misconception or advanced connection.
Bottom strip: key facts, common mistakes, notation legend, units and quick review.

# TYPOGRAPHY
* Bold modern sans-serif headings
* Clear scientific typesetting
* Large readable equations and labels
* Correct superscripts, subscripts, arrows, charges, units and Greek symbols
* No text overlapping diagrams or apparatus

{asset_block}

# FINAL RENDERING REQUIREMENTS
Produce one visually rich, scientifically accurate and professionally composed 8K infographic suitable for classroom teaching, self-study, digital learning, competitive exam preparation, college courses and large-format printing.
"""
            path.write_text(text, encoding="utf-8")
            created += 1
    return created


def main():
    physics_count = create_library(PHYSICS_BASE, PHYSICS, PHYSICS_ASSET, "Physics")
    chemistry_count = create_library(CHEMISTRY_BASE, CHEMISTRY, CHEM_ASSET, "Chemistry")
    print(f"Created {physics_count} physics infographic prompt files in {PHYSICS_BASE}")
    print(f"Created {chemistry_count} chemistry infographic prompt files in {CHEMISTRY_BASE}")
    print(f"Physics concept folders: {len([p for p in PHYSICS_BASE.iterdir() if p.is_dir()])}")
    print(f"Chemistry concept folders: {len([p for p in CHEMISTRY_BASE.iterdir() if p.is_dir()])}")


if __name__ == "__main__":
    main()
