import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three'
import { Instances } from './instance';

// const styles = require('./index.css');
import './index.scss';
import {
  MapControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei';

type Props = {
  test?: JSX.IntrinsicElements;
};

const Box = () => {
  const myRef = useRef<THREE.Mesh<
    THREE.BufferGeometry,
    THREE.Material | THREE.Material[]
  > | null>(null);

  const [active, setState] = useState<boolean>(false)

  const { scale } = useSpring({ scale: active ? 1.5 : 1 })

  useFrame((state, delta, xrFrame) => {
    const timer = state.clock.getElapsedTime();
    // console.log(a) // the value will be 0 at scene initialization and grow each frame
    if (myRef.current) {
      myRef.current.rotation.x = timer;
      myRef.current.rotation.y = timer;
    }
  });

  return (
    <animated.mesh scale={scale} ref={myRef} position={[-1, -1, 0]} 
      onPointerOut={(e) => {
        e.stopPropagation()
        setState(false)
      }}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setState(true)
      }}>
      <boxGeometry />
      <meshPhongMaterial color={0x666666} />
    </animated.mesh>
  );
};

const Index: FC<Props> = (props) => {
  const [isPageLoading, setPageLoading] = useState<boolean>(false);
  const [rotate, setRotate] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    console.log('page loading!');
  }, []);

  return (
    <div className={'container'}>
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0, 3],
          lookAt: () => new THREE.Vector3(0, 0, 0),
        }}
      >
        <ambientLight intensity={0.1} />
        <directionalLight color='#ffffff' position={[0, 0, 5]} />

        <Box />
        <mesh position={[1, 1, 0]}>
          <boxGeometry />
          <meshPhongMaterial color={0x666666} />
        </mesh>
        <mesh position={[-1, 1, 0]}>
          <boxGeometry />
          <meshPhongMaterial color={0x666666} />
        </mesh>
        <mesh position={[1, -1, 0]}>
          <boxGeometry />
          <meshPhongMaterial color={0x666666} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Index;
