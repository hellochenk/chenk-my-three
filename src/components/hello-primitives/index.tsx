import { 
  useRef, 
  // useState, 
  useEffect, 
  useCallback 
} from 'react';
// import { useRef, useEffect, useCallback } from 'react'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';
import {
  Mesh,
  LineSegments,
  WebGLRenderer,
  PerspectiveCamera,
  // MeshPhongMaterial,
  // DoubleSide,
  Scene,
  Color,
  AxesHelper,
  // Vector3,
  // TOUCH,
  DirectionalLight,
  BufferGeometry,
  WireframeGeometry,
  Material,
  // LineDashedMaterial,
  // LineBasicMaterial,
  DirectionalLightHelper,
} from 'three';
import type { FC } from 'react';
import {
  myBox,
  Circle,
  cone,
  Cylinder,
  Dodecahedron,
  // geometry2,
  Extrude,
  Icosahedron,
  Lathe,
  Octahedron,
  Plane,
  Polyhedron,
  ring,
  myShape,
  Sphere,
  Tetrahedron,
  Torus,
  // line,
  // curveObject,
  curveGeometry,
  // wireframe
} from './geometry';
import './index.scss';
import { createMaterial, getPositionByIndex } from './utils';
import createText from './my-text';

type Props = {};

const meshArr: (Mesh | LineSegments)[] = [];
const lineArr: (Mesh | LineSegments)[] = [];

const HelloPrimitives: FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  // const [isPageLoading, setPageLoading] = useState<boolean>(false);
  const createInit = useCallback(async () => {
    if (canvasRef.current === null) {
      return;
    }

    meshArr.length = 0; //以防万一，先清空原有数组

    //初始化场景
    const scene = new Scene();
    scene.background = new Color(0xaaaaaa);
    const axesHelper = new AxesHelper(200);
    scene.add(axesHelper);
    //初始化镜头
    const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(20, 20, 400);
    cameraRef.current = camera;

    // 创建轨迹
    const controls = new ArcballControls(camera, canvasRef.current, scene);
    controls.addEventListener('change', function () {
      renderer.render(scene, camera);
    });
    controls.update();

    //初始化渲染器
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });
    rendererRef.current = renderer;

    //添加灯光
    const light0 = new DirectionalLight(0xffffff, 0.4);
    light0.position.set(-20, 20, -20);
    scene.add(light0);

    const light1 = new DirectionalLight(0xffffff, 0.4);
    light0.position.set(20, -20, 20);
    scene.add(light1);

    //根据平行光实例，创建对应的辅助对象，并将辅助对象添加到场景中
    const directionalLightHelper0 = new DirectionalLightHelper(light0);
    const directionalLightHelper1 = new DirectionalLightHelper(light1);
    scene.add(directionalLightHelper0);
    scene.add(directionalLightHelper1);

    //获得各个 solid 类型的图元实例，并添加到 solidPrimitivesArr 中
    const solidPrimitivesArr: BufferGeometry[] = [];
    solidPrimitivesArr.push(myBox, Circle, cone, Cylinder, Dodecahedron);

    solidPrimitivesArr.push(Extrude, Icosahedron, Lathe, Octahedron, Plane);

    solidPrimitivesArr.push(Polyhedron, ring, myShape, Sphere, Tetrahedron);

    solidPrimitivesArr.push(Torus, curveGeometry);

    //创建 3D 文字，并添加到 mesArr 中，请注意此函数为异步函数
    const mytext = await createText('chenk');
    solidPrimitivesArr.push(mytext.textGeo);

    //将各个 solid 类型的图元实例转化为网格，并添加到 primitivesArr 中
    solidPrimitivesArr.forEach((item) => {
      const material = createMaterial(); //随机获得一种颜色材质
      const mesh = new Mesh(item, material);

      const wireframe = new WireframeGeometry(item);
      const line = new LineSegments(wireframe);
      // const lineMesh = new Mesh(wireframe, new LineBasicMaterial())

      meshArr.push(mesh); //将网格添加到网格数组中
      lineArr.push(line); //将网格添加到网格数组中
    });

    //获得各个 line 类型的图元实例，并添加到 meshArr 中
    // const linePrimitivesArr: Three.BufferGeometry[] = []
    // linePrimitivesArr.push(myEdges, myWireframe)

    //将各个 line 类型的图元实例转化为网格，并添加到 meshArr 中
    // linePrimitivesArr.forEach((item) => {
    //   const material = new Three.LineBasicMaterial({ color: 0x000000 })
    //   const mesh = new Three.LineSegments(item, material)
    //   meshArr.push(mesh)
    // })
    // meshArr.push(curveObject)

    meshArr.forEach((mesh, index) => {
      const { x, y } = getPositionByIndex(index);
      // const Geocurrent = solidPrimitivesArr[index]
      mesh.position.x = x; //为什么要 -2 ？
      mesh.position.y = y;

      lineArr[index].position.x = x;
      lineArr[index].position.y = y;

      // mesh.computeBoundingBox()
      // Geocurrent.boundingBox?.getCenter(mesh.position).multiplyScalar(-1)
      // wireframe.computeBoundingBox()
      // wireframe.boundingBox?.getCenter(line.position).multiplyScalar(-1)

      scene.add(mesh, lineArr[index]); //将网格添加到场景中
    });

    meshArr.forEach((item) => {
      const axes = new AxesHelper(15);
      const material = axes.material as Material;
      material.depthTest = false;
      axes.renderOrder = 1; // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
      item.add(axes);
    });
    //添加自动旋转渲染动画
    const render = (time: number) => {
      time = time * 0.001;
      meshArr.forEach((item, index) => {
        item.rotation.x = time;
        item.rotation.y = time;

        lineArr[index].rotation.x = time;
        lineArr[index].rotation.y = time;
      });
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);
  }, [canvasRef]);

  const resizeHandle = () => {
    //根据窗口大小变化，重新修改渲染器的视椎
    if (rendererRef.current === null || cameraRef.current === null) {
      return;
    }

    const canvas = rendererRef.current.domElement;
    cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false);
  };

  //组件首次装载到网页后触发，开始创建并初始化 3D 场景
  useEffect(() => {
    createInit();
    resizeHandle();
    window.addEventListener('resize', resizeHandle);
    return () => {
      window.removeEventListener('resize', resizeHandle);
    };
  }, [canvasRef, createInit]);

  return (<div className='full-screen'>
    <canvas ref={canvasRef} />
  </div>)
};

export default HelloPrimitives;
