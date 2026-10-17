import { useId, useState } from 'react';
import { archiveItems } from './archive-data.js';
import { externalUrl, filterArchive } from './archive-utils.js';
import styles from './ArchiveIndex.module.css';

const PAGE_SIZE = 12;

function Thumbnail({ item }) {
  const [failedSrc, setFailedSrc] = useState(null);

  return (
    <div className={styles.thumbnail}>
      {item.image && failedSrc !== item.image ? (
        <img
          src={item.image}
          alt={item.imageAlt || item.name}
          loading="lazy"
          onError={() => setFailedSrc(item.image)}
        />
      ) : (
        <div className={styles.placeholder}>
          <span aria-hidden="true">＋</span>
          <p>
            {item.image
              ? '이미지를 불러올 수 없습니다'
              : '이미지 준비 중'}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ArchiveIndex({
  items = archiveItems,
  homeHref = '/',
  newsletterHref = '/newsletter',
}) {
  const id = useId();
  const [view, setView] = useState('card');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [projectType, setProjectType] = useState('');
  const [tags, setTags] = useState([]);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [onlyOtherWays, setOnlyOtherWays] = useState(false);
  const [onlyNewsletter, setOnlyNewsletter] = useState(false);

  const categories = [
    ...new Set(items.map(item => item.category).filter(Boolean)),
  ];
  const projectTypes = [
    ...new Set(items.map(item => item.projectType).filter(Boolean)),
  ];
  const activeProjectType = projectTypes.includes(projectType)
    ? projectType
    : '';
  const allTags = [...new Set(items.flatMap(item => item.tags || []))];
  const activeCategory = categories.includes(category) ? category : '';
  const activeTags = tags.filter(tag => allTags.includes(tag));

  const otherWaysCount = items.filter(
    item => item.isOtherWays === true
  ).length;

  const newsletterCount = items.filter(
    item => Boolean(externalUrl(item.newsletterUrl))
  ).length;

  const filtered = filterArchive(items, {
    query,
    category: activeCategory,
    projectType: activeProjectType,
    tags: activeTags,
  }).filter(item => {
    const matchesOtherWays =
      !onlyOtherWays || item.isOtherWays === true;

    const matchesNewsletter =
      !onlyNewsletter || Boolean(externalUrl(item.newsletterUrl));

    return matchesOtherWays && matchesNewsletter;
  });


  const visible = filtered.slice(0, limit);
  const hasFilters =
    query.trim() ||
    activeCategory ||
    activeProjectType ||
    activeTags.length > 0 ||
    onlyOtherWays ||
    onlyNewsletter;

  function reset() {
    setQuery('');
    setCategory('');
    setProjectType('');
    setTags([]);
    setOnlyOtherWays(false);
    setOnlyNewsletter(false);
    setLimit(PAGE_SIZE);
  }

  function toggleTag(tag) {
    setTags(current =>
      current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag]
    );
    setLimit(PAGE_SIZE);
  }

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        {/* <a className={styles.back} href={homeHref}>← OTHER WAYS 홈</a> */}

        <header className={styles.hero}>
          {/* <p className={styles.eyebrow}>OTHER WAYS / RESEARCH ARCHIVE</p> */}

          <div className={styles.heroRow}>
            <h1>
              Archive<span>.</span>
            </h1>

            <div className={styles.heroCopy}>
              <h2>
                다른 가능성을 여는
                <br />
                사례와 질문의 모음.
              </h2>
              <p>
                익숙한 답을 비트는 프로젝트를 수집합니다.
                <br />
                하나의 이미지, 하나의 질문에서 새로운 관점을 발견해 보세요.
              </p>
            </div>
          </div>

          <div className={styles.heroBottom}>
            <span>COLLECT IDEAS. FOLLOW QUESTIONS.</span>
            <a href={newsletterHref}>뉴스레터로 더 깊이 읽기 ↗</a>
          </div>
        </header>

        <section
          className={styles.archive}
          aria-labelledby={`${id}-title`}
        >
          <div className={styles.toolbar}>
            <h2 id={`${id}-title`}>
              전체 사례 <span>{String(items.length).padStart(2, '0')}</span>
            </h2>

            <div className={styles.search}>
              <span aria-hidden="true">⌕</span>
              <label
                className={styles.visuallyHidden}
                htmlFor={`${id}-search`}
              >
                프로젝트, 핵심 질문, 카테고리, 태그 검색
              </label>
              <input
                id={`${id}-search`}
                type="search"
                placeholder="프로젝트나 질문을 검색하세요"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setLimit(PAGE_SIZE);
                }}
              />
            </div>
          </div>

          {projectTypes.length > 0 && (
            <div className={styles.filterGroup}>
              <p>프로젝트 유형</p>

              <div
                className={styles.chips}
                role="group"
                aria-label="프로젝트 유형 필터"
              >
                <button
                  type="button"
                  aria-pressed={!activeProjectType}
                  className={!activeProjectType ? styles.active : ''}
                  onClick={() => {
                    setProjectType('');
                    setLimit(PAGE_SIZE);
                  }}
                >
                  전체 <small>{items.length}</small>
                </button>

                {projectTypes.map(value => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={activeProjectType === value}
                    className={
                      activeProjectType === value ? styles.active : ''
                    }
                    onClick={() => {
                      setProjectType(value);
                      setLimit(PAGE_SIZE);
                    }}
                  >
                    {value}
                    <small>
                      {items.filter(item => item.projectType === value).length}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className={styles.filterGroup}>
              <p>카테고리</p>

              <div
                className={styles.chips}
                role="group"
                aria-label="카테고리 필터"
              >
                <button
                  type="button"
                  aria-pressed={!activeCategory}
                  className={!activeCategory ? styles.active : ''}
                  onClick={() => {
                    setCategory('');
                    setLimit(PAGE_SIZE);
                  }}
                >
                  전체 <small>{items.length}</small>
                </button>

                {categories.map(value => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={activeCategory === value}
                    className={
                      activeCategory === value ? styles.active : ''
                    }
                    onClick={() => {
                      setCategory(value);
                      setLimit(PAGE_SIZE);
                    }}
                  >
                    {value}
                    <small>
                      {items.filter(item => item.category === value).length}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.filterGroup}>
            <p>모아보기</p>

            <div
              className={styles.chips}
              role="group"
              aria-label="모아보기 필터"
            >
              <button
                type="button"
                aria-pressed={!onlyOtherWays && !onlyNewsletter}
                className={
                  !onlyOtherWays && !onlyNewsletter ? styles.active : ''
                }
                onClick={() => {
                  setOnlyOtherWays(false);
                  setOnlyNewsletter(false);
                  setLimit(PAGE_SIZE);
                }}
              >
                전체 <small>{items.length}</small>
              </button>

              <button
                type="button"
                aria-pressed={onlyOtherWays}
                className={onlyOtherWays ? styles.active : ''}
                onClick={() => {
                  setOnlyOtherWays(current => !current);
                  setLimit(PAGE_SIZE);
                }}
              >
                OTHER WAYS 프로젝트 <small>{otherWaysCount}</small>
              </button>

              <button
                type="button"
                aria-pressed={onlyNewsletter}
                className={onlyNewsletter ? styles.active : ''}
                onClick={() => {
                  setOnlyNewsletter(current => !current);
                  setLimit(PAGE_SIZE);
                }}
              >
                뉴스레터로 소개한 사례 <small>{newsletterCount}</small>
              </button>
            </div>
          </div>

          {allTags.length > 0 && (
            <details className={styles.tagDetails}>
              <summary className={styles.tagSummary}>
                <span>
                  태그 필터
                  {activeTags.length > 0 && ` · ${activeTags.length}개 선택`}
                </span>
                <span className={styles.tagToggle} aria-hidden="true">
                  ＋
                </span>
              </summary>

              <div
                className={styles.chips}
                role="group"
                aria-label="선택한 태그를 모두 포함하는 사례 보기"
              >
                {allTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={activeTags.includes(tag)}
                    className={
                      activeTags.includes(tag)
                        ? styles.activeTag
                        : styles.tagButton
                    }
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </details>
          )}

          <div className={styles.results}>
            <p role="status" aria-live="polite">
              <strong>{filtered.length}</strong>개의 사례
              {activeTags.length > 1 && (
                <span> · 선택한 태그를 모두 포함</span>
              )}
            </p>
            {hasFilters && (
              <button type="button" onClick={reset}>
                필터 초기화 ↺
              </button>
            )}
          </div>

          <div
            className={styles.viewSwitch}
            role="group"
            aria-label="사례 보기 유형"
          >
            <button
              type="button"
              aria-pressed={view === 'card'}
              onClick={() => setView('card')}
            >
              카드 보기
            </button>
            <button
              type="button"
              aria-pressed={view === 'text'}
              onClick={() => setView('text')}
            >
              텍스트 보기
            </button>
          </div>

          <div
            className={`${styles.grid} ${view === 'text' ? styles.textView : ''
              }`}
          >
            {visible.map(item => {
              const url = externalUrl(item.sourceUrl);
              const newsletterUrl = externalUrl(item.newsletterUrl);

              return (
                <article
                  key={item.id}
                  className={styles.card}
                  aria-labelledby={`${id}-card-${item.id}`}
                >
                  {view === 'card' && (
                    <>
                      <Thumbnail item={item} />
                      {item.imageCredit && (
                        <p className={styles.credit}>
                          이미지: {item.imageCredit}
                        </p>
                      )}
                    </>
                  )}

                  <div className={styles.cardBody}>
                    <p className={styles.category}>
                      {[
                        item.publishedAt?.slice(0, 4),
                        item.category,
                        item.projectType,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <h3 id={`${id}-card-${item.id}`}>
                      {item.question}
                    </h3>
                    <div className={styles.question}>
                      <p>{item.name}</p>
                    </div>

                    <ul className={styles.cardTags}>
                      {item.tags?.map(tag => (
                        <li key={tag}>
                          <button
                            type="button"
                            aria-pressed={activeTags.includes(tag)}
                            className={
                              activeTags.includes(tag)
                                ? styles.selectedCardTag
                                : ''
                            }
                            onClick={() => toggleTag(tag)}
                          >
                            #{tag}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.cardFooter}>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          원문 보기
                          <span aria-hidden="true">↗</span>
                          <span className={styles.visuallyHidden}>
                            — {item.name}, 새 탭에서 열림
                          </span>
                        </a>
                      ) : (
                        <span className={styles.pending}>
                          원문 링크 준비 중
                        </span>
                      )}

                      {newsletterUrl && (
                        <a
                          href={newsletterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.newsletterLink}
                        >
                          뉴스레터로 읽기
                          <span aria-hidden="true">↗</span>
                          <span className={styles.visuallyHidden}>
                            — {item.name}, 새 탭에서 열림
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <span>
                {items.length ? 'NO MATCHES' : 'THE COLLECTION BEGINS HERE'}
              </span>
              <h3>
                {items.length
                  ? '아직 맞는 사례를 찾지 못했어요.'
                  : '새로운 사례를 모으고 있습니다.'}
              </h3>
              <p>
                {items.length
                  ? '다른 검색어를 입력하거나 선택한 필터를 줄여보세요.'
                  : '수집한 프로젝트와 질문을 이곳에서 만나보세요.'}
              </p>
              {hasFilters && (
                <button type="button" onClick={reset}>
                  전체 사례 보기
                </button>
              )}
            </div>
          )}

          {filtered.length > visible.length && (
            <div className={styles.loadMore}>
              <button
                type="button"
                onClick={() => setLimit(current => current + PAGE_SIZE)}
              >
                사례 더 보기
                <span>{visible.length} / {filtered.length}</span>
                <b aria-hidden="true">＋</b>
              </button>
            </div>
          )}
        </section>

        {/* <footer className={styles.bottom}><span>OTHER WAYS — AN ARCHIVE OF POSSIBILITIES</span><p>궁금한 사례는 원문에서 더 깊이 살펴보세요.</p></footer> */}
      </div>
    </article>
  );
}
