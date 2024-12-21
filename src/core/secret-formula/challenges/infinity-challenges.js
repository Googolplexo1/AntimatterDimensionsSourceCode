import { DC } from "../../constants";

export const infinityChallenges = [
  {
    id: 1,
    description: "действуют условия всех Обычных Испытаний, кроме 9-го и 12-го.",
    goal: DC.E650,
    isQuickResettable: true,
    reward: {
      description: () => `множитель ${formatX(1.3, 1, 1)} ко всем Измерениям Бесконечности за каждое выполненное Испытание Бесконечности`,
      effect: () => Math.pow(1.3, InfinityChallenges.completed.length),
      formatEffect: value => formatX(value, 1, 1)
    },
    unlockAM: DC.E2000,
  },
  {
    id: 2,
    description: () => `каждые ${formatInt(400)} миллисекунд, когда у вас есть 8-е Измерение Антиматерии,
      вы принудительно совершаете Пожертвование Измерений.`,
    goal: DC.E10500,
    isQuickResettable: false,
    reward: {
      description: () => `разблокировать автоматику Пожертвования Измерений и сделать его принципиально сильнее:
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": false })} ➜
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": true })}`,
    },
    unlockAM: DC.E11000,
  },
  {
    id: 3,
    description: () =>
      `ускорители не имеют эффекта, зато все Измерения Антиматерии получают множитель в зависимости от
      количества ускорителей и Галактик Антиматерии.`,
    goal: DC.E5000,
    isQuickResettable: false,
    effect: () => Decimal.pow(1.05 + (player.galaxies * 0.005), player.totalTickBought),
    formatEffect: value => formatX(value, 2, 2),
    reward: {
      description: `множитель к Измерениям Антиматерии, как внутри Испытания`,
      effect: () => (Laitela.continuumActive
        ? Decimal.pow(1.05 + (player.galaxies * 0.005), Tickspeed.continuumValue)
        : Decimal.pow(1.05 + (player.galaxies * 0.005), player.totalTickBought)),
      formatEffect: value => formatX(value, 2, 2),
    },
    unlockAM: DC.E12000,
  },
  {
    id: 4,
    description: () =>
      `множители всех Измерений Антиматерии, кроме последнего купленного, возведены в степень ${format(0.25, 2, 2)}.`,
    goal: DC.E13000,
    isQuickResettable: true,
    effect: 0.25,
    reward: {
      description: () => `множители всех Измерений Антиматерии возведены в степень ${format(1.05, 2, 2)}`,
      effect: 1.05
    },
    unlockAM: DC.E14000,
  },
  {
    id: 5,
    description:
      `при покупке десятки любого Измерения Антиматерии с 1-го по 4-е все цены, меньшие, а с 5-го по 8-е - большие, чем цена,
      по которой была совершена покупка, возрастают, как если бы вы совершили соответствующую покупку.`,
    goal: DC.E16500,
    isQuickResettable: true,
    reward: {
      description: () =>
        `галактики на ${formatPercents(0.1)} сильнее. Требования Галактик Антиматерии и
        Расширений Измерений на ${formatInt(1)} 8-е Измерение Антиматерии ниже`,
      effect: 1.1
    },
    unlockAM: DC.E18000,
  },
  {
    id: 6,
    description: () =>
      "существует материя, которая растёт как в 11-м Обычном Испытании и делит множители всех Измерений Антиматерии.",
    goal: DC.D2E22222,
    isQuickResettable: true,
    effect: () => Currency.matter.value.clampMin(1),
    formatEffect: value => `/${format(value, 1, 2)}`,
    reward: {
      description: "множитель к Измерениям Бесконечности в зависимости от скорости тика",
      effect: () => Tickspeed.perSecond.pow(0.0005),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: DC.E22500,
  },
  {
    id: 7,
    description: () =>
      `вы не можете получать Галактики Антиматерии обычным способом, зато множитель Расширения Измерений по умолчанию
        увеличен до ${formatX(10)}.`,
    goal: DC.E10000,
    isQuickResettable: false,
    effect: 10,
    reward: {
      description: () => `множитель Расширения Измерений по умолчанию увеличен до ${formatX(4)}`,
      effect: 4
    },
    unlockAM: DC.E23000,
  },
  {
    id: 8,
    description: () =>
      `вы получаете множитель к Измерениям Антиматерии, который быстро экспоненциально убывает, но восстанавливается
        до ${formatX(1)} при покупке Измерений Антиматерии или ускорителей.`,
    goal: DC.E27000,
    isQuickResettable: true,
    effect: () => DC.D0_8446303389034288.pow(
      Math.max(0, player.records.thisInfinity.time - player.records.thisInfinity.lastBuyTime)),
    reward: {
      description:
        "множитель к Измерениям Антиматерии со 2-го по 7-е в зависимости от произведения множителей 1-го и 8-го ИА.",
      effect: () => AntimatterDimension(1).multiplier.times(AntimatterDimension(8).multiplier).pow(0.02),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: DC.E28000,
  },
];
