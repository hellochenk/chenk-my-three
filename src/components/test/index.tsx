import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { FC } from 'react';

// const styles = require('./index.css');

type Props = {};
type CountdownPropsType = {
  stampTimer: number;
};
// todo 跟随系统跳秒
const useCountdown = (props?: CountdownPropsType) => {
  const [stamp, setStamp] = useState<number>(0);
  const ONE_SECEND = useRef<number>(1000);

  // 依赖 index次数计时器将其改为每1s执行的自纠正倒计时
  const indexRef = useRef<number>(0);

  // 初始化props。stamp时和update时才需要设置这个prev
  const prevTotalStampRef = useRef<number | null>(0);
  // 变化中的stamp
  const totalStampRef = useRef<number | null>(0);

  // 调度真正开始执行时间
  const startCountdownStampRef = useRef<number | null>(null);

  // prefix 跟随系统跳秒
  const prefixRef = useRef<number>(1000);

  const beforeStarterAndInitValue = (timer: number) => {
    totalStampRef.current = timer;
    startCountdownStampRef.current = new Date().getTime();
  };

  const counting = useCallback(() => {
    if (startCountdownStampRef.current && totalStampRef.current) {
      const fixPrefix = ONE_SECEND.current - prefixRef.current
      indexRef.current += 1;
      const now = new Date().getTime();
      // 当前距离开始的间隔
      const durations = now - startCountdownStampRef.current;
      // 理论上递归后的执行间隔
      const wishDurations = indexRef.current * ONE_SECEND.current - fixPrefix;

      const diffdurations = durations - wishDurations;
      // @TODO 添加纠偏后的prefix
      if (
        diffdurations > ONE_SECEND.current ||
        diffdurations < -ONE_SECEND.current
      ) {
        console.log('fix')
        indexRef.current = durations / ONE_SECEND.current;
      }

      const diff = now - (startCountdownStampRef.current + indexRef.current * ONE_SECEND.current - fixPrefix);
      const nextTask = ONE_SECEND.current - diff;
      const newStamp = totalStampRef.current - durations;

      setStamp(() => newStamp);
      if (newStamp > 0) {
        setTimeout(() => {
          counting();
        }, nextTask);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPropsStampAndStartTask = useCallback((timer?: number) => {
    if (timer) {
      beforeStarterAndInitValue(timer);
      setStamp(timer || 0);
      prefixRef.current = ONE_SECEND.current - (new Date().getTime() % 1000);
      setTimeout(counting, prefixRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStamp = (timer: number) => {
    if (typeof timer !== 'number') {
      throw new Error('need post number');
    }
    prevTotalStampRef.current = timer;
    checkPropsStampAndStartTask(timer);
  };

  useEffect(() => {
    if (!prevTotalStampRef.current && props && props.stampTimer > 0) {
      prevTotalStampRef.current = props.stampTimer;
      checkPropsStampAndStartTask(props.stampTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkPropsStampAndStartTask]);

  return {
    stamp,
    updateStamp,
  };
};

const formatDuring = (stamp: number) => {
  if (stamp <= 0) {
    return '00:00:00';
  }
  // var days = parseInt(stamp / (1000 * 60 * 60 * 24));
  const hour = parseInt(
    `${(stamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)}`,
    10
  );
  const minute = parseInt(`${(stamp % (1000 * 60 * 60)) / (1000 * 60)}`, 10);
  const second = Math.floor((stamp % (1000 * 60)) / 1000);

  return `${hour < 10 ? `0${hour}` : hour}:${
    minute < 10 ? `0${minute}` : minute
  }:${second < 10 ? `0${second}` : second}`;
};

const min10 = 5 * 60000;
const Index: FC<Props> = (props) => {
  const countDown = useCountdown({
    stampTimer: min10
  });

  // useEffect(() => {
  //   countDown.updateStamp(min10);
  //   console.log('page loading!');
  // }, []);

  return <div>new components {formatDuring(countDown.stamp)}</div>;
};

export default Index;
