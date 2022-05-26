import React, { useRef, useState, useEffect, useCallback } from 'react';
// import { useRef, useEffect, useCallback } from 'react'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';
import {
  Mesh,
  LineSegments,
  WebGLRenderer,
  PerspectiveCamera,
  MeshPhongMaterial,
  DoubleSide,
  Scene,
  Color,
  AxesHelper,
  Vector3,
  TOUCH,
  DirectionalLight,
  BufferGeometry,
  WireframeGeometry,
} from 'three';
import type { FC } from 'react';
import {
  myBox,
  Circle,
  cone,
  Cylinder,
  Dodecahedron,
  geometry2,
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
  line,
  // wireframe
} from './geometry';
import './index.scss';

type Props = {};

const meshArr: (Mesh | LineSegments)[] = [];
const lineArr: (Mesh | LineSegments)[] = [];

const HelloPrimitives: FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  // const [isPageLoading, setPageLoading] = useState<boolean>(false);
  const createMaterial = () => {
    const material = new MeshPhongMaterial({ side: DoubleSide });

    const hue = Math.floor(Math.random() * 100) / 100; //随机获得一个色相
    const saturation = 1; //饱和度
    const luminance = 0.5; //亮度

    material.color.setHSL(hue, saturation, luminance);

    return material;
  };

  const createInit = useCallback(() => {
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
    // camera.position.x = 20;
    // camera.position.z = 400;
    // camera.position.y = 20;
    camera.lookAt(0, 0, 0);

    // 创建轨迹
    const controls = new ArcballControls( camera, canvasRef.current, scene );
    controls.addEventListener( 'change', function () {

      renderer.render( scene, camera );
    
    } );
    
    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 20, 20, 400 );
    controls.update();
    // controls.enabled = !0;
    // controls.target = new Vector3();
    // controls.minDistance = 0;
    // controls.maxDistance = 2000;
    // controls.minPolarAngle = Math.PI / 2;
    // controls.maxPolarAngle = Math.PI / 2;
    // // 禁用缩放
    // controls.enableZoom = !1;
    // // 禁用旋转
    // controls.enableRotate = !1;
    // controls.panSpeed = 2;

    // // 修改控件的默认触摸选项，设置为单指双指都为平移操作
    // controls.touches = {
    //     ONE: TOUCH.PAN,
    //     TWO: TOUCH.PAN,
    // };
    // controls.update();
    cameraRef.current = camera;

    //初始化渲染器
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });
    rendererRef.current = renderer;

    //添加 2 盏灯光
    const light0 = new DirectionalLight(0xffffff, .4);
    light0.position.set(-20, 20, -20);
    scene.add(light0);

    const light2 = new DirectionalLight(0xffffff, .4);
    light0.position.set(20, -20, 20);
    scene.add(light2);

    const light3 = new DirectionalLight(0xffffff, .4);
    light0.position.set(-20, -20, 20);
    scene.add(light3);

    const light4 = new DirectionalLight(0xffffff, .4);
    light0.position.set(20, 20, -20);
    scene.add(light4);


    //获得各个 solid 类型的图元实例，并添加到 solidPrimitivesArr 中
    const solidPrimitivesArr: BufferGeometry[] = [];
    solidPrimitivesArr.push(myBox, Circle, cone, Cylinder, Dodecahedron);

    solidPrimitivesArr.push(Extrude, Icosahedron, Lathe, Octahedron, Plane);

    solidPrimitivesArr.push(Polyhedron, ring, myShape, Sphere, Tetrahedron);

    solidPrimitivesArr.push(Torus);
    
    //将各个 solid 类型的图元实例转化为网格，并添加到 primitivesArr 中
    solidPrimitivesArr.forEach((item) => {
      const material = createMaterial(); //随机获得一种颜色材质
      const mesh = new Mesh(item, material);

      const wireframe = new WireframeGeometry(item);
      const line = new LineSegments( wireframe );

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

    //定义物体在画面中显示的网格布局
    const eachRow = 5; //每一行显示 5 个
    const spread = 30; //行高 和 列宽

    //配置每一个图元实例，转化为网格，并位置和材质后，将其添加到场景中
    meshArr.forEach((mesh, index) => {
      //我们设定的排列是每行显示 eachRow，即 5 个物体、行高 和 列宽 均为 spread 即 15
      //因此每个物体根据顺序，计算出自己所在的位置
      const row = Math.floor(index / eachRow); //计算出所在行
      const column = index % eachRow; //计算出所在列

      mesh.position.x = (column - 2) * spread; //为什么要 -2 ？
      //因为我们希望将每一行物体摆放的单元格，依次是：-2、-1、0、1、2，这样可以使每一整行物体处于居中显示
      mesh.position.y = (2 - row) * spread;

      scene.add(mesh); //将网格添加到场景中
    });

    lineArr.forEach((mesh, index) => {
      //我们设定的排列是每行显示 eachRow，即 5 个物体、行高 和 列宽 均为 spread 即 15
      //因此每个物体根据顺序，计算出自己所在的位置
      const row = Math.floor(index / eachRow); //计算出所在行
      const column = index % eachRow; //计算出所在列

      mesh.position.x = (column - 2) * spread; //为什么要 -2 ？
      //因为我们希望将每一行物体摆放的单元格，依次是：-2、-1、0、1、2，这样可以使每一整行物体处于居中显示
      mesh.position.y = (2 - row) * spread;

      scene.add(mesh); //将网格添加到场景中
    });

    scene.add(line); //将网格添加到场景中wireframe
    // const material = createMaterial();
    // const test12312 = new Mesh(wireframe, material)

    // scene.add(test12312); 

    //添加自动旋转渲染动画
    const render = (time: number) => {
      time = time * 0.001;
      meshArr.forEach((item) => {
        item.rotation.x = time;
        item.rotation.y = time;
      });
      lineArr.forEach((item) => {
        item.rotation.x = time;
        item.rotation.y = time;
      });
      // controls.update();
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

  return <canvas ref={canvasRef} className='full-screen' />;
};

export default HelloPrimitives;
