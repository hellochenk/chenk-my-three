import React, { useRef, useEffect } from 'react';
import * as Three from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';

import './index.scss';

const HelloThreejs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      //创建渲染器
      const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });

      const scene = new Three.Scene();
      scene.background = new Three.Color(0xadd8e6);
      scene.fog = new Three.Fog(0xadd8e6, .5, 6); //向场景中添加 雾

      //创建镜头
      const camera = new Three.PerspectiveCamera(75, 2, 0.1, 5);
      camera.position.z = 2;
      //创建场景

      const axesHelper = new Three.AxesHelper(10);
      scene.add(axesHelper);

      const controls = new ArcballControls(camera, canvasRef.current, scene);
      // controls.
      controls.addEventListener('change', function () {
        renderer.render(scene, camera);
      });
      controls.update();
      // scene.add(controls)

      const light = new Three.DirectionalLight(0xffffff, 1);
      light.position.set(-1, 2, 4);
      scene.add(light);

      const colors = ['blue', 'red', 'green'];
      const boxs: Three.Mesh[] = [];

      colors.forEach((color, index) => {
        const mat = new Three.MeshPhongMaterial({ color });
        const geo = new Three.BoxBufferGeometry(1, 1, 1);
        const mesh = new Three.Mesh(geo, mat);
        mesh.position.set((index - 1) * 2, 0, 0);
        scene.add(mesh);
        boxs.push(mesh);
      });

      // boxs.length > 0 && (boxs[1].material as Three.Material).fog = false

      //添加自动旋转渲染动画
      const render = (time: number) => {
        time = time * 0.001; //原本 time 为毫秒，我们这里对 time 进行转化，修改成 秒，以便于我们动画旋转角度的递增
        boxs.forEach((cube) => {
          cube.rotation.x = time;
          cube.rotation.y = time;
          cube.rotation.z = time;
        });
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      const handleResize = () => {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      };
      handleResize();
      document.body.addEventListener('resize', handleResize);

      return () => document.body.removeEventListener('resize', handleResize);
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} className='full-screen' />;
};

export default HelloThreejs;
