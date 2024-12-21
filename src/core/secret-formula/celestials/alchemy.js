import { DC } from "../../constants";

export const alchemyResources = {
  // T1 resources (Non-Effarig "base" resources)
  "power": {
    id: ALCHEMY_RESOURCE.POWER,
    name: "Сила",
    symbol: "Ω",
    isBaseResource: true,
    effect: amount => 1 + amount / 200000,
    tier: 1,
    uiOrder: 1,
    unlockedAt: 2,
    description: "возводит множители Измерений Антиматерии в степень",
    formatEffect: value => `множители Измерений Антиматерии возведены в степень ${format(value, 4, 4)}`
  },
  "infinity": {
    id: ALCHEMY_RESOURCE.INFINITY,
    name: "Бесконечность",
    symbol: "∞",
    isBaseResource: true,
    effect: amount => 1 + amount / 200000,
    tier: 1,
    uiOrder: 2,
    unlockedAt: 3,
    description: "возводит множители Измерений Бесконечности в степень",
    formatEffect: value => `множители Измерений Бесконечности возведены в степень ${format(value, 4, 4)}`
  },
  "time": {
    id: ALCHEMY_RESOURCE.TIME,
    name: "Время",
    symbol: "Δ",
    isBaseResource: true,
    effect: amount => 1 + amount / 200000,
    tier: 1,
    uiOrder: 3,
    unlockedAt: 4,
    description: "возводит множители Измерений Времени в степень",
    formatEffect: value => `множители Измерений Времени возведены в степень ${format(value, 4, 4)}`
  },
  "replication": {
    id: ALCHEMY_RESOURCE.REPLICATION,
    name: "Репликация",
    symbol: "Ξ",
    isBaseResource: true,
    effect: amount => Decimal.pow10(amount / 1000),
    tier: 1,
    uiOrder: 4,
    unlockedAt: 5,
    description: `даёт множитель к скорости репликации`,
    formatEffect: value => `множитель ${formatX(value, 2, 2)} к скорости репликации`
  },
  "dilation": {
    id: ALCHEMY_RESOURCE.DILATION,
    name: "Замедление",
    symbol: "Ψ",
    isBaseResource: true,
    effect: amount => Decimal.pow10(amount / 2000),
    tier: 1,
    uiOrder: 5,
    unlockedAt: 6,
    description: "даёт множитель к производству Замедленного Времени",
    formatEffect: value => `множитель ${formatX(value, 2, 2)} к производству Замедленного Времени`
  },

  // T2 resources (combinations of pairs of T1 resources)
  "cardinality": {
    id: ALCHEMY_RESOURCE.CARDINALITY,
    name: "Мощность",
    symbol: "α",
    isBaseResource: false,
    effect: amount => 1 + 0.2 / (1 + amount / 20000),
    tier: 2,
    uiOrder: 3,
    unlockedAt: 8,
    description: "ослабляет мягкое ограничение на скорость репликации",
    formatEffect: value => `степень мягкого ограничения на скорость репликации понижена: ${formatX(Math.log10(1.2) / LOG10_MAX_VALUE, 6, 6)} ➜
      ${formatX(Math.log10(value) / LOG10_MAX_VALUE, 6, 6)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.TIME,
        amount: 8
      },
      {
        resource: ALCHEMY_RESOURCE.REPLICATION,
        amount: 7
      }
    ]
  },
  "eternity": {
    id: ALCHEMY_RESOURCE.ETERNITY,
    name: "Вечность",
    symbol: "τ",
    isBaseResource: false,
    effect: amount => 1 + amount / 15000,
    tier: 2,
    uiOrder: 2,
    unlockedAt: 9,
    description: "возводит производство вечностей в секунду в степень",
    formatEffect: value => `производство вечностей в секунду возведено в степень ${format(value, 4, 4)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.TIME,
        amount: 11
      },
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 4
      }
    ]
  },
  "dimensionality": {
    id: ALCHEMY_RESOURCE.DIMENSIONALITY,
    name: "Размерность",
    symbol: "ρ",
    isBaseResource: false,
    effect: amount => Decimal.pow10(5 * amount),
    tier: 2,
    uiOrder: 1,
    unlockedAt: 10,
    description: "даёт большой множитель ко всем измерениям",
    formatEffect: value => `множитель ${formatX(value)} ко всем измерениям`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.POWER,
        amount: 10
      },
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 5
      }
    ]
  },
  "inflation": {
    id: ALCHEMY_RESOURCE.INFLATION,
    name: "Инфляция",
    symbol: "λ",
    isBaseResource: false,
    effect: amount => Decimal.pow10(6e9 - 3e5 * amount),
    tier: 2,
    uiOrder: 5,
    unlockedAt: 11,
    description: () => `возводит большие множители Измерений Антиматерии в степень ${format(1.05, 2, 2)}`,
    formatEffect: value => `множители Измерений Антиматерии, большие ${format(value)}, возведены в степень ${format(1.05, 2, 2)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.POWER,
        amount: 9
      },
      {
        resource: ALCHEMY_RESOURCE.DILATION,
        amount: 6
      }
    ]
  },
  "alternation": {
    id: ALCHEMY_RESOURCE.ALTERNATION,
    name: "Чередование",
    symbol: "ω",
    isBaseResource: false,
    effect: amount => amount / 200000,
    tier: 2,
    uiOrder: 4,
    unlockedAt: 12,
    description: "усиливает Тахионные Галактики в зависимости от количества Репликанти",
    formatEffect: value => `Тахионные Галактики в 1+${format(value / 1e6, 10, 10)}log₁₀(Репликанти) раза сильнее`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.REPLICATION,
        amount: 5
      },
      {
        resource: ALCHEMY_RESOURCE.DILATION,
        amount: 10
      }
    ]
  },

  // T3 resources (Effarig and conbinations of T1/T2 with Effarig)
  "effarig": {
    id: ALCHEMY_RESOURCE.EFFARIG,
    name: "Эффариг",
    symbol: "Ϙ",
    isBaseResource: true,
    effect: amount => Math.pow(10, amount / 2500),
    tier: 1,
    uiOrder: 1.5,
    unlockedAt: 7,
    description: "даёт множитель к получению Реликтовых Осколков",
    formatEffect: value => `множитель ${formatX(value, 2, 2)} к получению Реликтовых Осколков`
  },
  "synergism": {
    id: ALCHEMY_RESOURCE.SYNERGISM,
    name: "Синергия",
    symbol: "π",
    isBaseResource: false,
    effect: amount => {
      const rawValue = 0.3 + 1.3 * Math.sqrt(amount / 25000);
      return Achievement(175).isUnlocked ? rawValue : Math.min(rawValue, 1);
    },
    tier: 3,
    uiOrder: 2,
    unlockedAt: 13,
    description: "повышает производительность алхимических реакций",
    formatEffect(value) {
      return `множитель ${formatX(value / 0.3, 2, 2)} к получению ресурсов от алхимических реакций
        ${(!Achievement(175).isUnlocked && value >= 1) ? " (ограничено)" : ""}`;
    },
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 3
      },
      {
        resource: ALCHEMY_RESOURCE.REPLICATION,
        amount: 16
      },
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 14
      }
    ]
  },
  "momentum": {
    id: ALCHEMY_RESOURCE.MOMENTUM,
    name: "Импульс",
    symbol: "μ",
    isBaseResource: false,
    effect: amount => 1 + amount / 125000,
    tier: 3,
    uiOrder: 3,
    unlockedAt: 15,
    description: "возводит множители всех измерений в степень, растущую со временем",
    formatEffect: value => `множители всех измерений возведены в степень ${format(Ra.momentumValue, 4, 4)}, которая растёт
      линейно на ${format(0.005 * Achievement(175).effectOrDefault(1), 3, 3)}
      в час по реальному времяисчислению с момента разблокировки этого ресурса, но имеет ограничение в ${format(value, 4, 4)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 11
      },
      {
        resource: ALCHEMY_RESOURCE.POWER,
        amount: 4
      },
      {
        resource: ALCHEMY_RESOURCE.TIME,
        amount: 20
      }
    ]
  },
  "decoherence": {
    id: ALCHEMY_RESOURCE.DECOHERENCE,
    name: "Декогеренция",
    symbol: "ξ",
    isBaseResource: false,
    effect: amount => 0.15 * Math.sqrt(amount / 25000),
    tier: 3,
    uiOrder: 4,
    unlockedAt: 14,
    description: "повышает эффективность облагораживания глифов",
    formatEffect: value => `при облагораживании глифа вы получаете не только некоторое количество соответствующего ему ресурса, но и количество всех остальных основных ресурсов, равное ${formatPercents(value, 2)}` +
      " от того количества",
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 13
      },
      {
        resource: ALCHEMY_RESOURCE.ALTERNATION,
        amount: 8
      }
    ]
  },

  // T4 resources (resources which feed directly into the final resource)
  "exponential": {
    id: ALCHEMY_RESOURCE.EXPONENTIAL,
    name: "Экспонента",
    symbol: "Γ",
    isBaseResource: false,
    effect: amount => 10 * Math.pow(amount / 10000, 2),
    tier: 4,
    uiOrder: 2,
    unlockedAt: 18,
    description: "даёт множитель к получению Очков Бесконечности в зависимости от количества Репликанти",
    formatEffect: value => `множитель к получению Очков Бесконечности, равный количеству Репликанти в степени ${format(value, 2, 3)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.INFLATION,
        amount: 18
      },
      {
        resource: ALCHEMY_RESOURCE.SYNERGISM,
        amount: 3
      }
    ]
  },
  "force": {
    id: ALCHEMY_RESOURCE.FORCE,
    name: "Работа",
    symbol: "Φ",
    isBaseResource: false,
    effect: amount => 5 * amount,
    tier: 4,
    uiOrder: 2,
    unlockedAt: 17,
    description: "даёт множитель к Измерениям Антиматерии в зависимости от количества Машин Реальности",
    formatEffect: value => `множитель к Измерениям Антиматерии, равный количеству Машин Реальности в степени ${format(value, 2, 2)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.DIMENSIONALITY,
        amount: 7
      },
      {
        resource: ALCHEMY_RESOURCE.MOMENTUM,
        amount: 8
      }
    ]
  },
  "uncountability": {
    id: ALCHEMY_RESOURCE.UNCOUNTABILITY,
    name: "Несчётность",
    symbol: "Θ",
    isBaseResource: false,
    effect: amount => 160 * Math.sqrt(amount / 25000),
    tier: 4,
    uiOrder: 3,
    unlockedAt: 19,
    description: "производит реальности и Очки Умения",
    formatEffect: value => `вы получаете ${format(value, 2, 2)} реальности и Очка Умения в секунду`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 20
      },
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 6
      },
      {
        resource: ALCHEMY_RESOURCE.CARDINALITY,
        amount: 16
      }
    ]
  },
  "boundless": {
    id: ALCHEMY_RESOURCE.BOUNDLESS,
    name: "Бездна",
    symbol: "Π",
    isBaseResource: false,
    effect: amount => amount / 80000,
    tier: 4,
    uiOrder: 1,
    unlockedAt: 20,
    description: "усиливает Тессеракты",
    formatEffect: value => `Тессеракты на ${formatPercents(value, 2, 2)} сильнее`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.ETERNITY,
        amount: 13
      },
      {
        resource: ALCHEMY_RESOURCE.INFLATION,
        amount: 18
      }
    ]
  },
  "multiversal": {
    id: ALCHEMY_RESOURCE.MULTIVERSAL,
    name: "Многомирие",
    symbol: "Σ",
    isBaseResource: false,
    effect: amount => Math.floor(32 * Math.pow(amount / 25000, 2)),
    tier: 4,
    uiOrder: 5,
    unlockedAt: 16,
    description: "симулирует реальности многократно",
    formatEffect: value => `каждая реальность симулируется ${quantifyInt("дополнительный", value)} ${pluralize("раз", value)},` +
      " как при усилении",
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.ALTERNATION,
        amount: 16
      },
      {
        resource: ALCHEMY_RESOURCE.DECOHERENCE,
        amount: 3
      }
    ]
  },
  "unpredictability": {
    id: ALCHEMY_RESOURCE.UNPREDICTABILITY,
    name: "Непредсказуемость",
    symbol: "Λ",
    isBaseResource: false,
    // Somewhat ugly number to make this show 70.00% at cap
    effect: amount => amount / (10714.28 + amount),
    tier: 4,
    uiOrder: 4,
    unlockedAt: 21,
    description: "даёт каждой алхимической реакции шанс произойти повторно",
    formatEffect: value => `каждый раз, когда алхимическая реакция происходит, с вероятностью ${formatPercents(value, 2, 2)}
      она происходит повторно`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 15
      },
      {
        resource: ALCHEMY_RESOURCE.DECOHERENCE,
        amount: 3
      },
      {
        resource: ALCHEMY_RESOURCE.SYNERGISM,
        amount: 10
      }
    ]
  },

  // T5 (Reality)
  "reality": {
    id: ALCHEMY_RESOURCE.REALITY,
    name: "Реальность",
    symbol: "Ϟ",
    isBaseResource: false,
    effect: amount => Math.floor(amount),
    tier: 5,
    unlockedAt: 25,
    description: "можно преобразовать в глиф нового типа",
    formatEffect: value => "отсутствует, зато вы можете преобразовать этот ресурс в Глиф Реальности",
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EXPONENTIAL,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.FORCE,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.UNCOUNTABILITY,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.BOUNDLESS,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.MULTIVERSAL,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.UNPREDICTABILITY,
        amount: 1
      }
    ]
  },
};
