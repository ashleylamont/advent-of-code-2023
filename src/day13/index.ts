import run from "aocrunner";
import { transpose } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n\n").map((v) => v.trim().split("\n"));
};

const getSymmetryMasks = (rows: string[]) => {
  const masks: number[][][] = Array(rows[0].length - 1)
    .fill(null)
    .map(() => []);
  for (const row of rows) {
    for (let symColumn = 0; symColumn < rows[0].length - 1; symColumn++) {
      const symLength = Math.min(symColumn + 1, rows[0].length - symColumn - 1);
      const fNum = row.slice(symColumn - symLength + 1, symColumn + 1);
      const bNum = [...row.slice(symColumn + 1, symColumn + symLength + 1)]
        .reverse()
        .join("");
      const mask = [...fNum].flatMap((c, i) => (c === bNum[i] ? [] : [i]));
      masks[symColumn].push(mask);
    }
  }
  return masks.map((maskCol) => maskCol.flat().length);
};

const part1 = (rawInput: string) => {
  const patterns = parseInput(rawInput);

  let total = 0;
  for (const pattern of patterns) {
    // Vertical symmetry
    const rows = pattern;
    const rowMasks = getSymmetryMasks(rows);
    if (rowMasks.includes(0)) {
      total += rowMasks.indexOf(0) + 1;
    }

    // Horizontal Symmetry
    const cols = transpose(rows.map((r) => [...r])).map((c) => c.join(""));
    const colMasks = getSymmetryMasks(cols);
    if (colMasks.includes(0)) {
      total += (colMasks.indexOf(0) + 1) * 100;
    }
  }

  return total;
};

const part2 = (rawInput: string) => {
  const patterns = parseInput(rawInput);

  let total = 0;
  for (const pattern of patterns) {
    // Vertical symmetry
    const rows = pattern;
    const rowMasks = getSymmetryMasks(rows);
    if (rowMasks.includes(1)) {
      total += rowMasks.indexOf(1) + 1;
    }

    // Horizontal Symmetry
    const cols = transpose(rows.map((r) => [...r])).map((c) => c.join(""));
    const colMasks = getSymmetryMasks(cols);
    if (colMasks.includes(1)) {
      total += (colMasks.indexOf(1) + 1) * 100;
    }
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
