import React, { useMemo } from "react";
import * as THREE from "three";

/* ==========================================================================
   CALIBRACIÓN IMAGEN -> MUNDO 3D
   --------------------------------------------------------------------------
   - z0 aumentado a 35.2 para desplazar todo la red un poco MÁS HACIA ABAJO.
   - Escala (14.8) mantenida para conservar el tamaño amplio y expandido.
   ========================================================================== */
const CAL = {
  px0: 683,
  py0: 1442,
  x0: 0.5, // Centrado horizontal en el pasillo entre Poliforum y Cancha
  z0: 39, // Desplaza toda la red ligeramente hacia abajo (Sur)
  scaleX: 14,
  scaleZ: 14,
};

const r1 = (n) => Math.round(n * 10) / 10;

const px = ([ix, iy]) => [
  r1(CAL.x0 + (ix - CAL.px0) / CAL.scaleX),
  r1(CAL.z0 + (iy - CAL.py0) / CAL.scaleZ),
];

const path = (width, pts) => ({ width, points: pts.map(px) });

/* Anchos (unidades 3D) */
const PED = 0.7; // Trazos rosas: caminos peatonales
const ROAD = 1.3; // Trazos azules: calles (más anchas)

/* ==========================================================================
   roads = [{ width, points: [[x, z], ...] }]
   ========================================================================== */
export const roads = [
  /* ---------------------------- AZULES (calles) ---------------------------- */
  // Entrada oeste
  path(ROAD, [
    [22, 727],
    [120, 745],
    [225, 762],
    [300, 750],
    [345, 712],
    [365, 655],
  ]),
  // Arco hacia el norte, bordeando el edificio Central
  path(ROAD, [
    [365, 650],
    [445, 626],
    [530, 602],
    [600, 575],
    [655, 515],
    [685, 445],
    [693, 412],
  ]),
  // Lazo oeste (L / M)
  path(ROAD, [
    [390, 640],
    [347, 560],
    [342, 535],
    [380, 517],
    [408, 530],
    [445, 625],
  ]),
  // Diagonal oeste hacia el poliforum
  path(ROAD, [
    [225, 765],
    [290, 900],
    [358, 1043],
  ]),
  // Ramales norte (Esdai)
  path(ROAD, [
    [600, 343],
    [693, 412],
  ]),
  path(ROAD, [
    [655, 315],
    [690, 410],
  ]),
  path(ROAD, [
    [693, 412],
    [818, 360],
    [912, 520],
  ]),
  path(ROAD, [
    [890, 606],
    [866, 602],
    [862, 575],
  ]),
  // Calle oriente (A, I, CMD, R)
  path(ROAD, [
    [912, 522],
    [890, 610],
    [868, 690],
    [848, 768],
    [868, 830],
    [888, 866],
    [960, 868],
    [1030, 877],
    [1025, 1013],
  ]),

  /* ------------------------ ROSAS (caminos peatonales) ----------------------- */
  // Eje N-S central
  path(PED, [
    [683, 888],
    [683, 1442],
  ]),
  // Calle sur frente al estacionamiento
  path(PED, [
    [467, 1441],
    [962, 1449],
  ]),
  // Transversal media + curva este bordeando la cancha
  path(PED, [
    [478, 1063],
    [540, 1070],
    [580, 1058],
    [612, 1043],
    [683, 1043],
    [800, 1048],
    [990, 1058],
    [985, 1200],
    [972, 1350],
  ]),
  // Circuito este (D / H)
  path(PED, [
    [700, 915],
    [706, 890],
    [858, 903],
    [860, 990],
    [887, 1053],
  ]),
  // Diagonal oeste (F / G)
  path(PED, [
    [467, 931],
    [683, 990],
  ]),
  // Conectores cortos
  path(PED, [
    [507, 900],
    [500, 1062],
  ]),
  path(PED, [
    [358, 1043],
    [430, 1030],
    [500, 1035],
  ]),
  // Curva oeste hacia el Central
  path(PED, [
    [423, 913],
    [397, 893],
    [388, 860],
    [410, 812],
    [490, 712],
  ]),
  // Contorno sur del Central
  path(PED, [
    [440, 632],
    [465, 713],
    [668, 662],
  ]),
  path(PED, [
    [595, 690],
    [576, 842],
  ]),
  path(PED, [
    [597, 690],
    [655, 745],
    [676, 790],
    [676, 830],
  ]),
  // Arco peatonal norte
  path(PED, [
    [512, 390],
    [535, 406],
    [556, 400],
    [580, 428],
    [600, 500],
    [625, 590],
    [640, 640],
    [668, 662],
  ]),
  path(PED, [
    [583, 427],
    [640, 430],
    [700, 458],
  ]),
  path(PED, [
    [708, 420],
    [695, 500],
    [680, 600],
    [668, 662],
  ]),
  path(PED, [
    [705, 445],
    [825, 397],
  ]),
];

/* ==========================================================================
   Geometría: rectángulo por tramo + círculo en cada vértice
   ========================================================================== */
const buildRoadGeometry = ({ width, points }) => {
  const hw = width / 2;
  const shapes = [];

  for (let i = 0; i < points.length - 1; i++) {
    const [x1, z1] = points[i];
    const [x2, z2] = points[i + 1];
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    if (len < 1e-6) continue;

    const nx = (-dz / len) * hw;
    const ny = (-dx / len) * hw;

    const ax = x1,
      ay = -z1,
      bx = x2,
      by = -z2;

    const shape = new THREE.Shape();
    shape.moveTo(ax + nx, ay + ny);
    shape.lineTo(bx + nx, by + ny);
    shape.lineTo(bx - nx, by - ny);
    shape.lineTo(ax - nx, ay - ny);
    shape.closePath();
    shapes.push(shape);
  }

  points.forEach(([x, z]) => {
    const c = new THREE.Shape();
    c.absarc(x, -z, hw, 0, Math.PI * 2, false);
    shapes.push(c);
  });

  return new THREE.ShapeGeometry(shapes, 8);
};

function Roads({ color = "#ffffff", y = 0.05, data = roads }) {
  const geometries = useMemo(() => data.map(buildRoadGeometry), [data]);

  return (
    <group position={[0, y, 0]}>
      {geometries.map((geometry, i) => (
        <mesh
          key={i}
          geometry={geometry}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            roughness={0.9}
            metalness={0}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      ))}
    </group>
  );
}

export { Roads };
export default Roads;
