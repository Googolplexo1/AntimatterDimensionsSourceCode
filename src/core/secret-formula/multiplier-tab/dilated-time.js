import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
// Note most of the isActive entries in here have redundant-looking DT/s != 0 checks because DT is treated as a
// special case due to not being a prestige currency but still needing to be treated like one in the UI. This
// is because it requires dilation to be unlocked, which isn't a given, and we want the tab continuously visible
// after the first ever dilation unlock on the 0th reality
export const DT = {
  total: {
    name: "Производство Замедленного Времени",
    displayOverride: () => `${format(getDilationGainPerSecond().times(getGameSpeedupForDisplay()), 2, 2)}/с`,
    multValue: () => getDilationGainPerSecond().times(getGameSpeedupForDisplay()),
    isActive: () => PlayerProgress.realityUnlocked() ||
      (PlayerProgress.dilationUnlocked() && getDilationGainPerSecond().gt(0)),
    dilationEffect: () => (Enslaved.isRunning ? 0.85 : 1),
    overlay: ["Ψ"],
  },
  achievement: {
    name: "Награды за достижения",
    multValue: () => Achievement(132).effectOrDefault(1) * Achievement(137).effectOrDefault(1),
    isActive: () => (Achievement(132).canBeApplied || Achievement(137).canBeApplied) &&
      getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  dilation: {
    name: "Улучшения Замедления",
    multValue: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ),
    isActive: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ).gt(1),
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  amplifierDT: {
    name: `Улучшение Реальности "Временной Усилитель"`,
    multValue: () => RealityUpgrade(1).effectOrDefault(1),
    isActive: () => RealityUpgrade(1).canBeApplied && getDilationGainPerSecond().neq(0) && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  glyph: {
    name: "Глифы",
    multValue: () => {
      const dtMult = getAdjustedGlyphEffect("dilationDT").times(Pelle.specialGlyphEffect.dilation);
      const repliDT = Replicanti.areUnlocked
        ? Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1)
        : DC.D1;
      return dtMult.times(repliDT);
    },
    isActive: () => PlayerProgress.realityUnlocked() && getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.GENERIC_GLYPH
  },
  ra1: {
    name: "Этап Ра: 10-й Уровень Ви",
    multValue: () => DC.D1.timesEffectsOf(Ra.unlocks.continuousTTBoost.effects.dilatedTime),
    isActive: () => Ra.unlocks.autoTP.canBeApplied && getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  ra2: {
    name: "Этап Ра: 15-й Уровень Безымянных",
    multValue: () => DC.D1.timesEffectsOf(Ra.unlocks.peakGamespeedDT),
    isActive: () => Ra.unlocks.autoTP.canBeApplied && getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  alchemy: {
    name: () => `Алхимический ресурс "Замедление"`,
    multValue: () => AlchemyResource.dilation.effectOrDefault(1),
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied && getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.ALCHEMY,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: () => new Decimal(ShopPurchase.dilatedTimePurchases.currentMult ** (Pelle.isDoomed ? 0.5 : 1)),
    isActive: () => ShopPurchaseData.totalSTD > 0 && getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.IAP,
  },
  nerfV: {
    name: "Условие Реальности Ви",
    powValue: 0.5,
    isActive: () => V.isRunning && getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.GENERIC_V,
  },
  nerfPelle: {
    name: "Условие Обречённой Реальности",
    multValue: 1e-5,
    isActive: () => Pelle.isDoomed && getDilationGainPerSecond().neq(0),
    icon: MultiplierTabIcons.PELLE,
  },
};
