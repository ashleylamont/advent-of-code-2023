import run from "aocrunner";
import chalk from "chalk";

interface Pipe {
  connectedTo: Pipe[];
  hasAnimal: boolean;
  _char: string;
  _location: [number, number];
}

const parseInput = (rawInput: string) => {
  const network: Pipe[] = [];
  const pipes: Map<number, Pipe> = new Map();
  // Get all pipes
  const tiles = rawInput.split("\n").map((line) => [...line]);
  const key = (r: number, c: number) => r * tiles[0].length + c;
  tiles.forEach((row, rowNumber) => {
    row.forEach((tile, colNumber) => {
      if (tile !== ".") {
        const pipe: Pipe = {
          connectedTo: [], // We'll do this later
          hasAnimal: tile === "S",
          _char: tile,
          _location: [rowNumber, colNumber],
        };
        pipes.set(key(rowNumber, colNumber), pipe);
        network.push(pipe);
      }
    });
  });
  // Connect all of the pipes now that they've been created
  tiles.forEach((row, rowNumber) => {
    row.forEach((tile, colNumber) => {
      if (tile !== ".") {
        const pipe = pipes.get(key(rowNumber, colNumber));
        const addConnection = (r: number, c: number) => {
          const connection = pipes.get(key(rowNumber + r, colNumber + c));
          if (connection === undefined) return;
          if (!pipe.connectedTo.includes(connection))
            pipe.connectedTo.push(connection);
          if (!connection.connectedTo.includes(pipe) && connection.hasAnimal)
            connection.connectedTo.push(pipe);
        };
        switch (tile) {
          case "|": {
            addConnection(-1, 0);
            addConnection(1, 0);
            break;
          }
          case "-": {
            addConnection(0, -1);
            addConnection(0, 1);
            break;
          }
          case "L": {
            addConnection(-1, 0);
            addConnection(0, 1);
            break;
          }
          case "J": {
            addConnection(-1, 0);
            addConnection(0, -1);
            break;
          }
          case "7": {
            addConnection(1, 0);
            addConnection(0, -1);
            break;
          }
          case "F": {
            addConnection(1, 0);
            addConnection(0, 1);
            break;
          }
        }
      }
    });
  });
  return [network, pipes, key] as const;
};

const part1 = (rawInput: string) => {
  const [input] = parseInput(rawInput);

  const startPipe = input.find((pipe) => pipe.hasAnimal);
  let longestDistance = 0;
  const visitedPipes: Set<Pipe> = new Set();
  visitedPipes.add(startPipe);
  const frontier: [Pipe, number][] = [];
  startPipe.connectedTo.forEach((connection) => {
    frontier.push([connection, 1]);
  });
  while (frontier.length) {
    const [nextPipe, currentDistance] = frontier.shift();
    if (visitedPipes.has(nextPipe)) continue;
    visitedPipes.add(nextPipe);
    for (const connection of nextPipe.connectedTo) {
      if (visitedPipes.has(connection)) continue;
      frontier.push([connection, currentDistance + 1]);
    }
    if (currentDistance > longestDistance) longestDistance = currentDistance;
  }
  return longestDistance;
};

const part2 = (rawInput: string) => {
  const [network, pipes, pipeKey] = parseInput(rawInput);

  const startPipe = network.find((pipe) => pipe.hasAnimal);
  const enclosure: Set<Pipe> = new Set();
  const frontier = [startPipe];
  while (frontier.length) {
    const next = frontier.shift();
    if (enclosure.has(next)) continue;
    for (const con of next.connectedTo) {
      if (enclosure.has(con)) continue;
      frontier.push(con);
    }
    enclosure.add(next);
  }
  let minRow = Math.min(
    ...[...enclosure.values()].map((pipe) => pipe._location[0]),
  );
  let maxRow = Math.max(
    ...[...enclosure.values()].map((pipe) => pipe._location[0]),
  );
  let minCol = Math.min(
    ...[...enclosure.values()].map((pipe) => pipe._location[1]),
  );
  let maxCol = Math.max(
    ...[...enclosure.values()].map((pipe) => pipe._location[1]),
  );
  let enclosedCount = 0;
  for (let rowNum = minRow; rowNum <= maxRow; rowNum++) {
    let rowText = "";
    let colNum = minCol;
    let isEnclosed = false;
    while (colNum <= maxCol) {
      let firstPipe = pipes.get(pipeKey(rowNum, colNum));
      if (!enclosure.has(firstPipe)) {
        firstPipe = undefined;
      }
      if (firstPipe) {
        let pipe = firstPipe;
        let nextPipe = pipes.get(pipeKey(rowNum, colNum + 1));
        while (pipe.connectedTo.includes(nextPipe)) {
          rowText += (isEnclosed ? chalk.yellow : chalk.blue)(pipe._char);
          pipe = nextPipe;
          nextPipe = pipes.get(pipeKey(rowNum, pipe._location[1] + 1));
        }
        const minConnectionRow = Math.min(
          ...firstPipe.connectedTo.map((c) => c._location[0]),
          ...pipe.connectedTo.map((c) => c._location[0]),
        );
        const maxConnectionRow = Math.max(
          ...firstPipe.connectedTo.map((c) => c._location[0]),
          ...pipe.connectedTo.map((c) => c._location[0]),
        );
        rowText += (isEnclosed ? chalk.yellow : chalk.blue)(pipe._char);
        if (maxConnectionRow - minConnectionRow === 2) isEnclosed = !isEnclosed;
        colNum = pipe._location[1] + 1;
      } else {
        rowText += (isEnclosed ? chalk.green : chalk.red)(".");
        if (isEnclosed) enclosedCount += 1;
        colNum += 1;
      }
    }
    console.log(rowText);
  }

  return enclosedCount;
};

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
        expected: 8,
      },
      {
        input: `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`,
        expected: 4,
      },
      {
        input: `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
