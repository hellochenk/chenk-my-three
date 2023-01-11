import * as Three from 'three';

// 创建场景
const scene = new Three.Scene();
// 场景背景色 青蓝色
scene.background = new Three.Color(0x00ffff);

// 设置相机
const camera = new Three.PerspectiveCamera(45, 1, 0.1, 20);
camera.position.z = 15;
camera.lookAt(0, 0, 0)

// 设置灯光
const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
// 场景添加相机
scene.add(light);

const colors = ['blue', 'red', 'green'];
const boxs: Three.Mesh[] = [];

// 生成3个反光材质材质，转换mesh并添加到场景中
colors.forEach((color, index) => {
  const mat = new Three.MeshPhongMaterial({ color });
  const geo = new Three.BoxBufferGeometry(2, 2, 2);
  const mesh = new Three.Mesh(geo, mat);
  mesh.position.x = (index - 1) * 3;
  scene.add(mesh);
  boxs.push(mesh);
});

const targets = {
  scene,
  boxs,
  camera,
};

export default targets;
