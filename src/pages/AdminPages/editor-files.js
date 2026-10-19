export const INPUT_TYPES = ['text', 'textarea', 'singleSelect', 'multiSelect', 'list'];
export function validateToolkits(items) {
  const errors = [];
  if (!Array.isArray(items)) return ['툴킷 배열이 필요합니다.'];
  const toolkitIds = new Set();
  for (const item of items) {
    const prefix = item?.id || 'ID 없는 툴킷';
    if (!item || typeof item !== 'object') { errors.push('툴킷 항목은 객체여야 합니다.'); continue; }
    if (!/^exp-\d{3,}$/.test(item.id || '')) errors.push(`${prefix}: ID는 exp-001 형식이어야 합니다.`);
    for (const key of ['number','category','color','mark','description','question','outcome','pdfUrl']) { if (item[key] !== undefined && typeof item[key] !== 'string') errors.push(`${prefix}: ${key}는 문자열이어야 합니다.`); }
    if (item.relatedArchiveIds !== undefined && (!Array.isArray(item.relatedArchiveIds) || !item.relatedArchiveIds.every(x=>typeof x==='string'))) errors.push(`${prefix}: 관련 사례 ID는 문자열 목록이어야 합니다.`);
    if (toolkitIds.has(item.id)) errors.push(`${prefix}: 중복 ID입니다.`);
    toolkitIds.add(item.id);
    if (typeof item.title !== 'string' || !item.title.trim()) errors.push(`${prefix}: 제목을 입력하세요.`);
    if (!Number.isFinite(item.durationMinutes) || item.durationMinutes <= 0) errors.push(`${prefix}: 총 시간을 1분 이상 입력하세요.`);
    if (!Array.isArray(item.materials) || !item.materials.every(x=>typeof x==='string')) errors.push(`${prefix}: 준비물은 문자열 목록이어야 합니다.`);
    if (!Array.isArray(item.steps) || !item.steps.length) { errors.push(`${prefix}: 단계가 필요합니다.`); continue; }
    const stepIds = new Set();
    for (const step of item.steps) {
      if (!step || typeof step !== 'object') { errors.push(`${prefix}: 단계는 객체 형식이어야 합니다.`); continue; }
      if (typeof step.id !== 'string' || !step.id || stepIds.has(step.id)) errors.push(`${prefix}: 단계 ID가 비어 있거나 중복됩니다.`);
      stepIds.add(step.id);
      if (typeof step.title !== 'string' || !step.title.trim()) errors.push(`${prefix}: 단계 제목을 입력하세요.`);
      if (step.description !== undefined && typeof step.description !== 'string') errors.push(`${prefix}: 단계 안내는 문자열이어야 합니다.`);
      if (step.durationMinutes !== undefined && (!Number.isFinite(step.durationMinutes) || step.durationMinutes < 0)) errors.push(`${prefix}: 단계 시간을 확인하세요.`);
      if (!Array.isArray(step.questions) || !step.questions.length) { errors.push(`${prefix}: 각 단계에 질문이 하나 이상 필요합니다.`); continue; }
      const ids = new Set();
      for (const q of step.questions) {
        if (!q || typeof q !== 'object') { errors.push(`${prefix}: 질문은 객체 형식이어야 합니다.`); continue; }
        if (typeof q.id !== 'string' || !q.id || ids.has(q.id)) errors.push(`${prefix}: 같은 단계의 질문 ID가 비어 있거나 중복됩니다.`);
        ids.add(q.id);
        if (typeof q.label !== 'string' || !q.label.trim()) errors.push(`${prefix}: 질문 문구를 입력하세요.`);
        for (const key of ['placeholder','resultLabel','hint']) { if (q[key] !== undefined && typeof q[key] !== 'string') errors.push(`${prefix}: 질문의 ${key}는 문자열이어야 합니다.`); }
        if (!INPUT_TYPES.includes(q.type)) errors.push(`${prefix}: 지원하지 않는 입력 방식입니다.`);
        if (q.type === 'list' && (!Number.isInteger(q.itemCount) || q.itemCount < 1 || q.itemCount > 20)) errors.push(`${prefix}: 반복 입력은 1~20개로 지정하세요.`);
        if (q.type === 'singleSelect' || q.type === 'multiSelect') {
          const options = q.options;
          if (!Array.isArray(options) || !options.length || !options.every(x=>typeof x==='string' && x.trim())) errors.push(`${prefix}: 선택지를 한 개 이상 입력하세요.`);
          else if (new Set(options).size !== options.length) errors.push(`${prefix}: 중복 선택지를 정리하세요.`);
        }
      }
    }
  }
  return errors;
}
export function cleanToolkits(items) {
  return items.map(item=>({...item,steps:(item.steps||[]).map(step=>({...step,questions:(step.questions||[]).map(q=>({...q,...(Array.isArray(q.options)?{options:q.options.filter(x=>typeof x==='string' && x.trim()).map(x=>x.trim())}:{} )}))}))}));
}
export function parseToolkitFile(text) {
  const source = text.replace(/^\uFEFF/, '').trim();
  const match = source.match(/^export\s+const\s+labToolkits\s*=\s*([\s\S]*?);?\s*$/);
  const data = JSON.parse(match ? match[1] : source);
  const errors = validateToolkits(data);
  if (errors.length) throw new Error(errors.slice(0,3).join('\n'));
  return data;
}
export function serializeToolkits(items, format) {
  const clean = cleanToolkits(items);
  const errors = validateToolkits(clean);
  if (errors.length) throw new Error(errors.slice(0,3).join('\n'));
  const json = JSON.stringify(clean, null, 2);
  return format === 'json' ? json : `export const labToolkits = ${json};\n`;
}
