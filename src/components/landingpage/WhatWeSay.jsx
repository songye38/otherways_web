import { useId, useRef, useState } from 'react';
import styles from './WhatWeSay.module.css';

/** onSubscribe(email) must resolve after the server accepts the subscription.
 * Return { pdfSent: true } ONLY when the server confirms PDF delivery.
 */
export default function WhatWeSay({ onSubscribe }) {
  const id = useId();
  const busy = useRef(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (busy.current || status === 'success') return;
    if (typeof onSubscribe !== 'function') {
      setStatus('error');
      setMessage('구독 신청 기능을 준비 중입니다. 조금 뒤에 다시 찾아주세요.');
      return;
    }
    busy.current = true;
    setStatus('loading');
    setMessage('');
    try {
      const result = await onSubscribe(email.trim());
      setStatus('success');
      setMessage(result?.pdfSent === true
        ? "반갑습니다, Outlier님! 입력하신 이메일로 ‘10-Min Toolkit 샘플 PDF’ 발송을 완료했습니다. 첫 번째 편지는 10월 목요일 아침에 찾아갑니다."
        : '반갑습니다, Outlier님! 사전 구독 신청이 완료되었습니다. 샘플 PDF 발송 안내는 이메일로 확인해 주세요.');
    } catch {
      setStatus('error');
      setMessage('신청을 완료하지 못했습니다. 잠시 뒤 다시 시도해 주세요.');
    } finally {
      busy.current = false;
    }
  }

  return (
    <section id="newsletter" className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <p className={styles.label}>WHAT WE SAY</p>
          <h2 id={`${id}-title`} className={styles.title}>Letters for<br className={styles.mobileBreak} /> Outliers</h2>
          <p className={styles.subtitle}>매주 10분, 정답 없는 세상에서<br className={styles.mobileBreak} /> 나만의 궤적을 만드는 질문들</p>
          <p className={styles.body}>
            트렌드라는 이름 뒤에 숨지 않고 본질에 다가서기 위한 스튜디오의 실험 기록.<br />
            정해진 공식을 거부하고 자기만의 답을 찾아가는 주도적 창작자를 위해,<br />
            OTHERWAYS의 최신 디자이너 리서치와 생각을 즉시 실행으로 비틀어내는<br />
            프레임워크 질문을 매주 목요일 아침 이메일로 전달합니다.
          </p>
        </header>

        <div className={styles.signup}>
          <aside className={styles.subscribe}>
            <div>
              
              <a href="https://makeways.stibee.com/subscribe" target="_blank" rel="noopener noreferrer">뉴스레터 구독하기 <span aria-hidden="true">↗</span></a>
            </div>
            </aside>
          {/* <a
            href="https://실제-뉴스레터-구독주소"
            className={styles.subscribeButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            뉴스레터 구독하기
            <span aria-hidden="true">↗</span>
            <span className={styles.visuallyHidden}>
              (새 탭에서 열림)
            </span>
          </a> */}
        </div>
      </div>
    </section>
  );
}
