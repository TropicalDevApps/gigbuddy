const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const transposeChord = (chord: string, semitones: number): string => {
  if (semitones === 0) return chord;

  // Extract root and suffix (e.g., "F#m7" -> root: "F#", suffix: "m7")
  const match = chord.match(/^([A-G][#b]?)(.*)/);
  if (!match) return chord;

  const root = match[1];
  const suffix = match[2];

  // Standardize flats to sharps for lookup
  const flatMap: Record<string, string> = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
  const normalizedRoot = flatMap[root] || root;

  const index = notes.indexOf(normalizedRoot);
  if (index === -1) return chord;

  let newIndex = (index + semitones) % 12;
  while (newIndex < 0) newIndex += 12;

  return notes[newIndex] + suffix;
};

export const transposeKey = (key: string, semitones: number): string => {
  const [root, type] = key.split(' ');
  const transposedRoot = transposeChord(root, semitones);
  return `${transposedRoot}${type ? ' ' + type : ''}`;
};
