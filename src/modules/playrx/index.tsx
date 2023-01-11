import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { range, filter, map, fromEvent, scan, throttleTime } from 'rxjs';

type Props = {};

const fn = (element:HTMLDivElement) => {
  // range(1, 200)
  //   .pipe(
  //     filter((x) => x % 2 === 1),
  //     map((x) => x )
  //   )
  //   .subscribe((x) => console.log(x));

  fromEvent(element, 'click')
    .pipe(
      throttleTime(1000),
      map(() => (new Date().getTime())),
      scan((count, ...arg) => {
        console.log(...arg)
        return count + 1
      }, 0)
    )
    .subscribe((count) => console.log(`Clicked ${count} times`));
}

// type functionsList = ((...args: any) => unknown)[]
// const myarr: functionsList = []


// myarr.reduce((prev, curr) => (...args: any) => curr(prev(...args)))



const Index: FC<Props> = (props) => {
  const [isPageLoading, setPageLoading] = useState<boolean>(false);

  const myRef = useRef<HTMLDivElement|null>(null)

  useEffect(() => {
    // console.log('page loading!');
    if(myRef.current) {
      fn(myRef.current)
    }
  }, []);

  return <div ref={myRef}>paly rx</div>;
};

export default Index;
