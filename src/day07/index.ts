import run from "aocrunner";

interface HandType {
  isValid: (hand: number[]) => boolean;
  value: number;
}

const handTypes: HandType[] = [
  // 5oaK
  {
    isValid: (hand) => {
      return hand.includes(5);
    },
    value: 6,
  },
  // 4oaK
  {
    isValid: (hand) => {
      return hand.includes(4);
    },
    value: 5,
  },
  // Full house
  {
    isValid: (hand) => {
      return hand.includes(3) && hand.includes(2);
    },
    value: 4,
  },
  // 3oaK
  {
    isValid: (hand) => {
      return hand.includes(3);
    },
    value: 3,
  },
  // 2P
  {
    isValid: (hand) => {
      return hand.filter((v) => v >= 2).length === 2;
    },
    value: 2,
  },
  // 1P
  {
    isValid: (hand) => {
      return hand.includes(2);
    },
    value: 1,
  },
  // High card
  {
    isValid: () => true,
    value: 0,
  },
];

const cardValueWithJoker: Record<string, number> = {
  A: 12,
  K: 11,
  Q: 10,
  T: 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
  J: 0,
};

const cardValue: Record<string, number> = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  "9": 7,
  "8": 6,
  "7": 5,
  "6": 4,
  "5": 3,
  "4": 2,
  "3": 1,
  "2": 0,
};

const parseInput = (rawInput: string, isPartTwo: boolean = false) => {
  const hands: {
    cards: string[];
    cardCounts: Record<string, number>;
    bid: number;
    handValue: number;
  }[] = [];
  for (const [cards, bid] of rawInput
    .split("\n")
    .map((line) => line.trim().split(" "))) {
    const cardCounts = {};
    for (const card of [...cards]) {
      if (cardCounts[card] === undefined) {
        cardCounts[card] = 1;
      } else {
        cardCounts[card] += 1;
      }
    }
    const flattenedHands: number[][] = [];
    if (isPartTwo) {
      const flattenedHand: number[] = Object.values({
        ...cardCounts,
        J: 0,
      }).filter((v) => v !== 0);
      const addJoker = (partialHand: number[]): number[][] => {
        if (partialHand.reduce((a, b) => a + b, 0) === 5) return [partialHand];
        let fullHands: number[][] = [];
        for (let i = 0; i <= partialHand.length; i += 1) {
          let clonedPartialHand = [...partialHand];
          if (i < clonedPartialHand.length) {
            clonedPartialHand[i] += 1;
          } else {
            clonedPartialHand.push(1);
          }
          for (const fullHand of addJoker(clonedPartialHand)) {
            fullHands.push(fullHand);
          }
        }
        return fullHands;
      };
      for (const fullHand of addJoker(flattenedHand)) {
        flattenedHands.push(fullHand);
      }
    } else {
      flattenedHands.push(Object.values(cardCounts));
    }
    const handTypeValue = Math.max(
      ...handTypes
        .filter((type) => flattenedHands.some((hand) => type.isValid(hand)))
        .map((type) => type.value),
    );
    const handCardValues = [...cards].map((card) =>
      isPartTwo ? cardValueWithJoker[card] : cardValue[card],
    );
    let totalHandValue = 0;
    totalHandValue += handTypeValue * 371293; // 13^5
    totalHandValue += handCardValues
      .map((value, index) => value * Math.pow(13, 4 - index))
      .reduce((a, b) => a + b, 0);
    hands.push({
      cardCounts,
      cards: [...cards],
      handValue: totalHandValue,
      bid: parseInt(bid),
    });
  }
  return hands;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  input.sort((a, b) => a.handValue - b.handValue); // ascending order of strength
  // console.log(
  //   input
  //     .map(
  //       (hand, idx) =>
  //         `${hand.cards.join("")} (${idx + 1}) => ${hand.handValue};`,
  //     )
  //     .join("\n"),
  // );
  return input
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput, true);
  input.sort((a, b) => a.handValue - b.handValue); // ascending order of strength
  return input
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
