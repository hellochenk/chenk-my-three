import {
  useEffect, useRef,
} from 'react'
import type { FC } from 'react'

function random(min:number, max:number) {
  return Math.floor((Math.random() * (max - min) + min) * 100) / 100
}
class Bubble {
  x: number;
  y: number;
  // startHeight: number;
  vecterX: number;

  vecterY: number;

  offset: number;

  radius: number;

  width: number;

  height: number;

  color: string;

  speed: number;

  rate: number;

  // image: HTMLImageElement;

  constructor(w:number, h: number) {
    this.width = w
    this.height = h
    // 初始化中心点
    this.x = w / 2
    this.y = this.height + random(10, 500)

    this.rate = 1
    this.offset = random(50, 100)

    this.speed = random(0.1, 0.5)
    this.vecterX = random(-1, 1)
    this.vecterY = random(0.5, 1)
    this.color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    this.radius = random(12, 18)

    // const img = new Image()
    // const index = Math.floor(random(0, 12))
    // img.src = avatarList[index].src
    // this.image = img
  }

  move = () => {
    this.speed += (this.speed * 0.001)
    this.x += this.vecterX
    this.y -= (this.vecterY + this.speed)
    this.rate = (Math.floor((this.y / this.height) * 100) / 100)

    if (this.x - this.radius <= (this.width / 2 - this.offset)
      || this.x + this.radius >= (this.width / 2 + this.offset)) {
      // 改变方向
      this.vecterX = -this.vecterX
    }

    if (this.y - this.radius <= 0) {
      this.speed = random(0.1, 0.5)
      this.vecterX = random(-1, 1)
      this.vecterY = random(0.5, 1)
      this.color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
      this.radius = random(12, 18)
      // this.vecterX = -this.vecterX
      this.y = this.height + this.radius
    }
  }
}

const BubbleBTN: FC = () => {
  const myCTX = useRef<CanvasRenderingContext2D|null>(null)
  const animateRef = useRef<number|null>(null)
  const bubbleListRef = useRef<Bubble[]>([])
  const myCanvasRef = useRef<HTMLCanvasElement|null>(null)

  const createBubble = (num: number) => {
    const arr:Bubble[] = []
    //
    for (let x = 0; x < num; x++) {
      arr.push(new Bubble(
        myCanvasRef.current?.getBoundingClientRect().width || 100,
        myCanvasRef.current?.getBoundingClientRect().height || 100,
      ))
    }
    bubbleListRef.current = arr
  }

  const draw = (bubble:Bubble) => {
    if (myCTX.current) {
      myCTX.current.beginPath()
      //
      myCTX.current.fillStyle = bubble.color
      myCTX.current.globalAlpha = bubble.rate
      myCTX.current.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
      myCTX.current.fill()
      myCTX.current.closePath()

      // myCTX.current.beginPath()
      // myCTX.current.drawImage(
      //   bubble.image,
      //   bubble.x - bubble.radius,
      //   bubble.y - bubble.radius,
      //   bubble.radius * 2,
      //   bubble.radius * 2,
      // )
      // myCTX.current.closePath()
    }
  }

  const renderAnimate = () => {
    const canvas = myCanvasRef.current
    const parent = canvas?.parentElement?.getBoundingClientRect()
    myCTX.current?.clearRect(0, 0, parent?.width || 300, parent?.height || 300)
    bubbleListRef.current.forEach((item:Bubble) => {
      item.move()
      draw(item)
    })
    animateRef.current = requestAnimationFrame(renderAnimate)
  }

  const createCanvas = () => {
    if (myCanvasRef.current instanceof HTMLCanvasElement) {
      const canvas = myCanvasRef.current
      const ctx = canvas?.getContext?.('2d')
      myCTX.current = ctx
      const parent = canvas.parentElement?.getBoundingClientRect()
      canvas.width = parent?.width || 300
      canvas.height = parent?.height || 300
      createBubble(10)
      requestAnimationFrame(renderAnimate)
    }
  }

  useEffect(() => {
    if (myCanvasRef.current) {
      createCanvas()
    }
    return () => {
      if (animateRef.current) {
        cancelAnimationFrame(animateRef.current)
      }
    }
  //
  }, [myCanvasRef.current])

  return <div style={{
    width: 'inherit',
    height: 'inherit',
  }}><canvas ref={myCanvasRef}/></div>
}

export default BubbleBTN