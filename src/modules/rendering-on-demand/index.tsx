import { useEffect, useRef } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';

import './index.scss';

let boo = false;
const RenderingOnDemand = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const myStampRef = useRef<number>(new Date().getTime());

  const handleKeydown = (eve: KeyboardEvent) => {
    console.log(eve);
  };

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    canvasRef.current.focus();
    canvasRef.current.addEventListener('keydown', handleKeydown, false);

    myStampRef.current = new Date().getTime();
    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(45, 2, 1, 100);
    camera.position.z = 20;
    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 10);
    scene.add(light);

    const axesHelper = new Three.AxesHelper(15);
    scene.add(axesHelper);

    const colors = ['blue', 'red', 'green'];
    const cubes: Three.Mesh[] = [];

    colors.forEach((color, index) => {
      const material = new Three.MeshPhongMaterial({ color });
      const geometry = new Three.BoxBufferGeometry(4, 4, 4);
      const mesh = new Three.Mesh(geometry, material);
      mesh.position.x = (index - 1) * 6;
      scene.add(mesh);
      cubes.push(mesh);
    });

    const render = () => {
      boo = false;
      controls.update();
      renderer.render(scene, camera);
      // cubes.forEach((mesh) => {
      //   const now = new Date().getTime()
      //   const diff = now - myStampRef.current
      //   mesh.rotation.x += diff * 0.01
      //   mesh.rotation.y += diff * 0.01
      //   mesh.rotation.z += diff * 0.01
      //   myStampRef.current = now
      // })
    };
    window.requestAnimationFrame(render);

    const handleChange = () => {
      if (boo === false) {
        boo = true;
        window.requestAnimationFrame(render);
      }
    };

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.addEventListener('change', handleChange);
    controls.enableDamping = true;
    controls.update();

    const handleResize = () => {
      if (canvasRef.current === null) {
        return;
      }
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      window.requestAnimationFrame(render);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        style={{ display: 'block', width: '100%', height: '100%' }}
        className='full-screen'
      />
    </>
  );
};

export default RenderingOnDemand;
