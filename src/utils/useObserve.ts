// import type { LegacyRef } from 'react'

import {
  useCallback, useRef, useState, useEffect
} from 'react'
// import useEffectAfterQueryReady from './useEffectAfterQueryReady'

type ObserverType = {
  options?: IntersectionObserverInit,
  callback?: (entries: IntersectionObserverEntry[]) => unknown,
}

const useIntersectionObserver = (props: ObserverType) => {
  const isObserveValidRef = useRef<boolean>(
    typeof window !== 'undefined' && 'IntersectionObserver' in window,
  )

  const [visiable, setVisiable] = useState<boolean>(false)
  const myNodeRef = useRef<HTMLElement | null>(null)

  const addObserveListener = useCallback(() => {
    let callback = () => {
      //
    }
    if (typeof window === 'undefined') {
      return callback
    }
    // 支持视界交叉
    if (props?.callback && isObserveValidRef && visiable && myNodeRef.current) {
      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 1,
        ...props,
      }
      const intersectionObserver = new IntersectionObserver(props.callback, options)
      intersectionObserver.observe(myNodeRef.current)
      callback = intersectionObserver.disconnect
    }
    return callback
  }, [props, visiable])

  useEffect(() => {
    const callback = addObserveListener()
    return callback
  }, [addObserveListener])

  const ref = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setVisiable(true)
      myNodeRef.current = node
    }
  }, [])
  return [myNodeRef.current, ref]
}

useIntersectionObserver.displayName = 'useIntersectionObserver'

export default useIntersectionObserver
