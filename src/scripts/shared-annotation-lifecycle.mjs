const TEXT = 1;
const FREETEXT = 3;
const IMMEDIATE_TYPES = new Set([9, 10]); // highlight, underline
const PLACEHOLDER_CONTENTS = new Set(['insert text']);

export const isTextSharedAnnotation = (annotation) => (
  annotation.type === TEXT || annotation.type === FREETEXT
);

export const isFinalizedSharedAnnotation = (
  eventType,
  annotation,
) => {
  if (isTextSharedAnnotation(annotation)) {
    const contents = typeof annotation.contents === 'string' ? annotation.contents.trim() : '';
    return eventType === 'update' && contents.length > 0 && !PLACEHOLDER_CONTENTS.has(contents.toLowerCase());
  }
  return eventType === 'create' && IMMEDIATE_TYPES.has(annotation.type);
};
