import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (const line of input.split("\n")) {
    let firstDigit = "";
    let lastDigit = "";
    for (const char of line) {
      if (char >= "0" && char <= "9") {
        if (firstDigit === "") {
          firstDigit = char;
        }
        lastDigit = char;
      }
    }
    sum += parseInt(firstDigit + lastDigit);
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (const line of input.split("\n")) {
    let firstDigit = "";
    let lastDigit = "";
    // This is a bit of a hack, but it works
    // Having the string on either side of the number makes sure that overlapping numbers are counted
    const parsedLine = line
      .replaceAll("one", "one1one")
      .replaceAll("two", "two2two")
      .replaceAll("three", "three3three")
      .replaceAll("four", "four4four")
      .replaceAll("five", "five5five")
      .replaceAll("six", "six6six")
      .replaceAll("seven", "seven7seven")
      .replaceAll("eight", "eight8eight")
      .replaceAll("nine", "nine9nine");
    for (const char of parsedLine) {
      if (char >= "0" && char <= "9") {
        if (firstDigit === "") {
          firstDigit = char;
        }
        lastDigit = char;
      }
    }
    sum += parseInt(firstDigit + lastDigit);
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 77,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
