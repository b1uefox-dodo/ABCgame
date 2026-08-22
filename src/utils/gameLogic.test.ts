import { describe, it, expect } from 'vitest';
import {
  findMatchingEasterEgg,
  pickUniqueDistractors,
  getNextItemIndex,
  getNumberSpawnCount
} from './gameLogic';
import { EASTER_EGG_WORDS } from '../data/gameData';

describe('gameLogic', () => {
  describe('findMatchingEasterEgg', () => {
    it('should match Easter egg at the end of buffer', () => {
      const result = findMatchingEasterEgg('XYZCAT');
      expect(result).toBeDefined();
      expect(result?.word).toBe('CAT');
    });

    it('should match lowercase or mixed case buffer', () => {
      const result = findMatchingEasterEgg('hellobus');
      expect(result).toBeDefined();
      expect(result?.word).toBe('BUS');
    });

    it('should return null when no egg word matches', () => {
      const result = findMatchingEasterEgg('HELLOPLAIN');
      expect(result).toBeNull();
    });

    it('should match all words defined in EASTER_EGG_WORDS', () => {
      for (const egg of EASTER_EGG_WORDS) {
        const result = findMatchingEasterEgg(`PREFIX${egg.word}`);
        expect(result?.word).toBe(egg.word);
      }
    });

    it('should handle empty buffer gracefully', () => {
      expect(findMatchingEasterEgg('')).toBeNull();
    });
  });

  describe('pickUniqueDistractors', () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    it('should return exactly the requested count of distractors', () => {
      const distractors = pickUniqueDistractors(letters, 'A', 3);
      expect(distractors).toHaveLength(3);
    });

    it('should not contain the target symbol', () => {
      for (let i = 0; i < 20; i++) {
        const distractors = pickUniqueDistractors(letters, 'B', 3);
        expect(distractors).not.toContain('B');
      }
    });

    it('should not contain duplicate distractors', () => {
      for (let i = 0; i < 20; i++) {
        const distractors = pickUniqueDistractors(letters, 'C', 3);
        const uniqueSet = new Set(distractors);
        expect(uniqueSet.size).toBe(distractors.length);
      }
    });

    it('should handle small pools by returning as many as available', () => {
      const smallPool = ['X', 'Y'];
      const distractors = pickUniqueDistractors(smallPool, 'X', 3);
      expect(distractors).toEqual(['Y']);
    });
  });

  describe('getNextItemIndex', () => {
    it('should cycle through 0 to totalItems - 1', () => {
      expect(getNextItemIndex(0, 4)).toBe(1);
      expect(getNextItemIndex(1, 4)).toBe(2);
      expect(getNextItemIndex(2, 4)).toBe(3);
      expect(getNextItemIndex(3, 4)).toBe(0);
    });
  });

  describe('getNumberSpawnCount', () => {
    it('should return 1 for 0', () => {
      expect(getNumberSpawnCount(0)).toBe(1);
    });

    it('should return clamped count up to 3 for numbers 1-9', () => {
      expect(getNumberSpawnCount(1)).toBe(1);
      expect(getNumberSpawnCount(2)).toBe(2);
      expect(getNumberSpawnCount(3)).toBe(3);
      expect(getNumberSpawnCount(7)).toBe(3);
    });
  });
});
