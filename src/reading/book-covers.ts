export interface BookCover {
  id: 'martin' | 'sholl-steckel' | 'cohen-louie' | 'giustino' | 'liu-conceptual-dft';
  alt: string;
  localFilename: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceAuthorOrPublisher: string;
  retrievedDate: string;
  usageContext: string;
}

// The files are unaltered catalog covers except for the Giustino image, whose
// storefront whitespace was trimmed without changing the cover itself.
export const bookCovers: Record<BookCover['id'], BookCover> = {
  martin: {
    id: 'martin',
    alt: 'Cover of Richard M. Martin’s Electronic Structure: Basic Theory and Practical Methods, second edition.',
    localFilename: 'media/books/martin-electronic-structure-2e.jpg',
    sourceUrl: 'https://openlibrary.org/isbn/9781108555586',
    sourceTitle: 'Electronic Structure: Basic Theory and Practical Methods, second edition',
    sourceAuthorOrPublisher: 'Richard M. Martin; Cambridge University Press',
    retrievedDate: '2026-08-11',
    usageContext: 'Guided Reading book index',
  },
  'sholl-steckel': {
    id: 'sholl-steckel',
    alt: 'Cover of David S. Sholl and Janice A. Steckel’s Density Functional Theory: A Practical Introduction.',
    localFilename: 'media/books/sholl-steckel-dft-practical-introduction.jpg',
    sourceUrl: 'https://openlibrary.org/isbn/9780470373170',
    sourceTitle: 'Density Functional Theory: A Practical Introduction',
    sourceAuthorOrPublisher: 'David S. Sholl and Janice A. Steckel; Wiley',
    retrievedDate: '2026-08-11',
    usageContext: 'Guided Reading book index',
  },
  'cohen-louie': {
    id: 'cohen-louie',
    alt: 'Cover of Marvin L. Cohen and Steven G. Louie’s Fundamentals of Condensed Matter Physics.',
    localFilename: 'media/books/cohen-louie-fundamentals-condensed-matter.jpg',
    sourceUrl: 'https://openlibrary.org/isbn/9780521513319',
    sourceTitle: 'Fundamentals of Condensed Matter Physics',
    sourceAuthorOrPublisher: 'Marvin L. Cohen and Steven G. Louie; Cambridge University Press',
    retrievedDate: '2026-08-11',
    usageContext: 'Guided Reading book index',
  },
  giustino: {
    id: 'giustino',
    alt: 'Cover of Feliciano Giustino’s Materials Modelling Using Density Functional Theory: Properties and Predictions.',
    localFilename: 'media/books/giustino-materials-modelling-dft.jpg',
    sourceUrl: 'https://books.apple.com/us/book/materials-modelling-using-density-functional-theory/id878606946',
    sourceTitle: 'Materials Modelling Using Density Functional Theory: Properties and Predictions',
    sourceAuthorOrPublisher: 'Feliciano Giustino; Oxford University Press',
    retrievedDate: '2026-08-11',
    usageContext: 'Guided Reading book index',
  },
  'liu-conceptual-dft': {
    id: 'liu-conceptual-dft',
    alt: 'Cover of Conceptual Density Functional Theory: Towards a New Chemical Reactivity Theory, edited by Shubin Liu.',
    localFilename: 'media/books/liu-conceptual-density-functional-theory.jpg',
    sourceUrl: 'https://www.wiley-vch.de/en/areas-interest/natural-sciences/chemistry-11ch/computational-chemistry-molecular-modeling-11chd/conceptual-density-functional-theory-978-3-527-34843-5',
    sourceTitle: 'Conceptual Density Functional Theory: Towards a New Chemical Reactivity Theory',
    sourceAuthorOrPublisher: 'Shubin Liu (editor); Wiley-VCH',
    retrievedDate: '2026-08-11',
    usageContext: 'Guided Reading book index and Reference page',
  },
};
