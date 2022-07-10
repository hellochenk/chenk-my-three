import { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';

const getPostionFromIndex = (index: number) => {
  // 大致算出 N * N
  const Mathroot = 10;
  const offset = -5;

  const x = Math.floor(index / Mathroot) + offset;
  const y = (index % Mathroot) + offset;

  return [x * 2, y * 2];
};

export function Instances({ count = 100, temp = new THREE.Object3D() }) {
  const myRef = useRef<THREE.InstancedMesh | null>(null);
  const [select, setSelect] = useState<number|null>(null)


  useEffect(() => {
    if (myRef.current) {
      // Set positions
      for (let i = 0; i < count; i++) {
        const [x, y] = getPostionFromIndex(i);
        temp.position.set(x, y, 0);
        temp.updateMatrix();

        myRef.current.setMatrixAt(i, temp.matrix);
      }
      // Update the instance
      myRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <instancedMesh 
      onPointerEnter={(e) => {
        console.log('e.distance', e.instanceId)
        setSelect(e.instanceId || null)
      }}
      onPointerOut={(e) => {
        setSelect(null)
      }}
      ref={myRef}
      args={[undefined, undefined, count]}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshPhongMaterial color={0xe1e1e1} />
    </instancedMesh>
  );
}
