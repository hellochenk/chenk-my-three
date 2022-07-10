import * as React from 'react';
import type { FC } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { pathENUM } from './def';

import styles from './App.module.scss';

const Home = React.lazy(() => import('@/src/modules/home/index'));
const R3f = React.lazy(() => import('@/src/modules/r3f/index'));

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
            <Route path={pathENUM.home} element={<Home />}/>
            <Route path={pathENUM.r3f} element={<R3f />}/>

            <Route path={'home'} element={<Home />}/>
            <Route path={'/'} element={<Home />}/>
          </Routes>
        </React.Suspense>
      </div>
    </div>
  );
};

export default App;
