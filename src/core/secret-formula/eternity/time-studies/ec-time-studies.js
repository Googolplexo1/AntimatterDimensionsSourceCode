import { DC } from "../../../constants";

export const ecTimeStudies = [
  {
    id: 1,
    cost: 30,
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "вечностей",
      current: () => Currency.eternities.value,
      required: completions => new Decimal(20000 + Math.min(completions, Enslaved.isRunning ? 999 : 4) * 20000),
      formatValue: formatInt
    }
  },
  {
    id: 2,
    cost: 35,
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "ускорителей получено от Осколков Времени",
      current: () => player.totalTickGained,
      required: completions => 1300 + Math.min(completions, 4) * 150,
      formatValue: formatInt
    }
  },
  {
    id: 3,
    cost: 40,
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "8-х Измерений Антиматерии",
      current: () => AntimatterDimension(8).totalAmount,
      required: completions => new Decimal(17300 + Math.min(completions, 4) * 1250),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 4,
    cost: 70,
    requirement: [143],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "бесконечностей",
      current: () => Currency.infinitiesTotal.value,
      required: completions => new Decimal(1e8 + Math.min(completions, 4) * 2.5e7),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 5,
    cost: 130,
    requirement: [42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "Галактика",
      resource: " Антиматерии",
      current: () => player.galaxies,
      required: completions => 160 + Math.min(completions, 4) * 14,
      formatValue: formatInt
    }
  },
  {
    id: 6,
    cost: 85,
    requirement: [121],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "Галактик Репликанти",
      current: () => player.replicanti.galaxies,
      required: completions => 40 + Math.min(completions, 4) * 5,
      formatValue: formatInt
    }
  },
  {
    id: 7,
    cost: 115,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "антиматерии",
      current: () => Currency.antimatter.value,
      required: completions => DC.E300000.pow(Math.min(completions, 4)).times(DC.E500000),
      formatValue: value => format(value)
    }
  },
  {
    id: 8,
    cost: 115,
    requirement: [123],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "Очков Бесконечности",
      current: () => Currency.infinityPoints.value,
      required: completions => DC.E1000.pow(Math.min(completions, 4)).times(DC.E4000),
      formatValue: value => format(value)
    }
  },
  {
    id: 9,
    cost: 415,
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "Силы Бесконечности",
      current: () => Currency.infinityPower.value,
      required: completions => DC.E2000.pow(Math.min(completions, 4)).times(DC.E17500),
      formatValue: value => format(value)
    }
  },
  {
    id: 10,
    cost: 550,
    requirement: [181],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      word: "",
      resource: "Очков Вечности",
      current: () => Currency.eternityPoints.value,
      required: completions => DC.E20.pow(Math.min(completions, 4)).times(DC.E100),
      formatValue: value => format(value)
    }
  },
  {
    id: 11,
    cost: 1,
    requirement: [231, 232],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      path: "Антиматерии",
      forbiddenStudies: [72, 73],
    }
  },
  {
    id: 12,
    cost: 1,
    requirement: [233, 234],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      path: "Времени",
      forbiddenStudies: [71, 72],
    }
  }
];
