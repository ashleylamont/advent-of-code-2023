import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const games: {
    id: number;
    rounds: {
      blue: number;
      red: number;
      green: number;
    }[];
  }[] = [];
  for (const game of rawInput.split("\n")) {
    // Game n: x colour, y colour, z colour; ...
    const id = parseInt(game.split(" ")[1]);
    const rounds = [];
    for (const round of game.split(":")[1].split(";")) {
      const colours = round.split(",").map((c) => c.trim());
      let blue = 0;
      let red = 0;
      let green = 0;
      for (const colour of colours) {
        if (colour.includes("blue")) {
          blue = parseInt(colour.split(" ")[0]);
        } else if (colour.includes("red")) {
          red = parseInt(colour.split(" ")[0]);
        } else if (colour.includes("green")) {
          green = parseInt(colour.split(" ")[0]);
        }
      }
      rounds.push({ blue, red, green });
    }
    games.push({ id, rounds });
  }
  return games;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const maxRed = 12;
  const maxGreen = 13;
  const maxBlue = 14;

  let validGameIdSum = 0;
  for (const game of input) {
    let valid = true;
    for (const round of game.rounds) {
      if (
        round.red > maxRed ||
        round.green > maxGreen ||
        round.blue > maxBlue
      ) {
        valid = false;
        break;
      }
    }
    if (valid) {
      validGameIdSum += game.id;
    }
  }

  return validGameIdSum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let powerSum = 0;
  for (const game of input) {
    let maxRed = 0;
    let maxGreen = 0;
    let maxBlue = 0;
    for (const round of game.rounds) {
      maxRed = Math.max(maxRed, round.red);
      maxGreen = Math.max(maxGreen, round.green);
      maxBlue = Math.max(maxBlue, round.blue);
    }
    powerSum += maxRed * maxGreen * maxBlue;
  }

  return powerSum;
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
