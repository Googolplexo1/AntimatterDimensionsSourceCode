import { DC } from "../../constants";

const specialInfinityGlyphDisabledEffectText = () => (PelleRifts.chaos.milestones[1].canBeApplied
  ? " Кроме того, новый эффект Глифов Бесконечности отключён."
  : "");

export const eternityChallenges = [
  {
    id: 1,
    description: "Измерения Времени отключены.",
    goal: DC.E1800,
    goalIncrease: DC.E200,
    reward: {
      description: "множитель к Измерениям Времени в зависимости от длительности текущей вечности",
      effect: completions =>
        Decimal.pow(Math.max(player.records.thisEternity.time / 10, 0.9), 0.3 + (completions * 0.05)),
      formatEffect: value => formatX(value, 2, 1)
    },
    // These will get notation-formatted and scrambled between for the final goal
    scrambleText: ["1e2600", "1e201600"],
  },
  {
    id: 2,
    description: "Измерения Бесконечности отключены.",
    goal: DC.E975,
    pelleGoal: DC.E1750,
    goalIncrease: DC.E175,
    reward: {
      description: "множитель к 1-му Измерению Бесконечности в зависимости от количества Силы Бесконечности",
      effect: completions => Currency.infinityPower.value.pow(1.5 / (700 - completions * 100)).clampMin(1),
      cap: DC.E100,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 3,
    description: "Измерения Антиматерии с 5-го по 8-е ничего не производят. Пожертвование Измерений недоступно.",
    goal: DC.E600,
    pelleGoal: DC.E925,
    goalIncrease: DC.E75,
    reward: {
      description: () => `увеличить множитель за покупку ${formatInt(10)} Измерений Антиматерии`,
      effect: completions => completions * 0.72,
      formatEffect: value => `+${format(value, 2, 2)}`
    }
  },
  {
    id: 4,
    description: `все множители и производители бесконечностей отключены. Существует ограничение на
      количество бесконечностей, при нарушении которого вы провалите Испытание.`,
    goal: DC.E2750,
    goalIncrease: DC.E550,
    restriction: completions => Math.max(16 - 4 * completions, 0),
    checkRestriction: restriction => Currency.infinities.lte(restriction),
    formatRestriction: restriction => (restriction === 0
      ? "без бесконечностей"
      : `за ${quantifyInt("бесконечность", restriction)}`),
    failedRestriction: "(слишком много бесконечностей для следующего выполнения)",
    reward: {
      description: "множитель к Измерениям Бесконечности в зависимости от количества Очков Бесконечности",
      effect: completions => Currency.infinityPoints.value.pow(0.003 + completions * 0.002),
      cap: DC.E200,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 5,
    description: () => `наценка на Далёкие Галактики начинается сразу.
      Цена Расширений Измерений растёт принципиально быстрее.`,
    goal: DC.E750,
    pelleGoal: DC.E1400,
    goalIncrease: DC.E400,
    reward: {
      description: "наценка на Далёкие Галактики начинается позже",
      effect: completions => completions * 5,
      formatEffect: value => `на ${formatInt(value)} ГА позже`
    }
  },
  {
    id: 6,
    // The asterisk, if present, will get replaced with strings generated from the scramble text
    description: () => {
      if (Enslaved.isRunning) return "вы *, зато первые две наценки на Улучшение Репликанти, увеличивающее максимальное количество Галактик Репликанти, гораздо ниже.";
      return "вы не можете получать Галактики Антиматерии обычным способом, зато первые две наценки на Улучшение Репликанти," +
              " увеличивающее максимальное количество Галактик Репликанти, гораздо ниже.";
    },
    goal: DC.E850,
    pelleGoal: DC.E1500,
    goalIncrease: DC.E250,
    reward: {
      description: "уменьшить вторую наценку на Измерения Антиматерии",
      effect: completions => completions * 0.2,
      formatEffect: value => {
        const total = Math.round(Player.dimensionMultDecrease + Effects.sum(EternityChallenge(6).reward)) - value;
        return `-${format(value, 2, 1)} (до ${formatX(total, 2, 1)})`;
      }
    },
    scrambleText: ["не можете получать Галактики Антиматерии обычным способом", "c㏰'퐚 gai鸭 Anti꟢at랜erﻪﶓa⁍axie㮾 䂇orma㦂l"],
  },
  {
    id: 7,
    description:
      "1-е Измерение Времени производит 8-е Измерения Бесконечности вместо Осколков Времени, а 1-е Измерение Бесконечности" +
      " производит 7-е Измерения Антиматерии вместо Силы Бесконечности, зато скорость тика влияет на Измерения Бесконечности и Времени.",
    goal: DC.E2000,
    pelleGoal: DC.E2700,
    goalIncrease: DC.E530,
    effect: () => TimeDimension(1).productionPerSecond,
    reward: {
      description: "вы производите 8-е Измерения Бесконечности в зависимости от производства 1-го Измерения Времени",
      effect: completions => TimeDimension(1).productionPerSecond.pow(completions * 0.2).minus(1).clampMin(0),
      formatEffect: value => `${format(value, 2, 1)}/с`
    }
  },
  {
    id: 8,
    description: () => `вы можете купить не более ${formatInt(50)} десятков Измерений Бесконечности и не более
      ${formatInt(40)} Улучшений Репликанти. Соответствующая автоматика отключена.`,
    goal: DC.E1300,
    pelleGoal: DC.E2800,
    goalIncrease: DC.E900,
    reward: {
      description: "Галактики Репликанти сильнее в зависимости от количества Силы Бесконечности",
      effect: completions => {
        const infinityPower = Math.log10(Currency.infinityPower.value.pLog10() + 1);
        return Math.max(0, Math.pow(infinityPower, 0.03 * completions) - 1);
      },
      formatEffect: value => `на ${formatPercents(value, 2)}`
    }
  },
  {
    id: 9,
    description: () => `ускорители недоступны. Множитель от Силы Бесконечности принципиально ниже,
      зато действует на Измерения Времени вместо Измерений Антиматерии.${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E1750,
    pelleGoal: DC.E2900,
    goalIncrease: DC.E250,
    reward: {
      description: "множитель к Измерениям Бесконечности в зависимости от количества Осколков Времени",
      effect: completions => Currency.timeShards.value.pow(completions * 0.1).clampMin(1),
      cap: DC.E400,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 10,
    description: () => {
      let description = `Измерения Бесконечности и Времени отключены, зато Измерения Антиматерии получают огромный
        множитель в зависимости от количества бесконечностей (x${formatPow(950)}).${specialInfinityGlyphDisabledEffectText()}`;
      EternityChallenge(10).applyEffect(v => description += ` Сейчас: ${formatX(v, 2, 1)}`);
      return description;
    },
    goal: DC.E3000,
    pelleGoal: DC.E3200,
    goalIncrease: DC.E300,
    effect: () => Decimal.pow(Currency.infinitiesTotal.value, 950).clampMin(1).pow(TimeStudy(31).effectOrDefault(1)),
    reward: {
      description: "множитель к Измерениям Времени в зависимости от количества бесконечностей",
      effect: completions => {
        const mult = Currency.infinitiesTotal.value.times(2.783e-6).pow(0.4 + 0.1 * completions).clampMin(1);
        return mult.powEffectOf(TimeStudy(31));
      },
      formatEffect: value => {
        // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
        const mult = formatX(value, 2, 1);
        return TimeStudy(31).canBeApplied
          ? `${formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1)} (С учётом ИсслВ31: ${mult})`
          : mult;
      }
    }
  },
  {
    id: 11,
    description: () => `все множители к измерениям и эффекты, возводящие их множители в степень, отключены, кроме
      эффектов Силы Бесконечности и Расширений Измерений.${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E450,
    pelleGoal: DC.E11200,
    goalIncrease: DC.E200,
    pelleGoalIncrease: DC.E1400,
    reward: {
      description: "уменьшить вторую наценку на ускорители",
      effect: completions => completions * 0.07,
      formatEffect: value => {
        const total = Math.round(Player.tickSpeedMultDecrease + Effects.sum(EternityChallenge(11).reward)) - value;
        return `-${format(value, 2, 2)} (до ${formatX(total, 2, 2)})`;
      }
    }
  },
  {
    id: 12,
    description: () => (player.blackHole[0].unlocked
      ? `скорость игры равна ${format(0.001, 3, 3)} и не меняется ни при каких обстоятельствах. Испытание должно быть
        выполнено за ограниченное время, иначе вы провалите его.${specialInfinityGlyphDisabledEffectText()}`
      : `вся игра, кроме автоматики, работает в ${formatInt(1000)} раз медленнее. Испытание должно быть
        выполнено за ограниченное время, иначе вы провалите его.`),
    goal: DC.E110000,
    pelleGoal: DC.E208000,
    goalIncrease: DC.E12000,
    restriction: completions => Math.max(10 - 2 * completions, 1) / 10,
    checkRestriction: restriction => Time.thisEternity.totalSeconds < restriction,
    formatRestriction: restriction => `за ${format(restriction, 0, 1)} секунды игрового времени`,
    failedRestriction: "(слишком долгое время для следующего выполнения)",
    reward: {
      description: "наценки на Измерения Бесконечности возведены в степень",
      effect: completions => 1 - completions * 0.008,
      formatEffect: value => `${formatPow(value, 3, 3)}`
    }
  }
];
