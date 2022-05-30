import './App.scss'
import { Routes, Route } from "react-router-dom";
import HelloThreejs from '@/components/hello-threejs';
import HelloThreejsPrime from '@/components/hello-primitives';
import Star from '@/components/star';
import Texture from '@/components/texture';
import Light from '@/components/light';

const App = () => {
  return (
    <Routes>
      <Route path="about" element={<HelloThreejs />} />
      <Route path="star" element={<Star />} />
      <Route path="texture" element={<Texture />} />
      <Route path="light" element={<Light />} />
      <Route path="/" element={<HelloThreejsPrime />} />
    </Routes>
  )
}

export default App;