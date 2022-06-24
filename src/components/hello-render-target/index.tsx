import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

const styles = require('./index.css');

type Props = {};

export const Index: FC<Props> = (props) => {
  const [isPageLoading, setPageLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('page loading!');
  }, []);

  return <div>new components</div>;
};
