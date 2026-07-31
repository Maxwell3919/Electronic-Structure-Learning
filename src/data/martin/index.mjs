import part01 from './part01.mjs';
import part02 from './part02.mjs';
import part03 from './part03.mjs';
import part04 from './part04.mjs';
import part05 from './part05.mjs';
import part06 from './part06.mjs';
import part07 from './part07.mjs';

export const martinStructure = {
  schemaVersion: 1,
  source: {
    title: 'Electronic Structure: Basic Theory and Practical Methods',
    author: 'Richard M. Martin',
    edition: '2nd edition',
    publisher: 'Cambridge University Press',
    year: 2020,
    doi: '10.1017/9781108555586',
    role: 'Primary theory spine',
  },
  frontMatter: [
    { id: 'preface', title: 'Preface', page: 'xix' },
    { id: 'acknowledgments', title: 'Acknowledgments', page: 'xxiv' },
    { id: 'notation', title: 'List of Notation', page: 'xxvi' },
  ],
  parts: [part01, part02, part03, part04, part05, part06, part07],
};

export default martinStructure;
