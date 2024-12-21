import { DC } from "../../constants";
import wordShift from "../../word-shift";

export const pelleRifts = {
  vacuum: {
    id: 1,
    key: "vacuum",
    name: ["Вакуум", "Полость", "Пустота"],
    nameObjective: ["Вакуум", "Полость", "Пустоту"],
    drainResource: "ОБ",
    baseEffect: x => `Множитель ${formatX(x, 2, 2)} к получению ОБ`,
    additionalEffects: () => [PelleRifts.vacuum.milestones[2]],
    strike: () => PelleStrikes.infinity,
    percentage: totalFill => Math.log10(totalFill.plus(1).log10() * 10 + 1) ** 2.5 / 100,
    percentageToFill: percentage => Decimal.pow(10,
      Decimal.pow(10, (percentage * 100) ** (1 / 2.5)).div(10).minus(0.1)
    ).minus(1),
    effect: totalFill => {
      if (player.challenge.eternity.current !== 0) {
        const chall = EternityChallenge.current;
        const goal = chall.goalAtCompletions(chall.gainedCompletionStatus.totalCompletions);
        return totalFill.plus(1).pow(0.1).min(goal.pow(0.15));
      }
      return totalFill.plus(1).pow(0.33);
    },
    currency: () => Currency.infinityPoints,
    galaxyGeneratorThreshold: 1000,
    milestones: [
      {
        resource: "vacuum",
        requirement: 0.04,
        description: "Вы можете активировать один глиф"
      },
      {
        resource: "vacuum",
        requirement: 0.06,
        description: () => `Ограничение на количество Репликанти снято. Их разблокировка и Улучшения Репликанти в ${format(1e130)} раз дешевле`,
        effect: () => 1e130
      },
      {
        resource: "vacuum",
        requirement: 0.4,
        description: () => `${wordShift.wordCycle(PelleRifts.vacuum.name)} даёт множитель к получению ОВ`,
        effect: () => Decimal.pow(4, PelleRifts.vacuum.totalFill.log10() / 2 / 308 + 3),
        formatEffect: x => `Множитель ${formatX(x, 2, 2)} к получению ОВ`
      },
    ],
    galaxyGeneratorText: "Места для новых галактик недостаточно. Вы должны заполнить $value"
  },
  decay: {
    id: 2,
    key: "decay",
    name: ["Распад", "Коллапс", "Расстройство"],
    nameObjective: ["Распад", "Коллапс", "Расстройство"],
    drainResource: "Репликанти",
    spendable: true,
    baseEffect: x => `Множитель ${formatX(x, 2, 2)} к скорости репликации`,
    additionalEffects: () => [PelleRifts.decay.milestones[0], PelleRifts.decay.milestones[2]],
    strike: () => PelleStrikes.powerGalaxies,
    // 0 - 1
    percentage: totalFill => totalFill.plus(1).log10() * 0.05 / 100,
    // 0 - 1
    percentageToFill: percentage => Decimal.pow(10, 20 * percentage * 100).minus(1),
    effect: totalFill => (PelleRifts.chaos.milestones[0].canBeApplied
      ? Decimal.sqrt(2000 + 1) : Decimal.sqrt(totalFill.plus(1).log10() + 1)),
    currency: () => Currency.replicanti,
    galaxyGeneratorThreshold: 1e7,
    milestones: [
      {
        resource: "decay",
        requirement: 0.2,
        description: "Множитель к 1-му Измерению Бесконечности в зависимости от количества покупок Улучшения Пелля, дающего множитель к Измерениям Антиматерии",
        effect: () => {
          const x = player.celestials.pelle.rebuyables.antimatterDimensionMult;
          return Decimal.pow(1e50, x - 9);
        },
        formatEffect: x => `Множитель ${formatX(x, 2, 2)} к 1-му Измерению Бесконечности`
      },
      {
        resource: "decay",
        requirement: 0.6,
        description: () => `Когда у вас больше ${format(DC.E1300)} Репликанти,
          галактики на ${formatPercents(0.1)} сильнее`,
        effect: () => (Replicanti.amount.gt(DC.E1300) ? 1.1 : 1)
      },
      {
        resource: "decay",
        requirement: 1,
        description: "Максимальное количество Галактик Репликанти увеличено на значение, зависящее от общего количества достигнутых Этапов Разломов",
        effect: () => {
          const x = PelleRifts.totalMilestones();
          return x ** 2 - 2 * x;
        },
        formatEffect: x => `+${formatInt(x)} к максимальному количеству ГР`
      },
    ],
    galaxyGeneratorText: "Для создания новых галактик недостаточно антиматерии. Вы должны обратить $value вспять"
  },
  chaos: {
    id: 3,
    key: "chaos",
    name: ["Хаос", "Беспорядок", "Случайность"],
    nameObjective: ["Хаос", "Беспорядок", "Случайность"],
    drainResource: ["Распад", "Коллапс", "Расстройство"],
    baseEffect: x => `Множитель ${formatX(x, 2, 2)} к Измерениям Времени`,
    strike: () => PelleStrikes.eternity,
    percentage: totalFill => totalFill / 10,
    percentageToFill: percentage => 10 * percentage,
    effect: totalFill => {
      const fill = totalFill > 6.5
        ? (totalFill - 6.5) / 7 + 6.5
        : totalFill;
      return Decimal.pow(6, Decimal.pow(6, Decimal.pow(6, fill / 10 + 0.1)).minus(6))
        .div(1e5)
        .plus(Decimal.pow(10, fill / 10 + 0.1));
    },
    currency: () => ({
      get value() {
        return PelleRifts.decay.percentage;
      },
      set value(val) {
        const spent = PelleRifts.decay.percentage - val;
        player.celestials.pelle.rifts.decay.percentageSpent += spent;
      }
    }),
    galaxyGeneratorThreshold: 1e9,
    milestones: [
      {
        resource: "chaos",
        requirement: 0.09,
        description: () => `Эффект ${wordShift.wordCycle(["Распада", "Коллапса", "Расстройства"])}
          всегда таков, каков он при заполнении ${wordShift.wordCycle(["Распада", "Коллапса", "Расстройства"])} на ${formatPercents(1)},
          а его Этапы всегда действуют`
      },
      {
        resource: "chaos",
        requirement: 0.15,
        description: "У всех глифов появляется новый эффект в зависимости от типа",
      },
      {
        resource: "chaos",
        requirement: 1,
        description: () => `Ежесекундно вы получаете ${formatPercents(0.01)} от количества ОВ, которое вы могли бы получить при вечности`,
      },
    ],
    galaxyGeneratorText: "Ваши галактики слишком раздробленны. Вы должны упорядочить $value"
  },
  recursion: {
    id: 4,
    key: "recursion",
    name: ["Рекурсия", "Дисперсия", "Разрушение"],
    nameObjective: ["Рекурсию", "Дисперсию", "Разрушение"],
    drainResource: "ОВ",
    baseEffect: x => `Получение ОВ по умолчанию возведено в степень ${formatFloat(308 / (308 - x.toNumber()), 3)}`,
    additionalEffects: () => [PelleRifts.recursion.milestones[0], PelleRifts.recursion.milestones[1]],
    strike: () => PelleStrikes.ECs,
    percentage: totalFill => totalFill.plus(1).log10() ** 0.4 / 4000 ** 0.4,
    percentageToFill: percentage => Decimal.pow(10, percentage ** 2.5 * 4000).minus(1),
    effect: totalFill => new Decimal(58 * totalFill.plus(1).log10() ** 0.2 / 4000 ** 0.2),
    currency: () => Currency.eternityPoints,
    galaxyGeneratorThreshold: 1e10,
    milestones: [
      {
        resource: "recursion",
        requirement: 0.10,
        description: "Множитель ко множителю Расширения Измерений в зависимости от общего количества выполнений Испытаний Вечности",
        effect: () => Math.max(100 * EternityChallenges.completions ** 2, 1) *
          Math.max(1e4 ** (EternityChallenges.completions - 40), 1),
        formatEffect: x => `Множитель ${formatX(x, 2, 2)} ко множителю Расширений Измерений`
      },
      {
        resource: "recursion",
        requirement: 0.15,
        description: "Множитель к Измерениям Бесконечности в зависимости от общего количества выполнений Испытаний Вечности",
        effect: () => Decimal.pow("1e1500", ((EternityChallenges.completions - 25) / 20) ** 1.7).max(1),
        formatEffect: x => `Множитель ${formatX(x)} к Измерениям Бесконечности`
      },
      {
        resource: "recursion",
        requirement: 1,
        description: "Разблокировать возможность разблокировать Генератор Галактик",
      },
    ],
    galaxyGeneratorText: "Дальнейшее создание галактик безрезультатно. Вы должны сосредоточить $value"
  },
  paradox: {
    id: 5,
    key: "paradox",
    name: ["Парадокс", "Противоречие", "Заблуждение"],
    nameObjective: ["Парадокс", "Противоречие", "Заблуждение"],
    drainResource: "ЗВ",
    baseEffect: x => `Множители всех измерений возведены в степень ${formatPow(x, 2, 3)}`,
    additionalEffects: () => [PelleRifts.paradox.milestones[2]],
    strike: () => PelleStrikes.dilation,
    percentage: totalFill => totalFill.plus(1).log10() / 100,
    percentageToFill: percentage => Decimal.pow10(percentage * 100).minus(1),
    effect: totalFill => new Decimal(1 + totalFill.plus(1).log10() * 0.004),
    currency: () => Currency.dilatedTime,
    galaxyGeneratorThreshold: 1e5,
    milestones: [
      {
        resource: "paradox",
        requirement: 0.15,
        description: "Измерения Времени с 5-го по 8-е гораздо дешевле. Разблокировать новые Улучшения Замедления",
        // FIXME: Not a great solution
        onStateChange: () => {
          updateTimeDimensionCosts();
        }
      },
      {
        resource: "paradox",
        requirement: 0.25,
        description: () => `Производство Замедленного Времени в секунду по умолчанию возведено в степень ${format(1.4, 1, 1)}`,
        effect: 1.4
      },
      {
        resource: "paradox",
        requirement: 0.5,
        description: "Множитель к степени эффекта Силы Бесконечности в зависимости от общего количества купленных повторяемых Улучшений Замедления",
        effect: () => Math.min(
          1.1075 ** (Object.values(player.dilation.rebuyables).sum() - 60),
          712
        ),
        formatEffect: x => `Множитель ${formatX(x, 2, 2)} к степени эффекта Силы Бесконечности`
      },
    ],
    galaxyGeneratorText: "Создать большее количество галактик в принципе возможно, но Пелль установил ограничение. Вы должны игнорировать $value"
  }
};
