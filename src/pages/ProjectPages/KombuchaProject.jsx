import { useId } from 'react';
import styles from './KombuchaProject.module.css';

const observations = [
  ['배양 기간', '14일', '25°C–30°C 상온 유지 및 수면 위 바이오 셀룰로오스 레이어 형성'],
  [
    '밀도 및 두께',
    '평균 0.8cm (0.5–1.0cm)',
    '용기(통)별 상이하나 평균 0.8cm 수준으로 형성. 최소 0.5cm 내외의 균일한 막 관찰.'
  ],
  [
    '질감 및 물성',
    '고수분 ➔ 고탄성 섬유질',
    '건조 전 수분 함유량이 높고 두꺼우나, 건조 후 손으로 찢기 힘들 만큼 뛰어난 인장 강도 및 탄성 형성 (가위/칼 가공 필요).'
  ],
  [
    '천연 착색',
    '차(Tea) 색상 중화 및 침투',
    '선명한 발색 효과는 낮으나, 염색 과정을 통해 기존 찻물(홍차/녹차)의 어두운 침착색이 효과적으로 완화·중화됨.'
  ],
  [
    '수축률 변수',
    '두께 중심 수축 (면적 유지)',
    '건조 과정에서 면적(원형) 변형은 미미하나 두께 측면의 수축이 집중적으로 발생하며 유기적인 질감 형성.'
  ],
];
const questions = [
  { topic: '재료의 권력', title: '통제하지 않는 디자인도 가능할까?', text: '우리는 왜 재료를 항상 인간이 원하는 형태대로 완벽히 통제해야만 가치 있다고 여길까? 재료의 비정형적 수축을 디자인의 요소로 받아들일 순 없을까?' },
  { topic: '생산 속도', title: '기다림은 어떤 경험을 만들까?', text: '빠르게 사출되는 석유 플라스틱 대신, 3주 동안 자라나는 바이오 셀룰로오스의 느린 생산 속도는 어떤 새로운 소비 경험을 만들 수 있을까?' },
  { topic: '수명과 버림', title: '영원함 대신 유효기간을 설계한다면?', text: '사용 후 자연으로 완전히 돌아가는 물건을 만들 수 있다면, 우리는 제품에 영원함이 아닌 유효기간을 어떻게 디자인해야 할까?' },
];
const experiments = [
  ['구조적 가공 실험', '건조 시 3D 틀(Mold)에 입혀 입체적인 용기 형태로 건조시키는 성형 가공 실험.', '틀에 따른 형태 유지와 수축의 차이'],
  ['유연성 유지 기법', '글리세린 / 오일 처리를 통해 건조 후 바스락거림을 줄이고 가죽과 같은 질감을 유지할 수 있는지 탐구.', '처리 전후 유연성과 표면 상태의 차이'],
  ['모듈형 결합 실험', '접착제 없이 바이오 셀룰로오스가 자라나는 과정에서 서로 다른 레이어를 이어 붙이는 생체 접착 실험.', '접합부의 연결 상태와 분리 양상'],
];
const stages = ['배양 중의 레이어', '염료 침투와 표면', '건조 후의 질감', '가장자리의 수축'];

const heroImage = {
  src: '/project/01_kombucha/01.jpg',
  alt: '콤부차 바이오 셀룰로오스의 표면과 결',
  caption: '바이오 셀룰로오스 실험 기록',
};

const photos = [
  {
    src: '/project/01_kombucha/02.jpg',
    alt: '배양 중 수면 위에 형성된 셀룰로오스 레이어',
    caption: '배양 중의 레이어',
  },
  {
    src: '/project/01_kombucha/03.jpg',
    alt: '천연 염료로 착색한 셀룰로오스 표면',
    caption: '염료 침투와 표면',
  },
  {
    src: '/project/01_kombucha/04.jpg',
    alt: '건조 후 셀룰로오스의 질감',
    caption: '건조 후의 질감',
  },
  {
    src: '/project/01_kombucha/05.jpg',
    alt: '건조 과정에서 수축한 가장자리',
    caption: '가장자리의 수축',
  },
];

function Photo({ photo, label, index, hero = false }) {
  return (
    <figure className={hero ? styles.heroPhoto : styles.photo}>
      {photo?.src ? <img src={photo.src} alt={photo.alt || label} loading={hero ? 'eager' : 'lazy'} /> :
        <div className={styles.placeholder}><span className={styles.cross} aria-hidden="true">＋</span><span>{hero ? 'MATERIAL STUDY' : `OBSERVATION / 0${index + 1}`}</span><strong>{label}</strong><small>실험 사진을 기록할 자리</small></div>}
      <figcaption><span>{hero ? 'FIG. 00' : `FIG. 0${index + 1}`}</span>{photo?.caption || label}</figcaption>
    </figure>
  );
}

