import { DC } from "../../../constants";

const thisInfinityMult = thisInfinity => {
  // All "this inf time" or "best inf time" mults are * 10
  const scaledInfinity = thisInfinity * 10 + 1;
  const cappedInfinity = Math.min(Math.pow(scaledInfinity, 0.125), 500);
  return DC.D15.pow(Math.log(scaledInfinity) * cappedInfinity);
};
const passiveIPMult = () => {
  const isEffarigLimited = Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY;
  const normalValue = Perk.studyPassive.isBought ? 1e50 : 1e25;
  return isEffarigLimited
    ? Math.min(normalValue, Effarig.eternityCap.toNumber())
    : normalValue;
};


/**
 * List of time study specifications and attributes
 * {
 *  @property {Number} id                   Numerical ID shown for each time study in code and in-game
 *  @property {Number} cost                 Amount of available time theorems required to purchase
 *  @property {Number} STcost               Amount of available space theorems required to purchase if needed
 *  @property {Object[]} requirement   Array of Numbers or functions which are checked to determine purchasability
 *  @property {Number} reqType              Number specified by enum in TS_REQUIREMENT_TYPE for requirement behavior
 *  @property {Number[]} requiresST    Array of Numbers indicating which other studies will cause this particular
 *    study to also cost space theorems - in all cases this applies if ANY in the array are bought
 *  @property {function: @return String} description  Text to be shown in-game for the time study's effects
 *  @property {function: @return Number} effect       Numerical value for the effects of a study
 *  @property {String[]} cap     Hard-coded cap for studies which don't scale forever
 *  @property {String} formatEffect   Formatting function for effects, if the default formatting isn't appropriate
 * }
 */
