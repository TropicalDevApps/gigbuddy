import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes properly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500'); // tailwind-merge wins the later one
      expect(cn('p-4', { 'm-4': true, 'hidden': false })).toBe('p-4 m-4');
    });
  });
});
