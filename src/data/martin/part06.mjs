const rawUnits = [["25","Topology of the Electronic Structure of a Crystal: Introduction","chapter-25-topology-of-the-electronic-structure-of-a-crystal-introduction",517,[["25.1","Introduction",517],["25.2","Topology of What?",519],["25.3","Bulk-Boundary Correspondence",520],["25.4","Berry Phase and Topology for Bloch States in the Brillouin Zone",521],["25.5","Berry Flux and Chern Numbers: Winding of the Berry Phase",524],["25.6","Time-Reversal Symmetry and Topology of the Electronic System",526],["25.7","Surface States and the Relation to the Quantum Hall Effect",527],["25.8","Wannier Functions and Topology",528],["25.9","Topological Quantum Chemistry",529],["25.10","Majorana Modes",529]],530],["26","Two-Band Models: Berry Phase, Winding, and Topology","chapter-26-two-band-models-berry-phase-winding-and-topology",531,[["26.1","General Formulation for Two Bands",531],["26.2","Two-Band Models in One-Space Dimension",533],["26.3","Shockley Transition in the Bulk Band Structure and Surface States",535],["26.4","Winding of the Hamiltonian in One Dimension: Berry Phase and the Shockley Transition",537],["26.5","Winding of the Berry Phase in Two Dimensions: Chern Numbers and Topological Transitions",539],["26.6","The Thouless Quantized Particle Pump",541],["26.7","Graphene Nanoribbons and the Two-Site Model",543]],545],["27","Topological Insulators I: Two Dimensions","chapter-27-topological-insulators-i-two-dimensions",547,[["27.1","Two Dimensions: sp2 Models",548],["27.2","Chern Insulator and Anomalous Quantum Hall Effect",550],["27.3","Spin–Orbit Interaction and the Diagonal Approximation",552],["27.4","Topological Insulators and the Z2 Topological Invariant",554],["27.5","Example of a Topological Insulator on a Square Lattice",557],["27.6","From Chains to Planes: Example of a Topological Transition",560],["27.7","Hg/CdTe Quantum Well Structures",561],["27.8","Graphene and the Two-Site Model",563],["27.9","Honeycomb Lattice Model with Large Spin–Orbit Interaction",567]],567],["28","Topological Insulators II: Three Dimensions","chapter-28-topological-insulators-ii-three-dimensions",569,[["28.1","Weak and Strong Topological Insulators in Three Dimensions: Four Topological Invariants",569],["28.2","Tight-Binding Example in 3D",572],["28.3","Normal and Topological Insulators in Three Dimensions: Sb2 Se3 and Bi2 Se3",573],["28.4","Weyl and Dirac Semimetals",575],["28.5","Fermi Arcs",578]],580]];

export const part06 = {
  number: 6,
  roman: "VI",
  title: "Electronic Structure and Topology",
  titleZh: "电子结构与拓扑",
  label: "Part VI · Electronic Structure and Topology",
  slug: "part-06-electronic-structure-and-topology",
  overview: null,
  units: rawUnits.map(([id, title, slug, page, sections, exercisesPage]) => ({
    id: String(id),
    title,
    slug,
    page,
    label: `${6 === 7 ? 'Appendix' : 'Chapter'} ${id} · ${title}`,
    sections: sections.map(([sectionId, sectionTitle, sectionPage]) => ({
      id: sectionId,
      title: sectionTitle,
      page: sectionPage,
    })),
    exercisesPage,
  })),
};

export default part06;
