import { describe, it, expect } from 'vitest';
import { transposeChord, transposeKey } from './musicUtils';

describe('musicUtils', () => {
  describe('transposeChord', () => {
    it('should transpose chords correctly', () => {
      expect(transposeChord('C', 2)).toBe('D');
      expect(transposeChord('G', -2)).toBe('F');
      expect(transposeChord('F#m7', 1)).toBe('Gm7');
      expect(transposeChord('Bbmaj7', 3)).toBe('C#maj7'); // Bb -> A# -> B -> C -> C#
      expect(transposeChord('C', -1)).toBe('B');
      expect(transposeChord('E', 1)).toBe('F');
      expect(transposeChord('B', 1)).toBe('C');
    });

    it('should return original chord if semitones is 0', () => {
      expect(transposeChord('C', 0)).toBe('C');
      expect(transposeChord('F#m7', 0)).toBe('F#m7');
    });

    it('should return original string if it is not a valid chord', () => {
      expect(transposeChord('Invalid', 2)).toBe('Invalid'); // Wait, 'Invalid' might match 'I' or something? No, regex is ^([A-G][#b]?)(.*) so it might match 'Invalid' as I wait wait A-G. I is not A-G. So no match.
      expect(transposeChord('Hmaj7', 2)).toBe('Hmaj7');
    });
  });

  describe('transposeKey', () => {
    it('should transpose keys correctly', () => {
      expect(transposeKey('C Major', 2)).toBe('D Major');
      expect(transposeKey('Am', -2)).toBe('Gm');
      expect(transposeKey('F# minor', 1)).toBe('G minor');
    });
  });
});
