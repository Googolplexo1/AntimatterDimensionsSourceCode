import { DC } from "../../constants";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const infinities = {
  total: {
    name: "Получение бесконечностей",
    isBase: true,
    multValue: () => gainedInfinities(),
    // The earliest sources of infinity multipliers are ach87 and TS32, which may happen in either order
    isActive: () => (Achievement(87).isUnlocked || PlayerProgress.eternityUnlocked()) &&
      !EternityChallenge(4).isRunning && !Pelle.isDoomed,
    overlay: ["∞", "<i class='fa-solid fa-arrows-rotate' />"],
  },
  achievement: {
    name: "Награды за достижения",
    multValue: () => DC.D1.timesEffectsOf(
      Achievement(87),
      Achievement(131).effects.infinitiesGain,
      Achievement(164)
    ),
    isActive: () => Achievement(87).isUnlocked,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: "Исследование Времени 32",
    multValue: () => TimeStudy(32).effectOrDefault(1),
    isActive: () => TimeStudy(32).isBought,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  amplifierInf: {
    name: `Улучшение Реальности "Безграничный Усилитель"`,
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(5)),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  realityUpgrades: {
    name: `Улучшение Реальности "Бесчисленное Создание"`,
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(7)),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  glyph: {
    name: "Глифы Бесконечности",
    multValue: () => getAdjustedGlyphEffect("infinityinfmult"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("infinity"),
  },
  ra: {
    name: "Этап Ра: 10-й Уровень Ви",
    multValue: () => Ra.unlocks.continuousTTBoost.effects.infinity.effectOrDefault(1),
    isActive: () => Ra.unlocks.continuousTTBoost.isUnlocked,
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  singularity: {
    name: "Этап Сингулярности",
    powValue: () => SingularityMilestone.infinitiedPow.effectOrDefault(1),
    isActive: () => SingularityMilestone.infinitiedPow.canBeApplied,
    icon: MultiplierTabIcons.SINGULARITY,
  },
};
