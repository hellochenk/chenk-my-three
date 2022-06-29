import { useCallback, useEffect, useRef } from 'react';
import type { FC } from 'react';

import * as Three from 'three';

import mesh from '@/assets/images/mesh.png';

import './index.scss';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type Props = {};

// const min10 = 5 * 60000;
const Index: FC<Props> = (props) => {
  const myRef = useRef<HTMLCanvasElement | null>(null);

  const device = {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };

  const renderCanvas = useCallback(() => {
    console.log('render...');

    if (myRef.current instanceof HTMLCanvasElement) {
      const scene = new Three.Scene();
      scene.background = new Three.Color(0xe1e1e1);

      const renderer = new Three.WebGLRenderer({
        canvas: myRef.current,
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(device.width, device.height);

      const planeSize = 40;
      const PlaneShape = new Three.PlaneGeometry(planeSize, planeSize);

      const manager = new Three.LoadingManager();
      manager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log(
          'Started loading file: ' +
            url +
            '.\nLoaded ' +
            itemsLoaded +
            ' of ' +
            itemsTotal +
            ' files.'
        );
      };

      manager.onLoad = function () {
        console.log('Loading complete!');
      };

      manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log(
          'Loading file: ' +
            url +
            '.\nLoaded ' +
            itemsLoaded +
            ' of ' +
            itemsTotal +
            ' files.'
        );
      };

      manager.onError = function (url) {
        console.log('There was an error loading ' + url);
      };
      const loader = new Three.TextureLoader(manager);
      const texture = loader.load(mesh);
      texture.wrapS = Three.RepeatWrapping;
      texture.wrapT = Three.RepeatWrapping;
      texture.repeat.set(planeSize / 2, planeSize / 2);
      texture.magFilter = Three.NearestFilter;
      const material = new Three.MeshPhongMaterial({
        map: texture,
        side: Three.DoubleSide,
      });
      const plane = new Three.Mesh(PlaneShape, material);
      plane.receiveShadow = true;
      plane.rotation.x = Math.PI * -0.5;
      plane.position.x = -0.5;
      scene.add(plane);

      const camera = new Three.PerspectiveCamera(
        75,
        device.width / device.height,
        0.1,
        500
      );
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
      scene.add(camera);

      const axesHelper = new Three.AxesHelper(15);
      scene.add(axesHelper);

      const light = new Three.AmbientLight(0x404040); // soft white light
      scene.add(light);

      const light2 = new Three.SpotLight(0xffffff, 1);
      light2.castShadow = true;
      light2.position.set(10, 10, 10);
      light2.target.position.set(-4, 0, -4);
      scene.add(light2);
      scene.add(light2.target);

      const lightHelper = new Three.SpotLightHelper(light2)
      scene.add(lightHelper);

      const shadowCamera = light2.shadow.camera;
      // shadowCamera.left = -10;
      // shadowCamera.right = 10;
      // shadowCamera.top = 10;
      // shadowCamera.bottom = -10;
      shadowCamera.updateProjectionMatrix();
      const shadowHelper = new Three.CameraHelper(shadowCamera);
      scene.add(shadowHelper);


      const controls = new OrbitControls(camera, renderer.domElement);
      controls.update();
      // mesh
      const boxShape = new Three.BoxGeometry(3, 3, 3);
      // const boxMateril = new Three.MeshBasicMaterial({ color: 0x00ff00 });
      // const boxMateril = new Three.MeshPhongMaterial({
      //   color: 0x999999,
      // });
      const material1 = new Three.MeshPhongMaterial({ color: 0x44aa88 });
      const material2 = new Three.MeshPhongMaterial({ color: 0xc50d0d });
      const material3 = new Three.MeshPhongMaterial({ color: 0x39b20a });

      const meshArr: Three.Mesh[] = [material1, material2, material3].map(
        (material, index) => {
          const mesh = new Three.Mesh(boxShape, material);
          mesh.receiveShadow = true
          mesh.castShadow = true
          mesh.position.x = index * 5;
          mesh.position.y = 3;
          scene.add(mesh);
          return mesh;
        }
      );

      const renderBox = (timer: number) => {
        timer *= 0.01;

        meshArr.forEach((boxMesh) => {
          boxMesh.rotation.set(timer * 0.1, timer * 0.1, timer * 0.1);
        });
        renderer.render(scene, camera);
        controls.update();

        requestAnimationFrame(renderBox);
      };
      requestAnimationFrame(renderBox);
    }
  }, [device.height, device.width]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className='test'>
      <canvas ref={myRef} id='canvas' />
    </div>
  );
};

export default Index;
