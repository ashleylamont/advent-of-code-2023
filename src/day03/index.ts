import run from "aocrunner";

type Coordinate = [number, number];

type NumberObject = {
  type: "number";
  from: Coordinate;
  to: Coordinate;
  value: number;
};
type SymbolObject = {
  type: "symbol";
  position: Coordinate;
  value: string;
};

const parseInput = (rawInput: string) => {
  const objects: (NumberObject | SymbolObject)[] = [];

  const lines = rawInput.split("\n").map((v) => v.trim());

  for (let rowNum = 0; rowNum < lines.length; rowNum += 1) {
    const row = [...lines[rowNum]];
    let numberFrom: Coordinate | undefined = undefined;
    let numberValue: string | undefined = undefined;
    for (let colNum = 0; colNum < row.length; colNum += 1) {
      const cell = row[colNum];
      if (/\d/.test(cell)) {
        if (numberFrom === undefined) {
          numberFrom = [rowNum, colNum];
          numberValue = cell;
        } else {
          numberValue += cell;
        }
      } else {
        if (numberFrom !== undefined) {
          objects.push({
            type: "number",
            from: numberFrom,
            to: [rowNum, colNum - 1],
            value: parseInt(numberValue),
          });
          numberValue = undefined;
          numberFrom = undefined;
        }
        if (cell !== ".") {
          objects.push({
            type: "symbol",
            position: [rowNum, colNum],
            value: cell,
          });
        }
      }
    }
    if (numberFrom !== undefined) {
      objects.push({
        type: "number",
        from: numberFrom,
        to: [rowNum, row.length - 1],
        value: parseInt(numberValue),
      });
    }
  }

  return objects;
};

const line = (from: Coordinate, to: Coordinate): Coordinate[] => {
  // assume l->r rows only
  const out: Coordinate[] = [];
  for (let colNum = from[1]; colNum <= to[1]; colNum += 1) {
    out.push([from[0], colNum]);
  }
  return out;
};

const isAdjacent = (a: Coordinate, b: Coordinate): boolean =>
  Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const symbols = input.filter((v) => v.type === "symbol") as SymbolObject[];

  let numSum = 0;
  for (const number of input) {
    if (number.type !== "number") continue;
    const numberTiles = line(number.from, number.to);
    const hasAdjacentSymbol = symbols.some((s) =>
      numberTiles.some((t) => isAdjacent(s.position, t)),
    );
    if (hasAdjacentSymbol) {
      numSum += number.value;
    }
  }

  return numSum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const gears = input.filter(
    (v) => v.type === "symbol" && v.value === "*",
  ) as SymbolObject[];

  const numberAreas: [NumberObject, Coordinate[]][] = (
    input.filter((v) => v.type === "number") as NumberObject[]
  ).map((number) => [number, line(number.from, number.to)]);

  let gearRatioSum = 0;
  for (const gear of gears) {
    const adjacentNumbers = numberAreas.filter(([, area]) =>
      area.some((tile) => isAdjacent(tile, gear.position)),
    );
    if (adjacentNumbers.length === 2) {
      const [a, b] = adjacentNumbers;
      gearRatioSum += a[0].value * b[0].value;
    }
  }

  return gearRatioSum;
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
