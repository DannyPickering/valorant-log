import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function SquareLoader() {
  const cubeTop = useRef<HTMLDivElement>(null);
  const cubeBot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cubeTopRef = cubeTop.current;
    const cubeBotRef = cubeBot.current;

    // Set initial positions
    // gsap.set([cubeTop, cubeBot], { x: -50 });

    // Create the animation timeline
    const timeline = gsap.timeline({ repeat: -1 });

    timeline
      .to(cubeTopRef, { duration: 0.4, x: 8 })
      .to(cubeBotRef, { duration: 0.4, x: -8 }, "<")
      .to(cubeTopRef, { duration: 0.4, y: 8 })
      .to(cubeBotRef, { duration: 0.4, y: -8 }, "<")
      .to(cubeTopRef, { duration: 0.4, x: 0 })
      .to(cubeBotRef, { duration: 0.4, x: 0 }, "<")
      .to(cubeTopRef, { duration: 0.4, y: 0 })
      .to(cubeBotRef, { duration: 0.4, y: 0 }, "<");

    return () => {
      timeline.kill(); // Clean up the animation when the component unmounts
    };
  }, []);

  return (
    <div className="flex w-8 h-8">
      <div ref={cubeTop} className="square w-4 h-4 bg-slate-600"></div>
      <div ref={cubeBot} className="square w-4 h-4 bg-slate-800 self-end"></div>
    </div>
  );
}
