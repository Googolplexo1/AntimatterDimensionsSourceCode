const formatCost = c => format(c, 2);
// eslint-disable-next-line max-params
const expWithIncreasedScale = (base1, base2, incScale, coeff, x) =>
  Decimal.pow(base1, x).times(Decimal.pow(base2, x - incScale).max(1)).times(coeff);

const rebuyable = config => {
  const { id, description, cost, effect, formatEffect, cap } = config;
  return {
    id,
    description,
    cost: () => expWithIncreasedScale(...cost, player.celestials.pelle.rebuyables[id]),
    formatCost,
    cap,
    effect: (x = player.celestials.pelle.rebuyables[id]) => effect(x),
    formatEffect,
    rebuyable: true
  };
};

export const pelleUpgrades = {
  antimatterDimensionMult: rebuyable({
    id: "antimatterDimensionMult",
    description: "Множитель к Измерениям Антиматерии",
    cost: [10, 1e3, 41, 100],
    effect: x => Pelle.antimatterDimensionMult(x),
    formatEffect: x => formatX(x, 2, 2),
    cap: 44
  }),
  timeSpeedMult: rebuyable({
    id: "timeSpeedMult",
    description: "Множитель к скорости игры",
    cost: [20, 1e3, 30, 1e5],
    effect: x => Decimal.pow(1.3, x),
    formatEffect: x => formatX(x, 2, 2),
    cap: 35
  }),
  glyphLevels: rebuyable({
    id: "glyphLevels",
    description: "Увеличить ограничение Пелля на фактические уровни глифов",
    cost: [30, 1e3, 25, 1e15],
    effect: x => Math.floor(((3 * (x + 1)) - 2) ** 1.6),
    formatEffect: x => formatInt(x),
    cap: 26
  }),
  infConversion: rebuyable({
    id: "infConversion",
    description: "Увеличить степень эффекта Силы Бесконечности",
    cost: [40, 1e3, 20, 1e18],
    effect: x => (x * 3.5) ** 0.37,
    formatEffect: x => `+${format(x, 2, 2)}`,
    cap: 21
  }),
  galaxyPower: rebuyable({
    id: "galaxyPower",
    description: "Множитель к силе галактик",
    cost: [1000, 1e3, 10, 1e30],
    effect: x => 1 + x / 50,
    formatEffect: x => formatX(x, 2, 2),
    cap: 9
  }),
  antimatterDimAutobuyers1: {
    id: 0,
    description: "Разблокировать автоматику Измерений Антиматерии с 1-го по 4-е",
    cost: 1e5,
    formatCost,
  },
  dimBoostAutobuyer: {
    id: 1,
    description: "Разблокировать автоматику Расширений Измерений",
    cost: 5e5,
    formatCost,
  },
  keepAutobuyers: {
    id: 2,
    description: "Улучшения автоматики не сбрасываются на армагеддоне",
    cost: 5e6,
    formatCost,
  },
  antimatterDimAutobuyers2: {
    id: 3,
    description: "Разблокировать автоматику Измерений Антиматерии с 5-го по 8-е",
    cost: 2.5e7,
    formatCost,
  },
  galaxyAutobuyer: {
    id: 4,
    description: "Разблокировать автоматику Галактик Антиматерии",
    cost: 1e8,
    formatCost,
  },
  tickspeedAutobuyer: {
    id: 5,
    description: "Разблокировать автоматику ускорителей",
    cost: 1e9,
    formatCost,
  },
  keepInfinityUpgrades: {
    id: 6,
    description: "Улучшения Бесконечности не сбрасываются на армагеддоне",
    cost: 1e10,
    formatCost,
  },
  dimBoostResetsNothing: {
    id: 7,
    description: "При получении Расширений Измерений ничего не сбрасывается",
    cost: 1e11,
    formatCost,
  },
  keepBreakInfinityUpgrades: {
    id: 8,
    description: "Улучшения Преодоления не сбрасываются на армагеддоне",
    cost: 1e12,
    formatCost,
  },
  IDAutobuyers: {
    id: 9,
    description: "Разблокировать автоматику Измерений Бесконечности",
    cost: 1e14,
    formatCost,
  },
  keepInfinityChallenges: {
    id: 10,
    description: "Испытания Бесконечности не сбрасываются на армагеддоне",
    cost: 1e15,
    formatCost,
  },
  galaxyNoResetDimboost: {
    id: 11,
    description: "Расширения Измерений не сбрасываются при получении Галактик Антиматерии",
    cost: 1e16,
    formatCost
  },
  replicantiAutobuyers: {
    id: 12,
    description: "Разблокировать автоматику Улучшений Репликанти",
    cost: 1e17,
    formatCost,
  },
  replicantiGalaxyNoReset: {
    id: 13,
    description: "Галактики Репликанти не сбрасываются на бесконечности",
    cost: 1e19,
    formatCost,
  },
  eternitiesNoReset: {
    id: 14,
    description: "Вечности не сбрасываются на армагеддоне",
    cost: 1e20,
    formatCost,
  },
  timeStudiesNoReset: {
    id: 15,
    description: "Исследования и Теоремы Времени не сбрасываются на армагеддоне",
    cost: 1e21,
    formatCost,
  },
  replicantiStayUnlocked: {
    id: 16,
    description: "Репликанти всегда разблокированы",
    cost: 1e22,
    formatCost,
  },
  keepEternityUpgrades: {
    id: 17,
    description: "Улучшения Вечности не сбрасываются на армагеддоне",
    cost: 1e24,
    formatCost,
  },
  TDAutobuyers: {
    id: 18,
    description: "Разблокировать автоматику Измерений Времени",
    cost: 1e25,
    formatCost,
  },
  keepEternityChallenges: {
    id: 19,
    description: "Выполнения Испытаний Вечности не сбрасываются на армагеддоне",
    cost: 1e26,
    formatCost,
  },
  dilationUpgradesNoReset: {
    id: 21,
    description: "Улучшения Замедления не сбрасываются на армагеддоне",
    cost: 1e45,
    formatCost,
  },
  tachyonParticlesNoReset: {
    id: 22,
    description: "Тахионы не сбрасываются на армагеддоне",
    cost: 1e50,
    formatCost,
  },
  replicantiGalaxyEM40: {
    id: 20,
    description: "При получении Галактик Репликанти ничего не сбрасывается",
    cost: 1e30,
    formatCost,
  }
};
