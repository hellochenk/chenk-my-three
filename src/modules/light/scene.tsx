import * as Three from 'three';
import images from '@/assets/images/checker.png'
export enum MaterialType {
  MESH_PHONE_MATERIAL = 'MESH_PHONE_MATERIAL',
  MESH_STANDARD_MATERIAL = 'MESH_STANDARD_MATERIAL',
}

const createScene: (props: {
  type?: keyof typeof MaterialType;
  shouldWireframe?: boolean;
}) => Three.Scene = ({
  type = MaterialType.MESH_PHONE_MATERIAL,
  shouldWireframe = false,
}) => {
  const scene = new Three.Scene();

  const planeSize = 40;

  //创建所有纹理加载的管理器
  const loadingManager = new Three.LoadingManager()
  //创建一个 纹理加载器
  const loader = new Three.TextureLoader(loadingManager);
  const texture = loader.load(images);
  //添加加载管理器的各种事件处理函数
  loadingManager.onLoad = () => {
    console.log('纹理图片资源加载完成')
  }
  texture.wrapS = Three.RepeatWrapping;
  texture.wrapT = Three.RepeatWrapping;
  texture.magFilter = Three.NearestFilter;
  texture.repeat.set(planeSize / 4, planeSize / 4);

  let planeMat: Three.Material;
  let cubeMat: Three.Material;
  let sphereMat: Three.Material;

  // RectAreaLight 只作用在 MeshStandardMaterial 和 MeshPhysicalMaterial 材料物体上
  // 其他的都是phong反光材质
  switch (type) {
    case MaterialType.MESH_STANDARD_MATERIAL:
      planeMat = new Three.MeshStandardMaterial({
        map: texture,
        side: Three.DoubleSide,
      });
      cubeMat = new Three.MeshStandardMaterial({
        color: '#8AC',
        wireframe: shouldWireframe,
      });
      sphereMat = new Three.MeshStandardMaterial({
        color: '#CA8',
        wireframe: shouldWireframe,
      });
      break;
    default:
      planeMat = new Three.MeshPhongMaterial({
        map: texture,
        side: Three.DoubleSide,
      });
      cubeMat = new Three.MeshPhongMaterial({
        color: '#8AC',
        wireframe: shouldWireframe,
      });
      sphereMat = new Three.MeshPhongMaterial({
        color: '#8AC',
        wireframe: shouldWireframe,
      });
  }

  const planeGeo = new Three.PlaneBufferGeometry(planeSize, planeSize);
  const mesh = new Three.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -0.5;
  scene.add(mesh);

  const cubeGeo = new Three.BoxBufferGeometry(4, 4, 4);
  const cubeMesh = new Three.Mesh(cubeGeo, cubeMat);
  cubeMesh.position.set(5, 2.5, 0);
  scene.add(cubeMesh);

  const sphereGeo = new Three.SphereBufferGeometry(3, 32, 16);
  const sphereMesh = new Three.Mesh(sphereGeo, sphereMat);
  sphereMesh.position.set(-4, 5, 0);
  scene.add(sphereMesh);

  return scene;
};

export default createScene;
