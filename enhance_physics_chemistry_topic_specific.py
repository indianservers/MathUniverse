from pathlib import Path


ROOT = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts")


PHYSICS = {
    "01_Units_Measurement_and_Dimensions": ("Units, Measurement and Dimensions", "SI base-unit wheel, vernier caliper, micrometer screw gauge, stopwatch, balance, error-bar graph, dimensional-analysis matrix", "v = dx/dt, [F]=MLT^-2, % error = |measured-true|/true x 100, least count, significant figures", "derive dimension of pressure, convert km/h to m/s, read vernier and micrometer, reject dimensionally wrong formula"),
    "02_Motion_in_One_Dimension": ("Motion in One Dimension", "number-line track, ticker-tape strip, displacement vector, x-t graph, v-t graph, a-t graph, elevator/free-fall inset", "v = u + at, s = ut + 1/2 at^2, v^2 = u^2 + 2as, slope of x-t = v, area under v-t = s", "train braking, free fall from rest, upward throw sign convention, distance vs displacement"),
    "03_Motion_in_Two_Dimensions_and_Projectiles": ("Two-Dimensional Motion and Projectiles", "projectile arc with x/y components, velocity tangent arrows, range/height markers, vector triangle, relative-velocity river crossing", "R = u^2 sin2theta/g, H = u^2 sin^2 theta/2g, T = 2u sin theta/g, vx constant, ay = -g", "cannon shot, ball from table, swimmer crossing river, 45 degree maximum range misconception"),
    "04_Forces_and_Newtons_Laws": ("Forces and Newton's Laws", "free-body diagrams on blocks, pulley, inclined plane, contact forces, friction cone, action-reaction pair cards", "F_net = ma, f_s <= mu_s N, f_k = mu_k N, T relations, weight mg, normal reaction", "elevator scale reading, two-block system, inclined-plane acceleration, action-reaction not cancelling"),
    "05_Work_Energy_and_Power": ("Work, Energy and Power", "energy bar charts, work-area graph, roller-coaster track, spring compression, power meter", "W = F d cos theta, KE = 1/2 mv^2, PE = mgh, PE_s = 1/2 kx^2, P = W/t = Fv", "block pulled at angle, spring launcher, conservation with friction loss, negative work"),
    "06_Momentum_Collisions_and_Centre_of_Mass": ("Momentum, Collisions and Centre of Mass", "before/after collision lanes, impulse-time graph, center-of-mass balance, explosion fragments, ballistic pendulum", "p = mv, J = F Delta t = Delta p, m1u1+m2u2=m1v1+m2v2, e = relative speed after/before", "elastic vs inelastic collision, recoil, COM of two masses, airbag impulse"),
    "07_Rotational_Motion_and_Torque": ("Rotational Motion and Torque", "rotating disk, torque wrench, rolling wheel, angular kinematics dial, moment-of-inertia shapes table", "tau = rF sin theta, I alpha = tau, L = I omega, K_rot = 1/2 I omega^2, v = r omega", "door handle torque, rolling without slipping, angular momentum conservation, parallel-axis theorem"),
    "08_Gravitation_and_Orbits": ("Gravitation and Orbits", "Earth-satellite orbit, inverse-square field, escape-velocity launch, Kepler ellipse, gravitational potential well", "F = Gm1m2/r^2, g = GM/r^2, v_orb = sqrt(GM/r), v_esc = sqrt(2GM/R), T^2 proportional r^3", "planet orbit, satellite altitude, weight variation, geostationary orbit"),
    "09_Fluids_Pressure_and_Buoyancy": ("Fluids, Pressure and Buoyancy", "hydraulic press, U-tube manometer, buoyant block, streamline pipe, Bernoulli airplane/venturi inset", "P = F/A, P = rho gh, F_b = rho_fluid Vg, A1v1=A2v2, P+1/2 rho v^2+rho gh = constant", "floating vs sinking, hydraulic lift, capillary/viscosity cue, pressure acts all directions"),
    "10_Thermal_Physics_and_Heat_Transfer": ("Thermal Physics and Heat Transfer", "particle temperature model, calorimeter, conduction rod, convection loop, radiation spectrum, phase-change curve", "Q = mc Delta T, Q = mL, H = kA Delta T/L, Stefan-Boltzmann P = sigma eAT^4", "mixing water, ice melting plateau, insulation, Celsius-Kelvin conversion"),
    "11_Thermodynamics": ("Thermodynamics", "PV diagram cycles, piston-cylinder, heat engine, refrigerator, entropy arrow, Carnot loop", "Delta U = Q - W, W = area under PV curve, eta = W/Qh, COP = Qc/W, PV=nRT", "isothermal vs adiabatic, engine efficiency, work sign convention, cyclic process"),
    "12_Oscillations_and_SHM": ("Oscillations and SHM", "mass-spring oscillator, pendulum, sinusoidal x-v-a graph, phasor circle, damping envelope", "x=A sin(omega t+phi), omega=sqrt(k/m), T=2pi sqrt(m/k), T_pend=2pi sqrt(L/g), a=-omega^2x", "pendulum period, spring energy exchange, resonance, small-angle approximation"),
    "13_Waves_and_Sound": ("Waves and Sound", "wave anatomy, transverse/longitudinal comparison, standing waves on string/pipe, Doppler wavefronts, decibel meter", "v=f lambda, y=A sin(kx-omega t), f_n = nv/2L, open/closed pipe modes, beta=10 log(I/I0)", "echo, beats, resonance tube, Doppler ambulance, harmonics"),
    "14_Ray_Optics": ("Ray Optics", "mirror/lens ray diagrams, optical bench, prism, total internal reflection fiber, human eye accommodation", "1/f = 1/v + 1/u, m=v/u, n1 sin i = n2 sin r, critical angle sin C = n2/n1", "concave mirror image cases, convex lens image cases, prism deviation, TIR fiber"),
    "15_Wave_Optics": ("Wave Optics", "double-slit setup, interference fringes, diffraction single slit, polarization filters, wavefront Huygens diagram", "beta = lambda D/d, a sin theta = m lambda, I = I0 cos^2 theta, path difference = n lambda", "Young's experiment, single-slit width effect, polarizer analyzer, coherent sources"),
    "16_Electrostatics": ("Electrostatics", "charge interaction map, electric field lines, equipotential surfaces, capacitor plates, Gaussian surfaces", "F = kq1q2/r^2, E=F/q, V=kq/r, C=epsilon A/d, U=1/2 CV^2, Phi=EA cos theta", "point charges, dipole, capacitor with dielectric, field vs potential"),
    "17_Current_Electricity_and_Circuits": ("Current Electricity and Circuits", "breadboard/circuit schematic pair, resistor network, ammeter/voltmeter placement, I-V graph, Wheatstone bridge", "V=IR, P=VI=I^2R, R=rho L/A, series/parallel rules, Kirchhoff loop and junction laws", "equivalent resistance, meter connection, heating effect, internal resistance"),
    "18_Magnetism_and_Electromagnetic_Induction": ("Magnetism and EMI", "magnetic field lines, right-hand rules, current loop, solenoid, moving conductor, transformer coils", "F=qvB sin theta, F=BIL sin theta, Phi=BA cos theta, emf=-dPhi/dt, Ns/Np=Vs/Vp", "motor force, generator induction, Lenz law direction, transformer use"),
    "19_Electromagnetic_Waves": ("Electromagnetic Waves", "EM spectrum ribbon, perpendicular E/B fields, antenna emission, wavelength-frequency scale, application icons", "c=f lambda, c=1/sqrt(mu0 epsilon0), E/B=c, energy density concepts", "radio to gamma comparison, communication, medical imaging, ionizing vs non-ionizing"),
    "20_AC_Circuits_and_Electronics": ("AC Circuits and Electronics", "sine-wave voltage/current phasors, RLC circuit, resonance curve, diode rectifier, transistor amplifier, logic gates", "X_L=omega L, X_C=1/(omega C), Z=sqrt(R^2+(XL-XC)^2), Vrms=V0/sqrt2, f0=1/2pi sqrt(LC)", "RLC resonance, rectification ripple, phase lead/lag, filter capacitor"),
    "21_Modern_Physics_and_Relativity": ("Modern Physics and Relativity", "photoelectric apparatus, spacetime grid, time dilation clocks, mass-energy panel, blackbody curve", "E=hf, Kmax=hf-phi, lambda=h/p, E=mc^2, gamma=1/sqrt(1-v^2/c^2)", "photoelectric threshold, relativistic time, de Broglie wavelength, blackbody UV catastrophe"),
    "22_Quantum_Mechanics_Basics": ("Quantum Mechanics Basics", "wavefunction probability cloud, double-slit detector, uncertainty boxes, energy well levels, tunneling barrier", "Delta x Delta p >= hbar/2, |psi|^2 probability density, Schrodinger equation label, E_n in box proportional n^2", "particle in box, tunneling, measurement, superposition vs classical path"),
    "23_Atomic_Physics": ("Atomic Physics", "Bohr atom, hydrogen energy levels, spectral series, excitation/de-excitation arrows, emission spectrum", "E_n=-13.6/n^2 eV, Delta E=hf, 1/lambda=R(1/n1^2-1/n2^2), angular momentum quantization", "Balmer lines, ionization energy, absorption vs emission, orbital caveat"),
    "24_Nuclear_Physics_and_Radioactivity": ("Nuclear Physics and Radioactivity", "nuclear chart, alpha/beta/gamma decay, half-life graph, binding-energy curve, fission chain, fusion core", "N=N0 e^-lambda t, T1/2=ln2/lambda, Q=Delta mc^2, A/Z conservation, binding energy per nucleon", "decay series, carbon dating, reactor vs bomb, radiation shielding"),
    "25_Particle_Physics": ("Particle Physics", "standard model grid, quark composition of proton/neutron, Feynman diagram, detector layers, conservation law tags", "charge, baryon/lepton number, color concept, E^2=(pc)^2+(mc^2)^2, interaction vertices", "beta decay quark view, particle detector track, antimatter, neutrino"),
    "26_Solid_State_Physics_and_Semiconductors": ("Solid State and Semiconductors", "crystal lattice, band diagram, doped silicon, p-n junction depletion region, diode I-V curve, solar cell", "E_g band gap, n-type/p-type carriers, diode equation cue, conductivity sigma=nqmu, Bragg nlambda=2d sin theta", "LED, diode rectifier, transistor junction, band gap vs conductor/insulator"),
    "27_Astrophysics_and_Cosmology": ("Astrophysics and Cosmology", "HR diagram, stellar lifecycle, galaxy redshift spectrum, expanding universe grid, CMB map, black-hole lensing", "z=Delta lambda/lambda, v=H0 d, L=4piR^2 sigmaT^4, escape velocity, Schwarzschild radius Rs=2GM/c^2", "star classification, redshift distance, supernova, dark matter evidence"),
    "28_Experimental_Physics_and_Data": ("Experimental Physics and Data", "lab apparatus setup, sensor/data logger, uncertainty bars, calibration curve, residual plot, regression line", "mean, standard deviation, percent uncertainty, propagation cue, slope/intercept units, chi-square idea", "pendulum g experiment, Ohm's law graph, systematic vs random error, significant figures"),
    "29_Computational_Physics": ("Computational Physics", "simulation grid, finite-difference time steps, numerical integration, Monte Carlo dots, phase-space plot", "Euler x_{n+1}=x_n+v dt, Verlet cue, error vs step size, random sampling, boundary conditions", "projectile simulation, N-body orbit, heat diffusion grid, stability and timestep"),
    "30_Biophysics_and_Medical_Physics": ("Biophysics and Medical Physics", "ECG trace, neuron membrane circuit, X-ray/CT/MRI/ultrasound comparison, radiation dose shield, blood-flow model", "Poiseuille Q=pi r^4 DeltaP/8 eta L, Nernst equation cue, acoustic impedance, dose units Gy/Sv", "MRI vs CT, ultrasound reflection, nerve signal, hemodynamics, radiation safety"),
}


