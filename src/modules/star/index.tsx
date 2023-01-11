import { useRef, useEffect } from 'react';
import type { FC } from 'react';
import * as Three from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';

import {
  solarSystem,
  earthOrbit,
  moonOribit,
  pointLight,
} from '@/src/modules/star/mesh';

import './index.scss';
import { AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const nodeArr = [solarSystem, earthOrbit, moonOribit]; //太阳、地球、月亮对应的网格

const HelloScene: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Three.WebGLRenderer | null>(null);

  const mainCameraRef = useRef<Three.PerspectiveCamera | null>(null);
  const helperCameraRef = useRef<Three.PerspectiveCamera | null>(null);

  const sceneRef = useRef<Three.Scene | null>(null);

  const mainScaleRef = useRef<HTMLDivElement>(null);
  const helpScaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current && mainScaleRef.current && helpScaleRef.current) {
      //创建场景
      const scene = new Three.Scene();
      scene.background = new Three.Color(0x666666);
      sceneRef.current = scene;

      //创建渲染器
      const renderer = new Three.WebGLRenderer({
        canvas: canvasRef.current as HTMLCanvasElement,
      });
      renderer.physicallyCorrectLights = true;
      renderer.setScissorTest(true);
      rendererRef.current = renderer;

      const width = document.body.clientWidth;
      const height = document.body.clientHeight;

      //创建主镜头
      const mainCamera = new Three.PerspectiveCamera(50, width / height, 5, 150);
      mainCamera.position.set(20, 20, 100);
      mainCamera.lookAt(0, 0, 0);
      mainCameraRef.current = mainCamera;

      //创建辅助镜头
      const helperCamera = new Three.PerspectiveCamera(60, width / height, 5, 1000);
      helperCamera.position.set(25, 25, 150);
      helperCamera.lookAt(0, 0, 0);
      helperCameraRef.current = helperCamera;
      // 主镜头辅助
      const helper = new Three.CameraHelper(mainCamera);
      scene.add(helper);

      const light = new Three.AmbientLight(0xeeeeee);
      scene.add(light);

      const axesHelper = new AxesHelper(30);
      scene.add(axesHelper);

      const mainControls = new ArcballControls(
        mainCamera,
        mainScaleRef.current,
        scene,
      );
      
      mainControls.addEventListener('change', function () {
        renderer.render(scene, mainCamera);
      });
      mainControls.update();

      const scaleControls = new OrbitControls(
        helperCamera,
        helpScaleRef.current,
      );
      scaleControls.addEventListener('change', function () {
        renderer.render(scene, helperCamera);
      });
      scaleControls.update();

      //将太阳系、灯光添加到场景中
      scene.add(solarSystem);
      scene.add(pointLight);
      scene.add(light);

      nodeArr.forEach((item) => {
        const axes = new Three.AxesHelper(5);
        const material = axes.material as Three.Material;
        material.depthTest = false;
        axes.renderOrder = 1; // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
        item.add(axes);
      });

      const setScaleAspect = (div: HTMLDivElement) => {
        // 渲染节点
        if (canvasRef.current === null) {
          return;
        }

        //获得 canvas 和 div 的矩形框尺寸和位置
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const divRect = div.getBoundingClientRect();
        const right =
          Math.min(divRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, divRect.left - canvasRect.left);
        const bottom =
          Math.min(divRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, divRect.top - canvasRect.top);
        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);
        //将剪刀设置为仅渲染到画布的该部分
        const positiveYUpBottom = canvasRect.height - bottom;

        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        return width / height;
      };

      //创建循环渲染的动画
      const render = (time: number) => {
        if (
          !mainScaleRef.current ||
          !canvasRef.current ||
          !helpScaleRef.current ||
          !sceneRef.current
        ) {
          return null;
        }

        const sceneBackground = sceneRef.current.background as Three.Color;

        time = time * 0.002;
        nodeArr.forEach((item) => {
          item.rotation.y = time;
        });
        const mainAspect = setScaleAspect(mainScaleRef.current);
        
        mainCamera.aspect = mainAspect as number;
        mainCamera.updateProjectionMatrix();
        mainControls.update()
        helper.update();
        helper.visible = false;
        sceneBackground.set(0x666666);
        // 先渲染主场景
        renderer.render(scene, mainCamera);
        ///////////////////////

        const helpAspect = setScaleAspect(helpScaleRef.current);
        helperCamera.aspect = helpAspect as number;
        helperCamera.updateProjectionMatrix();
        scaleControls.update()
        sceneBackground.set(0x999999);
        helper.visible = true;
        renderer.render(sceneRef.current, helperCamera);

        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      //添加窗口尺寸变化的监听
      const resizeHandle = () => {
        const canvas = renderer.domElement;
        mainCamera.aspect = canvas.clientWidth / canvas.clientHeight;
        mainCamera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      };
      resizeHandle();
      window.addEventListener('resize', resizeHandle);

      return () => {
        window.removeEventListener('resize', resizeHandle);
      };
    }
  }, [canvasRef]);

  return (
    <div className='container'>
      <canvas ref={canvasRef} className='draw' />
      <div ref={mainScaleRef} className='mainScene'></div>
      <div ref={helpScaleRef} className='helperScene'></div>
    </div>
  );
};

export default HelloScene;
