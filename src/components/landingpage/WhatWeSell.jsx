import React, { useId } from 'react';
import styles from './WhatWeSell.module.css';

const steps = [
  {
    number: '01.',
    title: '10-min Toolkit',
    description: '완벽주의에 갇힌 생각을 깨뜨리고, 질문·상상·실행의 프레임워크를 통해 하루 10분 만에 머릿속 가설을 눈앞의 실체로 전환하는 입문 툴킷입니다.',
    image: '/toolkit.jpg',
    imageAlt: '10-min Toolkit 제품 이미지',
  },
  {
    number: '02.',
    title: 'My Future Playbook',
    description: '파편화된 생각을 넘어 나만의 고유한 미래 관점과 구체적인 로드맵을 깊이 있게 설계하는 정교한 실행서입니다.',
    image: '/playbook.jpg',
    imageAlt: 'My Future Playbook 제품 이미지',
  },
  {
    number: '03.',
    title: 'Lab Products',
    description: '정답 없는 세상에서 나만의 궤적을 만드는 창작자를 위해, OTHER WAYS 스튜디오가 새로이 선보이는 연구 라인업입니다.',
    image: '/lab-products.jpg',
    imageAlt: 'Lab Products 제품 이미지',
  },
];
export default function WhatWeSell() {
  const titleId = useId();

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <header className={styles.heading}>
        <p className={styles.label}>WHAT WE SELL</p>
        <h2 id={titleId} className={styles.title}>
          <span>Toolkits for outliers</span>
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
