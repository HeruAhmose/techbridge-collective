// ═══════════════════════════════════════════════════════════════
// Tamerian Materials — Complete Data Layer
// Design: Cinematic Science Documentary
// All patent data, specs, claims preserved from original
// ═══════════════════════════════════════════════════════════════

export const TECH_CARDS = [
  {
    id: "matrix",
    num: "01",
    title: "Hemp-Carbon Matrix",
    color: "#45e8d8",
    colorName: "teal",
    vol: "40–70 vol%",
    claim: "Claim 1",
    short:
      "Pyrolysis at 700–1400°C. Conductivity 10²–10⁶ S/m. Fiber Ø 5–50 μm, aspect ratios >100:1.",
    overview:
      "The carbonaceous matrix forms the structural and electrical backbone. Industrial hemp bast fibers are pyrolyzed at 700–1400°C in oxygen-depleted atmosphere (90–98% N₂, 2–10% H₂) for 0.5–6 hours, yielding a carbon matrix retaining original fibrous morphology with electrical conductivities ranging from 10² to 10⁶ Siemens per meter.",
    specs: [
      ["Conductivity", "10² – 10⁶ S/m"],
      ["Fiber Diameter", "5 – 50 μm"],
      ["Fiber Length", "0.5 – 20 mm"],
      ["Aspect Ratio", "> 100:1"],
      ["Volume Fraction", "40 – 70%"],
      ["Pyrolysis Temp", "700 – 1400°C"],
      ["Atmosphere", "N₂ / Ar / Forming Gas"],
      ["Duration", "0.5 – 6 hours"],
    ],
    claims: [
      "Claim 1: Carbonaceous matrix from pyrolyzed hemp at 40–70% by volume",
      "Claim 2: Pyrolysis at 700–1400°C in oxygen-depleted atmosphere",
      "Claim 3: 900–1200°C in 90–98% N₂ + 2–10% H₂, conductivity 10³–10⁵ S/m",
      "Claim 4: Fibrous morphology retained, fiber Ø 5–50 μm, length 0.5–20 mm, aspect >100:1",
    ],
    insight:
      "Percolation threshold occurs at approximately 15% carbon content by volume. Above this threshold, conductivity jumps from less than 10 S/m to over 100 S/m as continuous conductive pathways form through the fiber network. This is the fundamental mechanism enabling the composite's electrical functionality.",
  },
  {
    id: "crystals",
    num: "02",
    title: "Crystalline Phases",
    color: "#a485ff",
    colorName: "purple",
    vol: "Multi-phase",
    claim: "Claim 15",
    short:
      "Quartz SiO₂ (15–45%), tourmaline (3–25%), magnetite Fe₃O₄ (2–20%), rare-earth (0.3–10%).",
    overview:
      "Four distinct crystalline phases are dispersed throughout the carbon matrix in a hierarchical microstructure spanning three length scales: millimeter-scale carbon fiber networks providing structural pathways, micrometer-scale quartz and rare-earth distributions at fiber interfaces, and nanometer-scale tourmaline and magnetite dispersions at grain boundaries and within the polymer binder.",
    specs: [
      ["Quartz (SiO₂)", "15–45 vol%, 0.5–100 μm"],
      ["Tourmaline (Schorl)", "3–25 vol%, 50–500 nm"],
      ["Magnetite (Fe₃O₄)", "2–20 vol%, 10–200 nm"],
      ["Rare-Earth Doped", "0.3–10 vol%, 0.1–10 μm"],
      ["Polymer Binder", "5–30% by weight"],
      ["Binder Options", "Epoxy, polyimide, silicone, PU"],
    ],
    claims: [
      "Claim 13: Black tourmaline (schorl), 50–500 nm, 5–15 vol%",
      "Claim 14: Quartz average particle size 5–20 μm, present at 20–35 vol%",
      "Claim 15: Hierarchical microstructure with mm/μm/nm-scale distributions",
    ],
    insight:
      "At the millimeter scale, hemp-derived carbon fibers form the load-bearing and conduction backbone. At the micrometer scale, quartz and rare-earth particles sit at fiber interfaces. At the nanometer scale, tourmaline and magnetite fill grain boundaries and binder regions. This three-scale architecture is what enables multi-functional performance.",
  },
  {
    id: "harvest",
    num: "03",
    title: "Multi-Modal Harvesting",
    color: "#e8c44a",
    colorName: "gold",
    vol: "80–800 μW/cm²",
    claim: "Claim 6",
    short:
      "Simultaneous piezoelectric + thermoelectric + spin-Seebeck. Combined output at 250–350 K.",
    overview:
      "The composite harvests energy through three simultaneous mechanisms: (1) piezoelectric conversion from quartz and tourmaline under mechanical stress generating 50–500 μW/cm², (2) thermoelectric conversion from carbon-crystal interfaces with ZT of 1.0–2.5, and (3) spin-Seebeck effect from magnetite nanoparticles adding 40–60% additional thermal conversion.",
    specs: [
      ["Piezoelectric", "50–500 μW/cm²"],
      ["Stress Range", "10–100 MPa cyclic"],
      ["Frequency", "0.1–100 Hz"],
      ["Thermoelectric ZT", "1.0–2.5 at 250–350 K"],
      ["Spin-Seebeck Boost", "+40–60% over conventional"],
      ["Combined Output", "80–800 μW/cm²"],
      ["Tensile Strength", "30–200 MPa"],
      ["Young's Modulus", "3–40 GPa"],
    ],
    claims: [
      "Claim 6(a): Piezoelectric 50–500 μW/cm² under 10–100 MPa at 0.1–100 Hz",
      "Claim 6(b): Thermoelectric ZT 1.0–2.5 at 250–350 K",
      "Claim 6(c): Combined 80–800 μW/cm² under simultaneous mechanical + thermal loading",
    ],
    insight:
      "Under cyclic compressive stress, the quartz and tourmaline phases generate charge via the direct piezoelectric effect. Simultaneously, any thermal gradient across the composite drives both conventional Seebeck and spin-Seebeck currents through the magnetite-carbon network. All three mechanisms operate in parallel from the same material.",
    hasCharts: true,
  },
  {
    id: "quantum",
    num: "04",
    title: "Quantum Sensing",
    color: "#ff7eb6",
    colorName: "pink",
    vol: "T₂ > 500 ns",
    claim: "Claim 7",
    short:
      "Eu, Nd, Er, Yb, Ce in quartz host. Self-powered quantum sensors at room temperature.",
    overview:
      "Rare-earth doped crystalline particles embedded in the composite host quantum spin or optical centers that exhibit quantum coherence at or near room temperature. These centers are interrogated by a quantum readout circuit using optical excitation, microwave, or radio-frequency control fields. Because the composite itself harvests energy, the quantum sensors are entirely self-powered.",
    specs: [
      ["Dopants", "Eu³⁺, Nd³⁺, Er³⁺, Yb³⁺, Ce³⁺"],
      ["Host Matrix", "Quartz (SiO₂)"],
      ["Dopant Concentration", "0.1–5 atomic %"],
      ["Coherence Time T₂", "> 500 ns (target 1–10 μs)"],
      ["Operating Temp", "Room temperature (300K)"],
      ["Sensing Targets", "Magnetic field, temperature, strain"],
      ["Self-Powered", "Yes — energy from same composite"],
    ],
    claims: [
      "Claim 7: Quantum spin coherence T₂ of 1–10 μs at room temperature",
      "Claim 5: Europium-doped quartz at 0.5–2 atomic % concentration",
      "Claim 24: Device with quantum readout circuit measuring magnetic field, temp, or strain",
    ],
    insight:
      "Europium ions substituted into the quartz lattice at controlled concentrations create optically addressable quantum centers. Under optical pumping, these centers exhibit spin coherence that is sensitive to local magnetic fields, temperature shifts, and mechanical strain — enabling quantum-limited sensing powered by the composite's own energy harvesting.",
  },
];