CHEMISTRY = {
    "01_Matter_Atoms_and_Molecules": ("Matter, Atoms and Molecules", "particle model of solid/liquid/gas, atoms vs molecules, element/compound/mixture sorting, separation methods", "density=m/V, Avogadro idea, symbols/formulae, law of conservation of mass", "classify air/saltwater/iron/water, phase-change particle view, filtration vs distillation"),
    "02_Atomic_Structure": ("Atomic Structure", "nucleus, electron cloud, isotope comparison, Bohr shells, orbital shapes, quantum-number table", "A=Z+N, charge balance, Aufbau order, n/l/ml/ms, Pauli and Hund rules", "write configuration for Na/Cl/Fe, isotope notation, ion formation, orbital not orbit misconception"),
    "03_Periodic_Table_and_Periodic_Trends": ("Periodic Table and Trends", "periodic table heatmap, atomic radius arrows, ionization energy graph, electronegativity scale, shielding diagram", "Z_eff cue, radius trend, IE trend, EN trend, electron affinity exceptions", "compare Na/Mg/Cl, predict ion charge, explain anomalies Be/B/N/O"),
    "04_Chemical_Bonding": ("Chemical Bonding", "ionic lattice, covalent molecule, metallic sea, electronegativity ladder, Lewis structures", "octet rule, formal charge = valence - lone - bonds/2, lattice energy cue, bond polarity", "NaCl, H2O, CO2, NH4+, resonance warning"),
    "05_Molecular_Geometry_and_VSEPR": ("Molecular Geometry and VSEPR", "VSEPR 3D models, electron-domain table, bond angles, lone-pair compression, polarity vector sums", "AXE notation, steric number, hybridization sp/sp2/sp3, dipole moment vector", "CH4, NH3, H2O, CO2, BF3, SF6 geometry"),
    "06_Stoichiometry_and_Mole_Concept": ("Stoichiometry and Mole Concept", "mole road map, balance equation scale, limiting reagent table, gas molar volume, solution molarity flask", "n=m/M, N=nNA, M=n/V, PV=nRT, percent yield, limiting reagent ratios", "combustion calculation, titration mole ratio, hydrate water, excess reagent"),
    "07_Chemical_Reactions_Types": ("Chemical Reaction Types", "reaction-type gallery, precipitation beaker, gas evolution, combustion flame, decomposition setup", "A+B->AB, AB->A+B, AB+CD->AD+CB, net ionic equation, activity series", "identify reaction type, balance equations, precipitate rules, spectator ions"),
    "08_States_of_Matter_and_Gases": ("States of Matter and Gases", "kinetic particle boxes, gas syringe, pressure-volume graph, Maxwell distribution, phase diagram", "PV=nRT, Boyle, Charles, Gay-Lussac, Dalton partial pressure, rms speed cue", "balloon heating, gas collection over water, real gas deviation, phase boundary"),
    "09_Solutions_and_Colligative_Properties": ("Solutions and Colligative Properties", "dissolution hydration shells, concentration ladder, osmosis membrane, boiling/freezing shift graph", "M=n/V, molality, mole fraction, DeltaTb=Kb m i, DeltaTf=Kf m i, pi=iMRT", "salt water, antifreeze, osmotic pressure, van't Hoff factor"),
    "10_Acids_Bases_and_pH": ("Acids, Bases and pH", "pH scale, titration curve, buffer beaker, conjugate acid-base pairs, indicator color chart", "pH=-log[H+], pOH=-log[OH-], Ka/Kb, Henderson-Hasselbalch, Kw=1e-14 at 25C", "strong vs weak acid, buffer calculation, equivalence point, indicator choice"),
    "11_Chemical_Equilibrium": ("Chemical Equilibrium", "dynamic equilibrium arrows, concentration-time graph, Le Chatelier stress panels, K expression board", "Kc, Kp, Q vs K, ICE table, equilibrium shift rules", "Haber process pressure/temp, color equilibrium, common ion effect cue"),
    "12_Thermochemistry": ("Thermochemistry", "energy profile, calorimeter, Hess cycle, bond enthalpy table, exothermic/endothermic heat flow", "q=mcDeltaT, DeltaH, Hess law, bond energy reactants-products, DeltaG=DeltaH-TDeltaS cue", "neutralization calorimetry, combustion enthalpy, phase change enthalpy"),
    "13_Chemical_Kinetics": ("Chemical Kinetics", "collision theory animation panels, concentration-time graph, rate law table, Arrhenius plot, catalyst energy profile", "rate=k[A]^m[B]^n, t1/2 first-order, k=Ae^-Ea/RT, integrated first-order ln[A]", "order from data, catalyst effect, temperature effect, mechanism rate-determining step"),
    "14_Redox_and_Electrochemistry": ("Redox and Electrochemistry", "galvanic cell, electrolytic cell, salt bridge, electrode potentials, oxidation-number ladder", "Ecell=Ecathode-Eanode, DeltaG=-nFE, Nernst equation, Faraday laws, oxidation/reduction half reactions", "Daniell cell, electrolysis of water, corrosion, balancing redox"),
    "15_Organic_Chemistry_Basics": ("Organic Chemistry Basics", "functional-group map, carbon hybridization, homologous series, naming scaffold, isomer cards", "IUPAC parent-chain rules, sigma/pi bonds, degree of unsaturation, inductive effect cue", "name alkanes/alkenes, draw isomers, functional group identification"),
    "16_Hydrocarbons_and_Aromaticity": ("Hydrocarbons and Aromaticity", "alkane/alkene/alkyne reaction map, benzene resonance ring, aromaticity checklist, combustion comparison", "CnH2n+2, CnH2n, CnH2n-2, Huckel 4n+2 pi rule, Markovnikov cue", "benzene vs cyclohexatriene, addition reactions, substitution, resonance stabilization"),
    "17_Alcohols_Ethers_Aldehydes_and_Ketones": ("Alcohols, Ethers, Aldehydes and Ketones", "functional group comparison, oxidation ladder, carbonyl polarity, nucleophilic addition mechanism", "R-OH, R-O-R, R-CHO, R2CO, oxidation/reduction reagents, hemiacetal cue", "distinguish aldehyde/ketone, alcohol oxidation, Grignard addition, Tollens test"),
    "18_Carboxylic_Acids_and_Derivatives": ("Carboxylic Acids and Derivatives", "acyl substitution map, acidity resonance, esterification apparatus, derivative reactivity ladder", "RCOOH pKa cue, Fischer esterification, nucleophilic acyl substitution, acid chloride > anhydride > ester > amide", "aspirin ester, soap formation, amide stability, resonance acidity"),
    "19_Amines_and_Biomolecules": ("Amines and Biomolecules", "amine classification, amino acid zwitterion, peptide bond, carbohydrate ring, DNA base-pair inset", "basicity trends, pI concept, peptide condensation, glycosidic linkage, base pairing A-T/G-C", "amino acid pH form, protein levels, glucose ring, nucleic acid structure"),
    "20_Reaction_Mechanisms_and_Electron_Pushing": ("Reaction Mechanisms and Electron Pushing", "curved-arrow grammar board, SN1/SN2/E1/E2 map, carbocation stability, transition-state diagrams", "arrows start at electrons, rate laws, nucleophile/electrophile, leaving group, stereochemical inversion", "SN2 backside attack, SN1 racemization, E2 anti-periplanar, resonance arrows"),
    "21_Stereochemistry": ("Stereochemistry", "chiral center model, mirror-image enantiomers, R/S priority wheel, E/Z alkene, Fischer projection", "CIP rules, optical rotation, enantiomer vs diastereomer, meso, racemic mixture", "assign R/S, compare stereoisomers, convert wedge/Fischer, drug chirality"),
    "22_Coordination_Chemistry": ("Coordination Chemistry", "octahedral/tetrahedral/square planar complexes, ligand field splitting, isomer panels, color spectrum", "coordination number, oxidation state, crystal-field splitting Deltao, magnetic moment cue, chelation", "naming complexes, cis/trans, high-spin/low-spin, hemoglobin/EDTA"),
    "23_Inorganic_Chemistry_and_Metallurgy": ("Inorganic Chemistry and Metallurgy", "ore-to-metal flow, blast furnace, Ellingham diagram, slag formation, periodic block chemistry", "reduction, roasting/calcination, DeltaG-T idea, activity series, amphoteric oxides", "iron extraction, aluminium electrolysis, corrosion prevention, qualitative ions"),
    "24_Analytical_Chemistry": ("Analytical Chemistry", "titration setup, burette reading, calibration curve, chromatography plate, gravimetric precipitate", "C1V1=C2V2, Beer-Lambert A=epsilon lc, Rf=distance solute/distance solvent, uncertainty", "acid-base titration, UV-vis concentration, TLC mixture, standard solution"),
    "25_Spectroscopy_and_Structure_Determination": ("Spectroscopy and Structure Determination", "IR spectrum, NMR spectrum, mass spectrum, UV-vis plot, structure puzzle board", "IR functional peaks, NMR chemical shift/integration/splitting n+1, m/z, Beer-Lambert", "identify ethanol/acetone/benzaldehyde, molecular ion, fingerprint region"),
    "26_Polymer_Chemistry": ("Polymer Chemistry", "monomer-to-polymer chain, addition vs condensation, crosslinking, polymer property map, recycling codes", "degree of polymerization, repeat unit, Tg, tacticity, condensation byproduct", "polyethylene, nylon, PET, vulcanized rubber, biodegradable polymers"),
    "27_Materials_Chemistry_and_Nanomaterials": ("Materials and Nanomaterials", "crystal defects, nanoparticle size effects, graphene sheet, quantum dot, surface-area comparison", "surface area/volume, band gap tuning, Bragg relation, defect chemistry cue", "catalysts, batteries, sensors, graphene, nanoparticle safety"),
    "28_Environmental_Chemistry": ("Environmental Chemistry", "atmosphere layers, acid rain pathway, ozone cycle, water-treatment plant, carbon cycle, pollutant map", "pH rain, NOx/SOx reactions, BOD/COD, greenhouse effect, ppm/ppb concentration", "smog, eutrophication, ozone depletion, wastewater treatment"),
    "29_Medicinal_Chemistry_and_Drug_Molecules": ("Medicinal Chemistry and Drug Molecules", "drug-target binding pocket, SAR table, ADME pipeline, dose-response curve, lead optimization flow", "IC50/EC50, pKa/logP, hydrogen bonding, pharmacophore, chiral activity", "aspirin, penicillin, antivirals, receptor binding, toxicity caution"),
    "30_Computational_Chemistry": ("Computational Chemistry", "molecular modeling workstation, potential-energy surface, conformer search, HOMO-LUMO orbitals, docking pose", "energy minimization, Boltzmann distribution, RMSD, DFT/HF cue, force-field terms", "protein-ligand docking, reaction path, conformational analysis, limitations of models"),
}


