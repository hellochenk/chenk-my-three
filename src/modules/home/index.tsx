import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

// const styles = require('./index.css');

type Props = {};

const Index: FC<Props> = (props) => {
  const [isPageLoading, setPageLoading] = useState<boolean>(false);

  const fn = ({a} = {a: true}) => {
    console.log(a)
  }

  useEffect(() => {
    console.log('page loading!');
  }, []);

  return <div>this is home</div>;
};

export default Index
