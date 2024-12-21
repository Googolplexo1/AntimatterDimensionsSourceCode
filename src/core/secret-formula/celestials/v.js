import { DC } from "../../constants";

// This is supposed to be in ./navigation.js but importing doesn't work for some stupid reason
function emphasizeEnd(fraction) {
  return Math.pow(fraction, 10);
}

export const V_REDUCTION_MODE = {
  SUBTRACTION: 1,
  DIVISION: 2
};

export const v = {
  // Note: mainUnlock IDs here are one-indexed to match with navigation indices
  mainUnlock: {
    realities: {
      id: 1,
      name: "реальностей",
      resource: () => Currency.realities.value,
      requirement: 10000,
      format: x => formatInt(x),
      progress: () => Currency.realities.value / 10000,
    },
    eternities: {
      id: 2,
      name: "вечностей",
      resource: () => Currency.eternities.value,
      requirement: 1e70,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.eternities.value.pLog10() / 70),
    },
    infinities: {
      id: 3,
      name: "бесконечностей",
      resource: () => Currency.infinitiesTotal.value,
      requirement: 1e160,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.infinitiesTotal.value.pLog10() / 160),
    },
    dilatedTime: {
      id: 4,
      name: "Замедленного Времени",
      resource: () => player.records.thisReality.maxDT,
      requirement: DC.E320,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxDT.pLog10() / 320),
    },
    replicanti: {
      id: 5,
      name: "Репликанти",
      resource: () => player.records.thisReality.maxReplicanti,
      requirement: DC.E320000,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxReplicanti.pLog10() / 320000),
    },
    realityMachines: {
      id: 6,
      name: "Машин Реальности",
      resource: () => Currency.realityMachines.value,
      requirement: 1e60,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.realityMachines.value.pLog10() / 60),
    },
  },
  runUnlocks: [
    {
      id: 0,
      name: "Рыцарь глифов",
      description: value => `Разблокируйте Реальность не более чем с ${quantifyInt("действующим глифом", -value)}.`,
      // This achievement has internally negated values since the check is always greater than
      values: [-5, -4, -3, -2, -1, 0],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -Glyphs.activeWithoutCompanion.length,
      formatRecord: x => (x >= -5 ? formatInt(-x) : "Не выполнено"),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 1,
      name: "Антистеллар",
      description: value => `Достигните ${quantifyInt("галактики", value)}.`,
      values: [4000, 4300, 4600, 4900, 5200, 5500],
      condition: () => V.isRunning,
      currentValue: () => Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(300 * tiers),
      maxShardReduction: goal => goal - 4000,
      perReductionStep: 3,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 2,
      name: "Семь смертных материй",
      description: value => `Достигните ${format(Decimal.pow10(value))} Очков Бесконечности в 7-м Испытании Вечности.`,
      values: [6e5, 7.2e5, 8.4e5, 9.6e5, 1.08e6, 1.2e6],
      condition: () => V.isRunning && EternityChallenge(7).isRunning,
      currentValue: () => Currency.infinityPoints.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 1.2e5 * tiers,
      maxShardReduction: goal => goal - 6e5,
      perReductionStep: DC.E1200,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 3,
      name: "Юный мальчик",
      description: value => `Достигните ${format(Decimal.pow10(value))} антиматерии в 12-м Испытании Вечности,
        не разблокировав Замедление Времени.`,
      values: [400e6, 450e6, 500e6, 600e6, 700e6, 800e6],
      condition: () => V.isRunning && EternityChallenge(12).isRunning && !PlayerProgress.dilationUnlocked(),
      currentValue: () => Currency.antimatter.value.log10(),
      formatRecord: x => format(Decimal.pow10(x)),
      shardReduction: tiers => 50e6 * tiers,
      maxShardReduction: goal => goal - 400e6,
      perReductionStep: DC.E500000,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 4,
      name: "Вечное сияние",
      description: value => `Достигните ${format(Decimal.pow10(value))} Очков Вечности.`,
      values: [7000, 7600, 8200, 8800, 9400, 10000],
      condition: () => V.isRunning,
      currentValue: () => Currency.eternityPoints.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 600 * tiers,
      maxShardReduction: goal => goal - 7000,
      perReductionStep: 1e6,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 5,
      name: "Материальное начало",
      description: value => `Достигните ${quantifyInt("Расширения", value)} Измерений в 5-м Испытании Вечности в Замедлении.`,
      values: [51, 52, 53, 54, 55, 56],
      condition: () => V.isRunning && player.dilation.active && EternityChallenge(5).isRunning,
      currentValue: () => DimBoost.purchasedBoosts,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(tiers),
      maxShardReduction: () => 5,
      reductionStepSize: 100,
      perReductionStep: 1,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 6,
      name: "Реквием по глифу",
      description: value => `Разблокируйте Реальность не более чем с ${quantifyInt("действующим глифом", -value)}.`,
      // This achievement has internally negated values since the check is always greater than
      values: [1, 4, 7, 10, 13],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -player.requirementChecks.reality.maxGlyphs,
      formatRecord: x => formatInt(-x),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 7,
      name: "Пункт назначения",
      description: value => `Достигните ${formatInt(400000)} Теорем Времени в Реальности, на всём протяжении которой
        инвертированная Чёрная Дыра имела эффект не менее ${format(Decimal.pow10(value), 2, 2)},
        а вы не разряжали Чёрную Дыру и не начинали ИспВ12.`,
      values: [100, 150, 200, 250, 300],
      condition: () => V.isRunning,
      currentValue: () => (
        // Dirty hack I know lmao
        Currency.timeTheorems.gte(400000)
          ? -Math.log10(player.requirementChecks.reality.slowestBH)
          : 0),
      formatRecord: x => `${format(Math.pow(10, x))}`,
      shardReduction: tiers => 50 * tiers,
      maxShardReduction: goal => goal - 50,
      reductionStepSize: 2,
      perReductionStep: 10,
      mode: V_REDUCTION_MODE.DIVISION,
      isHard: true
    },
    {
      id: 8,
      name: "Глиф-затвор",
      description: value => `Сделайте уровень получаемого глифа не менее ${formatInt(value)}.`,
      values: [6500, 7000, 8000, 9000, 10000],
      condition: () => V.isRunning,
      currentValue: () => gainedGlyphLevel().actualLevel,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(500 * tiers),
      maxShardReduction: () => 500,
      perReductionStep: 5,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    }
  ],
  unlocks: {
    vAchievementUnlock: {
      id: 0,
      reward: "Разблокировать Реальность Ви",
      description: "",
      requirement: () => Object.values(GameDatabase.celestials.v.mainUnlock).every(e => e.progress() >= 1)
    },
    shardReduction: {
      id: 1,
      reward: `Разблокировать возможность тратить Очки Умения на понижение целей достижений Ви.`,
      description: () => `${formatInt(2)} достижения Ви`,
      requirement: () => V.spaceTheorems >= 2
    },
    adPow: {
      id: 2,
      reward: "Множители Измерений Антиматерии возведены в степень в зависимости от общего количества выполненных уровней достижений Ви.",
      description: () => `${formatInt(5)} достижений Ви`,
      effect: () => 1 + Math.sqrt(V.spaceTheorems) / 100,
      format: x => formatPow(x, 3, 3),
      requirement: () => V.spaceTheorems >= 5
    },
    fastAutoEC: {
      id: 3,
      reward: "Интервал автоматического выполнения ИспВ разделён на множитель достижений.",
      description: () => `${formatInt(10)} достижений Ви`,
      effect: () => Achievements.power,
      // Base rate is 60 ECs at 20 minutes each
      format: x => (Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied
        ? "Мгновенно"
        : `${TimeSpan.fromMilliseconds(60 * EternityChallenges.autoComplete.interval).toStringShort()} в сумме для выполнения всех`),
      requirement: () => V.spaceTheorems >= 10
    },
    autoAutoClean: {
      id: 4,
      reward: "Разблокировать опцию автоматической прочистки инвентаря на реальности.",
      description: () => `${formatInt(16)} достижений Ви`,
      requirement: () => V.spaceTheorems >= 16
    },
    achievementBH: {
      id: 5,
      reward: "Множитель достижений влияет на силу обеих Чёрных Дыр.",
      description: () => `${formatInt(30)} достижений Ви`,
      effect: () => Achievements.power,
      format: x => formatX(x, 2, 0),
      requirement: () => V.spaceTheorems >= 30
    },
    raUnlock: {
      id: 6,
      reward() {
        return `Все Исследования Времени стоят на ${formatInt(2)} Теоремы Пространства дешевле.
                Разблокировать Ра, Небожителя Забвения.`;
      },
      description: () => `${formatInt(36)} достижений Ви`,
      effect: 2,
      requirement: () => V.spaceTheorems >= 36
    }
  }
};
