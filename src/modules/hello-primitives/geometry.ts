import {
  BoxGeometry,
  BoxBufferGeometry,
  CircleBufferGeometry,
  ConeBufferGeometry,
  CylinderBufferGeometry,
  DodecahedronBufferGeometry,
  ExtrudeBufferGeometry,
  IcosahedronBufferGeometry,
  Shape,
  Vector2,
  LatheBufferGeometry,
  OctahedronBufferGeometry,
  PlaneBufferGeometry,
  PolyhedronBufferGeometry,
  RingBufferGeometry,
  ShapeBufferGeometry,
  SphereBufferGeometry,
  TetrahedronBufferGeometry,
  TorusBufferGeometry,
  SphereGeometry,
  WireframeGeometry,
  LineSegments,
  // CylinderGeometry,
  CatmullRomCurve3,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Line
} from 'three';

const myBoxwidth = 8;
const myBoxheight = 8;
const myBoxdepth = 8;
export const myBox = new BoxBufferGeometry(myBoxwidth, myBoxheight, myBoxdepth);
export const geometry2 = new BoxGeometry(
  myBoxwidth >> 1,
  myBoxheight >> 1,
  myBoxdepth >> 1
);
// /////////// ///////////
const Circleradius = 8;
const Circlesegment = 10;
export const Circle = new CircleBufferGeometry(Circleradius, Circlesegment);
// /////////// ///////////

const coneradius = 8;
const coneheight = 10;
const coneradialSegments = 10;
const coneheiSegments = 5;
const coneopenEnded = true;

export const cone = new ConeBufferGeometry(
  coneradius,
  coneheight,
  coneradialSegments,
  coneheiSegments,
  coneopenEnded
);
// /////////// ///////////
const CylinderradiusTop = 8;
const CylinderradiusBottom = 8;
const Cylinderheight = 8;
const CylinderradiusSegment = 6;
const CylinderheightSegment = 2;

export const Cylinder = new CylinderBufferGeometry(
  CylinderradiusTop,
  CylinderradiusBottom,
  Cylinderheight,
  CylinderradiusSegment,
  CylinderheightSegment
);
// /////////// ///////////

const radius = 8;
const detail: 0 | number = 0;

export const Dodecahedron = new DodecahedronBufferGeometry(radius, detail);
// /////////// ///////////
const Extrudelength = 12,
  Extrudewidth = 8;

const shape = new Shape();
shape.moveTo(0, 0);
shape.lineTo(0, Extrudewidth);
shape.lineTo(Extrudelength, Extrudewidth);
shape.lineTo(Extrudelength, 0);
shape.lineTo(0, 0);
const extrudeSettings = {
  steps: 2,
  depth: 16,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1,
};

export const Extrude = new ExtrudeBufferGeometry(shape, extrudeSettings);

// //
const IcosahedronRadius = 8;

export const Icosahedron = new IcosahedronBufferGeometry(IcosahedronRadius);

//

const points = [];
for (let i = 0; i < 12; i++) {
  points.push(new Vector2(Math.sin(i * 0.3) * 10 + 3, (i - 3) * 1.5));
}
export const Lathe = new LatheBufferGeometry(points);

// /

const OctahedronRadius = 8;
const OctahedronDetail = 0;
export const Octahedron = new OctahedronBufferGeometry(
  OctahedronRadius,
  OctahedronDetail
);

// /

const PlaneWidth = 8;
const PlaneHeight = 8;
const WidthSegment = 2;
const HeightSegment = 2;
export const Plane = new PlaneBufferGeometry(
  PlaneWidth,
  PlaneHeight,
  WidthSegment,
  HeightSegment
);

// /
const verticesOfCube = [
  -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1,
  1, 1,
];

const indicesOfFaces = [
  2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2, 3,
  7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
];

const Polyhedronradius = 10;
export const Polyhedron = new PolyhedronBufferGeometry(
  verticesOfCube,
  indicesOfFaces,
  Polyhedronradius
);

// ///
const innerRadius = 4;
const outRadius = 10;
const thetaSegment = 20;
export const ring = new RingBufferGeometry(
  innerRadius,
  outRadius,
  thetaSegment
);

const x = -5,
  y = -5;

const heartShape = new Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

export const myShape = new ShapeBufferGeometry(heartShape);

///
const Sphereradius = 8
const SpherewidthSegments = 10
const SphereheightSegments = 10

export const Sphere = new SphereBufferGeometry(Sphereradius, SpherewidthSegments, SphereheightSegments);
// 
const TetrahedronRadius = 10
export const Tetrahedron = new TetrahedronBufferGeometry(TetrahedronRadius,);

// 
const torusradius = 8
const torustube = 1
const toruradialSegments = 10
const torutubularSegments = 6
export const Torus = new TorusBufferGeometry(torusradius, torustube, toruradialSegments, torutubularSegments);

// 
const geometry = new SphereGeometry( 100, 30, 30 );
// const mytop = 6
// const mybottom = 6
// const myheight = 8
// const myPolgen =  new CylinderGeometry(mytop, mybottom, myheight)

const wireframe = new WireframeGeometry( geometry );

export const line = new LineSegments( wireframe );
// line.material.depthTest = false;
// line.material.opacity = 0.25;
// line.material.transparent = true;

// scene.add( line );

//Create a closed wavey loop
const curve = new CatmullRomCurve3( [
	new Vector3( -10, 0, 10 ),
	new Vector3( -5, 5, 5 ),
	new Vector3( 0, 0, 0 ),
	new Vector3( 5, -5, 5 ),
	new Vector3( 10, 0, 10 )
] );

const curvePoints = curve.getPoints( 50 );
export const curveGeometry = new BufferGeometry().setFromPoints( curvePoints );

const curveMaterial = new LineBasicMaterial({
  color: 0xffffff,
  linewidth: 1,
  linecap: 'round', //ignored by WebGLRenderer
  linejoin:  'round' //ignored by WebGLRenderer
});

// Create the final object to add to the scene
export const curveObject = new Line( curveGeometry, curveMaterial );