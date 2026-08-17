import type { PdfAnnotationObject } from '@embedpdf/snippet';

export type PersonalAnnotationRecord = {
  key: string;
  documentHash: string;
  annotationId: string;
  annotation: PdfAnnotationObject;
  updatedAt: string;
};

export type PersonalReadingState = {
  documentHash: string;
  paperId: string;
  lastPage: number;
  zoom: number;
  lastOpened: string;
  completed: boolean;
};

export const DB_NAME = 'electronic-structure-atlas-personal-annotations';
export const DB_VERSION = 2;
export const ANNOTATION_STORE = 'annotations';
export const READING_STATE_STORE = 'reading-state';
export const DOCUMENT_INDEX = 'documentHash';
export const PAPER_INDEX = 'paperId';

export const request = <T>(operation: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  operation.addEventListener('success', () => resolve(operation.result));
  operation.addEventListener('error', () => reject(operation.error ?? new Error('IndexedDB request failed.')));
});

export const transactionDone = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => {
  transaction.addEventListener('complete', () => resolve());
  transaction.addEventListener('abort', () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.')));
  transaction.addEventListener('error', () => reject(transaction.error ?? new Error('IndexedDB transaction failed.')));
});

export const openPersonalDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  const operation = indexedDB.open(DB_NAME, DB_VERSION);
  operation.addEventListener('upgradeneeded', () => {
    const database = operation.result;
    if (!database.objectStoreNames.contains(ANNOTATION_STORE)) {
      const store = database.createObjectStore(ANNOTATION_STORE, { keyPath: 'key' });
      store.createIndex(DOCUMENT_INDEX, DOCUMENT_INDEX, { unique: false });
    }
    if (!database.objectStoreNames.contains(READING_STATE_STORE)) {
      const store = database.createObjectStore(READING_STATE_STORE, { keyPath: 'documentHash' });
      store.createIndex(PAPER_INDEX, PAPER_INDEX, { unique: true });
    }
  });
  operation.addEventListener('success', () => resolve(operation.result));
  operation.addEventListener('error', () => reject(operation.error ?? new Error('IndexedDB is unavailable.')));
});

export const listPersonalAnnotations = async (database: IDBDatabase, documentHash: string) => {
  const transaction = database.transaction(ANNOTATION_STORE, 'readonly');
  const records = await request(
    transaction.objectStore(ANNOTATION_STORE).index(DOCUMENT_INDEX).getAll(documentHash),
  ) as PersonalAnnotationRecord[];
  await transactionDone(transaction);
  return records.sort((left, right) => left.annotationId.localeCompare(right.annotationId));
};

export const savePersonalAnnotationRecord = async (
  database: IDBDatabase,
  documentHash: string,
  annotation: PdfAnnotationObject,
) => {
  const transaction = database.transaction(ANNOTATION_STORE, 'readwrite', { durability: 'strict' });
  transaction.objectStore(ANNOTATION_STORE).put({
    key: `${documentHash}:${annotation.id}`,
    documentHash,
    annotationId: annotation.id,
    annotation,
    updatedAt: new Date().toISOString(),
  } satisfies PersonalAnnotationRecord);
  await transactionDone(transaction);
};

export const deletePersonalAnnotationRecord = async (
  database: IDBDatabase,
  documentHash: string,
  annotationId: string,
) => {
  const transaction = database.transaction(ANNOTATION_STORE, 'readwrite', { durability: 'strict' });
  transaction.objectStore(ANNOTATION_STORE).delete(`${documentHash}:${annotationId}`);
  await transactionDone(transaction);
};

export const getReadingState = async (database: IDBDatabase, documentHash: string) => {
  const transaction = database.transaction(READING_STATE_STORE, 'readonly');
  const state = await request(transaction.objectStore(READING_STATE_STORE).get(documentHash)) as PersonalReadingState | undefined;
  await transactionDone(transaction);
  return state ?? null;
};

export const listReadingStates = async (database: IDBDatabase) => {
  const transaction = database.transaction(READING_STATE_STORE, 'readonly');
  const states = await request(transaction.objectStore(READING_STATE_STORE).getAll()) as PersonalReadingState[];
  await transactionDone(transaction);
  return states.sort((left, right) => left.paperId.localeCompare(right.paperId));
};

export const saveReadingState = async (database: IDBDatabase, state: PersonalReadingState) => {
  const transaction = database.transaction(READING_STATE_STORE, 'readwrite', { durability: 'strict' });
  transaction.objectStore(READING_STATE_STORE).put(state);
  await transactionDone(transaction);
};