export const MFG_STEPS = [
  {
    n: "710",
    t: "Fiber Preparation",
    d: "Source, clean, and cut industrial hemp bast fibers. Pre-condition for optimal pyrolysis. Select hemp varieties with high cellulose and lignin content for maximum carbon yield and fiber quality.",
  },
  {
    n: "720",
    t: "Pyrolysis",
    d: "Heat hemp fibers to 700–1400°C in oxygen-depleted atmosphere (nitrogen, argon, or forming gas: 90–98% N₂ + 2–10% H₂) for 0.5–6 hours. This produces a carbonaceous matrix retaining the original fibrous morphology with electrical conductivities of 10²–10⁶ S/m.",
  },
  {
    n: "730",
    t: "Crystal Synthesis",
    d: "Prepare or procure: quartz microcrystals via sol-gel or hydrothermal methods, tourmaline and magnetite nanoparticles, and rare-earth doped crystals (e.g., europium-doped quartz synthesized by hydrolyzing TEOS with europium nitrate, then calcining at 1100–1200°C).",
  },
  {
    n: "740",
    t: "Dispersion",
    d: "Disperse the carbonaceous matrix and all crystalline particles in a solvent (water, ethanol, isopropanol, or NMP) with a surfactant or polymeric dispersing agent. Apply ultrasonication at 20–40 kHz frequency and 100–1000 watts power for 15–60 minutes to de-agglomerate particles and achieve homogeneous dispersion.",
  },
  {
    n: "750",
    t: "Binder Addition",
    d: "Introduce polymer binder (epoxy resin, polyimide, silicone elastomer, or polyurethane at 5–30% by weight) into the dispersed mixture. Mechanical stirring and/or additional ultrasonication ensures uniform distribution. Degass the composite precursor mixture under vacuum to remove trapped air and solvent bubbles.",
  },
  {
    n: "760",
    t: "Forming & Curing",
    d: "Form the degassed mixture into desired geometry — panels, tiles, films, or flexible strips — via casting, molding, extrusion, or other forming processes. Cure or consolidate through heat curing, room-temperature curing, pressure consolidation, or a combination thereof to yield the final composite material.",
  },
  {
    n: "770",
    t: "QC & Electrodes",
    d: "Machine to final dimensions. Attach electrodes of conductive metals (copper, silver, aluminum) or conductive coatings (graphene, carbon-based) to opposing surfaces. Test electrical conductivity, piezoelectric response, thermoelectric performance, and mechanical properties. If QC fails, rework formulation at step 740.",
  },
];

