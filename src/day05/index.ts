import run from "aocrunner";

const mapRange = (
  value: number,
  ranges: Set<[number, number, number]>,
): number => {
  for (const [targetStart, sourceStart, length] of ranges) {
    if (value >= sourceStart && value < sourceStart + length) {
      return targetStart + value - sourceStart;
    }
  }

  return value;
};

declare global {
  interface Number {
    mapRange(ranges: Set<[number, number, number]>): number;
  }
}

Number.prototype.mapRange = function (ranges) {
  return mapRange(this, ranges);
};

const parseInput = (rawInput: string) => {
  const seedSoilMaps = new Set<[number, number, number]>();
  const soilFertilizerMaps = new Set<[number, number, number]>();
  const fertilizerWaterMaps = new Set<[number, number, number]>();
  const waterLightMaps = new Set<[number, number, number]>();
  const lightTemperatureMaps = new Set<[number, number, number]>();
  const temperatureHumidityMaps = new Set<[number, number, number]>();
  const humidityLocationMaps = new Set<[number, number, number]>();
  const seeds: number[] = [];

  const [
    seedsText,
    seedToSoilMapText,
    soilToFertilizerMapText,
    fertilizerToWaterMapText,
    waterToLightMapText,
    lightToTemperatureMapText,
    temperatureToHumidityMapText,
    humidityToLocationMapText,
  ] = rawInput.split("\n\n");

  for (const seed of seedsText.split(":")[1].trim().split(" ")) {
    seeds.push(parseInt(seed.trim()));
  }

  function readSectionToMap(
    sectionText: string,
    map: Set<[number, number, number]>,
  ): void {
    for (const line of sectionText.split(":")[1].trim().split("\n")) {
      const [targetStart, sourceStart, length] = line
        .split(" ")
        .map((v: string) => parseInt(v.trim()));
      map.add([targetStart, sourceStart, length]);
    }
  }

  readSectionToMap(seedToSoilMapText, seedSoilMaps);
  readSectionToMap(soilToFertilizerMapText, soilFertilizerMaps);
  readSectionToMap(fertilizerToWaterMapText, fertilizerWaterMaps);
  readSectionToMap(waterToLightMapText, waterLightMaps);
  readSectionToMap(lightToTemperatureMapText, lightTemperatureMaps);
  readSectionToMap(temperatureToHumidityMapText, temperatureHumidityMaps);
  readSectionToMap(humidityToLocationMapText, humidityLocationMaps);

  const seedLocations: Map<number, number> = new Map();

  for (const seed of seeds) {
    seedLocations.set(
      seed,
      seed
        .mapRange(seedSoilMaps)
        .mapRange(soilFertilizerMaps)
        .mapRange(fertilizerWaterMaps)
        .mapRange(waterLightMaps)
        .mapRange(lightTemperatureMaps)
        .mapRange(temperatureHumidityMaps)
        .mapRange(humidityLocationMaps),
    );
  }

  const mapSeed = (seed: number): number =>
    seed
      .mapRange(seedSoilMaps)
      .mapRange(soilFertilizerMaps)
      .mapRange(fertilizerWaterMaps)
      .mapRange(waterLightMaps)
      .mapRange(lightTemperatureMaps)
      .mapRange(temperatureHumidityMaps)
      .mapRange(humidityLocationMaps);

  return {
    seeds,
    seedSoilMaps,
    soilFertilizerMaps,
    fertilizerWaterMaps,
    waterLightMaps,
    lightTemperatureMaps,
    temperatureHumidityMaps,
    humidityLocationMaps,
    seedLocations,
    mapSeed,
  };
};
const part1 = (rawInput: string) => {
  const { seedLocations } = parseInput(rawInput);

  return Math.min(...seedLocations.values());
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // We know that ranges can only map numbers 1:1
  // Thus necessarily, the lowest value must either be the bottom of a mapped range (e.g. a mapped seed->soil range)
  // or it must be the bottom of a range of seeds
  // We can count those and disregard other values to dramatically reduce our search space
  let pointsToCheck: number[] = [];

  // Check seeds
  for (let i = 0; i < input.seeds.length; i += 2) {
    pointsToCheck.push(input.seeds[i]);
  }

  // Check other ranges, and map them back to seeds
  const ranges = [
    input.seedSoilMaps,
    input.soilFertilizerMaps,
    input.fertilizerWaterMaps,
    input.waterLightMaps,
    input.lightTemperatureMaps,
    input.temperatureHumidityMaps,
    input.humidityLocationMaps,
  ];
  let currentLayerEntries: number[] = [];
  for (let layer = ranges.length - 1; layer >= 0; layer -= 1) {
    currentLayerEntries = currentLayerEntries.map((targetValue) => {
      for (const [targetStart, sourceStart, length] of ranges[layer]) {
        if (targetStart <= targetValue && targetStart + length > targetValue) {
          return targetValue + sourceStart - targetStart;
        }
      }
      return targetValue;
    });
    for (const [_, sourceStart] of ranges[layer]) {
      currentLayerEntries.push(sourceStart);
    }
  }
  currentLayerEntries.forEach((point) => pointsToCheck.push(point));

  return pointsToCheck
    .filter((pointToCheck) => {
      for (let i = 0; i < input.seeds.length; i += 2) {
        let [seedBase, seedLength] = input.seeds.slice(i, i + 2);
        if (seedBase <= pointToCheck && seedBase + seedLength > pointToCheck)
          return true;
      }
      return false;
    })
    .map((pointToCheck) => input.mapSeed(pointToCheck))
    .reduce((a, b) => Math.min(a, b));
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
