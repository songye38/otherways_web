import { useId, useState } from 'react';
import styles from './ProjectIndex.module.css';

export const defaultProjects = [
  {
    id: 'kombucha', category: 'Material Lab', label: 'MATERIAL LAB LOG #01',
    title: '콤부차 바이오 셀룰로오스 배양 및 표면 염색성 탐구',
    question: '생명체의 성장 메커니즘 자체를 구조체로 사용할 수 있을까?',
    description: '21일의 배양과 표면 염색 관찰에서 출발한 재료 실험. 형태를 만드는 대신, 물질이 자라날 조건을 탐구합니다.',
    tags: ['바이오 셀룰로오스', '배양', '표면 염색'],
    href: '/project/kombucha', image: '', imageAlt: '콤부차 바이오 셀룰로오스 실험 기록',
  },
];

export default function ProjectIndex({ projects = defaultProjects, homeHref = '/', newsletterHref = '/#newsletter' }) {
  const id = useId();
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(projects.map(project => project.category))];
  const activeCategory = categories.includes(category) ? category : 'All';
  const visible = activeCategory === 'All' ? projects : projects.filter(project => project.category === activeCategory);

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <a className={styles.back} href={homeHref}>← OTHER WAYS 홈</a>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>OTHER WAYS / PROJECT ARCHIVE</p>
          <div className={styles.heroRow}><h1>Questions<br />in the making<span>.</span></h1><div className={styles.heroCopy}><p>질문을 던지고,<br />직접 만들어 본 기록.</p><p>재료를 배양하고, 관점을 비틀고, 손으로 실험합니다.<br />완성된 결과와 그 과정에서 생겨난 질문을 함께 모읍니다.</p></div></div>
          <div className={styles.heroBottom}><span>RESEARCH · EXPERIMENTS · WORKSHOPS</span><a href={`#${id}-archive`}>프로젝트 살펴보기 ↓</a></div>
        </header>

        <section className={styles.archive} id={`${id}-archive`} aria-labelledby={`${id}-title`}>
          <div className={styles.archiveTop}><h2 id={`${id}-title`}>Project archive <span>{String(projects.length).padStart(2, '0')}</span></h2><p>새로운 가능성을 탐구하는 작은 실험들</p></div>
          <div className={styles.filters} role="group" aria-label="프로젝트 분야 선택">{categories.map(item => <button key={item} type="button" aria-pressed={activeCategory === item} onClick={() => setCategory(item)} className={activeCategory === item ? styles.active : ''}>{item === 'All' ? '전체' : item}<span>{item === 'All' ? projects.length : projects.filter(p => p.category === item).length}</span></button>)}</div>
          <p className={styles.visuallyHidden} role="status" aria-live="polite">{activeCategory === 'All' ? '전체' : activeCategory} 프로젝트 {visible.length}개</p>

          <div className={`${styles.grid} ${visible.length === 1 ? styles.single : ''}`}>
            {visible.map(project => <a key={project.id} className={styles.card} href={project.href}>
              <div className={styles.imageWrap}>
                {project.image ? <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" /> : <div className={styles.placeholder}><span>IMAGE TO BE ADDED</span><div aria-hidden="true">＋</div><strong>{project.category}</strong><small>프로젝트 대표 사진</small></div>}
                <span className={styles.imageLabel}>{project.label}</span><span className={styles.arrow} aria-hidden="true">↗</span>
              </div>
              <div className={styles.cardBody}><p className={styles.category}>{project.category}</p><h3>{project.title}</h3><p className={styles.question}>“{project.question}”</p>{project.description && <p className={styles.description}>{project.description}</p>}<ul className={styles.tags}>{project.tags?.map(tag => <li key={tag}>{tag}</li>)}</ul><span className={styles.read}>실험 기록 읽기 <span aria-hidden="true">↗</span></span></div>
            </a>)}
          </div>
          {visible.length === 0 && <p className={styles.empty}>아직 공개된 프로젝트가 없습니다. 첫 번째 실험 기록을 준비하고 있습니다.</p>}
        </section>

        <aside className={styles.note}><span>OUR WAY OF MAKING</span><p>하나의 실험은 끝나도,<br />질문은 다음 프로젝트로 이어집니다.</p><a href={newsletterHref}>다음 실험 소식 받아보기 ↗</a></aside>
        <div className={styles.bottom}><span>OTHER WAYS — AN ONGOING ARCHIVE</span><a href={homeHref}>홈으로 돌아가기 ↗</a></div>
      </div>
    </article>
  );
}