export const APPS = [
  {
    icon: "⬡",
    t: "Energy Harvesting Tiles",
    cl: "Claims 19, 20, 22",
    d: "Floor tiles with active composite layer, electrodes, and protective layers. Installed in buildings where foot traffic and ambient thermal gradients generate energy to power local sensors, lighting, or wireless nodes. Panel area: 10–400 cm².",
  },
  {
    icon: "◎",
    t: "Wearable Devices",
    cl: "Claims 11b, 23",
    d: "Composite integrated into flexible bands or garments. Silicone elastomer binder provides >50% elongation at break for comfort. Harvests body motion and heat to power wearable sensors or communication modules.",
  },
  {
    icon: "△",
    t: "Structural Health Monitoring",
    cl: "Claim 25",
    d: "Composite bonded to or embedded within bridge girders, building beams, pipelines, or roadways. Harvests vibrations and thermal cycling while providing strain and magnetic field sensing. No external cables or battery replacement needed.",
  },
  {
    icon: "◇",
    t: "Self-Powered Quantum Sensors",
    cl: "Claim 24",
    d: "Rare-earth doped regions define quantum sensing zones. A quantum readout circuit interrogates these regions to measure magnetic field, temperature, or strain — all powered by energy harvested from the same composite.",
  },
  {
    icon: "⊡",
    t: "Wireless IoT Nodes",
    cl: "Claim 21",
    d: "Complete battery-free sensor nodes: sensor + microcontroller + wireless communication module. Powered entirely by the composite. Transmits structural health data without external power cables or battery replacement.",
  },
];

