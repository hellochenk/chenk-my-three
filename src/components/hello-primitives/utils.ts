import * as Three from 'three'

//定义物体在画面中显示的网格布局
const eachRow = 5 //每一行显示 5 个
const spread = 30 //行高 和 列宽

export const createMaterial = () => {
  const material = new Three.MeshPhongMaterial({ side: Three.DoubleSide })

  const hue = Math.floor(Math.random() * 100) / 100 //随机获得一个色相
  const saturation = 1 //饱和度
  const luminance = 0.5 //亮度

  material.color.setHSL(hue, saturation, luminance)

  return material
}

export const getPositionByIndex = (index: number) => {
  //我们设定的排列是每行显示 eachRow，即 5 个物体、行高 和 列宽 均为 spread 即 15
  //因此每个物体根据顺序，计算出自己所在的位置
  const row = Math.floor(index / eachRow) //计算出所在行
  const column = index % eachRow //计算出所在列

  const x = (column - 2) * spread //为什么要 -2 ？
  //因为我们希望将每一行物体摆放的单元格，依次是：-2、-1、0、1、2，这样可以使每一整行物体处于居中显示
  const y = (2 - row) * spread

  return { x, y }
}

