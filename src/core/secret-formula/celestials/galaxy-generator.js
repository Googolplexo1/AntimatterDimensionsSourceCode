const formatCost = c => format(c, 2);

const rebuyable = config => {
  const { id, description, cost, effect, formatEffect, currency, currencyLabel, currencyPostLabel } = config;
  return {
    id,
    description,
    cost: () => cost(player.celestials.pelle.rebuyables[id]),
    formatCost,
    effect: (x = player.celestials.pelle.rebuyables[id]) => effect(x),
    formatEffect,
    currency,
    currencyLabel,
    currencyPostLabel,
  };
};

export const pelleGalaxyGeneratorUpgrades = {
  additive: rebuyable({
    id: "galaxyGeneratorAdditive",
    description: "Увеличить производство галактик Генератором по умолчанию на две в секунду",
    cost: x => Math.pow(3, x),
    effect: x => x * 2,
    formatEffect: x => `${format(x, 2, 2)}/с`,
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "галактика",
    currencyPostLabel: ""
  }),
  multiplicative: rebuyable({
    id: "galaxyGeneratorMultiplicative",
    description: "Увеличить производство галактик Генератором в два с половиной раза",
    cost: x => Math.pow(10, x),
    effect: x => Decimal.pow(2.5, x),
    formatEffect: x => formatX(x, 2, 1),
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "галактика",
    currencyPostLabel: ""
  }),
  antimatterMult: rebuyable({
    id: "galaxyGeneratorAntimatterMult",
    description: "Удвоить производство галактик Генератором",
    cost: x => Decimal.pow("1e100000000", 10 ** x),
    effect: x => Decimal.pow(2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.antimatter,
    currencyLabel: "",
    currencyPostLabel: "антиматерии"
  }),
  IPMult: rebuyable({
    id: "galaxyGeneratorIPMult",
    description: "Удвоить производство галактик Генератором",
    cost: x => Decimal.pow("1e2000000", 100 ** x),
    effect: x => Decimal.pow(2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.infinityPoints,
    currencyLabel: "",
    currencyPostLabel: "Очков Бесконечности"
  }),
  EPMult: rebuyable({
    id: "galaxyGeneratorEPMult",
    description: "Удвоить производство галактик Генератором",
    cost: x => Decimal.pow("1e10000", 1000 ** x),
    effect: x => Decimal.pow(2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.eternityPoints,
    currencyLabel: "",
    currencyPostLabel: "Очков Вечности"
  }),
};
