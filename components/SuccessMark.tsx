"use client"

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Icons } from '@/components/Icons'

gsap.registerPlugin(DrawSVGPlugin)

const SuccessMark = () => {
  const checkmark = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = checkmark.current;
    const polylineElement = svg?.querySelector('polyline')

    if (polylineElement) {
      gsap.fromTo(polylineElement, { drawSVG: '100% 100%' }, { drawSVG: '100% 0%', duration: 0.4 });
    }
  }, []);

  return (
    <Icons.check ref={checkmark} />
  )
}

export default SuccessMark