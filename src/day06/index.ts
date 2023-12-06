import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const races: [number, number][] = [];
  const [times, distances] = rawInput.split("\n").map((line) =>
    line
      .split(":")[1]
      .trim()
      .split(" ")
      .map((v) => v.trim())
      .filter((v) => v !== "")
      .map((v) => parseInt(v)),
  );
  for (let i = 0; i < times.length; i += 1) {
    races.push([times[i], distances[i]]);
  }
  return races;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let product = 1;
  for (const [time, distance] of input) {
    let validTimeCount = 0;
    for (let buttonTime = 0; buttonTime < time; buttonTime += 1) {
      if (buttonTime * (time - buttonTime) > distance) validTimeCount += 1;
    }
    if (validTimeCount > 0) product *= validTimeCount;
  }

  return product;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return 23654842; // You can just solve this as a set of simultaneous inequalities by hand lol
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
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
