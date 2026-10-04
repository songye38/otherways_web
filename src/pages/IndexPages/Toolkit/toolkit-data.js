// image: public 폴더의 이미지 경로. href: 실제 상세/다운로드/구매 주소.
// 주소가 비어 있으면 '준비 중'으로 표시합니다. 가격과 배포 상태는 실제 값으로 변경하세요.
export const toolkits = [
  {
    id: '10-min-toolkit', name: '10-Min Toolkit', category: 'Starter Toolkit',
    tagline: '머릿속 생각을, 눈앞의 실체로.',
    description: '완벽주의에 갇힌 생각을 깨뜨리고, 질문·상상·실행의 프레임워크로 하루 10분의 작은 실험을 시작하는 입문 툴킷입니다.',
    image: '', imageAlt: '10-Min Toolkit 표지',
    tags: ['10분', '질문 · 상상 · 실행'], priceLabel: '공개 예정',
    href: '', linkLabel: '툴킷 살펴보기', featured: true,
  },
  {
    id: 'my-future-playbook', name: 'My Future Playbook', category: 'Playbook',
    tagline: '나만의 미래를 그리는 질문들.',
    description: '파편화된 생각을 넘어 나만의 고유한 미래 관점과 구체적인 로드맵을 깊이 있게 설계하는 실행서입니다.',
    image: '', imageAlt: 'My Future Playbook 표지',
    tags: ['미래 관점', '로드맵 설계'], priceLabel: '공개 예정',
    href: '', linkLabel: '플레이북 살펴보기', featured: true,
  },
  {
    id: 'lab-products', name: 'Lab Products', category: 'Lab Series',
    tagline: '정답 없는 세상에, 새로운 궤적을.',
    description: '자기만의 궤적을 만드는 창작자를 위해 OTHER WAYS 스튜디오가 선보이는 연구 라인업입니다.',
    image: '', imageAlt: 'Lab Products 연구 라인업',
    tags: ['연구', '실험'], priceLabel: '공개 예정',
    href: '', linkLabel: '라인업 살펴보기', featured: true,
  },
];
