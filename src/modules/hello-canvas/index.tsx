import type { FC } from 'react';
import { useRef } from 'react';

import useCreateScene from '@/src/hooks/useCreateScene/index'

import './index.scss';

const Index: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const renderRef = useCreateScene(canvasRef)




  return (<div className='full-screen'>
    <canvas ref={canvasRef} />
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
    }} onClick={() => {
      if(canvasRef.current && renderRef.current) {
        renderRef.current()
        // const imgurl = canvasRef.current.toDataURL('image/png')
        // const a = document.createElement('a')
        // a.href = imgurl
        // a.download = 'myimg.jpeg'
        // a.click()

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            // 将blob
            const imgurl = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = imgurl
            a.download = 'myimg.jpeg'
            a.click()
          }
        }, 'image/jpeg', 0.8)
      }
    }}>make png</div>
  </div>)
};

export default Index;
