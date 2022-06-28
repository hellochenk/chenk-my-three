import { useEffect, useState } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// @TODO 待完善
const useCreateScene = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [renderer, setRenderer] = useState<Three.WebGLRenderer|null>(null)
  const [scene, setScene] = useState<Three.Scene|null>(null)
  const [camera, setCamera] = useState<Three.PerspectiveCamera|null>(null)
  const [controls, setControls] = useState<OrbitControls|null>(null)
  const [light, setLight] = useState<Three.DirectionalLight|null>(null)

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    setRenderer(renderer)

    const scene = new Three.Scene();
    scene.background = new Three.Color(0x222222);
    setScene(scene)
  
    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.set(0, 5, 10);
    setCamera(camera)
    

    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 0);
    setLight(light)
    scene.add(light);

    const controls = new OrbitControls(camera, canvasRef.current);
    setControls(controls)
    controls.update();

    const colors = ['blue', 'red', 'green'];
    const cubes: Three.Mesh[] = [];
    colors.forEach((color, index) => {
      const mat = new Three.MeshPhongMaterial({ color });
      const geo = new Three.BoxBufferGeometry(2, 2, 2);
      const mesh = new Three.Mesh(geo, mat);
      mesh.position.x = (index - 1) * 4;
      scene.add(mesh);
      cubes.push(mesh);
    });

    const render = (time: number) => {
      time *= 0.001;
      cubes.forEach((cube) => {
        cube.rotation.x = cube.rotation.y = time;
      });
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

  return {
    renderer,
    scene,
    camera,
    controls,
    light,
  }
};

export default useCreateScene;