export const CLAIMS = {
  composition: [
    "1. Composite: carbonaceous matrix (40–70%) + quartz (15–45%) + tourmaline (3–25%) + magnetite (2–20%) + RE (0.3–10%) + polymer binder (5–30% wt)",
    "2. Matrix produced by pyrolysis of hemp at 700–1400°C in oxygen-depleted atmosphere",
    "3. Pyrolysis at 900–1200°C in forming gas (90–98% N₂ + 2–10% H₂), conductivity 10³–10⁵ S/m",
    "4. Fibrous morphology: Ø 5–50 μm, length 0.5–20 mm, aspect ratio >100:1",
    "5. Rare-earth particles: europium-doped quartz at 0.5–2 atomic percent europium",
    "6. Performance: (a) piezoelectric 50–500 μW/cm², (b) ZT 1.0–2.5 at 250–350K, (c) combined 80–800 μW/cm²",
    "7. Quantum spin coherence time T₂ of 1–10 microseconds at room temperature",
    "8. Mechanical: tensile strength 30–200 MPa, Young's modulus 3–40 GPa, elongation 1–8%",
    "9. Carbon-negative production: net sequestration >0.5 tons CO₂ per ton composite produced",
    "10–11. Binder: epoxy resin for rigid applications, silicone elastomer for flexible wearable applications",
    "12. Magnetite nanoparticles form percolating network enhancing conductivity and spin-Seebeck response",
    "13. Tourmaline is black tourmaline (schorl), 50–500 nm particle size, present at 5–15 vol%",
    "14. Quartz microcrystals: average particle size 5–20 μm, present at 20–35 vol%",
    "15. Hierarchical microstructure: mm-scale fibers, μm-scale crystals at interfaces, nm-scale particles at grain boundaries",
  ],
  methods: [
    "16. Manufacturing method: pyrolyze hemp → procure/synthesize crystals → disperse all in solvent → ultrasonicate (20–40 kHz, 100–1000W, 15–60 min) → add polymer binder → degass under vacuum → form into desired shape → cure/consolidate",
    "17. Solvent selected from water, ethanol, isopropanol, N-methyl-2-pyrrolidone; dispersing agent compatible with polymer binder",
    "18. Post-curing step: attach electrodes to opposed surfaces of cured composite for energy harvesting",
  ],
  devices: [
    "19. Energy harvesting device: composite panel/film + first electrode + second electrode + energy management circuit (rectifier + voltage regulator + energy storage) + load",
    "20. Panel with lateral area of 10–400 cm², configured to harvest from ambient vibration, human motion, and temperature gradients",
    "21. Load comprises wireless sensor node (sensor + microcontroller + wireless transmitter), no external battery required",
    "22. Floor tile configuration: composite installed in building floor, harvests foot traffic + temperature gradients across tile",
    "23. Flexible wearable article: worn on human body, harvests body motion and body heat",
    "24. Quantum sensing device: rare-earth doped regions define quantum sensing zones, quantum readout circuit measures magnetic field, temperature, or strain, powered by composite energy harvesting",
    "25. Structural component for infrastructure monitoring: bonded to/embedded in bridges, beams, pipelines, roadways — self-powered structural health monitoring",
  ],
};

export const COMPOSITION = [
  {
    m: "q",
    n: "Hemp-Carbon Matrix",
    p: "40–70 vol%",
    d: "Structural backbone. Pyrolyzed at 700–1400°C. Fiber Ø 5–50 μm. Conductivity 10²–10⁶ S/m. Carbon-negative feedstock.",
    w: 60,
    c: "#f0e8d8",
  },
  {
    m: "t",
    n: "Quartz (SiO₂)",
    p: "15–45 vol%",
    d: "Stable piezoelectric phase generating charge under stress. Particle size 0.5–100 μm. d₃₃ ~2.3 pC/N. Host matrix for rare-earth dopants.",
    w: 35,
    c: "#45e8d8",
  },
  {
    m: "m",
    n: "Tourmaline (Schorl)",
    p: "3–25 vol%",
    d: "Enhanced piezoelectric coefficient d₃₃ ~5–10 pC/N plus pyroelectric effect. 50–500 nm particles. Dual mechanical + thermal harvesting.",
    w: 16,
    c: "#a485ff",
  },
  {
    m: "p",
    n: "Magnetite (Fe₃O₄)",
    p: "2–20 vol%",
    d: "Room-temperature ferrimagnetism. Spin-Seebeck thermoelectric enhancement. 10–200 nm particles forming percolating networks.",
    w: 12,
    c: "#e8c44a",
  },
  {
    m: "c",
    n: "Rare-Earth Crystals",
    p: "0.3–10 vol%",
    d: "Europium/neodymium-doped quartz at 0.1–5 atomic percent. Quantum spin coherence T₂ >500 ns at 300K for sensing.",
    w: 6,
    c: "#ff7eb6",
  },
];

