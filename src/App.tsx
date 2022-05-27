import './App.scss'
import { Routes, Route } from "react-router-dom";
import HelloThreejs from '@/components/hello-threejs';
import HelloThreejsPrime from '@/components/hello-primitives';
import Star from '@/components/star';

const App = () => {
  return (
    <Routes>
      <Route path="about" element={<HelloThreejs />} />
      <Route path="star" element={<Star />} />
      <Route path="/" element={<HelloThreejsPrime />} />
    </Routes>
  )
}

export default App;