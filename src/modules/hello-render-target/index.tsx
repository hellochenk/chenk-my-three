import { useEffect, useRef } from 'react';
import type { FC } from 'react';

import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as RTScene from './render-target-scene';

import './index.scss';

// 若我们现在改变需求，我们希望修改成：

// 场景中有一面镜子
// 在镜子中显示出 3 个不同颜色、不同旋转的立方体
// 场景本身当中，是看不见这 3 个立方体的

const HelloRenderTarget: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    // 子场景
    const rtScene = RTScene.default.scene;
    // 子场景的 box 数组
    const rtBoxs = RTScene.default.boxs;
    // 子场景相机
    const rtCamera = RTScene.default.camera;

    // 创建渲染器
    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });

    // 创建 WebGLRenderTarget 离屏渲染
    const rendererTarget = new Three.WebGLRenderTarget(512, 512);

    // 创建主场景
    const scene = new Three.Scene();
    scene.background = new Three.Color(0x333333);

    // 主场景灯光
    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    light.target.position.set(-2, 2, 2);
    scene.add(light);
    scene.add(light.target);

    // 相机
    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.z = 15;

    // 相机控制器
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.update();

    // 材质 使用rendererTarget材质
    const material = new Three.MeshPhongMaterial({
      map: rendererTarget.texture,
    });

    // 主场景-方块几何
    const cubeGeo = new Three.BoxBufferGeometry(4, 4, 4);
    // 方块mesh
    const cubeMesh = new Three.Mesh(cubeGeo, material);
    cubeMesh.position.x = 4;
    scene.add(cubeMesh);

    // 主场景-圆几何
    const circleGeo = new Three.CircleBufferGeometry(2.8, 36);
    const circleMesh = new Three.Mesh(circleGeo, material);
    circleMesh.position.x = -4;
    scene.add(circleMesh);

    const render = (time: number) => {
      time *= 0.001;

      // 主渲染器设置target
      renderer.setRenderTarget(rendererTarget);
      // 主渲染器渲染子场景，子相机
      renderer.render(rtScene, rtCamera);
      // 设置null ？
      renderer.setRenderTarget(null);
      
      // 主渲染器渲染主场景
      renderer.render(scene, camera);

      // 直接修改 box 的 postions
      rtBoxs.forEach((item) => {
        item.rotation.set(time, time, 0);
      });
      cubeMesh.rotation.set(time, time, 0);

      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

    const handleResize = () => {
      if (canvasRef.current === null) {
        return;
      }
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className='full-screen' />;
};

export default HelloRenderTarget;
