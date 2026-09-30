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
    position: [3, 1.5, -18],
    size: [6, 3, 18],
    rotation: [0, 0, 0],
  },
  {
    id: "BUILDING_L",
    nombre: "L",
    supervision: "M-21",
    position: [-15, 1, -28],
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
    position: [-30, 1.5, -11],
    size: [7, 3, 6],
    rotation: [0, -0.2, 0],
  },
  {
    id: "BUILDING_ERM",
    nombre: "ERMITA",
    supervision: "M-21",
    position: [-33, 0.5, -19],
    size: [1, 1, 1.5],
    rotation: [0, 0.5, 0],
  },
  // ==========================================
  // ZONA CENTRO - M-20 (azul)
  // ==========================================

  {
    id: "BUILDING_R",
    nombre: "R",
    supervision: "M-20",
    position: [18, 1, 9],
    size: [2, 2, 2.5],
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
    position: [5, 1.5, -3.5],
    size: [4, 3, 10],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_H",
    nombre: "H",
    supervision: "M-20",
    position: [5, 2, 6],
    size: [5.5, 4, 9],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_E",
    nombre: "E",
    supervision: "M-20",
    position: [-4, 1.5, -0.5],
    size: [4, 3, 8],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_C",
    nombre: "C",
    supervision: "M-20",
    position: [-7, 1.5, 9],
    size: [4, 3, 7],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_F",
    nombre: "F",
    supervision: "M-20",
    position: [-12, 1.5, 2.5],
    size: [4, 3, 10],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_G",
    nombre: "G",
    supervision: "M-20",
    position: [-20, 1.5, 5.5],
    size: [4, 3, 9],
    rotation: [0, 1.5, 0],
  },
  {
    id: "BUILDING_CANCHA",
    nombre: "CANCHA",
    supervision: "M-20",
    position: [10, 0.25, 24],
    size: [21, 0.5, 10],
    rotation: [0, -1.58, 0],
  },

  // ==========================================
  // POLIFORUM
  // ==========================================
  {
    id: "BUILDING_POLIFORUM",
    nombre: "Poliforum",
    supervision: "Poliforum",
    position: [-12, 2, 20],
    size: [9, 4, 10],
    rotation: [0, -1.58, 0],
  },

  // ==========================================
  // ESTACIONAMIENTO / ORIENTE
  // ==========================================
  {
    id: "BUILDING_P",
    nombre: "ESTACIONAMIENTO",
    supervision: "M-20",
    position: [-0.2, 3, 39],
    size: [6, 6, 22],
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
      return "#7acb73"; // Verde

    case "M-20":
      return "#72c7d8"; // Azul

    case "Poliforum":
      return "#f5d76e"; // Amarillo

    default:
      return "#aaaaaa"; // Gris
  }
};
