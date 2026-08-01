import registry from './registry.mjs';
export const readingQueue = registry.filter((entry) => ['queued', 'reading'].includes(entry.readingStatus));
export default readingQueue;