def build_block(subject: str, folder: str, data: tuple[str, str, str, str]) -> str:
    title, hero, formulas, examples = data
    return f"""

# TOPIC-SPECIFIC INFOGRAPHIC CONTENT UPGRADE
This file must be treated as a dedicated {subject} infographic for **{title}**, not as a generic science poster. Every large visual, icon, label, formula, graph and example must directly teach this exact topic.

## Mandatory central visual assets
Use a central hero composition built from: {hero}. These assets must be drawn as real teaching diagrams with labels, scale cues, arrows, legends, correct symbols and meaningful color coding.

## Must-show formulas, laws and quantitative panels
Include these formulas/rules prominently with definitions of each symbol and units/conditions: {formulas}. Put them in a clean formula strip and connect each formula to a visible diagram or worked example.

## Required worked examples and topic-specific content
Show at least three mini worked examples or model panels covering: {examples}. Include one beginner example, one exam-style problem and one advanced/application example.

## Specific graph, table or comparison requirement
Add at least one topic-appropriate graph/table: trend table, data plot, energy diagram, mechanism sequence, ray diagram, circuit graph, phase diagram, orbital/band diagram, spectrum, error graph or process-flow chart. Axes must be labelled with units where applicable.

## Misconception clinic
Add a compact wrong-vs-right panel for this exact topic. The wrong side must show a realistic student error; the right side must explain the correction using the relevant law, equation, structure, graph or model.

## Accuracy lock
Do not use decorative formulas or unrelated science imagery. Do not show incorrect units, impossible apparatus, wrong arrows, unbalanced equations, impossible valence, invalid graph shapes, fake spectra, wrong field/ray directions, or made-up constants. If a simplification is used, label the assumption.
""".strip()


