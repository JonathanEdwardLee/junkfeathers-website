export const regions = [
  { id: "upper", label: "Upper", low: 0, high: 8 },
  { id: "middle", label: "Middle", low: 6, high: 16 },
  { id: "lower", label: "Lower", low: 14, high: 24 },
  { id: "upper-middle", label: "Upper + middle", low: 0, high: 16 },
  { id: "middle-lower", label: "Middle + lower", low: 6, high: 24 },
  { id: "full", label: "Full neck", low: 0, high: 24 },
] as const;

export const patterns = {
  "Scale steps": [0],
  "Groups of three": [0, 1, 2],
  "Groups of four": [0, 1, 2, 3],
  "Diatonic thirds": [0, 2],
  "Triad outlines": [0, 2, 4],
} as const;
export type Pattern = keyof typeof patterns;
type Note = { midi: number; string: number; fret: number };
export function makeExercise(
  key: number,
  degrees: number[],
  low: number,
  high: number,
  direction: string,
  pattern: Pattern,
): Note[] {
  const tuning = [40, 45, 50, 55, 59, 64];
  const pitches = new Map<number, Note>();
  // A diagonal route moves from nut-side bass notes to body-side treble notes.
  // Score alternate fingerings against that route so repeated pitches stay put.
  for (const [string, open] of tuning.entries()) {
    for (let fret = low; fret <= high; fret++) {
      const midi = open + fret;
      if (!degrees.includes((midi - key + 12) % 12)) continue;
      const progress =
        (midi - tuning[0] - low) / (tuning[5] + high - tuning[0] - low);
      const target = low + progress * (high - low);
      const old = pitches.get(midi);
      if (!old || Math.abs(fret - target) < Math.abs(old.fret - target)) {
        pitches.set(midi, { string, fret, midi });
      }
    }
  }
  const ascending = [...pitches.values()].sort((a, b) => a.midi - b.midi);
  const offsets = patterns[pattern];
  function phrase(notes: Note[]) {
    const starts = notes.length - offsets[offsets.length - 1];
    return notes
      .slice(0, starts)
      .flatMap((_, i) => offsets.map((n) => notes[i + n]));
  }
  const descending = [...ascending].reverse();
  if (direction === "Ascending") return phrase(ascending);
  if (direction === "Descending") return phrase(descending);
  // The two turning notes are already present on the other leg of the loop.
  return [...phrase(ascending), ...phrase(descending).slice(1, -1)];
}
