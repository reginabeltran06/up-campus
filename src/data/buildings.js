export const buildings = [
  {
    id: "BUILDING_A",
    nombre: "A",
    supervision: "M-21",
    position: [14, 1.25, -36],
    size: [6, 2.5, 10],
    rotation: [0, -0.2, 0],
  },
  {
    id: "BUILDING_CENTRAL",
    nombre: "CENTRAL",
    supervision: "M-21",
    position: [6, 0, -17],
    size: [8.2, 3, 18.2], // caja envolvente, para el drop y otras lógicas
    height: 3,
    rotation: [0, 0.25, 0],
    shape: [
      [2.1, -9.1], // punta norte
      [4.0, 0.1], // esquina este (quiebre)
      [0.4, 9.1], // esquina sureste
      [-3.8, 7.3], // esquina suroeste
      [-2.3, 4.4], // escalón inferior
      [-3.3, 3.9],
      [-2.7, 2.7],
      [-3.7, 2.2],
      [-3.2, 0.9],
      [-4.1, 0.5], // inicio del arco oeste
      [-3.8, -0.2],
      [-3.7, -1.2],
      [-3.9, -2.1], // punto más al oeste
      [-2.8, -2.3], // escalones superiores
      [-3.1, -3.7],
      [-2.1, -3.9],
      [-2.4, -5.3],
      [-1.4, -5.5],
      [-1.6, -6.8],
      [-0.6, -7.1],
      [-1.1, -8.5],
    ],
  },
  {
    id: "BUILDING_L",
    nombre: "L",
    supervision: "M-21",
    position: [-12, 1, -28],
    size: [2, 2, 5],
    rotation: [0, -1.1, 0],
  },
  {
    id: "BUILDING_I",
    nombre: "I",
    supervision: "M-21",
    position: [13, 1, -15],
    size: [2, 2, 11],
    rotation: [0, -0.15, 0],
  },
  {
    id: "BUILDING_M",
    nombre: "M",
    supervision: "M-21",
    position: [-24, 1, -20],
    size: [4, 2, 5],
    rotation: [0, -1.1, 0],
  },
  {
    id: "BUILDING_N",
    nombre: "N",
    supervision: "M-21",
    position: [-25.5, 0.75, -23],
    size: [1.5, 1.5, 5],
    rotation: [0, -1.1, 0],
  },
  {
    id: "BUILDING_O",
    nombre: "O",
    supervision: "M-21",
    position: [-28, 1.5, -9],
    size: [4, 3, 5.5],
    rotation: [0, -0.2, 0],
  },
  {
    id: "BUILDING_ERM",
    nombre: "ERMITA",
    supervision: "M-21",
    position: [-28, 0.5, -20],
    size: [1, 1, 1.5],
    rotation: [0, 0.5, 0],
  },

  // ZONA CENTRO - M-20 (azul)
  {
    id: "BUILDING_R",
    nombre: "R",
    supervision: "M-20",
    position: [17, 1, 12],
    size: [2, 2, 3],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_CANCHAB",
    nombre: "CANCHAB",
    supervision: "M-20",
    position: [16, 0.25, 3],
    size: [7, 0.5, 4],
    rotation: [0, 1, 0],
  },
  {
    id: "BUILDING_CMD",
    nombre: "CMD",
    supervision: "M-20",
    position: [18, 1, -4.5],
    size: [2, 2, 5],
    rotation: [0, 1.6, 0],
  },
  {
    id: "BUILDING_D",
    nombre: "D",
    supervision: "M-20",
    position: [5.5, 1.5, 0],
    size: [3, 3, 8],
    rotation: [0, 1.35, 0],
  },
  {
    id: "BUILDING_H",
    nombre: "H",
    supervision: "M-20",
    position: [6, 2, 8],
    size: [5.5, 4, 7],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_E",
    nombre: "E",
    supervision: "M-20",
    position: [-3.3, 1.5, 1.5],
    size: [3, 3, 7],
    rotation: [0, 1.35, 0],
  },
  {
    id: "BUILDING_C",
    nombre: "C",
    supervision: "M-20",
    position: [-7, 1.5, 9],
    size: [3, 3, 7],
    rotation: [0, 1.35, 0],
  },
  {
    id: "BUILDING_F",
    nombre: "F",
    supervision: "M-20",
    position: [-11, 1.5, 3.5],
    size: [3, 3, 8],
    rotation: [0, 1.35, 0],
  },
  {
    id: "BUILDING_G",
    nombre: "G",
    supervision: "M-20",
    position: [-17, 1.5, 7],
    size: [3, 3, 8],
    rotation: [0, 1.35, 0],
  },
  {
    id: "BUILDING_CANCHA",
    nombre: "CANCHA",
    supervision: "M-20",
    position: [9, 0.25, 23.7],
    size: [14, 0.1, 20],
    rotation: [0, 0, 0],
  },

  // POLIFORUM
  {
    id: "BUILDING_POLIFORUM",
    nombre: "POLIFORUM",
    supervision: "Poliforum",
    position: [-10, 2, 21],
    size: [9, 4, 12],
    rotation: [0, -1.58, 0],
  },

  // ESTACIONAMIENTO / ORIENTE
  {
    id: "BUILDING_P",
    nombre: "ESTACIONAMIENTO",
    supervision: "M-20",
    position: [-0.2, 3, 39],
    size: [8, 6, 23],
    rotation: [0, -1.58, 0],
  },
  {
    id: "BUILDING_Q",
    nombre: "Q",
    supervision: "M-20",
    position: [-8, 1, 43.5],
    size: [2.5, 2, 7],
    rotation: [0, -1.58, 0],
  },
];

export const getBuildingColor = (supervision) => {
  switch (supervision) {
    case "M-21":
      return "#86b473";
    case "M-20":
      return "#80b9cb";
    case "Poliforum":
      return "#dac15e";
    default:
      return "#aaaaaa";
  }
};
