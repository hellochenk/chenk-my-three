import * as THREE from 'three';

export const getGeometry = {
  getBox() {
    const width = 1;  // ui: width
    const height = 1;  // ui: height
    const depth = 1;  // ui: depth
    const geometry = new THREE.BoxGeometry(width, height, depth);

    return geometry
  },
  getBigBox() {
    const width = 4;  // ui: width
    const height = 4;  // ui: height
    const depth = 4;  // ui: depth
    const widthSegments = 4;  // ui: widthSegments
    const heightSegments = 4;  // ui: heightSegments
    const depthSegments = 4;  // ui: depthSegments
    const geometry = new THREE.BoxGeometry(
        width, height, depth,
        widthSegments, heightSegments, depthSegments);
    return geometry
  },
  getCircle() {
    const radius = 7;  // ui: radius
    const segments = 24;  // ui: segments
    const geometry = new THREE.CircleGeometry(radius, segments);
    return geometry
  },
  getRound() {
    const roundedRectShape = new THREE.Shape();

    ( function roundedRect( ctx, x, y, width, height, radius ) {

      ctx.moveTo( x, y + radius );
      ctx.lineTo( x, y + height - radius );
      ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
      ctx.lineTo( x + width - radius, y + height );
      ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
      ctx.lineTo( x + width, y + radius );
      ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
      ctx.lineTo( x + radius, y );
      ctx.quadraticCurveTo( x, y, x, y + radius );

    } )( roundedRectShape, 0, 0, 5, 5, 2 );

    let geometry = new THREE.ShapeGeometry( roundedRectShape );

    return geometry
  } 
}