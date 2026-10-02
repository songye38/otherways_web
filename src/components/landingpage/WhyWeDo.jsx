import styles from './WhyWeDo.module.css';

export default function WhyWeDo() {
  return (
    <section className={styles.section} aria-labelledby="why-title">
      <header className={styles.heading}>
        <p className={styles.label}>WHY WE DO</p>

        <p className={styles.headTitle} id="why-title">
          정해진 정답을 고분고분 따라가는 시대는 끝났습니다
        </p>
      </header>

      <div className={styles.content}>
        <p>
          세상이 제시하는 획일화된 궤적과 뻔한 트렌드 속에서
          많은 창작자들이 자신만의 결과 관점을 잃어가고 있습니다.
          우리는 정답을 거부하고, 자기만의 질문과 실행으로
          내일의 궤적을 만들어가는 주도적 창작자들이
          끝까지 자기 길을 갈 수 있도록 돕기 위해 존재합니다.
        </p>
      </div>
    </section>
  );
}