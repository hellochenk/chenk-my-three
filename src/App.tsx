import './App.scss'
import { Routes, Route } from "react-router-dom";
import HelloThreejs from '@/components/hello-threejs';
import HelloThreejsPrime from '@/components/hello-primitives';
import Star from '@/components/star';
import Texture from '@/components/texture';
import Light from '@/components/light';
import Camera from '@/components/camera';
import FakeShadow from '@/components/hello-fake-shadow';
import HelloShadow from '@/components/hello-shadow';
import RoomShadow from '@/components/hello-shadow/hello-point-light-shadow';
import MyFog from '@/components/hello-fog';
import MyTest from '@/components/test';
import MyTarget from '@/components/hello-render-target';
import MyDemand from '@/components/rendering-on-demand';

const App = () => {
  return (
    <Routes>
      <Route path="about" element={<HelloThreejs />} />
      <Route path="star" element={<Star />} />
      <Route path="texture" element={<Texture />} />
      <Route path="light" element={<Light />} />
      <Route path="camera" element={<Camera />} />
      <Route path="fake" element={<FakeShadow />} />
      <Route path="shadow" element={<HelloShadow />} />
      <Route path="shadow2" element={<RoomShadow />} />
      <Route path="fog" element={<MyFog />} />
      <Route path="test" element={<MyTest />} />
      <Route path="target" element={<MyTarget />} />
      <Route path="demand" element={<MyDemand />} />
      <Route path="/" element={<HelloThreejsPrime />} />
    </Routes>
  )
}

export default App;