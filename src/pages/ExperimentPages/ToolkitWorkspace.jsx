import { useId, useState } from 'react';
// 아래 경로만 실제 데이터 파일 위치/이름에 맞춰주세요.
// ToolkitLab이 사용하는 것과 같은 파일을 import해야 합니다.
import { labToolkits } from '../IndexPages/10MinToolkit/toolkit-lab-data.js';
import { exportWorksheet } from './worksheet-export.js';
import styles from './ToolkitWorkspace.module.css';

const supportedTypes = ['text', 'textarea', 'singleSelect', 'multiSelect', 'list'];
const answerKey = (step, question) => `${step.id}/${question.id}`;
const optionValue = option => typeof option === 'string' ? option : option.value;
const optionLabel = option => typeof option === 'string' ? option : option.label;

function hasAnswer(question, value) {
  if (question.type === 'list') {
    return Array.from({ length: question.itemCount || 3 }, (_, i) => value?.[i] || '')
      .every(item => String(item).trim());
  }
  if (question.type === 'multiSelect') return Array.isArray(value) && value.length > 0;
  return typeof value === 'string' && value.trim().length > 0;
}

function displayAnswer(question, value) {
  if (question.type === 'list') {
    if (!Array.isArray(value) || !value.some(item => String(item).trim())) return '';
    return Array.from({ length: question.itemCount || 3 }, (_, index) =>
      `${index + 1}. ${value[index]?.trim() || '—'}`
    ).join('\n');
  }
  if (question.type === 'multiSelect') {
    if (!Array.isArray(value)) return '';
    return value.map(selected => {
      const option = (question.options || []).find(item => optionValue(item) === selected);
      return option ? optionLabel(option) : selected;
    }).join(' · ');
  }
  if (question.type === 'singleSelect') {
    const option = (question.options || []).find(item => optionValue(item) === value);
    return option ? optionLabel(option) : (value || '');
  }
  return value || '';
}

function QuestionField({ question, value, onChange }) {
  const id = useId();
  const optional = !question.required;
  const options = question.options || [];
  const choices = question.type === 'singleSelect' || question.type === 'multiSelect';

  if (!supportedTypes.includes(question.type)) {
    return <p className={styles.tip}>‘{question.label}’의 입력 방식은 아직 지원하지 않습니다: {question.type}</p>;
  }

  if (choices) {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className={styles.questionGroup}>
        <legend>{question.label}{optional && <small>선택</small>}</legend>
        {question.description && <p className={styles.tip}>{question.description}</p>}
        <div className={styles.delegateChips} role="group" aria-label={question.label}>
          {options.map(option => {
            const val = optionValue(option);
            return (
              <button
                key={val}
                type="button"
                aria-pressed={question.type === 'multiSelect' ? selected.includes(val) : value === val}
                onClick={() => onChange(question.type === 'multiSelect'
                  ? (selected.includes(val) ? selected.filter(item => item !== val) : [...selected, val])
                  : (value === val ? '' : val))}
              >
                {optionLabel(option)}
                <span aria-hidden="true">↗</span>
              </button>
            );
          })}
        </div>
        {question.type === 'singleSelect' && question.allowCustom && (
          <>
            <label htmlFor={id}>선택하거나 직접 입력하세요.</label>
            <input
              id={id}
              type="text"
              value={typeof value === 'string' ? value : ''}
              placeholder={question.placeholder || '다른 대상을 직접 적어도 좋아요.'}
              aria-required={Boolean(question.required)}
              onChange={event => onChange(event.target.value)}
            />
          </>
        )}
        {question.hint && <p className={styles.tip}>{question.hint}</p>}
      </fieldset>
    );
  }

  if (question.type === 'list') {
    const values = Array.isArray(value) ? value : [];
    return (
      <fieldset className={styles.questionGroup}>
        <legend>{question.label}{optional && <small>선택</small>}</legend>
        {question.description && <p className={styles.tip}>{question.description}</p>}
        <div className={styles.answerList}>
          {Array.from({ length: question.itemCount || 3 }, (_, index) => (
            <div key={index}>
              <label htmlFor={`${id}-${index}`}>{String(index + 1).padStart(2, '0')}</label>
              <textarea
                id={`${id}-${index}`}
                aria-label={`${question.label} — ${index + 1}번`}
                aria-required={Boolean(question.required)}
                rows={question.rows || 2}
                placeholder={question.placeholder || ''}
                value={values[index] || ''}
                onChange={event => {
                  const next = Array.from({ length: question.itemCount || 3 }, (_, i) => values[i] || '');
                  next[index] = event.target.value;
                  onChange(next);
                }}
              />
            </div>
          ))}
        </div>
        {question.hint && <p className={styles.tip}>{question.hint}</p>}
      </fieldset>
    );
  }

  return (
    <div className={styles.fieldBlock}>
      <label htmlFor={id}>{question.label}{optional && <small>선택</small>}</label>
      {question.description && <p className={styles.tip}>{question.description}</p>}
      {question.type === 'textarea' ? (
        <textarea
          id={id}
          rows={question.rows || 3}
          value={typeof value === 'string' ? value : ''}
          placeholder={question.placeholder || ''}
          aria-required={Boolean(question.required)}
          onChange={event => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={typeof value === 'string' ? value : ''}
          placeholder={question.placeholder || ''}
          aria-required={Boolean(question.required)}
          onChange={event => onChange(event.target.value)}
        />
      )}
      {question.hint && <p className={styles.tip}>{question.hint}</p>}
    </div>
  );
}

