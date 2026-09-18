import type { ReadingDocument } from './readingData'

export const ANTENNA_ID = 2026090901
export const antennaDocument: ReadingDocument = {
  id: ANTENNA_ID,
  title: 'Ultra-Wideband Omnidirectional Shared-Aperture Antenna for Electromagnetic Spectrum Measurement',
  authors: 'Meilin Wu, Yihong Su, Yu Jian Cheng, Zhiqin Zhao',
  journal: '用户提供论文 · 原文未注明刊物', year: '未注明', type: 'PDF',
  size: '3页', favorite: false, folder: '我的笔记库1',
}
export interface PaperAnchor { page: number; x: number; y: number; width?: number; height?: number }
export const antennaOutline = [
  { title: '摘要 Abstract', page: 1, x: .074, y: .24 },
  { title: 'I. Introduction', page: 1, x: .074, y: .369 },
  { title: 'II. Shared-Aperture Antenna Design', page: 1, x: .074, y: .802 },
  { title: 'A. Overall Structure', page: 1, x: .074, y: .826, child: true },
  { title: 'B. Sleeve Monopole Antenna', page: 1, x: .51, y: .49, child: true },
  { title: 'C. Annular Vivaldi Antenna Array', page: 2, x: .074, y: .404, child: true },
  { title: 'III. Simulation Result', page: 2, x: .074, y: .802 },
  { title: 'IV. Conclusion', page: 3, x: .51, y: .108 },
  { title: 'V. Acknowledgment', page: 3, x: .51, y: .313 },
  { title: 'References', page: 3, x: .51, y: .408 },
]
export const antennaAbstract = 'A shared-aperture antenna combining a sleeve monopole and a Vivaldi array is proposed for electromagnet spectrum map measurement. The operating frequency of 0.5–8 GHz is split into a low band (0.5–3.8 GHz) utilizing a vertically polarized sleeve monopole and a high band (3.8–8 GHz) utilizing a horizontally polarized Vivaldi array. Simulation results show a VSWR < 2.8 throughout the band, low-band gain variation < 1.5 dB, and stable high-band beam forming, suitable for spectrum monitoring scenarios.'
export const antennaFigures = [
  { title: 'Overall structure of the entire antenna.', page: 1, x: .51, y: .72 },
  { title: 'Structure of the sleeve monopole antenna (unit: mm).', page: 2, x: .07, y: .065 },
  { title: 'Structure of the annular Vivaldi antenna array (unit: mm).', page: 2, x: .51, y: .065 },
  { title: 'Voltage Standing Wave Ratio (VSWR) simulation results. (a) Sleeve Monopole Antenna; (b) Annular Vivaldi Antenna Array.', page: 2, x: .51, y: .47 },
  { title: 'Radiation pattern of E Plane of the sleeve monopole antenna.', page: 2, x: .51, y: .67 },
  { title: 'Radiation pattern of H Plane of the sleeve monopole antenna.', page: 3, x: .075, y: .065 },
  { title: 'Radiation pattern of a Vivaldi antenna unit. (a) E Plane; (b) H Plane.', page: 3, x: .075, y: .48 },
  { title: 'Combined radiation pattern of the Vivaldi antenna array.', page: 3, x: .075, y: .67 },
].map((f, i) => ({ ...f, number: i+1, image: `/antenna/figure-${i+1}.png` }))
export const antennaReferences = [
  ['Spectrum Sharing for Internet of Things: A Survey', 'L. Zhang, Y. C. Liang and M. Xiao', '2019', '10.1109/MWC.2018.1800259'],
  ['Spectrum Sharing and Interference Management for 6G LEO Satellite-Terrestrial Network Integration', 'N. Heydarishahreza, T. Han and N. Ansari', '2025', '10.1109/COMST.2024.3507019'],
  ['Free space spot-beamforming for IoT multi-user near-orthogonal overlay communications enhanced by OAM waves and reconfigurable meta-surface', 'Y. Zhao, Q. Lv, Y. L. Guan, et al.', '2025', '10.23919/emsci.2025.0002'],
  ['Measurements and Analysis of Personal Exposure to Radiofrequency Electromagnetic Fields at Outdoor and Indoor School Buildings: A Case Study at a Spanish School', 'R. Ramirez-Vazquez, I. Escobar, A. Thielens and E. Arribas', '2020', '10.1109/ACCESS.2020.3033800'],
  ['Design and implementation of RF power levels measurement system from indoor to outdoor in Isparta province', 'M. A. Gozel and M. Kahriman', '2024', '10.1016/j.sna.2024.115458'],
  ['Dynamic Ambient RF Energy Density Measurements of Montreal for Battery-Free IoT Sensor Network Planning', 'X. Gu, L. Grauwin, D. Dousset, S. Hemour and K. Wu', '2021', '10.1109/JIOT.2021.3065683'],
  ['A Review on Antenna Technologies for Ambient RF Energy Harvesting and Wireless Power Transfer: Designs, Challenges and Applications', 'M. A. Ullah, R. Keshavarz, M. Abolhasan, J. Lipman, K. P. Esselle and N. Shariati', '2022', '10.1109/ACCESS.2022.3149276'],
  ['Dual-Band Structure-Shared Antenna with Large Frequency Ratio for 5G Communication Applications', 'F. Xiao, X. Lin and Y. Su', '2020', '10.1109/LAWP.2020.3032739'],
  ['RF Energy Harvesting Using Multidirectional Rectennas: A Review', 'W. A. Khan, R. Raad, F. Tubbal, P. I. Theoharis and S. Iranmanesh', '2024', '10.1109/JSEN.2024.3397624'],
].map(([title, authors, year, doi], i) => ({ number: i+1, title, authors, year, doi, page: 3, x: .51, y: [.43,.465,.51,.558,.611,.657,.704,.76,.808][i] }))

