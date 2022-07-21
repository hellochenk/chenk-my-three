import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as THREE from 'three';

// const styles = require('./index.css');
import './index.scss';

type Props = {};

const Index: FC<Props> = (props) => {
  const [isPageLoading, setPageLoading] = useState<boolean>(false);

  const myContainerRef = useRef<HTMLDivElement | null>(null);

  const mycanvasref = useRef<HTMLCanvasElement | null>(null);

  const renderComp = () => {
    if (mycanvasref.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      camera.position.set(50, 50, 150);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: mycanvasref.current,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      // document.body.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);

      const radius = 10;
      const width = 200,
        height = 100;
      const mygeometry = new THREE.BoxGeometry(width, height, 50, 100, 50, 10);

      const v1 = new THREE.Vector3();
      const w1 = (width - radius * 2) * 0.5,
        h1 = (height - radius * 2) * 0.5;
      const vTemp = new THREE.Vector3(),
        vSign = new THREE.Vector3(),
        vRad = new THREE.Vector3();
      // @ts-ignore
      mygeometry.vertices?.foreach((v: any) => {
        v1.set(w1, h1, v.z);
        vTemp.multiplyVectors(v1, vSign.set(Math.sign(v.x), Math.sign(v.y), 1));
        vRad.subVectors(v, vTemp);
        if (
          Math.abs(v.x) > v1.x &&
          Math.abs(v.y) > v1.y &&
          vRad.length() > radius
        ) {
          vRad.setLength(radius).add(vTemp);
          v.copy(vRad);
        }
      });

      const mesh = new THREE.Mesh(
        mygeometry,
        new THREE.MeshBasicMaterial({
          color: 'round',
          wireframe: false,
        })
      );
      scene.add(mesh);

      render();

      function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
    }
  };

  useEffect(() => {
    renderComp();
  }, []);

  return (
    <div ref={myContainerRef} className='container'>
      <canvas ref={mycanvasref}></canvas>
    </div>
  );
};

export default Index;