def enhance(base: Path, subject: str, mapping: dict[str, tuple[str, str, str, str]]) -> tuple[int, int, list[str]]:
    touched = 0
    missing = []
    for folder in sorted(p for p in base.iterdir() if p.is_dir()):
        data = mapping.get(folder.name)
        if not data:
            missing.append(folder.name)
            continue
        block = build_block(subject, folder.name, data)
        for path in folder.glob("*.txt"):
            text = path.read_text(encoding="utf-8")
            if "# TOPIC-SPECIFIC INFOGRAPHIC CONTENT UPGRADE" in text:
                continue
            marker = "# FINAL RENDERING REQUIREMENTS"
            if marker in text:
                text = text.replace(marker, block + "\n\n" + marker, 1)
            else:
                text = text.rstrip() + "\n\n" + block + "\n"
            path.write_text(text, encoding="utf-8")
            touched += 1
    return touched, sum(1 for _ in base.rglob("*.txt")), missing


def main():
    results = [
        ("Physics",) + enhance(ROOT / "Physics", "Physics", PHYSICS),
        ("Chemistry",) + enhance(ROOT / "Chemistry", "Chemistry", CHEMISTRY),
    ]
    for subject, touched, files, missing in results:
        print(f"{subject}: enhanced={touched}, total_files={files}, missing_categories={len(missing)}")
        if missing:
            print("  " + "; ".join(missing))


if __name__ == "__main__":
    main()