const referenceEnhancements = [
  ['IEEE Wireless Communications', '2019-02-01', 'Reviews spectrum sharing architectures, interference coordination, and IoT access patterns that motivate wideband spectrum monitoring.'],
  ['IEEE Communications Surveys & Tutorials', '2025-01-16', 'Surveys LEO satellite-terrestrial spectrum sharing and interference management, giving a network-level context for sensing wide electromagnetic bands.'],
  ['EMSCI', '2025-07-22', 'Explores OAM-wave and metasurface assisted free-space beamforming for IoT links, a related direction for multi-user electromagnetic environment mapping.'],
  ['IEEE Access', '2020-11-02', 'Measures radiofrequency electromagnetic exposure around school buildings and shows why spatially resolved spectrum measurements are operationally useful.'],
  ['Sensors and Actuators A: Physical', '2024-04-15', 'Describes an RF power-level measurement system for indoor-to-outdoor surveys, providing instrumentation context for this antenna prototype.'],
  ['IEEE Internet of Things Journal', '2021-03-23', 'Maps ambient RF energy density in Montreal to support battery-free IoT planning and demonstrates the value of broadband field observations.'],
  ['IEEE Access', '2022-01-28', 'Reviews antenna technologies for ambient RF energy harvesting and wireless power transfer, including bandwidth, polarization, and deployment constraints.'],
  ['IEEE Antennas and Wireless Propagation Letters', '2020-11-03', 'Presents a dual-band structure-shared antenna, directly related to shared-aperture design choices and large frequency-ratio operation.'],
  ['IEEE Sensors Journal', '2024-05-08', 'Reviews multidirectional rectenna systems and links antenna coverage, directionality, and ambient RF harvesting scenarios.'],
] as const

export const antennaReferenceDetails = antennaReferences.map((reference, index) => ({
  ...reference,
  journal: referenceEnhancements[index][0],
  publicationDate: referenceEnhancements[index][1],
  abstract: referenceEnhancements[index][2],
  source: '基于题名、DOI与公开书目信息的原型补全；非本文PDF原文字段。',
}))

