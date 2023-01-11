import * as React from 'react';
import type { FC } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { pathENUM } from './def';

import styles from './App.module.scss';

const HelloThreejs = React.lazy(() => import('@/src/modules/hello-threejs'));
const HelloThreejsPrime = React.lazy(
  () => import('@/src/modules/hello-primitives')
);
const Star = React.lazy(() => import('@/src/modules/star'));
const Texture = React.lazy(() => import('@/src/modules/texture'));
const Light = React.lazy(() => import('@/src/modules/light'));
const Camera = React.lazy(() => import('@/src/modules/camera'));
const FakeShadow = React.lazy(() => import('@/src/modules/hello-fake-shadow'));
const HelloShadow = React.lazy(() => import('@/src/modules/hello-shadow'));
const RoomShadow = React.lazy(
  () => import('@/src/modules/hello-shadow/hello-point-light-shadow')
);
const MyFog = React.lazy(() => import('@/src/modules/hello-fog'));
const MyTest = React.lazy(() => import('@/src/modules/test'));
const MyTarget = React.lazy(() => import('@/src/modules/hello-render-target'));
const MyDemand = React.lazy(() => import('@/src/modules/rendering-on-demand'));
const MyHelloCanvas = React.lazy(
  () => import('@/src/modules/hello-canvas/index')
);
const Preserve = React.lazy(
  () => import('@/src/modules/Preserve-Drawing-Buffer/index')
);
const MyBubble = React.lazy(() => import('@/src/modules/bubble/index'));
const HelloEarth = React.lazy(() => import('@/src/modules/hello-earth/index'));

const HelloOffScene = React.lazy(
  () => import('@/src/modules/hello-offscreen-canvas/index')
);

const PlayRX = React.lazy(
  () => import('@/src/modules/playrx')
);


const App: FC = () => {
  const renderMenu = () => {
    let arr = [];
    for (let k in pathENUM) {
      arr.push(
        <div className={styles.link} key={k}>
          <Link to={k}>{k}</Link>
        </div>
      );
    }
    return arr;
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>{renderMenu()}</div>
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
            <Route path={pathENUM.playRX} element={<PlayRX />} />

            <Route path='/' element={<HelloThreejsPrime />} />
          </Routes>
        </React.Suspense>
      </div>
    </div>
  );
};

export default App;
