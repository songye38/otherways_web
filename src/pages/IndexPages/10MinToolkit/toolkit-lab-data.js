export const labToolkits = [
  {
    id: 'exp-001',
    number: '01',
    category: 'Question',
    color: 'pink',
    mark: '↗',

    title: '결정권을\n넘겨주는 실험',
    description:
      '내가 설계한 서비스의 결정권 하나를 인간 밖으로 옮겨봅니다.',
    question:
      '사용자가 모든 것을 통제하지 않아도 좋은 경험이 될까?',
    outcome:
      '비인간의 리듬을 반영한 서비스 규칙 3개',

    durationMinutes: 10,
    materials: ['종이와 펜 또는 웹 입력'],
    pdfUrl: '',
    relatedArchiveIds: [],

    steps: [
      {
        id: 'find',
        title: '결정권 찾기',
        description:
          '자주 쓰는 서비스에서 사용자가 결정하는 행동을 찾아보세요.',
        durationMinutes: 2,

        questions: [
          {
            id: 'service',
            label: '내가 고른 서비스',
            type: 'text',
            placeholder: '예: 음악 추천 앱',
            required: true,
          },
          {
            id: 'decision',
            label: '원래 사용자가 결정하던 것',
            type: 'textarea',
            placeholder: '예: 오늘 들을 음악의 분위기를 내가 고른다.',
            required: true,
          },
        ],
      },

      {
        id: 'shift',
        title: '인간 밖으로 옮기기',
        description:
          '그 결정권을 다른 존재나 환경에 맡겨보세요.',
        durationMinutes: 3,

        questions: [
          {
            id: 'delegate',
            label: '누구 또는 무엇에게 맡길까요?',
            type: 'singleSelect',
            options: ['날씨', '동물', '시간', '식물'],
            allowCustom: true,
            required: true,
          },
        ],
      },

      {
        id: 'make',
        title: '새로운 규칙 만들기',
        description:
          '결정권을 옮겼을 때 생기는 새로운 규칙을 만들어보세요.',
        durationMinutes: 5,

        questions: [
          {
            id: 'rules',
            label: '새로운 서비스 규칙 3개',
            type: 'list',
            itemCount: 3,
            placeholder: '새로운 규칙을 적어주세요.',
            required: true,
          },
          {
            id: 'next',
            label: '다음으로 이어지는 질문',
            type: 'textarea',
            placeholder: '무엇을 더 확인해보고 싶나요?',
            required: false,
          },
        ],
      },
    ],
  },
    {
    id: 'exp-002',
    number: '02',
    category: 'Question',
    color: 'pink',
    mark: '↗',

    title: '결정권을\n넘겨주는 실험',
    description:
      '내가 설계한 서비스의 결정권 하나를 인간 밖으로 옮겨봅니다.',
    question:
      '사용자가 모든 것을 통제하지 않아도 좋은 경험이 될까?',
    outcome:
      '비인간의 리듬을 반영한 서비스 규칙 3개',

    durationMinutes: 10,
    materials: ['종이와 펜 또는 웹 입력'],
    pdfUrl: '',
    relatedArchiveIds: [],

    steps: [
      {
        id: 'find',
        title: '결정권 찾기',
        description:
          '자주 쓰는 서비스에서 사용자가 결정하는 행동을 찾아보세요.',
        durationMinutes: 2,

        questions: [
          {
            id: 'service',
            label: '내가 고른 서비스',
            type: 'text',
            placeholder: '예: 음악 추천 앱',
            required: true,
          },
          {
            id: 'decision',
            label: '원래 사용자가 결정하던 것',
            type: 'textarea',
            placeholder: '예: 오늘 들을 음악의 분위기를 내가 고른다.',
            required: true,
          },
        ],
      },

      {
        id: 'shift',
        title: '인간 밖으로 옮기기',
        description:
          '그 결정권을 다른 존재나 환경에 맡겨보세요.',
        durationMinutes: 3,

        questions: [
          {
            id: 'delegate',
            label: '누구 또는 무엇에게 맡길까요?',
            type: 'singleSelect',
            options: ['날씨', '동물', '시간', '식물'],
            allowCustom: true,
            required: true,
          },
        ],
      },

      {
        id: 'make',
        title: '새로운 규칙 만들기',
        description:
          '결정권을 옮겼을 때 생기는 새로운 규칙을 만들어보세요.',
        durationMinutes: 5,

        questions: [
          {
            id: 'rules',
            label: '새로운 서비스 규칙 3개',
            type: 'list',
            itemCount: 3,
            placeholder: '새로운 규칙을 적어주세요.',
            required: true,
          },
          {
            id: 'next',
            label: '다음으로 이어지는 질문',
            type: 'textarea',
            placeholder: '무엇을 더 확인해보고 싶나요?',
            required: false,
          },
        ],
      },
    ],
  },
];