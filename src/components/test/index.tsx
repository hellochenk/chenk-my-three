import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { FC } from 'react';

// const styles = require('./index.css');

type Props = {};

// todo 跟随系统跳秒
type TimerType = {
  stamp: number | null;
};
const useCounter2 = (props?: TimerType) => {
  const [stamp, setStamp] = useState<number>(0)
  const ONE_SECEND = useRef<number>(1000)
  
  // 依赖 index次数计时器将其改为每1s执行的自纠正倒计时
  const indexRef = useRef<number>(0)

  // 考虑到update会改变倒计时总数总，不再依赖props
  const totalStampRef = useRef<number|null>(props?.stamp || 0)

  // 调度真正开始执行时间
  const firstTimerStampRef = useRef<number|null>(null)

  // 意义不明
  // const lastTimeStampRef = useRef<number|null>(null)
  // 意义不明
  // const myStampRef = useRef<number>(0)
  // 定时器队列 
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimerRef = useCallback(() => {
    indexRef.current = 0
    const newDateStamp = new Date().getTime()
    firstTimerStampRef.current = newDateStamp
    // lastTimeStampRef.current = newDateStamp
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      // timerRef.current.forEach((item) => clearTimeout(item))
      // timerRef.current = []
    }
  }, [])

  const counting = useCallback(() => {
    if (firstTimerStampRef.current && totalStampRef.current) {
        indexRef.current += 1
        const now = new Date().getTime()
        // 计时器执行时长
        const durations = now - firstTimerStampRef.current
        // if(durations)
        // 当 durations / 1000 与 indexRef.current 之间误差过大
        // 说明产生偏差，浏览器卡住/sleep等等，我们要进行纠偏
        console.log(`${durations / 1000}, ${indexRef.current}`)
        const diffdurations = durations / 1000 - indexRef.current
        console.log(`diffdurations ${diffdurations}`)
        if (diffdurations > 1) {
          console.log(`误差超过1s${diffdurations}，${timerRef.current}`)
          indexRef.current = Math.floor(diffdurations)
        } 

        const diff = now - (firstTimerStampRef.current + indexRef.current * ONE_SECEND.current)
        const nextTask = ONE_SECEND.current - diff

        // myStampRef.current -= durations

        const count = totalStampRef.current - durations

        setStamp(count)
    
        if (count <= 0) {
          clearTimerRef()
        } else {
          const recursiveTimer = setTimeout(() => {
            counting()
          }, ONE_SECEND.current)
          // timerRef.current.push(recursiveTimer)
        }
    }
  }, [clearTimerRef])

  const checkPropsStampAndStartTask = useCallback(
    (timer?: number) => {
      if (props?.stamp || timer) {
        clearTimerRef()
        // myStampRef.current = props?.stamp || timer || 0
        setStamp(props?.stamp || timer || 0)
        timerRef.current = setTimeout(counting, ONE_SECEND.current)
      }
    },
    [clearTimerRef, counting, props?.stamp],
  )

  const updateStamp = (timer: number) => {
    if (typeof timer !== 'number') {
      throw new Error('need post number')
    }
    clearTimerRef()
    totalStampRef.current = timer
    checkPropsStampAndStartTask(timer)
  }

  useEffect(() => {
    checkPropsStampAndStartTask()
  }, [checkPropsStampAndStartTask])

  return {
    stamp,
    updateStamp,
  }
}

const formatDuring = (stamp: number) => {
  if (stamp <= 0) {
    return '00:00:00'
  }
  // var days = parseInt(stamp / (1000 * 60 * 60 * 24));
  const hour = parseInt(
    `${(stamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)}`,
    10,
  )
  const minute = parseInt(`${(stamp % (1000 * 60 * 60)) / (1000 * 60)}`, 10)
  const second = Math.floor((stamp % (1000 * 60)) / 1000)

  return `${hour < 10 ? `0${hour}` : hour}:${
    minute < 10 ? `0${minute}` : minute
  }:${second < 10 ? `0${second}` : second}`
}

const min5 = 5 * 60000
const Index: FC<Props> = (props) => {
  // const [isPageLoading, setPageLoading] = useState<boolean>(false);
  const countDown = useCounter2({
    stamp: min5
  })
  useEffect(() => {
    console.log('page loading!');
  }, []);

  return <div>new components {formatDuring(countDown.stamp)}</div>;
};

export default Index
