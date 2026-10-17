// 질문 데이터와 답변으로 일정한 폭의 PNG 실험 시트를 만듭니다.
const colors = {
  pink: '#f0bfd4', green: '#dde5b5', yellow: '#f4dc8f',
  blue: '#cddfea', peach: '#f0c9ad', cream: '#ece7d9',
};

export async function exportWorksheet({ title, question = '', number = '', toolkitId = 'experiment', color = 'pink', sections = [] }) {
  if (document.fonts?.ready) await document.fonts.ready;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable');
  const width = 1200;
  const margin = 88;
  const contentWidth = width - margin * 2;
  const font = 'Arial, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

  function wrap(value, size, maxWidth, weight = 400) {
    ctx.font = `${weight} ${size}px ${font}`;
    const lines = [];
    for (const paragraph of String(value).split('\n')) {
      let line = '';
      for (const char of Array.from(paragraph)) {
        if (line && ctx.measureText(line + char).width > maxWidth) {
          lines.push(line);
          line = char;
        } else line += char;
      }
      lines.push(line);
    }
    return lines;
  }

  const titleLines = wrap(title, 55, contentWidth, 600);
  const questionLines = question ? wrap(question, 34, contentWidth - 56) : [];
  const questionHeight = question ? 92 + questionLines.length * 48 : 0;
  const blocks = sections.map((section, index) => {
    const label = `${String(index + 1).padStart(2, '0')} / ${section.label}`;
    const labelLines = wrap(label, 18, contentWidth);
    const lines = wrap(section.value || '아직 작성하지 않았습니다.', 27, contentWidth - 16);
    return { ...section, labelLines, lines, height: labelLines.length * 28 + 50 + lines.length * 43 + 36 };
  });
  const start = 196 + titleLines.length * 72 + 24;
  const height = Math.max(1200, start + questionHeight + 44 + blocks.reduce((sum, block) => sum + block.height, 0) + 100);
  if (height > 30000) throw new Error('Worksheet is too tall for a single image');
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = '#f8f6ef';
  ctx.fillRect(0, 0, width, height);

  function text(value, x, y, size, color = '#292923', weight = 400) {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${font}`;
    ctx.fillText(value, x, y);
  }

  text('OTHER WAYS / 10-MIN TOOLKIT', margin, 83, 19);
  ctx.textAlign = 'right';
  text(`EXPERIMENT ${number || toolkitId}`, width - margin, 119, 16, '#77756b');
  ctx.textAlign = 'left';
  titleLines.forEach((line, index) => text(line, margin, 196 + index * 72, 55, '#292923', 600));
  let y = start;
  if (question) {
    ctx.fillStyle = colors[color] || colors.pink;
    ctx.fillRect(margin, y, contentWidth, questionHeight);
    text('START WITH A QUESTION', margin + 28, y + 42, 15, '#75415b');
    questionLines.forEach((line, index) => text(line, margin + 28, y + 94 + index * 48, 34));
    y += questionHeight;
  }
  y += 44;
  for (const block of blocks) {
    block.labelLines.forEach((line, index) => text(line, margin, y + 21 + index * 28, 18, '#a32972'));
    const ruleY = y + block.labelLines.length * 28 + 10;
    ctx.strokeStyle = '#d6d1c5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, ruleY);
    ctx.lineTo(width - margin, ruleY);
    ctx.stroke();
    block.lines.forEach((line, index) => text(line, margin + 8, ruleY + 46 + index * 43, 27, block.value ? '#292923' : '#9a968b'));
    y += block.height;
  }
  text('완벽한 답 대신, 다음 실험으로 이어지는 생각의 흔적.', margin, height - 52, 18, '#77756b');
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('PNG export failed');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeId = toolkitId.replace(/[^a-zA-Z0-9_-]/g, '-');
  link.download = `otherways-${safeId}.png`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
