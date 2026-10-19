export const labToolkits = [
  {
    id: 'exp-001',
    number: '01',
    category: 'Question',
    color: '#F4AE97',
    mark: '↝',

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
    color: '#A4B1E9',
    mark: '◌',

    title: '빠져 있는\n질문 찾기',
    description:
      '익숙한 서비스나 아이디어에서 저항하는 사람, 숨겨진 전제, 보이지 않는 빈칸을 찾아봅니다.',
    question:
      '새로운 아이디어를 더하는 대신, 지금 놓치고 있는 질문을 발견한다면?',
    outcome:
      '기존 아이디어를 다시 바라보게 하는 새로운 질문 1개',

    durationMinutes: 10,
    materials: ['종이와 펜 또는 웹 입력'],
    pdfUrl: '',
    relatedArchiveIds: ['09', '16'],

    steps: [
      {
        id: 'resistance',
        title: '저항하는 사람 찾기',
        description:
          '자주 사용하는 서비스나 지금 고민 중인 아이디어 하나를 고르고, 이를 예상과 다르게 사용하는 사람을 상상해보세요.',
        durationMinutes: 3,

        questions: [
          {
            id: 'service',
            label: '내가 고른 서비스 또는 아이디어',
            type: 'text',
            placeholder: '예: AI 뉴스 추천 서비스',
            required: true,
          },
          {
            id: 'resistantUser',
            label: '누가 이 서비스에 저항할까요?',
            type: 'textarea',
            placeholder:
              '예: 추천 알고리즘을 속이기 위해 관심 없는 기사를 일부러 클릭하는 사람',
            required: true,
          },
          {
            id: 'reason',
            label: '그 사람은 왜 그렇게 행동할까요?',
            type: 'textarea',
            placeholder:
              '예: 알고리즘이 자신의 관심사를 지나치게 단정하는 것이 싫어서',
            required: false,
          },
        ],
      },

      {
        id: 'assumption',
        title: '당연한 전제 뒤집기',
        description:
          '서비스에 숨어 있는 당연한 생각을 하나 찾고, 그 전제가 정반대라면 어떤 일이 생길지 상상해보세요.',
        durationMinutes: 3,

        questions: [
          {
            id: 'assumption',
            label: '당연하다고 생각했던 것은 무엇인가요?',
            type: 'textarea',
            placeholder:
              '예: 사람은 자신의 관심사와 비슷한 뉴스를 보고 싶어 한다.',
            required: true,
          },
          {
            id: 'reversedAssumption',
            label: '그 전제를 반대로 뒤집는다면?',
            type: 'textarea',
            placeholder:
              '예: 사람은 자신이 절대로 선택하지 않을 뉴스를 만나고 싶어 한다.',
            required: true,
          },
          {
            id: 'possibility',
            label: '어떤 새로운 가능성이 생길까요?',
            type: 'textarea',
            placeholder:
              '예: 익숙하지 않은 관점을 일부러 소개하는 뉴스 추천 서비스',
            required: false,
          },
        ],
      },

      {
        id: 'blindspot',
        title: '보이지 않는 빈칸 찾기',
        description:
          '서비스가 기록하거나 고려하지 않는 경험을 찾아보세요. 앞의 두 단계까지 돌아보며 새롭게 발견한 질문 하나를 남겨봅니다.',
        durationMinutes: 4,

        questions: [
          {
            id: 'missing',
            label: '무엇이 기록되거나 고려되지 않고 있나요?',
            type: 'list',
            itemCount: 3,
            placeholder:
              '예: 기사를 읽다가 닫아버린 이유',
            required: true,
          },
          {
            id: 'consequence',
            label: '이 빈칸을 AI나 시스템이 마음대로 채운다면?',
            type: 'textarea',
            placeholder:
              '예: 기사를 읽지 않은 이유를 관심이 없기 때문이라고 잘못 판단할 수 있다.',
            required: false,
          },
          {
            id: 'newQuestion',
            label: '이번 실험에서 새롭게 발견한 질문',
            type: 'textarea',
            placeholder:
              '예: 사용자가 선택하지 않은 이유까지 서비스가 이해해야 할까?',
            required: true,
          },
        ],
      },
    ],
  },

  {
    id: 'exp-003',
    number: '03',
    category: 'Future',
    color: '#BFA2E7',
    mark: '⤴',

    title: '미래를 한 걸음\n더 밀어보기',
    description:
      '하나의 변화에서 출발해 파장을 추적하고, 익숙한 미래 이미지를 지우고, 해결책 뒤에 숨겨진 문제를 찾아봅니다.',
    question:
      '처음 떠오른 미래에서 멈추지 않는다면 어떤 가능성이 보일까?',
    outcome:
      '미래의 연쇄적 변화 3개, 대안적 미래 장면 1개, 근본 질문 1개',

    durationMinutes: 10,
    materials: ['종이와 펜 또는 웹 입력'],
    pdfUrl: '',
    relatedArchiveIds: ['10', '14'],

    steps: [
      {
        id: 'ripple',
        title: '그다음에는?',
        description:
          '지금 일어나고 있는 변화 하나를 고르고, 그 변화가 가져올 다음 결과를 상상해보세요. "그래서 그다음에는?"을 세 번 반복합니다.',
        durationMinutes: 3,

        questions: [
          {
            id: 'change',
            label: '지금 일어나고 있는 변화',
            type: 'text',
            placeholder:
              '예: AI가 점점 더 많은 업무를 대신한다.',
            required: true,
          },
          {
            id: 'consequences',
            label: '그래서 그다음에는 어떤 일이 생길까요?',
            type: 'list',
            itemCount: 3,
            placeholder:
              '앞에서 일어난 변화의 다음 결과를 적어보세요.',
            required: true,
          },
        ],
      },

      {
        id: 'unlearn',
        title: '익숙한 미래 지우기',
        description:
          '내가 상상한 미래에 등장하는 익숙한 이미지를 찾아보세요. 그 이미지가 어디에서 왔는지 생각한 뒤, 미래에서 지워봅니다.',
        durationMinutes: 3,

        questions: [
          {
            id: 'familiarImage',
            label: '미래라고 하면 떠오르는 익숙한 모습',
            type: 'text',
            placeholder:
              '예: AI 비서와 대화하는 사무실',
            required: true,
          },
          {
            id: 'imageSource',
            label: '그 이미지는 어디에서 왔을까요?',
            type: 'singleSelect',
            options: [
              '영화·드라마',
              '광고',
              '테크 기업의 이미지',
              '뉴스·미디어',
              '일상 경험',
            ],
            allowCustom: true,
            required: false,
          },
          {
            id: 'alternativeFuture',
            label: '그 익숙한 이미지를 지운다면 어떤 미래가 가능할까요?',
            type: 'textarea',
            placeholder:
              '예: AI는 존재하지만 챗봇은 없다면? AI가 눈에 보이지 않는 환경의 일부로 작동한다면?',
            required: true,
          },
        ],
      },

      {
        id: 'reverse',
        title: '해결책에서 거꾸로 올라가기',
        description:
          '미래에 등장하는 해결책 하나를 선택하고, 그것이 왜 필요해졌는지 세 번 질문해보세요. 마지막으로 처음 상상한 미래를 다시 바라봅니다.',
        durationMinutes: 4,

        questions: [
          {
            id: 'solution',
            label: '미래에 등장하는 해결책',
            type: 'text',
            placeholder:
              '예: AI가 사람의 업무를 대신한다.',
            required: true,
          },
          {
            id: 'whys',
            label: '이 해결책은 왜 필요해졌을까요?',
            type: 'list',
            itemCount: 3,
            placeholder:
              '예: 일이 너무 많기 때문에',
            required: true,
          },
          {
            id: 'newQuestion',
            label: '처음에는 보이지 않았던 새로운 질문',
            type: 'textarea',
            placeholder:
              '예: AI가 일을 대신하는 것보다, 우리가 이렇게 많은 일을 해야 하는 이유를 먼저 바꿀 수는 없을까?',
            required: true,
          },
        ],
      },
    ],
  },


  {
    id: 'exp-004',
    number: '04',
    category: 'Question',
    color: '#A0CFB8',
    mark: '−',

    title: '당연한 규칙\n하나 지우기',
    description:
      '익숙한 서비스나 공간에서 당연하게 여겼던 규칙을 찾아 하나를 제거하고, 새로운 가능성을 상상해봅니다.',
    question:
      '당연하다고 생각했던 규칙 하나가 사라진다면 무엇이 달라질까?',
    outcome:
      '제거한 규칙 1개와 새로운 경험 아이디어 1개',

    durationMinutes: 10,
    materials: ['종이와 펜 또는 웹 입력'],
    pdfUrl: '',
    relatedArchiveIds: ['02', '03'],

    steps: [
      {
        id: 'choose',
        title: '하나 고르기',
        description:
          '평소 익숙하게 사용하는 서비스, 공간, 제품 또는 제도 하나를 골라보세요.',
        durationMinutes: 2,

        questions: [
          {
            id: 'subject',
            label: '내가 고른 대상',
            type: 'text',
            placeholder: '예: 도서관',
            required: true,
          },
        ],
      },

      {
        id: 'rules',
        title: '당연한 규칙 찾기',
        description:
          '선택한 대상에 반드시 있어야 한다고 생각하는 규칙을 세 가지 적어보세요. 너무 당연해서 평소에는 의심하지 않았던 규칙일수록 좋습니다.',
        durationMinutes: 3,

        questions: [
          {
            id: 'assumptions',
            label: '당연하다고 생각했던 규칙 3개',
            type: 'list',
            itemCount: 3,
            placeholder:
              '예: 도서관의 책은 분야별로 정리되어 있어야 한다.',
            required: true,
          },
        ],
      },

      {
        id: 'remove',
        title: '규칙 하나 지우기',
        description:
          '세 가지 규칙 중 하나를 골라 제거해보세요. 그 규칙이 아예 금지된 상황을 상상합니다.',
        durationMinutes: 2,

        questions: [
          {
            id: 'removedRule',
            label: '어떤 규칙을 지울까요?',
            type: 'textarea',
            placeholder:
              '예: 도서관에서 책을 분야별로 정리하는 것이 금지된다.',
            required: true,
          },
        ],
      },

      {
        id: 'reimagine',
        title: '새로운 모습 상상하기',
        description:
          '없어진 규칙을 다시 복구하지 않고, 그 상태에서 가능한 새로운 경험을 상상해보세요.',
        durationMinutes: 3,

        questions: [
          {
            id: 'newExperience',
            label: '규칙이 사라진 뒤 어떤 경험이 가능해질까요?',
            type: 'textarea',
            placeholder:
              '예: 책을 분야 대신 기분에 따라 배치해 예상하지 못한 책을 발견하게 한다.',
            required: true,
          },
          {
            id: 'newQuestion',
            label: '이번 실험에서 새롭게 발견한 질문',
            type: 'textarea',
            placeholder:
              '예: 책을 효율적으로 찾는 것보다 우연히 발견하는 경험이 더 중요한 도서관도 가능할까?',
            required: false,
          },
        ],
      },
    ],
  },


  {
    id: 'exp-005',
    number: '05',
    category: 'Question',
    color: '#EABC7C',
    mark: '∞',

    title: '물건과의 관계\n다시 상상하기',
    description:
      '익숙한 물건 하나를 돌봄, 감각, 가치의 관점에서 바라보고 새로운 관계의 규칙을 만들어봅니다.',
    question:
      '익숙한 물건과 관계 맺는 방식을 바꾼다면, 무엇이 달라질까?',
    outcome:
      '물건과 관계 맺는 새로운 규칙 1개',

    durationMinutes: 10,
    materials: ['주변의 물건 하나', '종이와 펜 또는 웹 입력'],
    pdfUrl: '',
    relatedArchiveIds: [],

    steps: [
      {
        id: 'choose',
        title: '물건 하나 선택하기',
        description:
          '지금 주변에 있는 평범한 물건 하나를 골라보세요. 평소 그 물건을 어떻게 사용하고 대하는지 생각해봅니다.',
        durationMinutes: 2,

        questions: [
          {
            id: 'object',
            label: '내가 선택한 물건',
            type: 'text',
            placeholder: '예: 컵, 책, 휴대전화, 가방, 의자',
            required: true,
          },
          {
            id: 'currentRelationship',
            label: '나는 평소 이 물건을 어떻게 대하고 있나요?',
            type: 'textarea',
            placeholder:
              '예: 컵은 물을 마실 때 사용하고, 사용한 뒤에는 씻어서 보관한다.',
            required: true,
          },
        ],
      },

      {
        id: 'rethink',
        title: '관계 뒤집기',
        description:
          '물건을 단순히 사용하는 대신 돌보고, 보이지 않던 상태를 감각으로 느끼고, 가격과 소유권이 아닌 다른 기준으로 가치를 판단한다면 어떨지 상상해보세요.',
        durationMinutes: 5,

        questions: [
          {
            id: 'care',
            label: '돌봄 — 이 물건을 돌봐야 하는 존재로 생각한다면?',
            type: 'textarea',
            placeholder:
              '예: 컵이 오랫동안 사용되지 않으면 자신을 돌봐달라는 신호를 보낸다. 어떤 돌봄을 요구할까?',
            required: false,
          },
          {
            id: 'sensation',
            label: '감각 — 물건이 자신의 상태나 이야기를 감각으로 전달한다면?',
            type: 'textarea',
            placeholder:
              '예: 컵이 사용된 시간과 경험을 온도나 진동으로 표현한다면?',
            required: false,
          },
          {
            id: 'value',
            label: '가치 — 가격과 소유권이 사라진다면 무엇이 가치를 결정할까요?',
            type: 'textarea',
            placeholder:
              '예: 컵을 소유한 사람이 아니라, 컵을 통해 나눈 대화와 추억이 가치를 결정한다면?',
            required: false,
          },
        ],
      },

      {
        id: 'invent',
        title: '새로운 관계 발명하기',
        description:
          '앞서 상상한 세 가지 관점 중 가장 흥미로운 아이디어 하나를 선택하고, 물건과 관계 맺는 새로운 규칙을 만들어보세요.',
        durationMinutes: 3,

        questions: [
          {
            id: 'newRole',
            label: '앞으로 이 물건은 어떤 존재인가요?',
            type: 'textarea',
            placeholder:
              '예: 앞으로 이 컵은 함께 보낸 시간을 기억하는 존재입니다.',
            required: true,
          },
          {
            id: 'humanAction',
            label: '이 물건과 관계 맺기 위해 사람은 무엇을 해야 하나요?',
            type: 'textarea',
            placeholder:
              '예: 사람은 컵을 사용할 때마다 자신의 이야기를 하나씩 남겨야 합니다.',
            required: true,
          },
          {
            id: 'newRule',
            label: '새로운 관계의 규칙을 한 문장으로 표현해보세요.',
            type: 'textarea',
            placeholder:
              '예: 이 컵의 가치는 얼마나 오래 소유했는지가 아니라, 얼마나 많은 이야기를 함께 나누었는지에 따라 결정된다.',
            required: true,
          },
        ],
      },
    ],
  },

];