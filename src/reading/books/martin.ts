export type { MartinReadingPart, MartinReadingUnit } from './martin/model';
import { partI } from './martin/part-i';
import { partII } from './martin/part-ii';
import { partIII } from './martin/part-iii';
import { partIV } from './martin/part-iv';
import { partV } from './martin/part-v';
import { partVI } from './martin/part-vi';
import { partVII } from './martin/part-vii';

export const martinParts = [partI, partII, partIII, partIV, partV, partVI, partVII];
export const martinReadingUnits = martinParts.flatMap((part) => part.units);
export const martinReadingSlugs = [
  ...martinParts.map((part) => part.slug),
  ...martinReadingUnits.map((unit) => unit.slug),
];
