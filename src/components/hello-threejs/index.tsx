import React, { useRef, useEffect } from 'react';
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  Mesh,
  DirectionalLight,
  MeshPhongMaterial,
} from 'three';

import './index.scss';

const HelloThreejs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      //创建渲染器
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });

      //创建镜头
      //PerspectiveCamera() 中的 4 个参数分别为：
      //1、fov(field of view 的缩写)，可选参数，默认值为 50，指垂直方向上的角度，注意该值是度数而不是弧度
      //2、aspect，可选参数，默认值为 1，画布的宽高比(宽/高)，例如画布宽300像素，高150像素，那么意味着宽高比为 2
      //3、near，可选参数，默认值为 0.1，近平面，限制摄像机可绘制最近的距离，若小于该距离则不会绘制(相当于被裁切掉)
      //4、far，可选参数，默认值为 2000，远平面，限制摄像机可绘制最远的距离，若超出该距离则不会绘制(相当于被裁切掉)
      //以上 4 个参数在一起，构成了一个 “视椎”，关于视椎的概念理解，暂时先不作详细描述。
      const camera = new PerspectiveCamera(75, 16 / 9, 1, 1000);
      camera.position.z = 500
      //创建场景
      const scene = new Scene();

      //创建几何体
      const geometry = new BoxGeometry(1, 1, 1);

      //创建材质
      //我们需要让立方体能够反射光，所以不使用MeshBasicMaterial，而是改用MeshPhongMaterial
      //const material = new MeshBasicMaterial({ color: 0x44aa88 })
      // const material = new MeshPhongMaterial({ color: 0x44aa88 });
      const material1 = new MeshPhongMaterial({ color: 0x44aa88 });
      const material2 = new MeshPhongMaterial({ color: 0xc50d0d });
      const material3 = new MeshPhongMaterial({ color: 0x39b20a });

      //创建网格
      const cube1 = new Mesh(geometry, material1);
      cube1.position.x = -2;

      const cube2 = new Mesh(geometry, material2);
      cube2.position.x = 0;

      const cube3 = new Mesh(geometry, material3);
      cube3.position.x = 2;
      const cubes = [cube1, cube2, cube3];
      scene.add(cube1); //将网格添加到场景中
      scene.add(cube2); //将网格添加到场景中
      scene.add(cube3); //将网格添加到场景中

      //创建光源
      const light = new DirectionalLight(0xffffff, 1);
      light.position.set(-1, 2, 4);
      scene.add(light); //将光源添加到场景中，若场景中没有任何光源，则可反光材质的物体渲染出的结果是一片漆黑，什么也看不见

      //设置透视镜头的Z轴距离，以便我们以某个距离来观察几何体
      //之前初始化透视镜头时，设置的近平面为 0.1，远平面为 5
      //因此 camera.position.z 的值一定要在 0.1 - 5 的范围内，超出这个范围则画面不会被渲染
      camera.position.z = 2;

      //渲染器根据场景、透视镜头来渲染画面，并将该画面内容填充到 DOM 的 canvas 元素中
      //renderer.render(scene, camera)//由于后面我们添加了自动渲染渲染动画，所以此处的渲染可以注释掉

      //添加自动旋转渲染动画
      const render = (time: number) => {
        time = time * 0.001; //原本 time 为毫秒，我们这里对 time 进行转化，修改成 秒，以便于我们动画旋转角度的递增

        // const canvas = renderer.domElement; //获取 canvase
        // camera.aspect = canvas.clientWidth / canvas.clientHeight; //设置镜头宽高比
        // camera.updateProjectionMatrix(); //通知镜头更新视椎(视野)
        // renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

        cubes.forEach((cube) => {
          cube.rotation.x = time;
          cube.rotation.y = time;
        });
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      const handleResize = () => {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()

        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
      }
      handleResize()
      document.body.addEventListener('resize', handleResize)

      return () => document.body.removeEventListener('resize', handleResize)

    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} className='full-screen' />;
};

export default HelloThreejs;
