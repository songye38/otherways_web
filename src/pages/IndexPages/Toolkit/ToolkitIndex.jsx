import { useId, useState } from 'react';
import { toolkits } from './toolkit-data.js';
import styles from './ToolkitIndex.module.css';

function validHref(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return { href: value, external: false };
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? { href: url.href, external: true } : null; }
  catch { return null; }
}
function ProductLink({ product, className }) {
  const link = validHref(product.href);
  return link ? <a className={className} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>{product.linkLabel || '툴킷 살펴보기'}<span aria-hidden="true">↗</span>{link.external && <span className={styles.visuallyHidden}> (새 탭에서 열림)</span>}</a> : <span className={`${className} ${styles.pending}`}>준비 중<span aria-hidden="true">—</span></span>;
}
function ProductImage({ product, large = false }) {
  return <div className={`${styles.productImage} ${large ? styles.largeImage : ''}`}>
    {product.image ? <img src={product.image} alt={product.imageAlt || product.name} loading={large ? 'eager' : 'lazy'} /> : <div className={styles.placeholder}><span>OTHER WAYS / TOOLKIT</span><strong>{product.name}</strong><span className={styles.placeholderMark} aria-hidden="true">＋</span><small>제품 이미지 준비 중</small></div>}
  </div>;
}

export default function ToolkitIndex({ products = toolkits, homeHref = '/', newsletterHref = '/newsletter' }) {
  const id = useId();
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState('All');
  const featured = products.filter(p => p.featured);
  const slides = featured.length ? featured : products;
  const current = slides.length ? ((slide % slides.length) + slides.length) % slides.length : 0;
  const product = slides[current];
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const activeFilter = categories.includes(filter) ? filter : 'All';
  const visible = activeFilter === 'All' ? products : products.filter(p => p.category === activeFilter);

  return <article className={styles.page}><div className={styles.inner}>
    {/* <a className={styles.back} href={homeHref}>← OTHER WAYS 홈</a> */}
    <header className={styles.heading}>
      {/* <p className={styles.eyebrow}>OTHER WAYS / TOOLKIT COLLECTION</p> */}
    <div><h1>Tools for<br />your own way<span>.</span></h1><p>다르게 질문하고, 자유롭게 상상하고,<br />직접 만들어 보는 작은 도구들.</p></div></header>

    {product && <section className={styles.carousel} role="region" aria-roledescription="캐러셀" aria-labelledby={`${id}-featured`}>
      <div className={styles.carouselTop}>
        <h2 id={`${id}-featured`}>IN THE SPOTLIGHT</h2>
        <span>{String(current + 1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span></div>
      <div className={styles.slide} role="group" aria-roledescription="슬라이드" aria-label={`${current + 1} / ${slides.length}: ${product.name}`}>
        <ProductImage product={product} large />
        <div className={styles.featureCopy}><p className={styles.category}>{product.category}</p><h3>{product.name}</h3><p className={styles.tagline}>{product.tagline}</p><p className={styles.description}>{product.description}</p><ul className={styles.tags}>{product.tags?.map(tag => <li key={tag}>{tag}</li>)}</ul><div className={styles.featureBottom}><span className={styles.price}>{product.priceLabel}</span><ProductLink product={product} className={styles.primaryLink} /></div></div>
      </div>
      {slides.length > 1 && <div className={styles.carouselControls}><span className={styles.controlsHint}>나에게 필요한 도구를 찾아보세요</span><div className={styles.dots} role="group" aria-label="대표 툴킷 선택">{slides.map((p, i) => <button key={p.id} type="button" aria-label={`${i + 1}번째 툴킷: ${p.name}`} aria-pressed={current === i} className={current === i ? styles.selectedDot : ''} onClick={() => setSlide(i)} />)}</div><div className={styles.arrows}><button type="button" aria-label="이전 툴킷" onClick={() => setSlide(current - 1)}>←</button><button type="button" aria-label="다음 툴킷" onClick={() => setSlide(current + 1)}>→</button></div></div>}
      <p className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">{product.name}, {current + 1} / {slides.length}</p>
    </section>}

    <section id={`${id}-all`} className={styles.collection} aria-labelledby={`${id}-all-title`}>
      <div className={styles.collectionTop}><h2 id={`${id}-all-title`}>All toolkits <span>{String(products.length).padStart(2,'0')}</span></h2><p>지금의 질문에 맞는 도구를 골라보세요.</p></div>
      <div className={styles.filters} role="group" aria-label="툴킷 분류">{categories.map(category => <button key={category} type="button" aria-pressed={activeFilter === category} className={activeFilter === category ? styles.activeFilter : ''} onClick={() => setFilter(category)}>{category === 'All' ? '전체' : category}</button>)}</div>
      <p className={styles.visuallyHidden} role="status" aria-live="polite">툴킷 {visible.length}개</p>
      <div className={styles.grid}>{visible.map(p => <div key={p.id} className={styles.card}><ProductImage product={p} /><div className={styles.cardCopy}><p className={styles.category}>{p.category}</p><h3>{p.name}</h3><p className={styles.cardTagline}>{p.tagline}</p><ul className={styles.tags}>{p.tags?.map(tag => <li key={tag}>{tag}</li>)}</ul><div className={styles.cardBottom}><span className={styles.price}>{p.priceLabel}</span><ProductLink product={p} className={styles.cardLink} /></div></div></div>)}</div>
      {visible.length === 0 && <p className={styles.empty}>새로운 툴킷을 준비하고 있습니다.</p>}
    </section>

    <aside className={styles.newsletter}><div><p>SMALL TOOLS, NEW QUESTIONS</p><h2>어디서 시작할지 고민된다면,<br />10분 실험부터.</h2></div><a href={newsletterHref}>편지와 실험 툴킷 만나보기 ↗</a></aside>
    {/* <div className={styles.bottom}><span>OTHER WAYS — QUESTION / IMAGINE / MAKE</span><a href={homeHref}>홈으로 돌아가기 ↗</a></div> */}
  </div></article>;
}
