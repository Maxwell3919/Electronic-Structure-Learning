export type ReferenceEntry = {
  title: string;
  authors: string;
  year: string;
  url: string;
  whyUse: string;
  boundary: string;
  guideHref?: string;
};

export const normalizedReferenceGroups: { title: string; entries: ReferenceEntry[] }[] = [
  {
    "title": "Books and monographs",
    "entries": [
      {
        "title": "Density Functional Theory: A Practical Introduction",
        "authors": "David S. Sholl and Janice A. Steckel",
        "year": "2009",
        "url": "https://doi.org/10.1002/9780470447710",
        "guideHref": "/reading/books/sholl-steckel/",
        "whyUse": "Use it to connect practical DFT choices to the physical and numerical layers they modify.",
        "boundary": "Examples and software context reflect the source period; present execution guidance belongs in DRW."
      },
      {
        "title": "Materials Modelling Using Density Functional Theory",
        "authors": "Feliciano Giustino",
        "year": "2014",
        "url": "https://global.oup.com/academic/product/materials-modelling-using-density-functional-theory-9780199662449",
        "guideHref": "/reading/books/giustino/",
        "whyUse": "Use it for a compact theory-to-materials bridge with explicit computational objects.",
        "boundary": "Source examples do not replace current code documentation or observable-specific validation."
      },
      {
        "title": "Fundamentals of Condensed Matter Physics",
        "authors": "Marvin L. Cohen and Steven G. Louie",
        "year": "2016",
        "url": "https://www.cambridge.org/9780521513319",
        "guideHref": "/reading/books/cohen-louie/",
        "whyUse": "Use it for a broad condensed-matter route from states and quasiparticles to collective phenomena.",
        "boundary": "Model examples establish concepts, not universal material behavior."
      },
      {
        "title": "Electronic Structure: Basic Theory and Practical Methods",
        "authors": "Richard M. Martin",
        "year": "2020",
        "url": "https://doi.org/10.1017/9781108555586",
        "guideHref": "/reading/books/martin/",
        "whyUse": "Use it for a continuous theory-to-computation account of electronic structure.",
        "boundary": "Read later developments and implementation choices alongside the source edition."
      },
      {
        "title": "Conceptual Density Functional Theory Volume 2",
        "authors": "Shubin Liu (editor)",
        "year": "2022",
        "url": "https://doi.org/10.1002/9783527829941.fmatter",
        "whyUse": "Use it for a bounded conceptual treatment outside the continuous Core spine.",
        "boundary": "Edited scope and chapter quality vary; use the cited edition and verify decisive claims in primary sources."
      }
    ]
  },
  {
    "title": "Foundational papers",
    "entries": [
      {
        "title": "Inhomogeneous Electron Gas",
        "authors": "Pierre Hohenberg and Walter Kohn",
        "year": "1964",
        "url": "https://doi.org/10.1103/PhysRev.136.B864",
        "whyUse": "Use it for the original density–potential and density-variational argument.",
        "boundary": "The original theorem organization is not the later Levy–Lieb constrained-search formulation."
      },
      {
        "title": "Self-Consistent Equations Including Exchange and Correlation Effects",
        "authors": "Walter Kohn and Lu Jeu Sham",
        "year": "1965",
        "url": "https://doi.org/10.1103/PhysRev.140.A1133",
        "whyUse": "Use it for the auxiliary one-particle construction that makes ground-state DFT computationally usable.",
        "boundary": "Auxiliary orbitals and eigenvalues are not general many-body excitation observables."
      },
      {
        "title": "Universal variational functionals of electron densities, first-order density matrices, and natural spin-orbitals and solution of the v-representability problem",
        "authors": "Mel Levy",
        "year": "1979",
        "url": "https://doi.org/10.1073/pnas.76.12.6062",
        "whyUse": "Use it for the constrained-search construction and its density-domain repair.",
        "boundary": "The paper establishes a variational definition, not a closed practical approximation."
      }
    ]
  },
  {
    "title": "Major reviews",
    "entries": [
      {
        "title": "二维超导材料",
        "authors": "XIAO Rui-Chun; LU Wen-Jian; SUN Yu-Ping",
        "year": "2018",
        "url": "https://doi.org/10.7693/wl20180601",
        "whyUse": "Use it to orient a specialist field and locate the primary literature behind its synthesis.",
        "boundary": "A review organizes a field but does not replace its cited primary evidence or later updates."
      }
    ]
  },
  {
    "title": "Electronic-structure methods",
    "entries": [
      {
        "title": "Origin of the Structural and Magnetic Anomalies of the Layered Compound SrFeO 2 : A Density Functional Investigation",
        "authors": "H. J. Xiang; Su-Huai Wei; M.-H. Whangbo",
        "year": "2008",
        "url": "https://doi.org/10.1103/PhysRevLett.100.167207",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Simultaneous Visualization of Covalent and Noncovalent Interactions Using Regions of Density Overlap",
        "authors": "Piotr de Silva; Clémence Corminboeuf",
        "year": "2014",
        "url": "https://doi.org/10.1021/ct500490b",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "High throughput study on magnetic ground states with Hubbard U corrections in transition metal dihalide monolayers",
        "authors": "Xinru Li; Zeying Zhang; Hongbin Zhang",
        "year": "2020",
        "url": "https://doi.org/10.1039/C9NA00588A",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "High-throughput bandstructure simulations of van der Waals hetero-bilayers formed by 1T and 2H monolayers",
        "authors": "Rui Dong; Alain Jacob; Stéphane Bourdais; Stefano Sanvito",
        "year": "2021",
        "url": "https://doi.org/10.1038/s41699-021-00200-9",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Effect of Hubbard U-corrections on the electronic and magnetic properties of 2D materials: a high-throughput study",
        "authors": "Sahar Pakdel; Thomas Olsen; Kristian S. Thygesen",
        "year": "2025",
        "url": "https://doi.org/10.1038/s41524-024-01503-3",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "InvDesFlow-AL: active learning-based workflow for inverse design of functional materials",
        "authors": "Xiao-Qi Han; Peng-Jie Guo; Ze-Feng Gao; Hao Sun; Zhong-Yi Lu",
        "year": "2025",
        "url": "https://doi.org/10.1038/s41524-025-01830-z",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Unveiling vibrational and optoelectronic properties of HfX2 (X = Br, I) monolayers via DFT calculations",
        "authors": "W. O. Santos; L. S. Barbosa; E. Moreira; D. L. Azevedo",
        "year": "2025",
        "url": "https://doi.org/10.1063/5.0286460",
        "whyUse": "",
        "boundary": ""
      }
    ]
  },
  {
    "title": "Response, phonons, and EPC",
    "entries": [
      {
        "title": "Electronic structure of superconducting graphite intercalate compounds: The role of the interlayer state",
        "authors": "Gábor Csányi; P. B. Littlewood; Andriy H. Nevidomskyy; Chris J. Pickard; B. D. Simons",
        "year": "2005",
        "url": "https://doi.org/10.1038/nphys119",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Superconductivity in the intercalated graphite compounds C6Yb and C6Ca",
        "authors": "Thomas E. Weller; Mark Ellerby; Siddharth S. Saxena; Robert P. Smith; Neal T. Skipper",
        "year": "2005",
        "url": "https://doi.org/10.1038/nphys0010",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Predicting the spin-lattice order of frustrated systems from first principles",
        "authors": "H. J. Xiang; E. J. Kan; Su-Huai Wei; M.-H. Whangbo; X. G. Gong",
        "year": "2011",
        "url": "https://doi.org/10.1103/PhysRevB.84.224429",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Electronic origin of high-temperature superconductivity in single-layer FeSe superconductor",
        "authors": "Defa Liu; Wenhao Zhang; Daixiang Mou; Junfeng He; Yun-Bo Ou; Qing-Yan Wang; Zhi Li; Lili Wang; Lin Zhao; Shaolong He; Yingying Peng; Xu Liu; Chaoyu Chen; Li Yu; Guodong Liu; Xiaoli Dong; Jun Zhang; Chuangtian Chen; Zuyan Xu; Jiangping Hu; Xi Chen; Xucun Ma; Qikun Xue; X.J. Zhou",
        "year": "2012",
        "url": "https://doi.org/10.1038/ncomms1946",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Interface-Induced High-Temperature Superconductivity in Single Unit-Cell FeSe Films on SrTiO3",
        "authors": "Qing-Yan Wang; Zhi Li; Wen-Hao Zhang; Zuo-Cheng Zhang; Jin-Song Zhang; Wei Li; Hao Ding; Yun-Bo Ou; Peng Deng; Kai Chang; Jing Wen; Can-Li Song; Ke He; Jin-Feng Jia; Shuai-Hua Ji; Ya-Yu Wang; Li-Li Wang; Xi Chen; Xu-Cun Ma; Qi-Kun Xue",
        "year": "2012",
        "url": "https://doi.org/10.1088/0256-307X/29/3/037402",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Phonon-mediated superconductivity in graphene by lithium deposition",
        "authors": "Gianni Profeta; Matteo Calandra; Francesco Mauri",
        "year": "2012",
        "url": "https://doi.org/10.1038/nphys2181",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Correlation-enhanced electron-phonon coupling: Applications of GW and screened hybrid functional to bismuthates, chloronitrides, and other high Tc superconductors",
        "authors": "Z. P. Yin; A. Kutepov; G. Kotliar",
        "year": "2013",
        "url": "https://doi.org/10.1103/PhysRevX.3.021011",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Phonon-mediated superconductivity in electron-doped single-layer MoS 2 : A first-principles prediction",
        "authors": "Yizhi Ge; Amy Y. Liu",
        "year": "2013",
        "url": "https://doi.org/10.1103/PhysRevB.87.241408",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Electron-doped phosphorene: A potential monolayer superconductor",
        "authors": "D. F. Shao; W. J. Lu; H. Y. Lv; Y. P. Sun",
        "year": "2014",
        "url": "https://doi.org/10.1209/0295-5075/108/67004",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Two-dimensional superconductivity at the interface of a Bi2Te3/FeTe heterostructure",
        "authors": "Qing Lin He; Hongchao Liu; Mingquan He; Ying Hoi Lai; Hongtao He; Gan Wang; Kam Tuen Law; Rolf Lortz; Jiannong Wang; Iam Keong Sou",
        "year": "2014",
        "url": "https://doi.org/10.1038/ncomms5247",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Highly crystalline 2D superconductors",
        "authors": "Yu Saito; Tsutomu Nojima; Yoshihiro Iwasa",
        "year": "2016",
        "url": "https://doi.org/10.1038/natrevmats.2016.94",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Robust two-dimensional superconductivity and vortex system in Bi2Te3/FeTe heterostructures",
        "authors": "Hong-Chao Liu; Hui Li; Qing Lin He; Iam Keong Sou; Swee K. Goh; Jiannong Wang",
        "year": "2016",
        "url": "https://doi.org/10.1038/srep26168",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Superconductivity in the two-dimensional electron gas induced by high-energy optical phonon mode and large polarization of the SrTiO 3 substrate",
        "authors": "Baruch Rosenstein; B. Ya. Shapiro; I. Shapiro; Dingping Li",
        "year": "2016",
        "url": "https://doi.org/10.1103/PhysRevB.94.024505",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Theory of light-enhanced phonon-mediated superconductivity",
        "authors": "M. A. Sentef; A. F. Kemper; A. Georges; C. Kollath",
        "year": "2016",
        "url": "https://doi.org/10.1103/PhysRevB.93.144506",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Gated tuned superconductivity and phonon softening in monolayer and bilayer MoS2",
        "authors": "Yajun Fu; Erfu Liu; Hongtao Yuan; Peizhe Tang; Biao Lian; Gang Xu; Junwen Zeng; Zhuoyu Chen; Yaojia Wang; Wei Zhou; Kang Xu; Anyuan Gao; Chen Pan; Miao Wang; Baigeng Wang; Shou-Cheng Zhang; Yi Cui; Harold Y. Hwang; Feng Miao",
        "year": "2017",
        "url": "https://doi.org/10.1038/s41535-017-0056-1",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Observation of two-dimensional superconductivity in bilayers of BaBiO 3 and BaPbO 3",
        "authors": "B. Meir; S. Gorol; T. Kopp; G. Hammerl",
        "year": "2017",
        "url": "https://doi.org/10.1103/PhysRevB.96.100507",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Ubiquitous strong electron–phonon coupling at the interface of FeSe/SrTiO3",
        "authors": "Chaofan Zhang; Zhongkai Liu; Zhuoyu Chen; Yanwu Xie; Ruihua He; Shujie Tang; Junfeng He; Wei Li; Tao Jia; Slavko N. Rebec; Eric Yue Ma; Hao Yan; Makoto Hashimoto; Donghui Lu; Sung-Kwan Mo; Yasuyuki Hikita; Robert G. Moore; Harold Y. Hwang; Dunghai Lee; Zhixun Shen",
        "year": "2017",
        "url": "https://doi.org/10.1038/ncomms14468",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Exchange Enhancement of the Electron-Phonon Interaction: the Case of Weakly Doped Two-Dimensional Multivalley Semiconductors",
        "authors": "Betül Pamuk; Paolo Zoccante; Jacopo Baima; Francesco Mauri; Matteo Calandra",
        "year": "2018",
        "url": "https://doi.org/10.7566/JPSJ.87.041013",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Observation of interface superconductivity in a SnSe 2 /epitaxial graphene van der Waals heterostructure",
        "authors": "Yi-Min Zhang; Jia-Qi Fan; Wen-Lin Wang; Ding Zhang; Lili Wang; Wei Li; Ke He; Can-Li Song; Xu-Cun Ma; Qi-Kun Xue",
        "year": "2018",
        "url": "https://doi.org/10.1103/PhysRevB.98.220508",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Theory of Phonon-Mediated Superconductivity in Twisted Bilayer Graphene",
        "authors": "Fengcheng Wu; A. H. MacDonald; Ivar Martin",
        "year": "2018",
        "url": "https://doi.org/10.1103/PhysRevLett.121.257001",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Cross-dimensional electron-phonon coupling in van der Waals heterostructures",
        "authors": "Miao-Ling Lin; Yu Zhou; Jiang-Bin Wu; Xin Cong; Xue-Lu Liu; Jun Zhang; Hai Li; Wang Yao; Ping-Heng Tan",
        "year": "2019",
        "url": "https://doi.org/10.1038/s41467-019-10400-z",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Enhanced Electron-Phonon Interaction in Multivalley Materials",
        "authors": "Thibault Sohier; Evgeniy Ponomarev; Marco Gibertini; Helmuth Berger; Nicola Marzari; Nicolas Ubrig; Alberto F. Morpurgo",
        "year": "2019",
        "url": "https://doi.org/10.1103/PhysRevX.9.031019",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Evidence of cooperative effect on the enhanced superconducting transition temperature at the FeSe/SrTiO3 interface",
        "authors": "Q. Song; T. L. Yu; X. Lou; B. P. Xie; H. C. Xu; C. H. P. Wen; Q. Yao; S. Y. Zhang; X. T. Zhu; J. D. Guo; R. Peng; D. L. Feng",
        "year": "2019",
        "url": "https://doi.org/10.1038/s41467-019-08560-z",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Studies on the origin of the interfacial superconductivity of Sb2 Te3 /Fe1+y Te heterostructures",
        "authors": "Jing Liang; Yu Jun Zhang; Xiong Yao; Hui Li; Zi-Xiang Li; Jiannong Wang; Yuanzhen Chen; Iam Keong Sou",
        "year": "2019",
        "url": "https://doi.org/10.1073/pnas.1914534117",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Charge density wave and superconducting phase in monolayer InSe",
        "authors": "Mohammad Alidoosti; Davoud Nasr Esfahani; Reza Asgari",
        "year": "2021",
        "url": "https://doi.org/10.1103/PhysRevB.103.035411",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Electron-Phonon Mediated Superconductivity in 1T−MoS2 and Effect of Pressure on the Same",
        "authors": "Kumar et al.",
        "year": "2021",
        "url": "https://doi.org/10.1016/j.jpcs.2021.110185",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Interfacial Electron-Phonon Coupling Constants Extracted from Intrinsic Replica Bands in Monolayer FeSe / SrTi O 3",
        "authors": "Brendan D. Faeth; Saien Xie; Shuolong Yang; Jason K. Kawasaki; Jocienne N. Nelson; Shuyuan Zhang; Christopher Parzyck; Pramita Mishra; Chen Li; Christopher Jozwiak; Aaron Bostwick; Eli Rotenberg; Darrell G. Schlom; Kyle M. Shen",
        "year": "2021",
        "url": "https://doi.org/10.1103/PhysRevLett.127.016803",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Two-dimensional superconductivity driven by interfacial electron-phonon coupling in a BaPbO 3 / BaBiO 3 bilayer",
        "authors": "S. Di Napoli; C. Helman; A. M. Llois; V. Vildosola",
        "year": "2021",
        "url": "https://doi.org/10.1103/PhysRevB.103.174509",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Emergence of superconductivity in an InSe monolayer: Roles of deposited metal and biaxial strain",
        "authors": "Jianyong Chen; Xing Wang; Xiumin Liu",
        "year": "2022",
        "url": "https://doi.org/10.1016/j.jpcs.2022.110823",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Moiré Phonons in Magic-Angle Twisted Bilayer Graphene",
        "authors": "Xiaoqian Liu; Ran Peng; Zhaoru Sun; Jianpeng Liu",
        "year": "2022",
        "url": "https://doi.org/10.1021/acs.nanolett.2c02010",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Superconductivity in monolayer Ba 2 N electride: First-principles study",
        "authors": "Xiao-Le Qiu; Jian-Feng Zhang; Huan-Cheng Yang; Zhong-Yi Lu; Kai Liu",
        "year": "2022",
        "url": "https://doi.org/10.1103/PhysRevB.105.165101",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Electron-phonon coupling and spin fluctuations in the Ising superconductor NbSe2",
        "authors": "S. Das; H. Paudyal; E. R. Margine; D. F. Agterberg; I. I. Mazin",
        "year": "2023",
        "url": "https://doi.org/10.1038/s41524-023-01017-4",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Atomic-scale observation of localized phonons at FeSe/SrTiO3 interface",
        "authors": "Ruochen Shi; Qize Li; Xiaofeng Xu; Bo Han; Ruixue Zhu; Fachen Liu; Ruishi Qi; Xiaowen Zhang; Jinlong Du; Ji Chen; Dapeng Yu; Xuetao Zhu; Jiandong Guo; Peng Gao",
        "year": "2024",
        "url": "https://doi.org/10.1038/s41467-024-47688-5",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Modulation of superconductivity and superhardness in X B 4 C 4 ( X = Be , B , Al , Si , P , and Ti ) borocarbides at ambient pressure",
        "authors": "Qiwen Jiang; Zihao Huo; Zhengtao Liu; Ling Chen; Tiancheng Ma; Shuqing Jiang; Defang Duan; Tian Cui",
        "year": "2025",
        "url": "https://doi.org/10.1103/lswp-5cxx",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Superconductivity in twisted bilayer WSe_2",
        "authors": "Yinjie Guo; Jordan Pack; Joshua Swann; Luke Holtzman; Matthew Cothrine; Kenji Watanabe; Takashi Taniguchi; David G. Mandrus; Katayun Barmak; James Hone; Andrew J. Millis; Abhay Pasupathy; Cory R. Dean",
        "year": "2025",
        "url": "https://doi.org/10.1038/s41586-024-08381-1",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "A unified tight-binding description of the electronic structure and Ising protection of superconductivity in misfit layered compounds",
        "authors": "G. A. Bobkov; I. A. Shvets; I. V. Bobkova",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2607.19308",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Ah-SCDFT: A general approach for superconductivity with anharmonic corrections",
        "authors": "Fan et al.",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2607.17759",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Cavity Tuning of the CDW--Superconductivity Interplay in a Kagome Metal",
        "authors": "Lan-Ting Shi et al.",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2607.27769",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Doping tunable charge density waves in misfit layer compounds",
        "authors": "Hugo Le Du et al.",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2607.19095",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "First-Principles Investigation of Electron--Phonon Coupling and Intrinsic Two-Gap Superconductivity in Hexagonal BAs3 Monolayer",
        "authors": "Jakkapat Seeyangnok; Udomsilp Pinsook",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2606.08423",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Interface-Confined Superconductivity with Thickness-Independent Superfluid Stiffness in (Pb,Sn)Te/FeTe Bilayers",
        "authors": "Yan et al.",
        "year": "2026",
        "url": "https://arxiv.org/abs/2607.17539",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Microscopic theory for electron-phonon coupling in twisted bilayer graphene",
        "authors": "Ziyan Zhu; Thomas P. Devereaux",
        "year": "2026",
        "url": "https://doi.org/10.1103/tpww-cq4k",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Quantum geometry and critical temperature enhancement in MgB_2 superconductivity",
        "authors": "Yi Jiang et al.",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2607.19458",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Quasiparticle GW for Superconductors: Toward a Unified Treatment of Electron-Phonon and Electron-Plasmon Couplings",
        "authors": "Catalin D. Spataru; Christopher Renskers; Elena R. Margine",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2605.21700",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Stacking-tuned superconductivity and competing charge-density-wave states in NbSe_2",
        "authors": "Sandra Sajan et al.",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2607.20335",
        "whyUse": "",
        "boundary": ""
      }
    ]
  },
  {
    "title": "Many-body, GW, and BSE",
    "entries": [
      {
        "title": "New Method for Calculating the One-Particle Green's Function with Application to the Electron-Gas Problem",
        "authors": "Lars Hedin",
        "year": "1965",
        "url": "https://doi.org/10.1103/PhysRev.139.A796",
        "whyUse": "Use it for the coupled propagator, screening, self-energy, and vertex framework behind GW.",
        "boundary": "GW variants follow from additional truncation and self-consistency choices; they are not one universal algorithm."
      }
    ]
  },
  {
    "title": "Wannier, Berry, and topology",
    "entries": [
      {
        "title": "First-principles theory of ferroelectric phase transitions for perovskites: The case of BaTiO 3",
        "authors": "W. Zhong; David Vanderbilt; K. M. Rabe",
        "year": "1995",
        "url": "https://doi.org/10.1103/PhysRevB.52.6301",
        "whyUse": "Use it for the first-principles-derived effective Hamiltonian and Monte Carlo phase sequence for BaTiO3.",
        "boundary": "The reported transition sequence tests the specified BaTiO3 reduced model; it is not a direct finite-temperature all-electron calculation or a universal perovskite result."
      },
      {
        "title": "Ferroelectric heterobilayer with tunable first- and higher-order topological states",
        "authors": "Runhan Li; Ning Mao; Linke Cai; Yingxi Bai; Baibiao Huang; Ying Dai; Chengwang Niu",
        "year": "2023",
        "url": "https://doi.org/10.1103/PhysRevB.108.125302",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Mechanism for Nodal Topological Superconductivity on PtBi_2 Surface",
        "authors": "Kristian Mæland; Giorgio Sangiovanni; Björn Trauzettel",
        "year": "2026",
        "url": "https://doi.org/10.1103/x1cy-w5zd",
        "whyUse": "",
        "boundary": ""
      }
    ]
  },
  {
    "title": "Materials and application case studies",
    "entries": [
      {
        "title": "Crystal and Magnetic Structures in Layered, Transition Metal Dihalides and Trihalides",
        "authors": "Michael McGuire",
        "year": "2017",
        "url": "https://doi.org/10.3390/cryst7050121",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Reversible and selective ion intercalation through the top surface of few-layer MoS2",
        "authors": "Jinsong Zhang; Ankun Yang; Xi Wu; Jorik van de Groep; Peizhe Tang; Shaorui Li; Bofei Liu; Feifei Shi; Jiayu Wan; Qitong Li; Yongming Sun; Zhiyi Lu; Xueli Zheng; Guangmin Zhou; Chun-Lan Wu; Shou-Cheng Zhang; Mark L. Brongersma; Jia Li; Yi Cui",
        "year": "2018",
        "url": "https://doi.org/10.1038/s41467-018-07710-z",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Efficient Computational Design of 2D van der Waals Heterostructures: Band- Alignment, Lattice-Mismatch, and Machine-learning",
        "authors": "Kamal Choudhary et al.",
        "year": "2020",
        "url": "https://doi.org/10.48550/arXiv.2004.03025",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "HfX2 (X = Cl, Br, I) Monolayer and Type II Heterostructures with Promising Photovoltaic Characteristics*",
        "authors": "Xingyong Huang; Liujiang Zhou; Luo Yan; You Wang; Wei Zhang; Xiumin Xie; Qiang Xu; Hai-Zhi Song",
        "year": "2020",
        "url": "https://doi.org/10.1088/0256-307X/37/12/127101",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Observation of an intermediate state during lithium intercalation of twisted bilayer MoS2",
        "authors": "Yecun Wu; Jingyang Wang; Yanbin Li; Jiawei Zhou; Bai Yang Wang; Ankun Yang; Lin-Wang Wang; Harold Y. Hwang; Yi Cui",
        "year": "2022",
        "url": "https://doi.org/10.1038/s41467-022-30516-z",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Trigonal Symmetry Breaking and its Electronic Effects in Two-Dimensional Dihalides MX2 and Trihalides MX3",
        "authors": "Alexandru B. Georgescu; Andrew J. Millis; James M. Rondinelli",
        "year": "2022",
        "url": "https://doi.org/10.1103/PhysRevB.105.245153",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Van der Waals Electrides",
        "authors": "Jun Zhou; Jing-Yang You; Yi-Ming Zhao; Yuan Ping Feng; Lei Shen",
        "year": "2024",
        "url": "https://doi.org/10.1021/acs.accounts.4c00394",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Versatile Method for Preparing Two-Dimensional Metal Dihalides",
        "authors": "Rongrong Qi et al.",
        "year": "2024",
        "url": "https://doi.org/10.1021/acsnano.4c04397",
        "whyUse": "",
        "boundary": ""
      },
      {
        "title": "Surface Modification for III-V Selective Area Molecular Beam Epitaxy of Non-Selective Mask Materials",
        "authors": "Ashlee M. García et al.",
        "year": "2026",
        "url": "https://doi.org/10.48550/arXiv.2606.02317",
        "whyUse": "",
        "boundary": ""
      }
    ]
  }
];

export const normalizedReferenceCount = normalizedReferenceGroups.reduce((total, group) => total + group.entries.length, 0);