export const antennaKeywords = ['shared aperture antenna', 'ultra-wideband', 'sleeve monopole', 'Vivaldi array', 'spectrum measurement', 'omnidirectional radiation']

export const antennaPhraseDefinitions = [
  { phrase: 'shared-aperture antenna', meaning: '共口径天线：多个天线结构共用同一物理口径，以减少体积并覆盖不同频段或极化。', translation: '共口径天线' },
  { phrase: 'sleeve monopole', meaning: '套筒单极子：利用套筒结构扩展阻抗带宽的垂直极化低频天线单元。', translation: '套筒单极子' },
  { phrase: 'Vivaldi array', meaning: 'Vivaldi阵列：由渐变槽天线组成的宽带阵列，适合高频段定向或波束形成。', translation: 'Vivaldi阵列' },
  { phrase: 'VSWR', meaning: '电压驻波比：反映天线阻抗匹配程度，数值越低通常表示反射越小。', translation: '电压驻波比' },
  { phrase: 'omnidirectional', meaning: '全向辐射：在水平面上尽量均匀覆盖各方向，适合环境频谱测量。', translation: '全向' },
  { phrase: 'beam forming', meaning: '波束形成：通过阵列幅相控制把辐射能量集中到指定方向。', translation: '波束形成' },
]

export const antennaGraph = {
  nodes: [
    { id: 'paper', type: 'paper', label: 'Ultra-wideband shared-aperture antenna', description: '0.5-8 GHz spectrum measurement antenna combining low-band sleeve monopole and high-band Vivaldi array.', page: 1 },
    { id: 'author-su', type: 'scholar', label: 'Yihong Su', description: 'Corresponding author; Institute for Wireless Intelligence, Chengdu.', page: 1 },
    { id: 'theory-shared-aperture', type: 'theory', label: 'Shared-aperture design', description: 'Co-locates different radiators in one compact aperture while managing coupling and pattern consistency.', page: 1 },
    { id: 'tech-sleeve', type: 'technology', label: 'Sleeve monopole', description: 'Low-band vertically polarized radiator covering 0.5-3.8 GHz.', page: 2 },
    { id: 'tech-vivaldi', type: 'technology', label: 'Annular Vivaldi array', description: 'High-band horizontally polarized array covering 3.8-8 GHz.', page: 2 },
    { id: 'metric-vswr', type: 'metric', label: 'VSWR < 2.8', description: 'Simulation result used to judge impedance matching across the full band.', page: 2 },
    { id: 'ref-shared', type: 'reference', label: 'Dual-Band Structure-Shared Antenna', description: 'Closest cited work for structure-shared antenna design.', page: 3 },
  ],
  edges: [
    ['paper', 'author-su', 'authored by'],
    ['paper', 'theory-shared-aperture', 'uses'],
    ['paper', 'tech-sleeve', 'contains'],
    ['paper', 'tech-vivaldi', 'contains'],
    ['tech-sleeve', 'metric-vswr', 'validated by'],
    ['tech-vivaldi', 'metric-vswr', 'validated by'],
    ['paper', 'ref-shared', 'cites'],
  ].map(([source, target, relation], index) => ({ id: `edge-${index + 1}`, source, target, relation })),
}

export const antennaSeedNote = {
  id: ANTENNA_ID, title: '示例 · 连续超宽带覆盖',
  excerpt: 'This paper designs and validates an ultra-wideband shared-aperture antenna covering 0.5–8 GHz.',
  createdAt: '', color: '#FFE4BA',
  sourceAnchor: { page: 3, x: .51, y: .13, width: .42, height: .025 },
  sourceRects: [{ x: .51, y: .13, width: .42, height: .013 }, { x: .51, y: .145, width: .315, height: .013 }],
}
