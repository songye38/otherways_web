import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const headerRef = useRef(null);
  const [onHero, setOnHero] = useState(false);

  useEffect(() => {
    let frame = null;

    function updateColor() {
      frame = null;

      const hero = document.getElementById('hero');
      const header = headerRef.current;

      if (!hero || !header) {
        setOnHero(false);
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const checkY = headerRect.top + headerRect.height / 2;

      setOnHero(
        heroRect.top <= checkY && heroRect.bottom > checkY
      );
    }

    function scheduleUpdate() {
      if (frame === null) {
        frame = requestAnimationFrame(updateColor);
      }
    }

    updateColor();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${
        onHero ? styles.light : styles.dark
      }`}
    >
      <a href="/" aria-label="OTHER WAYS 홈">
        <img
          src="/logo.png"
          alt="OTHER WAYS"
          className={styles.logo}
        />
      </a>

      <p className={styles.tagline}>
        We design for the
        <br />
        Outliers of Tomorrow
      </p>

      <nav className={styles.nav} aria-label="주요 메뉴">
        <a href="/toolkit">Toolkit</a>
        <a href="/project">Project</a>
        <a href="/newsletter">Newsletter</a>
      </nav>
    </header>
  );
}