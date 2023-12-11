import run from "aocrunner";

const parseInput = (rawInput: string, isPartTwo: boolean = false) => {
  const expansionFactor = (isPartTwo ? 1000000 : 2) - 1;

  const grid: Record<number, Record<number, string>> = {};
  const add = (r: number, c: number, char: string) => {
    if (!grid[r]) grid[r] = {};
    grid[r][c] = char;
  };

  const get = (r: number, c: number) => {
    return grid[r]?.[c] ?? ".";
  };

  const emptyRows: number[] = [];
  const emptyColumns: boolean[] = Array(rawInput.split("\n")[0].length)
    .fill(null)
    .map(() => true);

  rawInput.split("\n").forEach((line, r) => {
    if ([...line].every((char) => char === ".")) {
      emptyRows.push(r);
    }
    [...line].forEach((char, c) => {
      if (char !== ".") {
        emptyColumns[c] = false;
      }
    });
  });

  rawInput.split("\n").forEach((line, r) => {
    const effectiveRow =
      r + emptyRows.filter((row) => row < r).length * expansionFactor;
    [...line].forEach((char, c) => {
      const effectiveColumn =
        c +
        emptyColumns.filter((isEmpty, col) => col < c && isEmpty).length *
          expansionFactor;
      if (char !== ".") {
        add(effectiveRow, effectiveColumn, char);
      }
    });
  });

  return {
    grid,
    get,
  };
};

const part1 = (rawInput: string) => {
  const { grid, get } = parseInput(rawInput);

  const galaxies: [number, number][] = [];
  for (const r in grid) {
    for (const c in grid[r]) {
      if (get(+r, +c) === "#") {
        galaxies.push([+r, +c]);
      }
    }
  }

  const galaxyPairs: [[number, number], [number, number]][] = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      galaxyPairs.push([galaxies[i], galaxies[j]]);
    }
  }

  let distSum = 0;
  for (const [a, b] of galaxyPairs) {
    distSum += Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  return distSum;
};

const part2 = (rawInput: string) => {
  const { grid, get } = parseInput(rawInput, true);

  const galaxies: [number, number][] = [];
  for (const r in grid) {
    for (const c in grid[r]) {
      if (get(+r, +c) === "#") {
        galaxies.push([+r, +c]);
      }
    }
  }

  const galaxyPairs: [[number, number], [number, number]][] = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      galaxyPairs.push([galaxies[i], galaxies[j]]);
    }
  }

  let distSum = 0;
  for (const [a, b] of galaxyPairs) {
    distSum += Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  return distSum;
};

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 82000210,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