function safeLink(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export default function ToolkitWorkspace({ toolkitId, backHref = '/10-min-toolkit', products = labToolkits }) {
  const toolkit = products.find(item => item.id === toolkitId);
  if (!toolkit) {
    return (
      <article className={styles.page}>
        <div className={styles.inner}>
          <h1>툴킷을 찾을 수 없습니다.</h1>
          <p>주소를 확인하거나 전체 툴킷 목록에서 다시 골라주세요.</p>
          <a href={backHref}>← 전체 툴킷 목록으로 돌아가기</a>
        </div>
      </article>
    );
  }
  return <Workspace key={toolkit.id} toolkit={toolkit} backHref={backHref} />;
}

function Workspace({ toolkit, backHref }) {
  const id = useId();
  const [mode, setMode] = useState('web');
  const [result, setResult] = useState(false);
  const [answers, setAnswers] = useState({});
  const [notice, setNotice] = useState('');
  const [exporting, setExporting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = toolkit.steps || [];
  const done = steps.map(step => {
    const questions = step.questions || [];
    const required = questions.filter(question => question.required);
    return required.length
      ? required.every(question => hasAnswer(question, answers[answerKey(step, question)]))
      : questions.some(question => hasAnswer(question, answers[answerKey(step, question)]));
  });
  const progress = done.filter(Boolean).length;
  const showingSheet = mode === 'paper' || result;
  const title = toolkit.title.replaceAll('\n', ' ');
  const duration = toolkit.durationMinutes ?? steps.reduce((sum, step) => sum + (Number(step.durationMinutes) || 0), 0);
  const fields = steps.flatMap(step => (step.questions || []).map(question => ({
    id: answerKey(step, question),
    label: question.resultLabel || question.label,
    value: displayAnswer(question, answers[answerKey(step, question)]),
    type: question.type,
    count: question.itemCount || 3,
  })));
  const pdfUrl = safeLink(toolkit.pdfUrl);

  function edit(step, question, value) {
    setAnswers(current => ({ ...current, [answerKey(step, question)]: value }));
    setNotice('');
  }

  function jump(index) {
    setActiveStep(index);
    document.getElementById(`${id}-step-${index}`)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  async function saveImage() {
    setExporting(true);
    setNotice('');
    try {
      await exportWorksheet({
        title,
        question: toolkit.question,
        number: toolkit.number,
        toolkitId: toolkit.id,
        color: toolkit.color,
        sections: fields,
      });
      setNotice('실험 시트 이미지 내보내기를 실행했습니다.');
    } catch {
      setNotice('이미지를 저장하지 못했습니다. 내용이 매우 길다면 인쇄 / PDF 저장을 이용해 주세요.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.breadcrumb}>
          <a href={backHref}>← 전체 툴킷 목록으로 돌아가기</a>
        </div>

        <header className={styles.hero}>
          <div>
            <h1>{title}<span aria-hidden="true">↗</span></h1>
            <p>{toolkit.description}</p>
          </div>
          {duration > 0 && <span className={styles.timeStamp}>{duration}<span>MINUTES</span></span>}
        </header>

        <div className={styles.modeBar}>
          <div className={styles.modeTabs} role="group" aria-label="실험 방식 선택">
            <button type="button" aria-pressed={mode === 'web'} onClick={() => { setMode('web'); setNotice(''); }}>웹에서 해보기</button>
            <button type="button" aria-pressed={mode === 'paper'} onClick={() => { setMode('paper'); setNotice(''); }}>종이로 해보기</button>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <h2>{toolkit.sidebarTitle || '질문에서\n나의 실험으로.'}</h2>
              <div className={styles.progress}>
                <div><span>작성 단계</span><strong>{progress} / {steps.length}</strong></div>
                <div className={styles.progressTrack}><span style={{ width: `${steps.length ? progress / steps.length * 100 : 0}%` }} /></div>
              </div>
              <nav className={styles.stepsNav} aria-label="실험 단계">
                {steps.map((step, index) => (
                  <button type="button" key={step.id} className={activeStep === index && !showingSheet ? styles.currentStep : ''} disabled={showingSheet} onClick={() => jump(index)}>
                    <span>{done[index] ? '✓' : String(index + 1).padStart(2, '0')}</span>
                    {step.title}
                    {step.durationMinutes > 0 && <small>{step.durationMinutes}분</small>}
                  </button>
                ))}
              </nav>
              {toolkit.outcome && <div className={styles.leaveWith}><span>오늘 남길 것</span><p>{toolkit.outcome}</p></div>}
              {toolkit.materials?.length > 0 && <div className={styles.materials}><span>준비물</span><p>{toolkit.materials.join(' · ')}</p></div>}
            </div>
          </aside>

          <div className={styles.workspace}>
            {!showingSheet ? (
              <>
                {toolkit.question && <div className={styles.questionCard}><span>START WITH A QUESTION</span><p>{toolkit.question}</p><span className={styles.questionMark} aria-hidden="true">?</span></div>}
                {steps.map((step, index) => (
                  <section className={styles.step} id={`${id}-step-${index}`} key={step.id} onFocusCapture={() => setActiveStep(index)} aria-labelledby={`${id}-title-${index}`}>
                    <div className={styles.stepHeading}><span>{String(index + 1).padStart(2, '0')}{step.label ? ` / ${step.label}` : ''}</span>{step.durationMinutes > 0 && <span>{step.durationMinutes} MIN</span>}</div>
                    <h2 id={`${id}-title-${index}`}>{step.title}</h2>
                    {step.description && <p className={styles.prompt}>{step.description}</p>}
                    {(step.questions || []).map(question => (
                      <QuestionField key={question.id} question={question} value={answers[answerKey(step, question)]} onChange={value => edit(step, question, value)} />
                    ))}
                  </section>
                ))}
                <div className={styles.actions}>
                  <p>아직 빈칸이 있어도 괜찮아요. 지금의 생각을 한 장으로 모아볼까요?</p>
                  <button type="button" className={styles.primaryButton} onClick={() => { setResult(true); setNotice(''); window.scrollTo({ top: 0, behavior: 'auto' }); }}>내 실험 시트 보기 <span aria-hidden="true">↗</span></button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.sheetToolbar}>
                  <div><p>{mode === 'paper' ? 'PAPER WORKSHEET' : 'YOUR EXPERIMENT SHEET'}</p><h2>{mode === 'paper' ? '종이 위에서, 내 속도로.' : '생각이 한 장의 시트가 되었어요.'}</h2></div>
                  {mode === 'web' && <button type="button" onClick={() => setResult(false)}>← 이어서 작성</button>}
                </div>
                <section className={`${styles.resultSheet} ${mode === 'paper' ? styles.blankSheet : ''}`} aria-label={mode === 'paper' ? '인쇄용 빈 실험 시트' : '작성한 실험 시트'}>
                  <div className={styles.sheetBrand}><strong>OTHER WAYS</strong><span>10-MIN TOOLKIT / {toolkit.number || toolkit.id}</span></div>
                  <h2>{title}</h2>
                  {toolkit.question && <div className={styles.sheetQuestion}><span>START WITH A QUESTION</span><p>{toolkit.question}</p></div>}
                  {fields.map((field, index) => (
                    <div className={styles.sheetField} key={field.id}>
                      <h3><span>{String(index + 1).padStart(2, '0')}</span>{field.label}</h3>
                      {mode === 'paper' ? (
                        field.type === 'list' ? <div>{Array.from({ length: field.count }, (_, i) => <div className={styles.paperListItem} key={i}><span>{i + 1}.</span><div className={styles.writingLines} /></div>)}</div> : <div className={styles.writingLines} />
                      ) : <p className={!field.value ? styles.unfilled : ''}>{field.value || '아직 작성하지 않았습니다.'}</p>}
                    </div>
                  ))}
                  <div className={styles.sheetFoot}>완벽한 답 대신, 다음 실험으로 이어지는 생각의 흔적.<span>QUESTION. IMAGINE. MAKE.</span></div>
                </section>
                <div className={styles.exportActions}>
                  {mode === 'paper' ? (
                    <>
                      <p>빈 시트를 인쇄하거나 인쇄 창에서 PDF로 저장할 수 있어요.</p>
                      {pdfUrl && <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>종이 툴킷 PDF 열기 ↗<span className={styles.srOnly}> (새 탭에서 열림)</span></a>}
                      <button type="button" className={styles.primaryButton} onClick={() => window.print()}>종이 시트 인쇄 / PDF 저장 <span aria-hidden="true">↗</span></button>
                    </>
                  ) : (
                    <>
                      <p>작성한 내용을 디자인된 시트 이미지로 저장해 두세요.</p>
                      <button type="button" className={styles.primaryButton} onClick={saveImage} disabled={exporting}>{exporting ? '이미지 만드는 중…' : 'PNG 이미지로 저장'} <span aria-hidden="true">↓</span></button>
                      <button type="button" className={styles.secondaryButton} onClick={() => window.print()}>인쇄 / PDF 저장</button>
                    </>
                  )}
                </div>
              </>
            )}
            <p className={styles.notice} role="status" aria-live="polite">{notice}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
