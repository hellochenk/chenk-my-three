import * as React from 'react';
import type { FC } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { pathENUM } from './def';

import styles from './App.module.scss';

const HelloThreejs = React.lazy(() => import('@/components/hello-threejs'));
const HelloThreejsPrime = React.lazy(
  () => import('@/components/hello-primitives')
);
const Star = React.lazy(() => import('@/components/star'));
const Texture = React.lazy(() => import('@/components/texture'));
const Light = React.lazy(() => import('@/components/light'));
const Camera = React.lazy(() => import('@/components/camera'));
const FakeShadow = React.lazy(() => import('@/components/hello-fake-shadow'));
const HelloShadow = React.lazy(() => import('@/components/hello-shadow'));
const RoomShadow = React.lazy(
  () => import('@/components/hello-shadow/hello-point-light-shadow')
);
const MyFog = React.lazy(() => import('@/components/hello-fog'));
const MyTest = React.lazy(() => import('@/components/test'));
const MyTarget = React.lazy(() => import('@/components/hello-render-target'));
const MyDemand = React.lazy(() => import('@/components/rendering-on-demand'));
const MyHelloCanvas = React.lazy(() => import('@/components/hello-canvas/index'));
const Preserve = React.lazy(() => import('@/components/Preserve-Drawing-Buffer/index'));
const MyBubble = React.lazy(() => import('@/components/bubble/index'));
const HelloEarth = React.lazy(() => import('@/components/hello-earth/index'));

const HelloOffScene = React.lazy(() => import('@/components/hello-offscreen-canvas/index'));



const App: FC = () => {
  const renderMenu = () => {
    let arr = []
    for (let k in pathENUM) {
      arr.push(<div className={styles.link} key={k}><Link to={k}>{k}</Link></div>)
    }
    return arr
  }

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        { renderMenu() }
      </div>
      <div className={styles.content}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={pathENUM.about} element={<HelloThreejs />} />
            <Route path={pathENUM.star} element={<Star />} />
            <Route path={pathENUM.texture} element={<Texture />} />
            <Route path={pathENUM.light} element={<Light />} />
            <Route path={pathENUM.camera} element={<Camera />} />
            <Route path={pathENUM.fake} element={<FakeShadow />} />
            <Route path={pathENUM.shadow} element={<HelloShadow />} />
            <Route path={pathENUM.shadow2} element={<RoomShadow />} />
            <Route path={pathENUM.fog} element={<MyFog />} />
            <Route path={pathENUM.test} element={<MyTest />} />
            <Route path={pathENUM.target} element={<MyTarget />} />
            <Route path={pathENUM.demand} element={<MyDemand />} />
            <Route path={pathENUM.HelloCanvas} element={<MyHelloCanvas />} />
            <Route path={pathENUM.Preserve} element={<Preserve />} />
            <Route path={pathENUM.bubble} element={<MyBubble />} />
            <Route path={pathENUM.earth} element={<HelloEarth />} />
            <Route path={pathENUM.offscene} element={<HelloOffScene />} />

            <Route path='/' element={<HelloThreejsPrime />} />
          </Routes>
        </React.Suspense>
      </div>
    </div>
  );
};

export default App;