export const ORBITAL_NODES = [
  { a: 0, r: 46, c: "#f0e8d8", m: "q" },
  { a: 72, r: 46, c: "#45e8d8", m: "t" },
  { a: 144, r: 46, c: "#a485ff", m: "m" },
  { a: 216, r: 46, c: "#e8c44a", m: "p" },
  { a: 288, r: 46, c: "#ff7eb6", m: "c" },
  { a: 36, r: 33, c: "#45e8d8", m: "t" },
  { a: 108, r: 33, c: "#f0e8d8", m: "q" },
  { a: 180, r: 33, c: "#a485ff", m: "m" },
  { a: 252, r: 33, c: "#e8c44a", m: "p" },
  { a: 324, r: 33, c: "#ff7eb6", m: "c" },
];

export const PIEZO_DATA = [
  [0, 0, "0V @ 0 MPa"],
  [0.1, 0.8, "0.8V @ 10"],
  [0.2, 2.2, "2.2V @ 20"],
  [0.3, 3.5, "3.5V @ 30"],
  [0.4, 5.5, "5.5V @ 40"],
  [0.5, 7.8, "7.8V @ 50"],
  [0.6, 9.5, "9.5V @ 60"],
  [0.7, 11, "11V @ 70"],
  [0.8, 12.5, "12.5V @ 80"],
  [0.9, 14, "14V @ 90"],
  [1, 15, "15V @ 100"],
] as const;

export const ZT_DATA = [
  [0, 0.95, "ZT 0.95 @ 250K"],
  [0.125, 1.05, "ZT 1.05 @ 275K"],
  [0.25, 1.15, "ZT 1.15 @ 300K"],
  [0.375, 1.35, "ZT 1.35 @ 325K"],
  [0.5, 1.55, "ZT 1.55 @ 350K"],
  [0.625, 1.75, "ZT 1.75 @ 375K"],
  [0.75, 1.9, "ZT 1.9 @ 400K"],
  [0.875, 2.05, "ZT 2.05 @ 425K"],
  [1, 2.2, "ZT 2.2 @ 450K"],
] as const;

export const ZT_REF = [
  [0, 0.12],
  [0.25, 0.18],
  [0.5, 0.24],
  [0.75, 0.32],
  [1, 0.4],
] as const;

export const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hero-bg-C5xwpUWTF6pTR9o6HLbCm5.webp",
  crystal:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/crystal-structure-K4PL8jwohk8roJbj9shQ2A.webp",
  energy:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/energy-harvest-PNBq2sGEGtqLx4VHNfzbvQ.webp",
  quantum:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/quantum-sense-ZraQQjnwG6Xiy9vaPamEwB.webp",
  hemp: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hemp-carbon-XqwmAz4AyBgZgmkGUnrUBH.webp",
};

export const STATS = [
  {
    value: "40–70",
    suffix: "%",
    label: "Hemp-Carbon by Vol",
    countFrom: 40,
    countTo: 70,
  },
  { value: "10²–10⁶", suffix: "", label: "S/m Conductivity", isStatic: true },
  { value: "25", suffix: "", label: "Patent Claims", countTo: 25 },
  { value: "5", suffix: "", label: "Crystal Systems", countTo: 5 },
  { value: ">0.5", suffix: "", label: "t CO₂/Ton Sequestered", isStatic: true },
];
