import React, { useId } from 'react';
import styles from './WhatWeDo.module.css';

const steps = [
  {
    number: '01.',
    title: 'Question',
    description: '남들이 정해놓은 문제와 상투적인 트렌드 단어를 비틀어, 프로젝트의 판도를 바꾸는 본질적인 질문을 발굴합니다.',
  },
  {
    number: '02.',
    title: 'Imagine',
    description: '기존의 뻔한 공식에서 벗어나 시공간을 넘나드는 관점 전환을 시도하고, 나만의 차별화된 논리와 이정표를 설계합니다.',
  },
  {
    number: '03.',
    title: 'Make',
    description: '완벽주의에 갇히지 않고 10분 만에 손을 움직입니다. 거친 스케치와 프로토타입으로 머릿속 가설을 눈앞의 실체로 전환합니다.',
  },
];

export default function WhatWeDo() {
  const titleId = useId();

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <header className={styles.heading}>
        <p className={styles.label}>WHAT WE DO</p>
        <h2 id={titleId} className={styles.title}>
          <span>정답 없는 세상에서 나만의 길을 만드는</span>{' '}
          <span>3단계 선순환 프레임워크를 연구하고 실행합니다.</span>
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
          </li>
        ))}
      </ol>
    </section>
  );
}