export const normalTimeStudies = [
  {
    id: 11,
    cost: 1,
    // All requirements of an empty array will always evaluate to true, so this study is always purchasable
    requirement: [],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: "Множитель к 1-му Измерению Времени в зависимости от скорости тика",
    effect: () => {
      const tickspeed = Tickspeed.current.dividedBy(1000);
      const firstPart = tickspeed.pow(0.005).times(0.95);
      const secondPart = tickspeed.pow(0.0003).times(0.05);
      return firstPart.plus(secondPart).reciprocate();
    },
    cap: DC.E2500,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 21,
    cost: 3,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Улучшить формулу множителя Репликанти",
    effect: () => Replicanti.amount.pow(0.032),
    // This is a special case because the study itself is *added* to the existing formula, but it makes more sense
    // to display a multiplicative increase just like every other study. We need to do the calculation in here in order
    // to properly show only the effect of this study and nothing else
    formatEffect: value => {
      const oldVal = Decimal.pow(Decimal.log2(Replicanti.amount.clampMin(1)), 2);
      const newVal = oldVal.plus(value);
      return formatX(newVal.div(oldVal).clampMin(1), 2, 2);
    }
  },
  {
    id: 22,
    cost: 2,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Понизить ограничение на интервал репликации по умолчанию с ${formatInt(50)}мс до ${formatInt(1)}мс`,
    effect: 1
  },
  {
    id: 31,
    cost: 3,
    requirement: [21],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Все множители, зависящие от количества бесконечностей, возведены в четвёртую степень",
    effect: 4
  },
  {
    id: 32,
    cost: 2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к получению бесконечностей в зависимости от количества Расширений Измерений",
    effect: () => Math.max(DimBoost.totalBoosts, 1),
    formatEffect: value => formatX(value, 2)
  },
  {
    id: 33,
    cost: 2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Сохранять половину Галактик Репликанти на Большом Сжатии (складывается с наградой за достижение 95)"
  },
  {
    id: 41,
    cost: 4,
    requirement: [31],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Множитель ${formatX(DC.D1_2, 1, 1)} к получению Очков Бесконечности за каждую галактику`,
    effect: () => DC.D1_2.pow(Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 42,
    cost: 6,
    requirement: [32],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Понизить наценку на Галактики Антиматерии с ${formatInt(60)} до ${formatInt(52)} 8-х Измерений Антиматерии`,
    effect: 52
  },
  {
    id: 51,
    cost: 3,
    requirement: [41, 42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Множитель ${formatX(1e15)} к получению Очков Бесконечности`,
    effect: 1e15
  },
  {
    id: 61,
    cost: 3,
    requirement: [51],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Множитель ${formatX(15)} к получению Очков Вечности`,
    effect: 15
  },
  {
    id: 62,
    cost: 3,
    requirement: [42, () => Perk.bypassEC5Lock.isBought || EternityChallenge(5).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `Множитель ${formatX(3)} к скорости репликации`,
    effect: 3
  },
  {
    id: 71,
    cost: 4,
    requirement: [61, () => Perk.studyECRequirement.isBought || !EternityChallenge(12).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Множитель Пожертвования Измерений влияет на все Измерения Антиматерии с ослабленным эффектом",
    effect: () => Sacrifice.totalBoost.pow(0.25).clampMin(1),
    cap: DC.E210000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 72,
    cost: 6,
    requirement: [61,
      () => Perk.studyECRequirement.isBought ||
        (!EternityChallenge(11).isUnlocked && !EternityChallenge(12).isUnlocked)],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Множитель Пожертвования Измерений влияет на 4-е Измерение Бесконечности с ослабленным эффектом",
    effect: () => Sacrifice.totalBoost.pow(0.04).clampMin(1),
    cap: DC.E30000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 73,
    cost: 5,
    requirement: [61, () => Perk.studyECRequirement.isBought || !EternityChallenge(11).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Множитель Пожертвования Измерений влияет на 3-е Измерение Времени с ослабленным эффектом",
    effect: () => Sacrifice.totalBoost.pow(0.005).clampMin(1),
    cap: DC.E1300,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 81,
    cost: 4,
    requirement: [71],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Увеличить множитель Расширения Измерений по умолчанию до ${formatX(10)}`,
    effect: 10
  },
  {
    id: 82,
    cost: 6,
    requirement: [72],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к Измерениям Бесконечности в зависимости от количества Расширений Измерений",
    effect: () => DC.D1_0000109.pow(Math.pow(DimBoost.totalBoosts, 2)),
    cap: DC.E1E7,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 83,
    cost: 5,
    requirement: [73],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель ко множителю Расширения Измерений в зависимости от количества ускорителей, полученных от Осколков Времени",
    effect: () => DC.D1_0004.pow(player.totalTickGained),
    cap: DC.E30,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 91,
    cost: 4,
    requirement: [81],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к Измерениям Антиматерии в зависимости от длительности текущей вечности",
    effect: () => Decimal.pow10(Math.min(Time.thisEternity.totalMinutes, 20) * 15),
    cap: DC.E300,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 92,
    cost: 5,
    requirement: [82],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к Измерениям Бесконечности в зависимости от рекордного времени вечности",
    effect: () => DC.D2.pow(60 / Math.max(Time.bestEternity.totalSeconds, 2)),
    cap: DC.C2P30,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 93,
    cost: 7,
    requirement: [83],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к Измерениям Времени в зависимости от количества ускорителей, полученных от Осколков Времени",
    effect: () => Decimal.pow(player.totalTickGained, 0.25).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 101,
    cost: 4,
    requirement: [91],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к Измерениям Антиматерии, равный количеству Репликанти",
    effect: () => Decimal.max(Replicanti.amount, 1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 102,
    cost: 6,
    requirement: [92],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель ко множителю Репликанти в зависимости от количества Галактик Репликанти",
    effect: () => DC.D5.pow(player.replicanti.galaxies),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 103,
    cost: 6,
    requirement: [93],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к Измерениям Времени в зависимости от количества Галактик Репликанти",
    effect: () => Math.max(player.replicanti.galaxies, 1),
    formatEffect: value => formatX(value, 2, 0)
  },
  {
    id: 111,
    cost: 12,
    requirement: [101, 102, 103],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Получение Очков Бесконечности по умолчанию возведено в степень ${formatFloat(308 / 285, 4, 4)}`,
    effect: 285
  },
  {
    id: 121,
    cost: 9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [122, 123],
    description: () => (Perk.studyActiveEP.isBought
      ? `Множитель ${formatX(50)} к получению Очков Вечности`
      : `Множитель к получению Очков Вечности в зависимости от суммарной длительности 
      десяти прошлых вечностей${PlayerProgress.seenAlteredSpeed() ? " (по реальному времяисчислению)" : ""}`),
    effect: () => (Perk.studyActiveEP.isBought
      ? 50
      : Math.clamp(250 / Player.averageRealTimePerEternity, 1, 50)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 1, 1)),
    cap: 50
  },
  {
    id: 122,
    cost: 9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 123],
    description: () => (Perk.studyPassive.isBought
      ? `Множитель ${formatX(50)} к получению Очков Вечности`
      : `Множитель ${formatX(35)} к получению Очков Вечности`),
    effect: () => (Perk.studyPassive.isBought ? 50 : 35)
  },
  {
    id: 123,
    cost: 9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 122],
    description: "Множитель к получению Очков Вечности в зависимости от длительности текущей вечности",
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisEternity.plus(perkEffect).totalSeconds;
      return Math.sqrt(1.39 * totalSeconds);
    },
    formatEffect: value => formatX(value, 1, 1)
  },
  {
    id: 131,
    cost: 5,
    STCost: 8,
    requirement: [121],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [132, 133],
    description: () => (Achievement(138).isUnlocked
      ? `Максимальное количество Галактик Репликанти на ${formatPercents(0.5)} выше`
      : `Максимальное количество Галактик Репликанти на ${formatPercents(0.5)} выше, но их автоматика отключена`),
    effect: () => Math.floor(player.replicanti.boughtGalaxyCap / 2)
  },
  {
    id: 132,
    cost: 5,
    STCost: 8,
    requirement: [122],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 133],
    description: () => (Pelle.isDoomed
      ? `Галактики Репликанти на ${formatPercents(0.4)} сильнее`
      : `Галактики Репликанти на ${formatPercents(0.4)} сильнее. Множитель
        ${Perk.studyPassive.isBought ? formatX(3) : formatX(1.5, 1, 1)} к скорости репликации`),
    effect: 0.4
  },
  {
    id: 133,
    cost: 5,
    STCost: 8,
    requirement: [123],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 132],
    description: () => (Achievement(138).isUnlocked
      ? `Галактики Репликанти на ${formatPercents(0.5)} сильнее`
      : `Галактики Репликанти на ${formatPercents(0.5)} сильнее, но репликация в ${format(10)} раз медленнее, ` +
    `если у вас менее ${format(Number.MAX_VALUE, 2)} Репликанти`),
    effect: 0.5
  },
  {
    id: 141,
    cost: 4,
    STCost: 2,
    requirement: [131],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [142, 143],
    description: () => (Perk.studyActiveEP.isBought
      ? `Множитель ${formatX(DC.E45)} к получению Очков Бесконечности`
      : "Множитель к получению Очков Бесконечности, который непрерывно убывает, но восстанавливается на бесконечности"),
    effect: () => (Perk.studyActiveEP.isBought
      ? DC.E45
      : DC.E45.divide(thisInfinityMult(Time.thisInfinity.totalSeconds)).clampMin(1)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 2, 1))
  },
  {
    id: 142,
    cost: 4,
    STCost: 2,
    requirement: [132],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 143],
    description: () => `Множитель ${formatX(passiveIPMult())} к получению Очков Бесконечности`,
    effect: passiveIPMult,
    cap: () => (Effarig.eternityCap === undefined ? undefined : Effarig.eternityCap.toNumber())
  },
  {
    id: 143,
    cost: 4,
    STCost: 2,
    requirement: [133],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 142],
    description: "Множитель к получению Очков Бесконечности в зависимости от длительности текущей бесконечности",
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisInfinity.plus(perkEffect).totalSeconds;
      return thisInfinityMult(totalSeconds);
    },
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  {
    id: 151,
    cost: 8,
    requirement: [141, 142, 143],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Множитель ${formatX(1e4)} ко всем Измерениям Времени`,
    effect: 1e4
  },
  {
    id: 161,
    cost: 7,
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Множитель ${formatX(DC.E616)} ко всем Измерениям Антиматерии`,
    effect: () => DC.E616
  },
  {
    id: 162,
    cost: 7,
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Множитель ${formatX(1e11)} ко всем Измерениям Бесконечности`,
    effect: 1e11
  },
  {
    id: 171,
    cost: 15,
    requirement: [161, 162],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Понизить наценку на ускорители, получаемые от Осколков Времени, с
      ${formatX(1.33, 0, 2)} до ${formatX(1.25, 0, 2)}`,
    effect: () => TS171_MULTIPLIER
  },
  {
    id: 181,
    cost: 200,
    requirement: [171,
      () => EternityChallenge(1).completions > 0 || Perk.bypassEC1Lock.isBought,
      () => EternityChallenge(2).completions > 0 || Perk.bypassEC2Lock.isBought,
      () => EternityChallenge(3).completions > 0 || Perk.bypassEC3Lock.isBought],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `Ежесекундно вы получаете ${formatPercents(0.01)} от количества Очков Бесконечности, которое вы могли бы получить при Большом Сжатии`,
    effect: () => gainedInfinityPoints().times(Time.deltaTime / 100)
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige)
  },
  {
    id: 191,
    cost: 400,
    requirement: [181, () => EternityChallenge(10).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `На вечности вы навсегда сохраняете ${formatPercents(0.05)}
    бесконечностей`,
    effect: () => Currency.infinities.value.times(0.05).floor()
  },
  {
    id: 192,
    cost: 730,
    requirement: [181, () => EternityChallenge(10).completions > 0, () => !Enslaved.isRunning],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => (Enslaved.isRunning
      ? "В этой Реальности недостаточно места"
      : `Снять ограничение в ${format(replicantiCap(), 2, 1)} Репликанти (после него действует мягкое ограничение на скорость репликации)`)
  },
  {
    id: 193,
    cost: 300,
    requirement: [181, () => EternityChallenge(10).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: "Множитель к Измерениям Антиматерии в зависимости от количества вечностей",
    effect: () => (DC.E13000.pow(Currency.eternities.value.div(1e6).clampMax(1))),
    cap: DC.E13000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 201,
    cost: 900,
    requirement: [192],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Вы можете выбрать до двух путей на развилке измерений"
  },
  {
    id: 211,
    cost: 120,
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Понизить наценку на Расширения Измерений с ${formatInt(15)} до ${formatInt(10)} 8-х Измерений Антиматерии`,
    effect: 5
  },
  {
    id: 212,
    cost: 150,
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Галактики сильнее в зависимости от количества Осколков Времени",
    effect: () => Math.pow(Currency.timeShards.value.clampMin(2).log2(), 0.005),
    cap: 1.1,
    formatEffect: value => `на ${formatPercents(value - 1, 3)} сильнее`
  },
  {
    id: 213,
    cost: 200,
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Множитель ${formatX(20)} к скорости репликации`,
    effect: 20
  },
  {
    id: 214,
    cost: 120,
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Множитель к 8-му Измерению Антиматерии в зависимости от множителя Пожертвования Измерений",
    effect: () => {
      const totalBoost = Sacrifice.totalBoost;
      const firstPart = totalBoost.pow(7.6).clampMaxExponent(44000);
      const secondPart = totalBoost.pow(1.05).clampMaxExponent(120000);
      return firstPart.times(secondPart);
    },
    cap: DC.E164000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 221,
    cost: 900,
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [222],
    description: "Множитель к Измерениям Времени в зависимости от количества Расширений Измерений",
    effect: () => DC.D1_0025.pow(DimBoost.totalBoosts).pow(TimeStudy(301).isBought ? TimeStudy(231).effectValue : 1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 222,
    cost: 900,
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [221],
    description: () => `Понизить наценку на Расширения Измерений с ${formatInt(10)} до ${formatInt(8)} 8-х Измерений Антиматерии`,
    effect: 2
  },
  {
    id: 223,
    cost: 900,
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [224],
    description: () => `Наценка на Далёкие Галактики начинается на ${formatInt(7)} галактик позже`,
    effect: 7
  },
  {
    id: 224,
    cost: 900,
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [223],
    description() {
      const effect = TimeStudy(224).effectValue;
      return `Наценка на Далёкие Галактики начинается на ${quantifyInt("галактику", effect)} позже
        (на одну за каждые ${formatInt(2000)} Расширений)`;
    },
    effect: () => Math.floor(DimBoost.totalBoosts / 2000)
  },
  {
    id: 225,
    cost: 900,
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [226],
    description: "Получать дополнительные Галактики Репликанти в зависимости от количества Репликанти",
    effect: () => Math.floor(Replicanti.amount.exponent / 1000),
    formatEffect: value => `+${formatInt(value)} ГР`
  },
  {
    id: 226,
    cost: 900,
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [225],
    description: "Получать дополнительные Галактики Репликанти в зависимости от их максимального количества",
    effect: () => Math.floor(player.replicanti.boughtGalaxyCap / 15),
    formatEffect: value => `+${formatInt(value)} ГР`
  },
  {
    id: 227,
    cost: 900,
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [228],
    description: "Множитель к 4-му Измерению Времени в зависимости от множителя Пожертвования Измерений",
    effect: () => Math.max(Math.pow(Sacrifice.totalBoost.pLog10(), 10), 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 228,
    cost: 900,
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [227],
    description: () => `Пожертвование Измерений сильнее:
      ${Sacrifice.getSacrificeDescription({ "TimeStudy228": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "TimeStudy228": true })}`,
    effect: 0.2
  },
  {
    id: 231,
    cost: 500,
    STCost: 5,
    requirement: [221, 222],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [232],
    description: "Множитель ко множителю Расширения Измерений в зависимости от их количества",
    effect: () => Decimal.pow(DimBoost.totalBoosts, 0.3).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 232,
    cost: 500,
    STCost: 5,
    requirement: [223, 224],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [231],
    description: "Галактики сильнее в зависимости от количества Галактик Антиматерии",
    effect: () => Math.pow(1 + player.galaxies / 1000, 0.2),
    formatEffect: value => `на ${formatPercents(value - 1, 3)} сильнее`
  },
  {
    id: 233,
    cost: 500,
    STCost: 5,
    requirement: [225, 226],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [234],
    description: "Улучшение Репликанти, увеличивающее максимальное количество Галактик Репликанти, дешевле в зависимости от количества Репликанти",
    effect: () => Replicanti.amount.pow(0.3),
    formatEffect: value => `в ${format(value, 1, 2)} раз`
  },
  {
    id: 234,
    cost: 500,
    STCost: 5,
    requirement: [227, 228],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [233],
    description: "Множитель Пожертвования Измерений влияет на 1-е Измерение Антиматерии",
    effect: () => Sacrifice.totalBoost,
  },
  // Note: These last 4 entries are the triad studies
  {
    id: 301,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1, 221, 222, 231],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [221, 222, 231],
    description: "Эффект Исследования Времени 221 возведён в степень эффекта Исследования Времени 231",
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1
  },
  {
    id: 302,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2, 223, 224, 232],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [223, 224, 232],
    description: () => `Наценка на Далёкие Галактики начинается на ${formatInt(3000)} галактик позже`,
    effect: 3000,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2
  },
  {
    id: 303,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3, 225, 226, 233],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [225, 226, 233],
    description: () => `Получать на ${formatPercents(0.5)} больше дополнительных Галактик Репликанти`,
    effect: 1.5,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3
  },
  {
    id: 304,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4, 227, 228, 234],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [227, 228, 234],
    description: "Множитель Пожертвования Измерений возведён в квадрат",
    effect: 2,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4
  }
];
