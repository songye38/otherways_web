import { useId, useMemo, useState } from 'react';
import { newsletterIssues } from './newsletter-data.js';
import styles from './NewsletterIndex.module.css';

function safeExternal(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
function dateLabel(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return '발행일 미정';
  return date.replaceAll('-', '.');
}
function ExternalLink({ href, children, pending }) {
  const url = safeExternal(href);
  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true">↗</span><span className={styles.visuallyHidden}> (새 탭에서 열림)</span></a> : <span className={styles.pending}>{pending}</span>;
}

export default function NewsletterIndex({ issues = newsletterIssues, homeHref = '/', subscribeHref = 'https://makeways.stibee.com/subscribe' }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const ordered = useMemo(() => [...issues].sort((a, b) => Number(b.number) - Number(a.number)), [issues]);
  const years = [...new Set(ordered.map(issue => /^\d{4}-\d{2}-\d{2}$/.test(issue.date || '') ? issue.date.slice(0,4) : null).filter(Boolean))].sort().reverse();
  const activeYear = years.includes(year) ? year : 'all';
  const search = query.trim().toLocaleLowerCase();
  const visible = ordered.filter(issue => (activeYear === 'all' || issue.date?.startsWith(activeYear)) && `${issue.number}호 ${issue.title} ${issue.experimentTitle || ''}`.toLocaleLowerCase().includes(search));

  return (
    <article className={styles.page}><div className={styles.inner}>
      {/* <a className={styles.back} href={homeHref}>← OTHER WAYS 홈</a> */}
      <header className={styles.hero}>
        {/* <p className={styles.eyebrow}>OTHER WAYS / NEWSLETTER ARCHIVE</p> */}
        <div className={styles.heroRow}><h1>MakeWays<span>.</span></h1><div className={styles.intro}><p>읽고 끝나는 편지에서,<br />직접 해보는 질문으로.</p><p>디자인 리서치와 새로운 관점,<br />그리고 손을 움직이는 10분 실험.<br />지금까지 보낸 편지와 실험 툴킷을 모았습니다.</p></div></div>
        <div className={styles.heroBottom}><span>A LETTER. A QUESTION. A SMALL EXPERIMENT.</span><a href={subscribeHref}>새로운 편지 받아보기 ↗</a></div>
      </header>

      <section className={styles.archive} aria-labelledby={`${id}-title`}>
        <div className={styles.archiveHeading}><h2 id={`${id}-title`}>전체 뉴스레터<span>{String(issues.length).padStart(2,'0')}</span></h2></div>
        <div className={styles.filters}>
          <div className={styles.search}><label className={styles.visuallyHidden} htmlFor={`${id}-search`}>호수, 뉴스레터 제목 또는 실험 제목 검색</label><span aria-hidden="true">⌕</span><input id={`${id}-search`} type="search" placeholder="편지 제목이나 10분 실험 찾기" value={query} onChange={event => setQuery(event.target.value)} /></div>
          <div className={styles.year}><label htmlFor={`${id}-year`}>발행 연도</label><select id={`${id}-year`} value={activeYear} onChange={event => setYear(event.target.value)}><option value="all">전체</option>{years.map(value => <option key={value} value={value}>{value}년</option>)}</select></div>
        </div>
        <p className={styles.visuallyHidden} role="status" aria-live="polite">편지 {visible.length}개</p>
        <ol className={styles.issues}>{visible.map(issue => <li key={issue.number} className={styles.issue}>
          <div className={styles.issueMeta}><span className={styles.number}>{String(issue.number).padStart(2,'0')}<small>호</small></span>{/^\d{4}-\d{2}-\d{2}$/.test(issue.date || '') ? <time dateTime={issue.date}>{dateLabel(issue.date)}</time> : <span className={styles.date}>발행일 미정</span>}</div>
          <div className={styles.issueBody}><div className={styles.letter}><div><p className={styles.label}>LETTER / {String(issue.number).padStart(2,'0')}</p><h3>{issue.title}</h3></div><ExternalLink href={issue.newsletterUrl} pending="뉴스레터 링크 준비 중">뉴스레터 읽기</ExternalLink></div>
            <div className={styles.experiment}><div><p className={styles.experimentLabel}><span aria-hidden="true">＋</span> 10-MIN EXPERIMENT</p><h4>{issue.experimentTitle || '이번 호의 10분 실험을 준비 중입니다'}</h4></div><ExternalLink href={issue.toolkitUrl} pending="툴킷 준비 중">실험 툴킷 열기</ExternalLink></div>
          </div>
        </li>)}</ol>
        {visible.length === 0 && <div className={styles.empty}><span>{issues.length === 0 ? 'THE FIRST LETTER IS ON ITS WAY' : 'NO LETTERS FOUND'}</span><h3>{issues.length === 0 ? '첫 번째 편지를 준비하고 있어요.' : '찾으시는 편지가 없어요.'}</h3><p>{issues.length === 0 ? '편지가 발행되면 이곳에서 뉴스레터와 10분 실험을 함께 만나볼 수 있어요.' : '다른 검색어를 입력하거나 발행 연도를 바꿔보세요.'}</p>{issues.length > 0 && <button type="button" onClick={() => { setQuery(''); setYear('all'); }}>전체 편지 보기</button>}</div>}
      </section>
      <aside className={styles.subscribe}><p>THE NEXT LETTER</p><div><h2>다음 질문은,<br />메일함에서 만나세요.</h2><a href={subscribeHref}>뉴스레터 구독하기 <span aria-hidden="true">↗</span></a></div></aside>
      {/* <div className={styles.bottom}><span>OTHER WAYS — LETTERS FOR OUTLIERS</span><a href={homeHref}>홈으로 돌아가기 ↗</a></div> */}
    </div></article>
  );
}