export default function KombuchaProject({ toolkitHref = '/toolkit', backHref = '/#projects' }) {
  const id = useId();
  const sections = ['data', 'insights', 'questions', 'future', 'toolkit'];
  const anchor = key => `${id}-${key}`;
  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <a className={styles.back} href={backHref}>← 프로젝트 목록</a>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>OTHER WAYS RESEARCH <span>MATERIAL LAB LOG #01</span></p>
          <h1>콤부차 바이오 셀룰로오스<br />배양 및 표면 염색성 탐구</h1>
          <p className={styles.intro}>물질을 만드는 대신,<br />물질이 자라날 조건을 디자인하기.</p>
          <div className={styles.meta}><span>재료 실험</span><span>배양 · 건조 · 염색</span><span>21일의 관찰 기록</span></div>
          <Photo photo={heroImage} label="콤부차 바이오 셀룰로오스의 표면과 결" hero />
          <div className={styles.mainQuestion}><span>THE STARTING QUESTION</span><blockquote>“플라스틱의 대체재를 디자인하는 것이 아니라,<br />생명체의 성장 메커니즘 자체를 구조체로 사용할 수 있을까?”</blockquote></div>
        </header>

        <nav className={styles.index} aria-label="프로젝트 목차">
          {['데이터', '발견', '질문', '다음 실험', '직접 적용하기'].map((title, i) => <a key={title} href={`#${anchor(sections[i])}`}><span>0{i + 1}</span>{title}</a>)}
        </nav>

        <section id={anchor('data')} className={styles.section} aria-labelledby={anchor('data-title')}>
          <div className={styles.sectionHeading}><p>01 / EXPERIMENTAL DATA</p><h2 id={anchor('data-title')}>손으로 확보한<br />관찰의 기록</h2></div>
          <div className={styles.sectionBody}>
            <p className={styles.lead}>배양에서 건조, 그리고 착색까지. 재료가 변하는 순간을 기록했습니다.</p>
            <dl className={styles.data}>{observations.map(([label, value, text]) => <div key={label}><dt>{label}</dt><dd><strong>{value}</strong><p>{text}</p></dd></div>)}</dl>
            <p className={styles.note}>이 기록은 이번 실험에서 관찰한 결과입니다. 두께와 수축률은 수치로 기록되지 않았습니다.</p>
          </div>
        </section>

        <div className={styles.gallery}>{stages.map((label, i) => <Photo key={label} photo={photos[i]} label={label} index={i} />)}</div>

        <section id={anchor('insights')} className={styles.section} aria-labelledby={anchor('insights-title')}>
          <div className={styles.sectionHeading}><p>02 / DISCOVERIES & INSIGHTS</p><h2 id={anchor('insights-title')}>재료가 바꾼<br />제작의 관점</h2></div>
          <div className={styles.sectionBody}>
            <div className={styles.insight}><span>INSIGHT 01</span><h3>규격화에 대한 저항</h3><p>공장에서 찍어내는 플라스틱과 달리, 바이오 셀룰로오스의 결은 온도·습도·용기 모양 등 환경에 따라 달라질 수 있습니다. 이번 실험에서 나타난 비정형적 변화는 균일한 형태를 전제로 했던 제작 방식에 질문을 던집니다.</p></div>
            <div className={styles.insight}><span>INSIGHT 02</span><h3>시간을 품는 물질</h3><p>물리적으로 조형하는 재료에서, 시간을 들여 자라나게 만드는 재료로. 제작자의 역할은 형태를 직접 만드는 것에서 성장의 조건을 설계하는 것으로 이동합니다.</p></div>
          </div>
        </section>

        <section id={anchor('questions')} className={styles.questions} aria-labelledby={anchor('questions-title')}>
          <p className={styles.eyebrow}>03 / QUESTIONS DERIVED</p><h2 id={anchor('questions-title')}>완성된 답보다,<br />다음으로 이어지는 질문.</h2>
          <div className={styles.questionList}>{questions.map((q, i) => <div key={q.topic}><span className={styles.questionNumber}>0{i + 1}</span><div><p className={styles.topic}>{q.topic}에 관한 질문</p><h3>{q.title}</h3><blockquote>{q.text}</blockquote></div></div>)}</div>
          <p className={styles.questionNote}>자연으로 돌아가는 조건과 기간은 다음 연구에서 확인할 주제입니다.</p>
        </section>

        <section id={anchor('future')} className={styles.section} aria-labelledby={anchor('future-title')}>
          <div className={styles.sectionHeading}><p>04 / FUTURE EXPERIMENTS</p><h2 id={anchor('future-title')}>이제, 무엇을<br />더 실험할까?</h2></div>
          <div className={styles.sectionBody}><p className={styles.lead}>이번 배양과 염색 관찰을 바탕으로, 형태·유연성·결합을 다음 실험으로 이어갑니다.</p>
            <ol className={styles.experiments}>{experiments.map(([title, text, observe], i) => <li key={title}><span>EXP. 0{i + 1} <em>계획</em></span><h3>{title}</h3><p>{text}</p><div className={styles.observe}><small>다음 관찰 포인트</small>{observe}</div></li>)}</ol>
          </div>
        </section>

        <section id={anchor('toolkit')} className={styles.cta} aria-labelledby={anchor('toolkit-title')}>
          <p>05 / THIS RESEARCH IN YOUR HANDS</p><h2 id={anchor('toolkit-title')}>이번엔, 당신의 재료에<br />질문을 던질 차례.</h2>
          <div><p>당신의 프로젝트에서도 상투적인 친환경 키워드 대신<br />본질적인 재료 질문을 던져보세요.</p><a href={toolkitHref}>10-Min Toolkit Vol.02 <span>[Question Frame]</span><b aria-hidden="true">↗</b></a></div>
        </section>
        <div className={styles.end}><span>OTHER WAYS / MATERIAL LAB LOG #01</span><a href={backHref}>프로젝트 목록으로 돌아가기 ↗</a></div>
      </div>
    </article>
  );
}
