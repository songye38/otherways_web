import React, { useId, useRef, useState } from 'react';
import { references, referenceTopics, referenceTypes } from './reference-data.js';
import styles from './ReferenceIndex.module.css';

function FilterRow({ label, options, value, onChange }) {
  const id = useId();

  return (
    <div className={styles.filterRow}>
      <span id={id} className={styles.filterLabel}>{label}</span>
      <div className={styles.chips} role="group" aria-labelledby={id}>
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            className={styles.chip}
            aria-pressed={value === option.value}
            onClick={() => onChange(value === option.value ? '' : option.value)}
          >
            {option.label} <span>{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BookCover({ title, src }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.bookVisual} aria-hidden="true">
      {!loaded && (
        <div className={styles.coverFallback}>
          <span>OTHER WAYS / BOOK</span>
          <strong>{title}</strong>
          <span>표지 미리보기</span>
        </div>
      )}
      {src && (
        <img
          className={styles.cover}
          src={src}
          alt=""
          decoding="async"
          referrerPolicy="no-referrer"
          hidden={!loaded}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      )}
    </div>
  );
}

function ReferenceEntry({ item }) {
  const isBook = item.type === '책';
  const isOrg = item.type === '조직';

  const link = item.url && (
    <a
      className={styles.source}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {item.link || (isOrg ? '웹사이트 보기' : '자료 보기')}{' '}
      <span aria-hidden="true">↗</span>
      <span className={styles.srOnly}> — {item.title} (새 탭에서 열림)</span>
    </a>
  );

  if (isOrg) {
    return (
      <li className={styles.orgCard}>
        <div className={styles.orgThumbnail}>
          {item.image && (
            <img src={item.image} alt={item.imageAlt ?? ''} loading="lazy" />
          )}
        </div>

        <div className={styles.orgInfo}>
          {item.venue && <p className={styles.orgType}>{item.venue}</p>}
          <h4>{item.title}</h4>
          {item.note && <p className={styles.byline}>{item.note}</p>}
          {link}
        </div>
      </li>
    );
  }

  return (
    <li className={isBook ? styles.book : styles.paper}>
      {isBook && <BookCover key={item.cover} title={item.title} src={item.cover} />}

      <div className={isBook ? styles.bookCopy : styles.paperCopy}>
        <h4>
          {item.title}
          {item.subtitle && <span className={styles.subtitle}>{item.subtitle}</span>}
        </h4>

        <p className={styles.byline}>
          {isBook ? (
            <>
              {item.author && <span>{item.author}</span>}
              {item.venue && <span>{item.venue}</span>}
              {item.year && <span>{item.year}</span>}
            </>
          ) : (
            [item.author, item.year, item.venue].filter(Boolean).join(' · ')
          )}
        </p>

        {isBook && link}
      </div>

      {!isBook && link}
    </li>
  );
}

export default function ReferenceIndex({ items = references }) {
  const id = useId();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [topic, setTopic] = useState('');
  const [sort, setSort] = useState('curated');

  const allOption = { value: '', label: '전체', count: items.length };
  const typeOptions = [allOption, ...referenceTypes.map(value => ({
    value,
    label: value,
    count: items.filter(item => item.type === value).length,
  }))];
  const topicOptions = [allOption, ...Object.entries(referenceTopics).map(([value, info]) => ({
    value,
    label: info.label,
    count: items.filter(item => item.topics?.includes(value)).length,
  }))];

  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = items.filter(item => {
    const topics = item.topics ?? [];
    const searchable = [
      item.title, item.subtitle, item.author, item.venue, item.year, item.type, item.note,
      ...topics.flatMap(key => [referenceTopics[key]?.label, referenceTopics[key]?.keyword]),
    ].join(' ').toLowerCase();

    return (!type || item.type === type)
      && (!topic || topics.includes(topic))
      && words.every(word => searchable.includes(word));
  });

  if (sort !== 'curated') {
    shown.sort((a, b) => {
      if (a.year == null) return b.year == null ? 0 : 1;
      if (b.year == null) return -1;
      return sort === 'new' ? b.year - a.year : a.year - b.year;
    });
  }

  function resetFilters() {
    setQuery('');
    setType('');
    setTopic('');
    searchRef.current?.focus();
  }

  return (
    <div className={styles.page}>
      <header className={`${styles.hero} ${styles.wrap}`} aria-labelledby={`${id}-hero`}>
        <div className={styles.heroRow}>
          <h1 id={`${id}-hero`} className={styles.title}>
            References<span>.</span>
          </h1>

          <div className={styles.heroCopy}>
            <h2>
              다른 가능성을 읽는
              <br />
              책과 논문의 모음.
            </h2>
            <p>
              사변적 디자인, 비판적 디자인, 디자인 픽션을 다룬 자료를 모았습니다.
              <br />
              관심 있는 주제에서 다음 읽을거리를 찾아보세요.
            </p>
          </div>
        </div>

        <div className={styles.heroBottom}>
          <span>COLLECT REFERENCES. FOLLOW QUESTIONS.</span>
          <a href={`#${id}-index`}>자료 목록 보기 ↓</a>
        </div>
      </header>

      <section className={`${styles.index} ${styles.wrap}`} aria-labelledby={`${id}-index`}>
        <div className={styles.indexHeading}>
          <h2 id={`${id}-index`}>
            전체 자료 <span>{String(items.length).padStart(2, '0')}</span>
          </h2>
          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <span className={styles.srOnly}>자료 검색</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="제목, 저자, 키워드 검색"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className={styles.controls}>
          <FilterRow label="자료 유형" options={typeOptions} value={type} onChange={setType} />
          <FilterRow label="주제" options={topicOptions} value={topic} onChange={setTopic} />
        </div>

        <div className={styles.listHead}>
          <span className={styles.count} role="status" aria-atomic="true">
            {shown.length}개 자료 / 전체 {items.length}개
          </span>
          <label>
            정렬
            <select value={sort} onChange={event => setSort(event.target.value)}>
              <option value="curated">추천 순서</option>
              <option value="new">최신 발행순</option>
              <option value="old">오래된 순</option>
            </select>
          </label>
        </div>

        {shown.length === 0 ? (
          <div className={styles.empty}>
            <p>조건에 맞는 자료가 없어. 다른 검색어나 주제로 찾아봐.</p>
            <button type="button" onClick={resetFilters}>필터 초기화</button>
          </div>
        ) : (
          referenceTypes.map((group, index) => {
            const entries = shown.filter(item => item.type === group);
            if (!entries.length) return null;

            const titleId = `${id}-group-${index}`;
            const listClass =
              group === '책' || group === '조직'
                ? styles.bookGrid
                : styles.paperList;

            return (
              <section key={group} className={styles.collection} aria-labelledby={titleId}>
                <div className={styles.collectionHead}>
                  <h3 id={titleId}>{group}</h3>
                  <span>{String(entries.length).padStart(2, '0')}</span>
                </div>

                <ul className={`${styles.list} ${listClass}`}>
                  {entries.map(item => <ReferenceEntry key={item.id} item={item} />)}
                </ul>
              </section>
            );
          })
        )}
      </section>
    </div>
  );
}
