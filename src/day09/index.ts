import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const sequences: number[][] = [];
  for (const line of rawInput.split("\n")) {
    sequences.push(line.split(" ").map((v) => parseInt(v.trim())));
  }
  return sequences;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let nextDigits: number[] = [];

  for (const sequence of input) {
    const derivatives: number[][] = [];
    // Get first derivative
    let firstDerivative: number[] = [];
    for (let i = 0; i < sequence.length - 1; i++) {
      firstDerivative.push(sequence[i + 1] - sequence[i]);
    }
    derivatives.push(firstDerivative);
    // Get remaining until all 0
    while (derivatives.at(-1).some((v) => v !== 0)) {
      let nextDerivative: number[] = [];
      let lastDerivative = derivatives.at(-1);
      for (let i = 0; i < lastDerivative.length - 1; i++) {
        nextDerivative.push(lastDerivative[i + 1] - lastDerivative[i]);
      }
      derivatives.push(nextDerivative);
    }
    let nextDigit = 0;
    for (let i = derivatives.length - 1; i >= 0; i--) {
      nextDigit = nextDigit + derivatives[i].at(-1);
    }
    nextDigits.push(nextDigit + sequence.at(-1));
  }

  return nextDigits.reduce((a, b) => a + b);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let prevDigits: number[] = [];

  for (const sequence of input) {
    const derivatives: number[][] = [];
    // Get first derivative
    let firstDerivative: number[] = [];
    for (let i = 0; i < sequence.length - 1; i++) {
      firstDerivative.push(sequence[i + 1] - sequence[i]);
    }
    derivatives.push(firstDerivative);
    // Get remaining until all 0
    while (derivatives.at(-1).some((v) => v !== 0)) {
      let nextDerivative: number[] = [];
      let lastDerivative = derivatives.at(-1);
      for (let i = 0; i < lastDerivative.length - 1; i++) {
        nextDerivative.push(lastDerivative[i + 1] - lastDerivative[i]);
      }
      derivatives.push(nextDerivative);
    }
    let prevDigit = 0;
    for (let i = derivatives.length - 1; i >= 0; i--) {
      prevDigit = derivatives[i][0] - prevDigit;
    }
    prevDigits.push(sequence[0] - prevDigit);
  }

  return prevDigits.reduce((a, b) => a + b);
};

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
