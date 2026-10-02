'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { createWhiteFlight } from './flight-engine.js';
import styles from './WhiteFlight.module.css';

/** Copy this entire folder into your React project. No animation library needed. */
export default function WhiteFlight({
  radius = 140,
  distance = 140,
  ambientStrength = 1,
  speed = 1,
  background = '#ce479c',
  dotColor = '#fffff4',
  showGrid = true,
  showControls = true,
  showCaption = true,
  className = '',
  style,
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [localRadius, setRadius] = useState(radius);
  const [localDistance, setDistance] = useState(distance);
  const [paused, setPaused] = useState(false);
  const id = useId();

  useEffect(() => { setRadius(radius); }, [radius]);
  useEffect(() => { setDistance(distance); }, [distance]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    engineRef.current = createWhiteFlight(canvasRef.current, { paused: media.matches });
    setPaused(media.matches);
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setOptions({
      radius: localRadius,
      distance: localDistance,
      ambientStrength,
      speed,
      background,
      dotColor,
      showGrid,
      paused,
      showControls,
      showCaption,
    });
  }, [localRadius, localDistance, ambientStrength, speed, background, dotColor,
    showGrid, paused, showControls, showCaption]);

  return (
    <section className={`${styles.root} ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-label="흰 점들이 잔잔하게 움직이는 그림. 마우스나 손가락을 움직이면 가까운 점들이 더 크게 날아오릅니다."
      />
      {showCaption && <header className={styles.caption}>
        <img
          src="/logo.png"
          alt="브랜드 이름"
          className={styles.logo}
        />
        <p>We design for the <br />Outliers of Tomorrow</p>
      </header>}
      {showControls && <div className={styles.controls} aria-label="움직임 조절">
        <div className={styles.field}>
          <label htmlFor={`${id}-radius`}>이동 범위 <output>{localRadius}</output></label>
          <input id={`${id}-radius`} type="range" min="60" max="280" step="10"
            value={localRadius} onChange={e => setRadius(Number(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-distance`}>비행 거리 <output>{localDistance}</output></label>
          <input id={`${id}-distance`} type="range" min="20" max="180" step="10"
            value={localDistance} onChange={e => setDistance(Number(e.target.value))} />
        </div>
        <button type="button" aria-pressed={paused} onClick={() => setPaused(p => !p)}>
          {paused ? '움직임 재생' : '움직임 멈춤'}
        </button>
        <button type="button" onClick={() => engineRef.current?.reset()}>원래 자리로</button>
      </div>}
    </section>
  );
}
