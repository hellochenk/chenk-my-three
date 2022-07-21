import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

import './index.scss';

type Props = {};

const Index: FC<Props> = (props) => {
  const [isPageLoading, setPageLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('page loading!');
  }, []);

  return <div>new home</div>;
};

export default Index;
