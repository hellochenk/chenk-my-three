import React, { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

import createScene, { MaterialType } from './scene';

import './index.scss';

enum LightType {
  AmbientLight = 'AmbientLight',
  AmbientLightProbe = 'AmbientLightProbe',
  DirectionalLight = 'DirectionalLight',
  HemisphereLight = 'HemisphereLight',
  HemisphereLightProbe = 'HemisphereLightProbe',
  PointLight = 'PointLight',
  RectAreaLight = 'RectAreaLight',
  SpotLight = 'SpotLight',
}

const buttonLables = [
  LightType.AmbientLight,
  LightType.AmbientLightProbe,
  LightType.DirectionalLight,
  LightType.HemisphereLight,
  LightType.HemisphereLightProbe,
  LightType.PointLight,
  LightType.RectAreaLight,
  LightType.SpotLight,
];

const Index: FC = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Three.Scene | null>(null);
  const [isOpenWireframe, setOpenWireframe] = useState<boolean>(false)
  const [type, setType] = useState<LightType>(LightType.AmbientLight);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });

    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = createScene({
      shouldWireframe: isOpenWireframe
    });
    sceneRef.current = scene;

    const render = () => {
      if (sceneRef.current) {
        renderer.render(sceneRef.current, camera);
        controls.update();
      }
      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas === null) {
        return;
      }
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, isOpenWireframe]);

  useEffect(() => {
    if (sceneRef.current === null) {
      return;
    }

    sceneRef.current = null;

    let newScene: Three.Scene;
    if (type === LightType.RectAreaLight) {
      // 只有在 RectAreaLight 才需要更换材质
      newScene = createScene({
        type: MaterialType.MESH_STANDARD_MATERIAL,
        shouldWireframe: isOpenWireframe
      });
    } else {
      // 否侧全部使用phong反光材质
      newScene = createScene({
        shouldWireframe: isOpenWireframe
      });
    }
    sceneRef.current = newScene;

    switch (type) {
      case LightType.AmbientLight: {
        const ambientLight = new Three.AmbientLight(0xffffff, 1);
        newScene.add(ambientLight);
        break;
      }
      case LightType.AmbientLightProbe: {
        const ambientLightProbe = new Three.AmbientLightProbe(0xffffff, 1);
        newScene.add(ambientLightProbe);
        break;
      }
      case LightType.DirectionalLight: {
        const directionalLight = new Three.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 10, 0);
        directionalLight.target.position.set(-5, 0, 0);
        newScene.add(directionalLight);
        newScene.add(directionalLight.target);

        const directionalLightHelper = new Three.DirectionalLightHelper(
          directionalLight
        );
        newScene.add(directionalLightHelper);
        break;
      }
      case LightType.HemisphereLight: {
        const hemisphereLight = new Three.HemisphereLight(
          0xb1e1ff,
          0xb97a20,
          1
        );
        newScene.add(hemisphereLight);

        const hemisphereLightHelper = new Three.HemisphereLightHelper(
          hemisphereLight,
          5
        );
        newScene.add(hemisphereLightHelper);

        break;
      }
      case LightType.HemisphereLightProbe: {
        const hemisphereLightProbe = new Three.HemisphereLightProbe(
          0xb1e1ff,
          0xb97a20,
          1
        );
        newScene.add(hemisphereLightProbe);
        break;
      }
      case LightType.PointLight: {
        const pointLight = new Three.PointLight(0xffffff, 1);
        pointLight.position.set(0, 10, 0);
        newScene.add(pointLight);

        const pointLightHelper = new Three.PointLightHelper(pointLight);
        newScene.add(pointLightHelper);
        break;
      }
      case LightType.RectAreaLight: {
        //RectAreaLightUniformsLib.init() //实际测试时发现即使不添加这行代码，场景似乎也依然正常渲染，没有看出差异

        const rectAreaLight = new Three.RectAreaLight(0xffffff, 5, 12, 4);
        rectAreaLight.position.set(0, 10, 0);
        rectAreaLight.rotation.x = Three.MathUtils.degToRad(-90);
        newScene.add(rectAreaLight);

        const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
        newScene.add(rectAreaLightHelper);
        break;
      }
      case LightType.SpotLight: {
        const spotLight = new Three.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 10, 0);
        spotLight.target.position.set(-5, 0, 0);
        newScene.add(spotLight);
        newScene.add(spotLight.target);

        const spotLightHelper = new Three.SpotLightHelper(spotLight);
        newScene.add(spotLightHelper);
        break;
      }
      default:
        console.log('???');
        break;
    }
  }, [isOpenWireframe, type]);

  useEffect(() => {
    console.log('page loading!');
  }, []);

  return (
    <div className='full-screen'>
      <div className="checkbox">
        <input  type="checkbox" onChange={(ev) => {
          setOpenWireframe(ev.target.checked)
        }} />
        <label htmlFor="">open wireframe</label>
      </div>
      <div className='buttons'>
        {buttonLables.map((label, index) => {
          return (
            <button
              className={label === type ? 'button-selected' : ''}
              onClick={() => {
                setType(label);
              }}
              key={`button${index}`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Index;
