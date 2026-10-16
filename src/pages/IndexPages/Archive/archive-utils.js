export function externalUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
export function filterArchive(items, { query = '', category = '', tags = [] } = {}) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const itemTags = item.tags || [];
    const text = [item.name, item.question, item.category, ...itemTags].join(' ').toLocaleLowerCase();
    return (!category || item.category === category)
      && tags.every(tag => itemTags.includes(tag))
      && words.every(word => text.includes(word));
  });
}
