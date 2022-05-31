import {
  DirectionalLight,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshToonMaterial,
  Object3D,
  PointLight,
  SphereBufferGeometry,
  TextureLoader,
} from 'three';
import sun from '@/assets/images/sun.jpeg'
import earth from '@/assets/images/earth.jpeg'
import moon from '@/assets/images/moon.jpeg'

//创建一个球体
const segment = 32
const sphere = new SphereBufferGeometry(1, segment, segment); //球体为6边形，目的是为了方便我们观察到他在自转

const Test = new MeshToonMaterial({
  color: 0xffffff,
  // flatShading: true
})

const loader = new TextureLoader()
const sunMaterial = new MeshBasicMaterial({
  map:loader.load(sun)
})

const earthMaterial = new MeshBasicMaterial({
  map:loader.load(earth)
})

const moonMaterial = new MeshBasicMaterial({
  map:loader.load(moon)
})


Test.color.set(0xff0000)
Test.emissive.set(0x666666)
//创建太阳
const sunMesh = new Mesh(sphere, sunMaterial);
sunMesh.scale.set(4, 4, 4); //将球体尺寸放大 4 倍

//创建地球
const earthMesh = new Mesh(sphere, earthMaterial);

//创建月球
const moonMesh = new Mesh(sphere, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5); //将球体尺寸缩小 0.5 倍

//创建一个 3D 空间，用来容纳月球，相当于月球轨迹空间
export const moonOribit = new Object3D();
moonOribit.position.x = 5;
moonOribit.add(moonMesh);

//创建一个 3D 空间，用来容纳地球，相当于地球轨迹空间
export const earthOrbit = new Object3D();
earthOrbit.position.x = 15;
earthOrbit.add(earthMesh);
earthOrbit.add(moonOribit);

//创建一个 3D 空间，用来容纳太阳和地球(含月球)
export const solarSystem = new Object3D();
solarSystem.add(sunMesh);
solarSystem.add(earthOrbit);

//创建点光源
export const pointLight = new PointLight(0xffffff, 3);

//添加灯光
export const light = new DirectionalLight(0xffffff, 0.4);
light.position.set(0, 0, 0);

export default {};
