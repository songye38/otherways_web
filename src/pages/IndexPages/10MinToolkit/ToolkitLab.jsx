import { useEffect, useId, useRef, useState } from 'react';
import { labToolkits } from './toolkit-lab-data.js';
import styles from './ToolkitLab.module.css';

export default function ToolkitLab({ products = labToolkits }) {
  const id = useId();
  const dialogRef = useRef(null);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [started, setStarted] = useState(false);
  const [notes, setNotes] = useState({});
  const [notice, setNotice] = useState('');
  const categories = ['All', ...new Set(products.map(item => item.category))];
  const visible = category === 'All' ? products : products.filter(item => item.category === category);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  function openToolkit(item) {
    window.location.assign(
      `/10-min-toolkit/${encodeURIComponent(item.id)}`
    );
  }

  function pickOne() {
    if (visible.length) openToolkit(visible[Math.floor(Math.random() * visible.length)]);
  }

  function downloadNote() {
    if (!selected) return;
    const text = `${selected.title.replaceAll('\n', ' ')}\n\n핵심 질문\n${selected.question}\n\n나의 실험 기록\n${notes[selected.id] || '(아직 기록이 없습니다)'}\n\nOTHER WAYS / 10-MIN EXPERIMENT — 테스트용 가상 툴킷`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `otherways-experiment-${selected.id}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('기록 파일을 다운로드했습니다.');
  }

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          <h1>오늘은 무엇을<br /><span>다르게</span> 해볼까<span className={styles.punctuation}>?</span></h1>
          <div className={styles.heroBottom}><p>생각만 하던 질문을 손 위로 꺼내는 10분.<br />마음에 걸리는 실험 한 장을 골라보세요.</p><button type="button" className={styles.randomButton} onClick={pickOne} disabled={!visible.length}><span aria-hidden="true">↝</span> 하나 골라줘 <span aria-hidden="true">↗</span></button></div>
          <div className={styles.annotation}><span>완벽한 답은 필요 없어요.</span><svg viewBox="0 0 90 40" width="90" height="40" aria-hidden="true"><path d="M2 6 Q45 50 82 14 M69 12 L84 13 L80 28" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
        </header>

        <section className={styles.workbench} aria-labelledby={`${id}-title`}>
          <div className={styles.benchTop}><h2 id={`${id}-title`}>THE EXPERIMENT DESK <span>{String(products.length).padStart(2, '0')}</span></h2></div>
          <div className={styles.filters} role="group" aria-label="실험 선택">{categories.map(value => <button type="button" key={value} aria-pressed={category === value} className={category === value ? styles.active : ''} onClick={() => setCategory(value)}>{value === 'All' ? '모든 실험' : value}<span>{value === 'All' ? products.length : products.filter(item => item.category === value).length}</span></button>)}</div>
          <p className={styles.srOnly} role="status" aria-live="polite">실험 {visible.length}개</p>
          <div className={styles.sheets}>{visible.map(item => <button type="button" key={item.id} className={`${styles.sheet} ${styles[item.color] || styles.cream}`} onClick={() => openToolkit(item)} aria-label={`${item.title.replaceAll('\n', ' ')} — 실험 살펴보기`}>
            <div className={styles.sheetTop}><span>EXPERIMENT / {item.number}</span><span>{item.category}</span></div>
            <div className={styles.sheetMark} aria-hidden="true">{item.mark}</div>
            <h3>{item.title}</h3><p className={styles.sheetDescription}>{item.description}</p>
            <div className={styles.sheetBottom}><span>10 MIN <span aria-hidden="true">/</span> 종이 + 펜</span><span className={styles.openArrow} aria-hidden="true">↗</span></div>
          </button>)}</div>
          {visible.length === 0 && <p className={styles.empty}>새로운 실험을 준비 중입니다.</p>}
        </section>

        {/* <footer className={styles.footer}><p>작은 실험도 하나의 시작이 됩니다.</p></footer> */}
      </div>

      <dialog ref={dialogRef} className={styles.dialog} onCancel={() => setSelected(null)} onClose={() => setSelected(null)} aria-labelledby={`${id}-dialog-title`}>
        {selected && <div className={styles.dialogInner}>
          <div className={styles.dialogTop}><span>EXPERIMENT / {selected.number} · {selected.category}</span><button type="button" onClick={() => setSelected(null)} aria-label="실험 닫기" autoFocus>×</button></div>
          <h2 id={`${id}-dialog-title`}>{selected.title.replaceAll('\n', ' ')}</h2>
          <p className={styles.dialogDescription}>{selected.description}</p>
          <div className={`${styles.startQuestion} ${styles[selected.color] || styles.cream}`}><span>START WITH A QUESTION</span><p>{selected.question}</p></div>
          <dl className={styles.facts}><div><dt>준비물</dt><dd>종이와 펜 또는 아래 기록란</dd></div><div><dt>해보고 남는 것</dt><dd>{selected.outcome}</dd></div></dl>
          {!started ? <button className={styles.startButton} type="button" onClick={() => setStarted(true)}>10분 실험 시작하기 <span aria-hidden="true">↗</span></button> : <div className={styles.practice}>
            <h3>10분 동안, 이렇게 해보세요.</h3>
            <ol>
              {selected.steps.map(step => (
                <li key={step.id}>
                  <span>{step.durationMinutes} MIN</span>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
            <label htmlFor={`${id}-note`}>생각의 흔적을 남겨보세요.</label><textarea id={`${id}-note`} value={notes[selected.id] || ''} onChange={event => setNotes(current => ({ ...current, [selected.id]: event.target.value }))} placeholder="거친 메모도 좋아요. 새로운 규칙, 장면, 다음 질문을 적어보세요." rows={5} />
            <button className={styles.startButton} type="button" onClick={downloadNote}>내 실험 기록 저장 <span aria-hidden="true">↓</span></button><p className={styles.fileNote}>텍스트 파일(.txt)로 내려받습니다.</p><p className={styles.savedNotice} role="status">{notice}</p>
          </div>}
        </div>}
      </dialog>
    </article>
  );
}
