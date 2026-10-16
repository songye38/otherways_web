import { useEffect, useId, useRef, useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const headerRef = useRef(null);
  const [onHero, setOnHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navId = useId();


  //색상감지용
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

  // 메뉴 닫기용
  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${onHero ? styles.light : styles.dark
        } ${menuOpen ? styles.menuOpen : ''}`}
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

      <button
        ref={menuButtonRef}
        type="button"
        className={styles.menuButton}
        aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={menuOpen}
        aria-controls={navId}
        onClick={() => setMenuOpen(open => !open)}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        id={navId}
        className={styles.nav}
        aria-label="주요 메뉴"
      >
        <a href="/toolkit" onClick={() => setMenuOpen(false)}>
          Product
        </a>
        <a href="/project" onClick={() => setMenuOpen(false)}>
          Project
        </a>
        <a href="/newsletter" onClick={() => setMenuOpen(false)}>
          Newsletter
        </a>
        <a href="/archive" onClick={() => setMenuOpen(false)}>
          Archive
        </a>
      </nav>
    </header>
  );
}