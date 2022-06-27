import { useRef, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import * as Three from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';

import sun from '@/assets/images/sun.jpeg';
import duck1 from '@/assets/images/duck_1.jpeg';
import duck2 from '@/assets/images/duck_2.jpeg';
import duck3 from '@/assets/images/duck_3.jpeg';
import duck4 from '@/assets/images/duck_4.jpeg';
import duck5 from '@/assets/images/duck_5.jpeg';

import './index.scss';

const HelloTexture: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const rendererRef = useRef<Three.WebGLRenderer | null>(null);
  // const cameraRef = useRef<Three.PerspectiveCamera | null>(null);
  // const sceneRef = useRef<Three.Scene | null>(null);

  const images = useMemo(() => [sun, duck1, duck2, duck3, duck4, duck5], []);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const scene = new Three.Scene();
    const renderer = new Three.WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });

    const directiona = new Three.DirectionalLight()
    directiona.position.set(0, 500, 0)
    scene.add(directiona)
    //根据平行光实例，创建对应的辅助对象，并将辅助对象添加到场景中
    const directionalLightHelper = new Three.DirectionalLightHelper(directiona)
    scene.add(directionalLightHelper)

    const camera = new Three.PerspectiveCamera(40, 2, 200, 2000);
    camera.position.set(0, 0, 500);

    scene.background = new Three.Color(0xcccccc);
    const controls = new ArcballControls(camera, renderer.domElement);

    controls.update()

    //创建所有纹理加载的管理器
    const loadingManager = new Three.LoadingManager()
    //创建一个 纹理加载器
    const myloaders = new Three.TextureLoader(loadingManager)

    //添加加载管理器的各种事件处理函数
    loadingManager.onLoad = () => {
      console.log('纹理图片资源加载完成')
    }
    loadingManager.onProgress = (url, loaded, total) => {
      console.log(`图片加载中, 共 ${total} 张，当前已加载 ${loaded} 张 ${url}`)
    }
    loadingManager.onError = (url) => {
      console.log(`加载失败 ${url}`)
    }

    //创建一个 纹理加载器
    // const loader = new Three.TextureLoader();
    //创建一个材质，材质的 map 属性值为 纹理加载器加载的图片资源
    const materialArr:Three.MeshBasicMaterial[] = images.map((item) => {
      const texture = myloaders.load(item); //loader.load('xxx.jpg')返回值为Three.Text类型实例
      // texture.magFilter = Three.NearestFilter // ：最接近模式
      // texture.wrapS= Three.RepeatWrapping
      // texture.wrapT= Three.RepeatWrapping
      const material = new Three.MeshBasicMaterial({
        map: texture,
        opacity: 0.1,
        // wireframe: true
      });
      return material;
    });
    const mySunTexture = myloaders.load(sun);
    mySunTexture.wrapS = Three.RepeatWrapping
    mySunTexture.wrapT = Three.RepeatWrapping
    mySunTexture.offset.set(.2, .2)

    const sunmaterial = new Three.MeshBasicMaterial({
      map: mySunTexture,
      opacity: 0.1,
      // wireframe: true
    });

    const length = 100

    const box = new Three.BoxBufferGeometry(length, length, length);
    const boxMesh = new Three.Mesh(box, materialArr);
    scene.add(boxMesh);

    const Dodecahedron = new Three.DodecahedronGeometry(100, 4)
    const DodecahedronMesh = new Three.Mesh(Dodecahedron, sunmaterial);
    DodecahedronMesh.position.x = 200
    // DodecahedronMesh.position = 200
    scene.add(DodecahedronMesh);

    const render = (time: number) => {
      time = time * 0.001;

      boxMesh.rotation.x = time;
      boxMesh.rotation.y = time;
      DodecahedronMesh.rotation.z = time


      renderer.render(scene, camera);

      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

    const resizeHandle = () => {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    resizeHandle();
    window.addEventListener('resize', resizeHandle);

    return () => {
      window.removeEventListener('resize', resizeHandle);
    };
  }, [canvasRef, images]);

  return <canvas ref={canvasRef} className='full-screen' />;
};

export default HelloTexture;
