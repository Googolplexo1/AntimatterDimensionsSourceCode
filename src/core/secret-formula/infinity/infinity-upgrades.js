import { DC } from "../../constants";

function dimInfinityMult() {
  return Currency.infinitiesTotal.value.times(0.2).plus(1);
}
function chargedDimInfinityMult() {
  return 1 + Math.log10(Math.max(1, Currency.infinitiesTotal.value.pLog10())) * Math.sqrt(Ra.pets.teresa.level) / 150;
}

export const infinityUpgrades = {
  totalTimeMult: {
    id: "timeMult",
    cost: 1,
    description: "Множитель к Измерениям Антиматерии в зависимости от времени игры",
    effect: () => Math.pow(Time.totalTimePlayed.totalMinutes / 2, 0.15),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: "Множители Измерений Антиматерии возведены в степень в зависимости от времени игры",
      effect: () => 1 +
        Math.log10(Math.log10(Time.totalTimePlayed.totalMilliseconds)) *
        Math.pow(Ra.pets.teresa.level, 0.5) / 150,
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim18mult: {
    id: "18Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.totalTimeMult.isBought,
    description: "Множитель к 1-му и 8-му Измерениям Антиматерии в зависимости от количества бесконечностей",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "Множители 1-го и 8-го Измерений Антиматерии возведены в степень в зависимости от количества бесконечностей",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim27mult: {
    id: "27Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.buy10Mult.isBought,
    description: "Множитель ко 2-му и 7-му Измерениям Антиматерии в зависимости от количества бесконечностей",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "Множители 2-го и 7-го Измерений Антиматерии возведены в степень в зависимости от количества бесконечностей",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim36mult: {
    id: "36Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim18mult.isBought,
    description: "Множитель к 3-му и 6-му Измерениям Антиматерии в зависимости от количества бесконечностей",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "Множители 3-го и 6-го Измерений Антиматерии возведены в степень в зависимости от количества бесконечностей",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim45mult: {
    id: "45Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim27mult.isBought,
    description: "Множитель к 4-му и 5-му Измерениям Антиматерии в зависимости от количества бесконечностей",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "Множители 4-го и 5-го Измерений Антиматерии возведены в степень в зависимости от количества бесконечностей",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  resetBoost: {
    id: "resetBoost",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim36mult.isBought,
    description: () =>
      `Уменьшить цены на Расширения Измерений и Галактики Антиматерии на ${formatInt(9)} 8-х Измерений Антиматерии`,
    effect: 9,
    charged: {
      description: () => "Уменьшить цены на Расширения Измерений",
      effect: () => 1 / (1 + Math.sqrt(Ra.pets.teresa.level) / 10),
      formatEffect: value => `в ${format(1 / value, 4, 4)} раз`
    }
  },
  buy10Mult: {
    id: "dimMult",
    cost: 1,
    description: () => `Увеличить множитель за покупку ${formatInt(10)} Измерений Антиматерии`,
    effect: () => 1.1,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.2, 0, 1)}`,
    charged: {
      description: () => `Множитель за покупку ${formatInt(10)} Измерений Антиматерии возведён в степень`,
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  galaxyBoost: {
    id: "galaxyBoost",
    cost: 2,
    checkRequirement: () => InfinityUpgrade.dim45mult.isBought,
    description: "Галактики вдвое сильнее",
    effect: 2,
    charged: {
      description: "Галактики сильнее",
      effect: () => 2 + Math.sqrt(Ra.pets.teresa.level) / 100,
      formatEffect: value => `на ${formatPercents(value - 1)} сильнее`
    }
  },
  thisInfinityTimeMult: {
    id: "timeMult2",
    cost: 3,
    description: "Множитель к Измерениям Антиматерии в зависимости от длительности текущей бесконечности",
    effect: () => Decimal.max(Math.pow(Time.thisInfinity.totalMinutes / 4, 0.25), 1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description:
        "Множители Измерений Антиматерии возведены в степень в зависимости от длительности текущей бесконечности",
      effect: () => 1 +
        Math.log10(Math.log10(Time.thisInfinity.totalMilliseconds + 100)) *
        Math.sqrt(Ra.pets.teresa.level) / 150,
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  unspentIPMult: {
    id: "unspentBonus",
    cost: 5,
    checkRequirement: () => InfinityUpgrade.thisInfinityTimeMult.isBought,
    description: "Множитель к 1-му Измерению Антиматерии в зависимости от количества Очков Бесконечности",
    effect: () => Currency.infinityPoints.value.dividedBy(2).pow(1.5).plus(1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: "Множитель к 1-му Измерению Антиматерии в зависимости от количества Очков Бесконечности",
      effect: () => Currency.infinityPoints.value.dividedBy(2).pow(Math.sqrt(Ra.pets.teresa.level) * 1.5).plus(1),
      formatEffect: value => formatX(value, 2, 2)
    }
  },
  dimboostMult: {
    id: "resetMult",
    cost: 7,
    checkRequirement: () => InfinityUpgrade.unspentIPMult.isBought,
    description: "Увеличить множитель Расширения Измерений по умолчанию",
    effect: () => 2.5,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.5, 0, 1)}`,
    charged: {
      description: "Множитель Расширения Измерений возведён в степень",
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  ipGen: {
    id: "passiveGen",
    cost: 10,
    checkRequirement: () => InfinityUpgrade.dimboostMult.isBought,
    description: () => `Вы производите по Очку Бесконечности с периодом в ${formatInt(10)} раз большим, чем рекордное время бесконечности`,
    // Cutting corners: this is not actual effect, but it is totalIPMult that is displyed on upgrade
    effect: () => (Pelle.isDoomed ? DC.D0 : GameCache.totalIPMult.value),
    formatEffect: value => {
      if (Pelle.isDoomed) return "Недоступно";
      if (player.records.bestInfinity.time === Number.MAX_VALUE) return "Отключено ввиду отсутствия бесконечностей";
      return `${format(value, 2)} ОБ раз в ${Time.bestInfinity.times(10).toStringShort()}`;
    },
    charged: {
      description: "Вы производите Машины Реальности пропорционально количеству, которое вы могли бы получить при реальности",
      effect: () => Math.pow(Ra.pets.teresa.level, 2) *
        Ra.unlocks.continuousTTBoost.effects.autoPrestige.effectOrDefault(1),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  skipReset1: {
    id: "skipReset1",
    cost: 20,
    description: () =>
      `Начинать с ${formatInt(1)} Расширением Измерений`,
  },
  skipReset2: {
    id: "skipReset2",
    cost: 40,
    checkRequirement: () => InfinityUpgrade.skipReset1.isBought,
    description: () =>
      `Начинать с ${formatInt(2)} Расширениями Измерений`,
  },
  skipReset3: {
    id: "skipReset3",
    cost: 80,
    checkRequirement: () => InfinityUpgrade.skipReset2.isBought,
    description: () =>
      `Начинать с ${formatInt(3)} Расширениями Измерений`,
  },
  skipResetGalaxy: {
    id: "skipResetGalaxy",
    cost: 300,
    checkRequirement: () => InfinityUpgrade.skipReset3.isBought,
    description: () =>
      `Начинать с ${formatInt(4)} Расширениями Измерений и ${formatInt(1)} Галактикой Антиматерии`,
  },
  ipOffline: {
    id: "ipOffline",
    cost: 1000,
    checkRequirement: () => Achievement(41).isUnlocked,
    description: () => (player.options.offlineProgress
      ? `Производить ${formatPercents(0.5)} от лучшего прироста ОБ за время среди бесконечностей, на протяжении которых вы не нажимали кнопку "Купить всё", офлайн`
      : "Это Улучшение производило бы Очки Бесконечности, но офлайн-прогресс отключён"),
    effect: () => (player.options.offlineProgress
      ? player.records.thisEternity.bestIPMsWithoutMaxAll.times(TimeSpan.fromMinutes(1).totalMilliseconds / 2)
      : DC.D0),
    isDisabled: () => !player.options.offlineProgress,
    formatEffect: value => `${format(value, 2, 2)} ОБ/мин`,
  },
  ipMult: {
    id: "ipMult",
    cost: () => InfinityUpgrade.ipMult.cost,
    checkRequirement: () => Achievement(41).isUnlocked,
    costCap: DC.E6E6,
    costIncreaseThreshold: DC.E3E6,
    description: () => `Удвоить получение Очков Бесконечности`,
    // Normally the multiplier caps at e993k or so with 3300000 purchases, but if the cost is capped then we just give
    // an extra e7k to make the multiplier look nice
    effect: () => (player.IPMultPurchases >= 3300000 ? DC.E1E6 : DC.D2.pow(player.IPMultPurchases)),
    cap: () => Effarig.eternityCap ?? DC.E1E6,
    formatEffect: value => formatX(value, 2, 2),
  }
};
