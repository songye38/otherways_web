export const STORAGE_KEY = 'otherways-toolkit-editor-project-v2';

export function isEditableList(value) {
  return Array.isArray(value) && value.every(item =>
    item && typeof item.id === 'string' && typeof item.title === 'string'
    && Array.isArray(item.steps) && item.steps.every(step =>
      step && typeof step.id === 'string' && Array.isArray(step.questions)
      && step.questions.every(question => question && typeof question.id === 'string' && typeof question.type === 'string')
    )
  );
}

export function readDraft(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    return saved && isEditableList(saved.items) ? saved : null;
  } catch { return null; }
}

export function makeDraft(items, sourceFingerprint) {
  return { items, sourceFingerprint, savedAt: new Date().toISOString() };
}
