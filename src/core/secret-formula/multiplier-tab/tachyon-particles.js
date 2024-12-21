import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const TP = {
  total: {
    name: "Тахионы",
    displayOverride: () => format(new Decimal(Currency.tachyonParticles.value), 2, 2),
    // This is treated as a multiplier and not a prestige currency, with an overridden display;
    // therefore we need to return 1 "by default"
    multValue: () => {
      const baseTP = new Decimal(Currency.tachyonParticles.value)
        .pow(PelleRifts.paradox.milestones[1].effectOrDefault(1));
      return TimeStudy.dilation.isBought ? baseTP : 1;
    },
    isActive: () => PlayerProgress.realityUnlocked() || PlayerProgress.dilationUnlocked(),
    icon: MultiplierTabIcons.TACHYON_PARTICLES,
  },
  base: {
    name: "Получение Тахионов по умолчанию",
    isBase: true,
    multValue: () => new Decimal(Currency.tachyonParticles.value).div(tachyonGainMultiplier()),
    isActive: () => new Decimal(Currency.tachyonParticles.value).gt(0),
    icon: MultiplierTabIcons.TACHYON_PARTICLES,
  },
  achievementMult: {
    name: "Достижения",
    multValue: () => RealityUpgrade(8).effectOrDefault(1),
    isActive: () => RealityUpgrade(8).canBeApplied && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  achievement: {
    name: "Награда за достижение 132",
    multValue: () => Achievement(132).effectOrDefault(1),
    isActive: () => Achievement(132).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  dilation: {
    name: "Утроитель Тахионов",
    multValue: () => DilationUpgrade.tachyonGain.effectOrDefault(1),
    isActive: () => DilationUpgrade.tachyonGain.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  amplifierTP: {
    name: `Улучшение Реальности "Сверхсветовой Усилитель"`,
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(4)),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  realityUpgrade: {
    name: `Улучшение Реальности "Парадоксальное Время"`,
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(15)),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  dilationGlyphSacrifice: {
    name: "Пожертвованные Глифы Замедления",
    multValue: () => GlyphSacrifice.dilation.effectValue,
    isActive: () => GlyphSacrifice.dilation.effectValue > 1,
    icon: MultiplierTabIcons.SACRIFICE("dilation"),
  },
  nerfEnslaved: {
    name: "Условие Реальности Безымянных",
    powValue: () => Enslaved.tachyonNerf,
    isActive: () => Enslaved.isRunning,
    icon: MultiplierTabIcons.GENERIC_ENSLAVED,
  }
};
