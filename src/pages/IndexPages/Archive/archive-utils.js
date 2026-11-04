export function externalUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export const TAG_GROUPS = [
  { key: 'topics', label: '주제·대상' },
  { key: 'methods', label: '연구 방법' },
  { key: 'perspectives', label: '이론·관점' },
  { key: 'findings', label: '핵심 발견' },
];

export function getTagValues(item, group) {
  const values = item.tags?.[group];

  return Array.isArray(values) ? values : [];
}

export function filterArchive(
  items,
  {
    query = '',
    category = '',
    projectType = '',
    tags = {},
  } = {}
) {
  const words = query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return items.filter(item => {
    const allTags = TAG_GROUPS.flatMap(({ key }) =>
      getTagValues(item, key)
    );

    const text = [
      item.name,
      item.question,
      item.category,
      item.projectType,
      ...allTags,
    ]
      .join(' ')
      .toLocaleLowerCase();

    const matchesTags = TAG_GROUPS.every(({ key }) => {
      const selected = tags[key] || [];

      // 같은 항목 안에서는 OR, 서로 다른 항목 사이는 AND
      return (
        selected.length === 0 ||
        selected.some(tag => getTagValues(item, key).includes(tag))
      );
    });

    return (
      (!category || item.category === category) &&
      (!projectType || item.projectType === projectType) &&
      matchesTags &&
      words.every(word => text.includes(word))
    );
  });
}

// tags를 네개의 타입으로 분리하기 전의 기존 필터 함수
// export function filterArchive(items, { query = '', category = '', projectType = '',tags = [] } = {}) {
//   const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
//   return items.filter(item => {
//     const itemTags = item.tags || [];

//     const text = [
//       item.name,
//       item.question,
//       item.category,
//       item.projectType,
//       ...itemTags,
//     ].join(' ').toLocaleLowerCase();

//     return (
//       (!category || item.category === category) &&
//       (!projectType || item.projectType === projectType) &&
//       tags.every(tag => itemTags.includes(tag)) &&
//       words.every(word => text.includes(word))
//     );
//   });
// }