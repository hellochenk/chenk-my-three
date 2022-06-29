declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
// declaration.d.ts
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
declare module 'react-app-rewire-alias';