import React, { useId } from 'react';
import styles from './WhatWeMake.module.css';

const steps = [
  {
    image: '/project_1.png',
    imageAlt: '10-min Toolkit 제품 이미지',
  },
  {
    image: '/project_2.png',
    imageAlt: 'My Future Playbook 제품 이미지',
  },
  {
    image: '/project_3.png',
    imageAlt: 'Lab Products 제품 이미지',
  },
];
export default function WhatWeMake() {
  const titleId = useId();

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <header className={styles.heading}>
        <p className={styles.label}>WHAT WE MAKE</p>
        <h2 id={titleId} className={styles.title}>
          <span>연구 / 프로젝트 / 워크숍</span>
        </h2>
      </header>

      <ol className={styles.steps}>
        {steps.map(step => (
          <li key={step.title} className={styles.step}>
            <h3 className={styles.stepTitle}>
              <span className={styles.number} aria-hidden="true">{step.number}</span>
              {step.title}
            </h3>
            <p className={styles.description}>{step.description}</p>
            <img
              src={step.image}
              alt={step.imageAlt}
              className={styles.productImage}
              loading="lazy"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
