export type PaperAnchorType = 'paragraph' | 'figure' | 'equation' | 'table';

export type NormalizedBBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PaperAnchor = {
  id: string;
  page: number;
  type: PaperAnchorType;
  bbox: NormalizedBBox;
  sourceText?: string;
  figureId?: string;
  left: string;
  right: string;
};

const a = (
  id: string,
  page: number,
  type: PaperAnchorType,
  bbox: [number, number, number, number],
  left: string,
  right: string,
  extra: Pick<PaperAnchor, 'sourceText' | 'figureId'> = {},
): PaperAnchor => ({ id, page, type, bbox: { x: bbox[0], y: bbox[1], width: bbox[2], height: bbox[3] }, left, right, ...extra });

export const pilotAnnotations: PaperAnchor[] = [
  a('abstract', 1, 'paragraph', [0.16, 0.24, 0.68, 0.21], 'The abstract states the full proposed chain: one-sided Si-N functionalization makes h-BN metallic; calculated EPC gives T₍c₎ = 14.3 K; 5% tensile strain raises the calculated value to 34.9 K; 6% strain produces a soft phonon associated with a CDW.', '【来源主张】These are predictions from first-principles and isotropic Eliashberg calculations, not reports of synthesized BN₂Si, measured superconductivity, or an experimentally observed CDW. The abstract joins distinct evidence layers that the reader should keep separate.'),
  a('intro-2d-context', 1, 'paragraph', [0.07, 0.52, 0.42, 0.33], 'The opening motivates 2D superconductivity through examples where deposition or strain changes graphene.', 'This establishes functionalization as a research move. The cited examples motivate the strategy but do not validate the particular BN₂Si structure.'),
  a('intro-sin-context', 1, 'paragraph', [0.52, 0.51, 0.42, 0.25], 'The authors connect their proposal to synthesized MoSi₂N₄/WSi₂N₄ and to calculations on other Si-N-passivated monolayers.', '【推断连接】Experimental synthesis of related MA₂Z₄ layers supports chemical plausibility of Si-N layers; it does not by itself establish that the proposed BN₂Si sheet is synthesizable or stable under the modeled conditions.'),
  a('intro-hbn-context', 1, 'paragraph', [0.52, 0.75, 0.42, 0.19], 'This paragraph reviews h-BN as an insulator and earlier calculations that induce superconductivity by doping, intercalation, decoration, or hydrogenation.', 'The comparison frames the paper’s novelty: functionalization is proposed as a doping-free route. Reported T₍c₎ values here are calculated values unless an experiment is explicitly cited.'),
  a('intro-gap', 2, 'paragraph', [0.06, 0.07, 0.42, 0.20], 'The literature survey ends with the open question of whether Si-N passivation can produce high-T₍c₎ behavior in monolayer h-BN.', 'This is the research gap the calculations address. “Intriguing to explore” signals an unresolved proposal, not an established material platform.'),
  a('intro-work-summary', 2, 'paragraph', [0.06, 0.26, 0.42, 0.20], 'The paper’s program compares one-sided BN₂Si with two-sided BN₃Si₂, then follows metallic BN₂Si through EPC, strain enhancement, and a 6% CDW instability.', 'This paragraph is the argument map: structure → electronic character → lattice/EPC → calculated T₍c₎ → strained instability.'),
  a('methods', 2, 'paragraph', [0.06, 0.51, 0.42, 0.43], 'Electronic structures use VASP/PBE/PAW, while phonons and EPC use Quantum ESPRESSO with stated k/q meshes, cutoffs, vacuum, and isotropic Eliashberg equations.', '【来源记录】These settings define the computational evidence. The paper reports no cross-code equivalence test, convergence series in the main text, anharmonic treatment, or experimental validation.'),
  a('figure-1', 2, 'figure', [0.50, 0.08, 0.43, 0.34], 'Figure 1 defines the candidate geometries and shows charge-density difference and ELF for one-sided BN₂Si.', 'The geometry panels identify what is being predicted. Charge redistribution and ELF support bonding interpretation, but neither alone establishes thermodynamic synthesizability.', { figureId: 'Figure 1' }),
  a('structure-definition', 2, 'paragraph', [0.51, 0.45, 0.42, 0.24], 'One- and two-sided Si-N layers produce BN₂Si and BN₃Si₂ in space group P3m1; relaxation gives their lattice constants, thicknesses, bond lengths, and buckling.', 'This turns the functionalization idea into explicit atomic models. All later observables are conditional on these relaxed structures.'),
  a('formation-energy', 2, 'equation', [0.51, 0.78, 0.42, 0.12], 'Formation energies compare each proposed sheet with monolayer h-BN, crystalline Si, and N₂ using the stated per-atom expressions.', '【来源主张】Negative values are interpreted as thermal stability relative to these chosen references. They do not establish kinetic accessibility, the competing phase hull, or substrate-dependent growth stability.'),
  a('dynamic-stability', 3, 'paragraph', [0.07, 0.39, 0.42, 0.08], 'The authors report no imaginary phonons for unstrained BN₂Si and BN₃Si₂.', 'Within the harmonic calculations this supports local dynamical stability. It does not cover finite-temperature or anharmonic stability.'),
  a('figure-2', 3, 'figure', [0.08, 0.10, 0.84, 0.28], 'Figure 2 resolves bands and DOS by B, N, and Si orbitals; the dashed horizontal line is E₍F₎.', 'The crossing near E₍F₎ and orbital weights are the evidence for metallic BN₂Si and for identifying N-pz character near the Fermi level.', { figureId: 'Figure 2' }),
  a('electronic-structure', 3, 'paragraph', [0.07, 0.49, 0.42, 0.17], 'One-sided functionalization produces a band crossing at E₍F₎, whereas two-sided BN₃Si₂ remains an indirect-gap semiconductor.', 'This comparison explains why the superconductivity analysis proceeds with BN₂Si: conventional EPC pairing requires states at E₍F₎.'),
  a('bonding-analysis', 3, 'paragraph', [0.52, 0.45, 0.42, 0.22], 'Charge-density difference and ELF are used to describe electron transfer and covalent Si-N, B-N, and interlayer Si-B bonds.', 'These real-space quantities provide a bonding interpretation that complements the relaxed geometry. They remain model-dependent electron-density diagnostics.'),
  a('figure-3', 3, 'figure', [0.08, 0.66, 0.84, 0.28], 'Figure 3 connects phonon branches, atom-resolved vibrations, EPC weights λqν, phonon DOS, α²F(ω), cumulative λ(ω), and two representative eigenvectors.', 'This is the central mechanism figure: it identifies which phonons supply the coupling rather than reporting only a total λ.', { figureId: 'Figure 3' }),
  a('orbital-character', 4, 'paragraph', [0.06, 0.07, 0.42, 0.23], 'Near E₍F₎, the authors assign the dominant contribution to N-pz orbitals, with smaller B and Si contributions.', 'This identifies the electronic side of the EPC channel. Orbital projections depend on the projection scheme and do not constitute a directly measured orbital population.'),
  a('phonon-spectrum', 4, 'paragraph', [0.06, 0.30, 0.42, 0.29], 'The unstrained spectrum spans to about 1033 cm⁻¹; atom-resolved phonon DOS separates low Si-dominated, mid-frequency mixed, and high-frequency light-atom modes.', 'The absence of a phonon gap and the mode composition provide the vocabulary for interpreting α²F(ω) and λ(ω).'),
  a('epc-decomposition', 4, 'paragraph', [0.06, 0.59, 0.42, 0.35], 'The largest α²F peak near 235 cm⁻¹ is assigned to N-electron coupling with out-of-plane Si/N modes and contributes about 58% of λ = 0.66; a second peak near 337 cm⁻¹ adds a smaller step.', 'This is the paper’s main microscopic attribution. The percentages are calculated decompositions, not mode-resolved experimental measurements.'),
  a('mode-eigenvectors', 4, 'paragraph', [0.52, 0.07, 0.42, 0.23], 'Mode I is described as out-of-plane B/N motion; mode II as in-plane Si/N motion.', 'The eigenvectors tie peaks in α²F to concrete atomic displacement patterns, making the proposed coupling mechanism inspectable.'),
  a('strain-definition', 4, 'paragraph', [0.52, 0.35, 0.42, 0.25], 'Biaxial strain is ε = (a − a₀)/a₀ × 100%; the main analysis focuses on tensile strain after noting compressive-strain imaginary modes.', 'The strain convention and the exclusion of the unstable compressive case bound the subsequent trend. A substrate or loading protocol is not modeled.'),
  a('strain-softening', 4, 'paragraph', [0.52, 0.60, 0.42, 0.34], 'At 5% tension the calculation remains harmonically stable, broad phonon softening occurs, and Si-dominated acoustic modes near K strongly increase λ(ω).', 'This supplies the mechanism for the enhanced calculated T₍c₎: softening strengthens EPC, especially in low-frequency Si motion.'),
  a('figure-4', 5, 'figure', [0.11, 0.08, 0.77, 0.38], 'Figure 4 compares unstrained and 5%-strained phonons, α²F, λ(ω), and calculated T₍c₎ versus strain.', 'The figure supports a monotonic calculated T₍c₎ trend through 5%, while also showing that the change comes with strong lattice softening.', { figureId: 'Figure 4' }),
  a('lambda-strain', 5, 'paragraph', [0.06, 0.57, 0.42, 0.15], 'The total EPC constant rises to λ = 1.82 at 5% tensile strain, so strong-coupling correction factors are included.', 'This is the numerical bridge from phonon softening to the T₍c₎ model. It remains conditional on the isotropic treatment and chosen Coulomb pseudopotential.'),
  a('allen-dynes', 5, 'equation', [0.12, 0.70, 0.35, 0.08], 'Equation 1 is the Allen–Dynes-modified expression relating T₍c₎ to λ, ωlog, μ*, and correction factors f₁ and f₂.', 'The equation produces a model-dependent transition temperature; it is not direct evidence that superconductivity has been observed.'),
  a('strong-coupling-factor', 5, 'equation', [0.15, 0.78, 0.31, 0.07], 'Equation 2 defines f₁, the strong-coupling correction.', 'Because λ exceeds the weak-coupling range, this factor modifies the simpler McMillan estimate.'),
  a('shape-factor', 5, 'equation', [0.12, 0.85, 0.35, 0.06], 'Equation 3 defines f₂ from λ, μ*, and the ratio ω₂/ωlog.', 'This factor accounts for spectral shape; it makes the T₍c₎ estimate depend on more than the total EPC constant.'),
  a('omega-two', 5, 'equation', [0.17, 0.91, 0.28, 0.05], 'Equation 4 defines ω₂ as the second moment of α²F(ω), normalized by λ.', 'Together, Eqs. 1–4 show exactly how the calculated spectrum becomes the reported T₍c₎.'),
  a('tc-result', 5, 'paragraph', [0.06, 0.94, 0.42, 0.04], 'Despite a lower ωlog, the stronger λ yields the reported 34.9 K at 5% strain.', '【来源主张】This is a calculated T₍c₎ under the stated model and μ* = 0.1, not an experimental transition.'),
  a('cdw-framing', 5, 'paragraph', [0.52, 0.57, 0.42, 0.20], 'At 6% strain an imaginary acoustic mode appears near one-third K–Γ; the authors interpret it as a CDW signature.', 'A soft harmonic phonon establishes a structural instability of the reference cell at that wave vector. Calling the resulting phase a CDW also relies on the susceptibility and linewidth analysis that follows.'),
  a('cdw-tests', 5, 'paragraph', [0.52, 0.77, 0.42, 0.17], 'The proposed tests separate Fermi-surface nesting, examined with real and imaginary susceptibility, from EPC-driven lattice distortion, examined with phonon linewidth.', 'This lays out two mechanistic diagnostics rather than assuming every soft phonon has the same origin.'),
  a('figure-5', 6, 'figure', [0.10, 0.08, 0.82, 0.23], 'Figure 5 aligns the 6%-strain soft phonon with peaks in susceptibility and the acoustic-branch linewidth.', 'The shared wave-vector location is the paper’s strongest evidence for the joint FSN-and-EPC interpretation of the instability.', { figureId: 'Figure 5' }),
  a('susceptibility-result', 6, 'paragraph', [0.06, 0.33, 0.42, 0.08], 'Both real and imaginary susceptibility show a feature at the proposed CDW wave vector.', '【来源主张】The authors take the coincidence as confirmation of a Fermi-surface-nesting contribution.'),
  a('linewidth-result', 6, 'paragraph', [0.06, 0.41, 0.42, 0.17], 'The largest phonon-linewidth peak coincides with the imaginary phonon near one-third K–Γ.', 'This connects strong EPC to the same instability, supporting an EPC-driven periodic distortion in addition to nesting.'),
  a('cdw-synthesis', 6, 'paragraph', [0.06, 0.58, 0.42, 0.16], 'The paper concludes that both FSN and EPC contribute and situates strain-tunable BN₂Si among other strained CDW systems.', '【推断连接】Agreement of calculated diagnostics supports a joint mechanism within the model. The CDW structure, transition temperature, and competition with superconductivity are not independently calculated or measured here.'),
  a('conclusion', 6, 'paragraph', [0.06, 0.75, 0.87, 0.16], 'The conclusion restates the conditional chain from functionalization to metallic BN₂Si, calculated EPC superconductivity, strain-enhanced T₍c₎, and a 6% CDW instability.', 'The bounded reading is: this paper predicts a candidate and a mechanism. It does not report synthesis, resistance or Meissner data, a measured gap, or diffraction evidence for the CDW.'),
];

export const pilotAnnotationCounts = pilotAnnotations.reduce(
  (counts, anchor) => ({ ...counts, [anchor.type]: counts[anchor.type] + 1 }),
  { paragraph: 0, figure: 0, equation: 0, table: 0 } as Record<PaperAnchorType, number>,
);
