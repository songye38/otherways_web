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
          <aside className={styles.benefit} aria-labelledby={`${id}-benefit`}>
            <p id={`${id}-benefit`} className={styles.benefitLabel}><span aria-hidden="true">↗</span> PRE-ORDER BENEFIT</p>
            <p className={styles.benefitCopy}>
              지금 10월 사전 구독을 완료하시는 모든 분께<br />
              생각을 즉시 실체화하는 <strong>‘10-Min Toolkit 샘플 PDF’</strong>를<br />
              이메일로 즉시 발송해 드립니다.
            </p>
            <ul className={styles.includes}>
              <li>Vol.01~03 핵심 프레임워크 시트 포함</li>
              <li>완벽주의를 깨는 10분 액션 가이드 포함</li>
            </ul>
          </aside>

          <form onSubmit={submit} className={styles.form} aria-busy={status === 'loading'}>
            <label htmlFor={`${id}-email`} className={styles.visuallyHidden}>구독할 이메일 주소</label>
            <div className={styles.inputRow}>
              <input id={`${id}-email`} type="email" name="email" autoComplete="email" required
                placeholder="name@example.com" value={email}
                aria-describedby={`${id}-note ${id}-message`}
                disabled={status === 'loading' || status === 'success'}
                onChange={event => { setEmail(event.target.value); if (status === 'error') { setStatus('idle'); setMessage(''); } }} />
              <button type="submit" disabled={status === 'loading' || status === 'success'}>
                {status === 'loading' ? '신청 중…' : status === 'success' ? '구독 신청 완료 ✓' : '사전 구독 신청하기'}
                {status !== 'success' && <span aria-hidden="true">↗</span>}
              </button>
            </div>
            <p id={`${id}-note`} className={styles.note}>*스팸은 보내지 않으며, 언제든 구독을 해지할 수 있습니다.</p>
            <p id={`${id}-message`} className={`${styles.message} ${status === 'error' ? styles.error : ''}`}
              role="status" aria-live="polite" aria-atomic="true">{message}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
