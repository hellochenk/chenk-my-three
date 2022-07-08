import * as React from 'react';
import type { FC } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { pathENUM } from './def';

import styles from './App.module.scss';

// const HelloThreejs = React.lazy(() => import('@/components/hello-threejs'));

const App: FC = () => {
  const renderMenu = () => {
    let arr = []
    for (let k in pathENUM) {
      arr.push(<div className={styles.link} key={k}><Link to={k}>{k}</Link></div>)
    }
    return arr
  }

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        { renderMenu() }
      </div>
      <div className={styles.content}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            
          </Routes>
        </React.Suspense>
      </div>
    </div>
  );
};

export default App;
