import { EASTER_EGG_WORDS, EasterEggWord } from '../data/gameData';

/**
 * Checks if the typed buffer ends with any registered Easter Egg word.
 * Returns the matching EasterEggWord if found, or null otherwise.
 */
export function findMatchingEasterEgg(
  buffer: string,
  eggList: EasterEggWord[] = EASTER_EGG_WORDS
): EasterEggWord | null {
  if (!buffer) return null;
  const upperBuffer = buffer.toUpperCase();
  for (const egg of eggList) {
    if (upperBuffer.endsWith(egg.word.toUpperCase())) {
      return egg;
    }
  }
  return null;
}

/**
 * Picks a specified number of unique distractor symbols from a candidate pool,
 * ensuring none match the target symbol.
 */
export function pickUniqueDistractors(
  allSymbols: string[],
  targetSymbol: string,
  count: number = 3
): string[] {
  const pool = allSymbols.filter((s) => s.toUpperCase() !== targetSymbol.toUpperCase());
  const selected: string[] = [];

  while (selected.length < count && pool.length > 0) {
    const randIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool.splice(randIndex, 1)[0];
    selected.push(chosen);
  }

  return selected;
}

/**
 * Calculates the next index in a circular item array.
 */
export function getNextItemIndex(currentIndex: number, totalItems: number): number {
  if (totalItems <= 0) return 0;
  return (currentIndex + 1) % totalItems;
}

/**
 * Determines number of entities to spawn for number key press (1 to 3 for performance & visual clarity).
 */
export function getNumberSpawnCount(num: number): number {
  if (num <= 0) return 1;
  return Math.min(num, 3);
}
