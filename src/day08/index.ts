import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [steps, areas] = rawInput.split("\n\n").map((v) => v.trim());
  const areaMap: Record<string, [string, string]> = Object.fromEntries(
    areas.split("\n").map((area) => {
      const [[current], [left, right]] = area.split("=").map((part) =>
        part
          .replace("(", "")
          .replace(")", "")
          .split(",")
          .map((v) => v.trim()),
      );
      return [current, [left, right]];
    }),
  );
  return { steps, areaMap };
};

function* pathIterator(
  startLoc: string,
  path: string,
  areaMap: Record<string, [string, string]>,
  isPartTwo: boolean = true,
): IterableIterator<[string, number]> {
  let loc = startLoc;
  let stepCount = 0;
  const locVal = () => (isPartTwo ? `${stepCount % path.length}:${loc}` : loc);
  yield [locVal(), stepCount];
  while (true) {
    const nextStep = path.charAt(stepCount % path.length);
    stepCount += 1;
    loc = areaMap[loc][nextStep === "L" ? 0 : 1];
    yield [locVal(), stepCount];
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  for (const [loc, count] of pathIterator(
    "AAA",
    input.steps,
    input.areaMap,
    false,
  )) {
    if (loc === "ZZZ") return count;
  }
};

const primeFactors = (number: number): Record<number, number> => {
  let n = number;
  const factors = {};
  while (n % 2 === 0) {
    n /= 2;
    factors[2] = (factors[2] ?? 0) + 1;
  }
  while (n > 1) {
    let divisor = 3;
    while (n % divisor !== 0) divisor += 2;
    n /= divisor;
    factors[divisor] = (factors[divisor] ?? 0) + 1;
  }
  return factors;
};

const lcm = (numbers: number[]): number => {
  const factors = numbers.map((num) => primeFactors(num));
  const factorSet = new Set();
  for (const numberFactors of factors) {
    for (const factor of Object.keys(numberFactors)) {
      factorSet.add(factor);
    }
  }
  const maxFactors = Object.fromEntries(
    [...factorSet.keys()].map((factor: number) => [
      factor,
      Math.max(...factors.map((f) => f[factor] ?? 0)),
    ]),
  );
  let lcmValue = 1;
  for (const [factor, count] of Object.entries(maxFactors)) {
    lcmValue *= Math.pow(parseInt(factor), count);
  }
  return lcmValue;
};

const getCycle = (
  startLoc: string,
  path: string,
  areaMap: Record<string, [string, string]>,
  validEndTest: (loc: string) => boolean = (loc) => loc.endsWith("Z"),
): {
  delay: number;
  length: number;
  validEnds: number[];
} => {
  const tortoise = pathIterator(startLoc, path, areaMap);
  const hare = pathIterator(startLoc, path, areaMap);
  // Skip 0th position
  tortoise.next();
  hare.next();
  let nextTortoise = tortoise.next().value;
  hare.next();
  let nextHare = hare.next().value;
  while (nextTortoise[0] !== nextHare[0]) {
    nextTortoise = tortoise.next().value;
    hare.next();
    nextHare = hare.next().value;
  }
  let delay = 0;
  const secondTortoise = pathIterator(startLoc, path, areaMap);
  nextTortoise = secondTortoise.next().value;
  while (nextTortoise[0] !== nextHare[0]) {
    nextTortoise = secondTortoise.next().value;
    nextHare = hare.next().value;
    delay += 1;
  }
  let cycleStart = nextTortoise[0];
  let cycleStartStep = nextTortoise[1];
  nextTortoise = tortoise.next().value;
  while (nextTortoise[0] !== cycleStart) {
    nextTortoise = tortoise.next().value;
  }
  const cycleLength = nextTortoise[1] - cycleStartStep;
  const validEndsIterator = pathIterator(startLoc, path, areaMap);
  const validEnds: number[] = [];
  for (const [loc, step] of validEndsIterator) {
    if (step >= cycleLength + delay) break;
    if (step < delay) continue;
    if (validEndTest(loc)) validEnds.push(step - delay);
  }

  return {
    delay,
    length: cycleLength,
    validEnds,
  };
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const startPoints = Object.keys(input.areaMap).filter((loc) =>
    loc.endsWith("A"),
  );
  const startCycles = startPoints.map((loc) =>
    getCycle(loc, input.steps, input.areaMap),
  );
  const combinedLength = lcm(startCycles.map((c) => c.length));
  const minDelay = Math.max(...startCycles.map((c) => c.delay));
  const validPointsInCombinedLength: Record<string, number> = {};
  // let cycleCount = 0;
  // for (const cycle of startCycles) {
  //   const iterationCount = combinedLength / cycle.length;
  //   for (const validPoint of cycle.validEnds) {
  //     for (let iteration = 0; iteration < iterationCount; iteration += 1) {
  //       let offsetPoint = validPoint + cycle.delay + cycle.length * iteration;
  //       validPointsInCombinedLength[offsetPoint] =
  //         (validPointsInCombinedLength[offsetPoint] ?? 0) + 1;
  //     }
  //     console.log("Point");
  //   }
  //   cycleCount += 1;
  // }
  // for (const [validPoint, count] of Object.entries(
  //   validPointsInCombinedLength,
  // )) {
  //   const vp = parseInt(validPoint);
  //   if (vp < minDelay) continue;
  //   if (count < startCycles.length) continue;
  //   return vp;
  // }
  // return -1;

  // ok you know what, fuck this, I googled it and apparently you can just meme non-general-solution do it with LCM over the time to reach Z because the inputs are all specially formed to allow that
  // wtf???
  return lcm(startCycles.map((c) => c.delay + c.validEnds[0]));
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
