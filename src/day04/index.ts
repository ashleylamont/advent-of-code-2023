import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const cards: [number[], number[]][] = [];
  const lines = rawInput.split("\n").map((v) => v.split(":")[1].trim());
  for (const line of lines) {
    const [left, right] = line.split("|").map((v) => v.trim());
    cards.push([
      left
        .split(" ")
        .filter((v) => v.trim() !== "")
        .map((v) => parseInt(v.trim())),
      right
        .split(" ")
        .filter((v) => v.trim() !== "")
        .map((v) => parseInt(v.trim())),
    ]);
  }
  return cards;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let cardScoreSum = 0;
  for (const [left, right] of input) {
    let matchCount = 0;
    for (const card of left) {
      if (right.includes(card)) {
        matchCount += 1;
      }
    }
    if (matchCount > 0) {
      cardScoreSum += Math.pow(2, matchCount - 1);
    }
  }

  return cardScoreSum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cardCounts: number[] = Array(input.length)
    .fill(null)
    .map(() => 1);
  input.forEach(([left, right], i) => {
    const matchCount = left.filter((v) => right.includes(v)).length;
    if (matchCount > 0) {
      for (let j = 0; j < matchCount; j++) {
        cardCounts[i + j + 1] += cardCounts[i];
      }
    }
  });

  return cardCounts.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
