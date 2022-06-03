import type { FC } from 'react';
import { useRef, useEffect } from 'react';
import * as Three from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';

import './index.scss';

interface SphereShadowBase {
  base: Three.Object3D;
  sphereMesh: Three.Mesh;
  shadowMesh: Three.Mesh;
  y: number;
}
/**
 * 开启自然投影
 * renderer开启shadowMap
 * 灯光开启投影
 * 平面接受投影
 * 材质也要开启产生/接受投影
 */
const HelloShadow: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    // 渲染器
    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    // 渲染器开启阴影
    renderer.shadowMap.enabled = true;
    // 是否开启物理上的正确光照
    renderer.physicallyCorrectLights = true;

    const scene = new Three.Scene();
    scene.background = new Three.Color(0x333333);

    const camera = new Three.PerspectiveCamera(45, 2, 5, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    const helperCamera = new Three.PerspectiveCamera(45, 2, 5, 100)
    helperCamera.position.set(20, 10, 20)
    helperCamera.lookAt(0, 5, 0)
    scene.add(helperCamera)

    const cameraHelper = new Three.CameraHelper(helperCamera)
    scene.add(cameraHelper)

    const controls = new OrbitControls(camera, canvasRef.current)
    controls.target.set(0, 5, 0)
    controls.update()

    // 半球灯 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
    // const hemisphereLight = new Three.HemisphereLight(0xffffff, 0x666666, 2);
    // scene.add(hemisphereLight);

    // 平行灯
    const directionalLight = new Three.DirectionalLight(0xffffff, 1);
    // 开启投影
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-4, 0, -4);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    const directionalLightHelper = new Three.DirectionalLightHelper(
      directionalLight
    );
    scene.add(directionalLightHelper);

    const shadowCamera = directionalLight.shadow.camera;
    shadowCamera.left = -10;
    shadowCamera.right = 10;
    shadowCamera.top = 10;
    shadowCamera.bottom = -10;
    shadowCamera.updateProjectionMatrix();

    const shadowHelper = new Three.CameraHelper(shadowCamera);
    scene.add(shadowHelper);

    // 设置地块材质
    const planeSize = 40;
    const loader = new Three.TextureLoader();
    const texture = loader.load(require('@/assets/images/checker.png'));
    texture.wrapS = Three.RepeatWrapping;
    texture.wrapT = Three.RepeatWrapping;
    texture.magFilter = Three.NearestFilter;
    texture.repeat.set(planeSize / 2, planeSize / 2);

    const planeMaterial = new Three.MeshPhongMaterial({
      map: texture,
      side: Three.DoubleSide,
    });
    // planeMaterial.color.setRGB(0.5, 0.5, 0.5); //在纹理图片颜色的RGB基础上，分别乘以 1.5，这样可以不修改纹理图片的前提下让纹理图片更加偏白一些
    // 地块

    const planeGeo = new Three.PlaneBufferGeometry(planeSize, planeSize);
    const planeMesh = new Three.Mesh(planeGeo, planeMaterial);
    planeMesh.receiveShadow = true;
    planeMesh.rotation.x = Math.PI * -0.5;
    scene.add(planeMesh);

    const commonMaterial = new Three.MeshPhongMaterial({
      color: 0x88AACC
    })

    // 球体
    const sphereRadius = 1;
    const sphereGeo = new Three.SphereBufferGeometry(sphereRadius, 12, 12); // segments

    const sphereMesh = new Three.Mesh(sphereGeo, commonMaterial);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    sphereMesh.position.set(-4, 5, 0)
    scene.add(sphereMesh);

    const axesHelper = new Three.AxesHelper(15);
    scene.add(axesHelper);

    // box
    const myBoxwidth = 2;
    const myBoxGeo = new Three.BoxBufferGeometry(
      myBoxwidth,
      myBoxwidth,
      myBoxwidth
    );
    const boxMesh = new Three.Mesh(myBoxGeo, commonMaterial);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxMesh.position.set(5, 3, 0)
    scene.add(boxMesh);

    const render = (time: number) => {
      time *= 0.001;

      directionalLightHelper.update();
      shadowHelper.update();
      cameraHelper.update();

      renderer.render(scene, camera);
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

export default HelloShadow;
