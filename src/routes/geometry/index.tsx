import { useRef, useEffect } from 'react';
import type { FC } from 'react';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

import { getGeometry } from './components/geometry';

// const styles = require('./index.css');
import './index.scss';

type Props = {};

const Index: FC<Props> = (props) => {
  const myContainerRef = useRef<HTMLDivElement | null>(null);

  const mycanvasref = useRef<HTMLCanvasElement | null>(null);
  // const myRef = useRef({
  //   width: window.document.body.clientWidth,
  //   height: window.document.body.clientHeight
  // })

  const getContainerRect = () => {
    if (myContainerRef.current) {
      const rect = myContainerRef.current.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
      };
    }
    return {
      width: 2,
      height: 1,
    };
  };

  const draw = () => {
    if (mycanvasref.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas: mycanvasref.current,
      });
      const rect = getContainerRect();
      renderer.setSize(rect.width, rect.height);

      const fov = 75;
      const aspect = rect.width / rect.height; // 相机默认值
      const near = 0.1;
      const far = 100;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 10;

      const scene = new THREE.Scene();
      const control = new OrbitControls(camera, mycanvasref.current);
      // scene.add(control)

      function makeInstance(
        geometry: THREE.BufferGeometry,
        color: THREE.ColorRepresentation,
        x: number
      ) {
        const material = new THREE.MeshPhongMaterial({ 
          color,
          wireframe: false,
          side: THREE.DoubleSide,
        });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
      }

      const box = getGeometry.getRound();

      const cubes = [
        makeInstance(box, 0x44aa88, 0),
        makeInstance(box, 0x8844aa, -10),
        makeInstance(box, 0xaa8844, 10),
      ];

      {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
      }

      {

        const color = 0xffffff;
        const intensity = 0.6;
        const light = new THREE.AmbientLight(color, intensity);
        // light.position.set(-1, 2, 4);
        scene.add(light);
      }

      // renderer.render(scene, camera);

      function render(time: number) {
        time *= 0.001; // 将时间单位变为秒

        cubes.forEach((cube, ndx) => {
          const speed = 1 + ndx * 0.1;
          const rot = time * speed;
          cube.rotation.x = rot;
          cube.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    }
  };

  useEffect(() => {
    draw();
  }, [mycanvasref]);

  return (
    <div ref={myContainerRef} className='container'>
      <canvas ref={mycanvasref}></canvas>
    </div>
  );
};

export default Index;
