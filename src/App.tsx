import './App.scss'
import { Routes, Route } from "react-router-dom";
import HelloThreejs from '@/components/hello-threejs';
import HelloThreejsPrime from '@/components/hello-primitives';
import Star from '@/components/star';
import Texture from '@/components/texture';
import Light from '@/components/light';
import Camera from '@/components/camera';
import FakeShadow from '@/components/hello-fake-shadow';

const App = () => {
  return (
    <Routes>
      <Route path="about" element={<HelloThreejs />} />
      <Route path="star" element={<Star />} />
      <Route path="texture" element={<Texture />} />
      <Route path="light" element={<Light />} />
      <Route path="camera" element={<Camera />} />
      <Route path="fake" element={<FakeShadow />} />
      <Route path="/" element={<HelloThreejsPrime />} />
    </Routes>
  )
}

export default App;