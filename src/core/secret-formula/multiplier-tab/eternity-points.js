import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const EP = {
  total: {
    name: "Получение ОВ",
    displayOverride: () => (Player.canEternity
      ? format(gainedEternityPoints(), 2, 2)
      : "Совершить вечность невозможно"),
    // This effectively hides everything if the player can't actually gain any
    multValue: () => (Player.canEternity ? gainedEternityPoints() : 1),
    isActive: () => PlayerProgress.eternityUnlocked() || Player.canEternity,
    dilationEffect: () => (Laitela.isRunning ? 0.75 * Effects.product(DilationUpgrade.dilationPenalty) : 1),
    overlay: ["Δ", "<i class='fa-solid fa-layer-group' />"],
  },
  base: {
    name: "По умолчанию",
    isBase: true,
    fakeValue: DC.D5,
    multValue: () => DC.D5.pow(player.records.thisEternity.maxIP.plus(
      gainedInfinityPoints()).log10() / (308 - PelleRifts.recursion.effectValue.toNumber()) - 0.7),
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.CONVERT_FROM("IP"),
  },
  IP: {
    name: "Очки Бесконечности",
    displayOverride: () => `${format(player.records.thisEternity.maxIP.plus(gainedInfinityPoints()), 2, 2)} ОБ`,
    // Just needs to match the value in base and be larger than 1
    multValue: DC.D5,
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("infinity"),
  },
  divisor: {
    name: "Четвёртый Разлом",
    powValue: () => 308 / (308 - PelleRifts.recursion.effectValue.toNumber()),
    isActive: () => PelleRifts.recursion.canBeApplied,
    icon: MultiplierTabIcons.PELLE,
  },
  eternityUpgrade: {
    name: () => `Упятеритель ОВ`,
    multValue: () => EternityUpgrade.epMult.effectOrDefault(1),
    isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("eternity"),
  },
  timeStudy: {
    name: "Исследования Времени",
    multValue: () => DC.D1.timesEffectsOf(
      TimeStudy(61),
      TimeStudy(121),
      TimeStudy(122),
      TimeStudy(123),
    ),
    isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  glyph: {
    name: "Глифы Времени",
    multValue: () => DC.D1
      .timesEffectsOf(Pelle.isDoomed ? null : GlyphEffect.epMult)
      .times(Pelle.specialGlyphEffect.time),
    powValue: () => (GlyphAlteration.isAdded("time") ? getSecondaryGlyphEffect("timeEP") : 1),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("time"),
  },
  realityUpgrade: {
    name: `Улучшение Реальности "Знающее Бытие"`,
    multValue: () => RealityUpgrade(12).effectOrDefault(1),
    isActive: () => RealityUpgrade(12).canBeApplied && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  pelle: {
    name: "Этап Первого Разлома",
    multValue: () => PelleRifts.vacuum.milestones[2].effectOrDefault(1),
    isActive: () => PelleRifts.vacuum.milestones[2].canBeApplied,
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: () => ShopPurchase.EPPurchases.currentMult,
    isActive: () => ShopPurchaseData.totalSTD > 0,
    icon: MultiplierTabIcons.IAP,
  },
  nerfTeresa: {
    name: "Условие Реальности Терезы",
    powValue: () => 0.55,
    isActive: () => Teresa.isRunning,
    icon: MultiplierTabIcons.GENERIC_TERESA,
  },
  nerfV: {
    name: "Условие Реальности Ви",
    powValue: () => 0.5,
    isActive: () => V.isRunning,
    icon: MultiplierTabIcons.GENERIC_V,
  },
};
