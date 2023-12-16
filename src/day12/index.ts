import run from "aocrunner";
import { memoize } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const rows = rawInput.split("\n");
  const parsedRows: [string, number[]][] = [];
  for (const row of rows) {
    const [springs, segments] = row.split(" ");
    parsedRows.push([
      springs,
      segments.split(",").map((v) => parseInt(v.trim())),
    ]);
  }
  return parsedRows;
};

class PermutationCounter {
  groups: readonly number[];
  constructor(groups: readonly number[]) {
    this.groups = groups;
  }

  public _countValidPermutations(springs: string, group: number = 0): number {
    if (springs.charAt(0) === ".")
      return this.countValidPermutations(springs.slice(1), group);

    if (springs.charAt(0) === "?") {
      const workingCase = "." + springs.slice(1);
      const brokenCase = "#" + springs.slice(1);
      return (
        this.countValidPermutations(workingCase, group) +
        this.countValidPermutations(brokenCase, group)
      );
    }

    if (springs.charAt(0) === "#") {
      const nextGroupSize = this.groups[group];
      const nextGroup = springs.slice(0, nextGroupSize);
      const charAfter = springs.charAt(nextGroupSize);
      if (
        nextGroup.length === nextGroupSize &&
        charAfter !== "#" &&
        !nextGroup.includes(".")
      )
        return this.countValidPermutations(
          "." + springs.slice(nextGroupSize + 1),
          group + 1,
        );
      return 0;
    }

    return group === this.groups.length ? 1 : 0;
  }

  public countValidPermutations = memoize((s, g) => `${s}${g}`)(
    this._countValidPermutations,
  );
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;
  for (const [springs, groups] of input) {
    const permutationCounter = new PermutationCounter(groups);
    total += permutationCounter.countValidPermutations(springs);
  }

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const partTwoInput = input.map(
    ([s, g]) =>
      [`${s}?${s}?${s}?${s}?${s}`, [...g, ...g, ...g, ...g, ...g]] as [
        string,
        number[],
      ],
  );

  let total = 0;
  for (const [springs, groups] of partTwoInput) {
    const permutationCounter = new PermutationCounter(groups);
    total += permutationCounter.countValidPermutations(springs);
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
