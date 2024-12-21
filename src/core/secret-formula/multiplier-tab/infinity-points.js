import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const IP = {
  total: {
    name: "Получение ОБ",
    displayOverride: () => (Player.canCrunch
      ? format(gainedInfinityPoints(), 2, 2)
      : "Совершить Большое Сжатие невозможно"),
    // This effectively hides everything if the player can't actually gain any
    multValue: () => (Player.canCrunch ? gainedInfinityPoints() : 1),
    isActive: () => PlayerProgress.infinityUnlocked() || Player.canCrunch,
    dilationEffect: () => (Laitela.isRunning ? 0.75 * Effects.product(DilationUpgrade.dilationPenalty) : 1),
    overlay: ["∞", "<i class='fa-solid fa-layer-group' />"],
  },
  base: {
    name: "По умолчанию",
    isBase: true,
    fakeValue: DC.D5,
    multValue: () => {
      const div = Effects.min(308, Achievement(103), TimeStudy(111));
      return Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75);
    },
    isActive: () => player.break,
    icon: MultiplierTabIcons.CONVERT_FROM("AM"),
  },
  antimatter: {
    name: "Антиматерия",
    displayOverride: () => `${format(player.records.thisInfinity.maxAM, 2, 2)} антиматерии`,
    // Just needs to match the value in base and be larger than 1
    multValue: DC.D5,
    isActive: () => player.break,
    icon: MultiplierTabIcons.ANTIMATTER,
  },
  divisor: {
    name: () => (TimeStudy(111).isBought ? "Исследование Времени 111" : "Награда за достижение 103"),
    powValue: () => 308 / Effects.min(308, Achievement(103), TimeStudy(111)),
    isActive: () => Achievement(103).canBeApplied || TimeStudy(111).isBought,
    icon: () => (TimeStudy(111).isBought ? MultiplierTabIcons.TIME_STUDY : MultiplierTabIcons.ACHIEVEMENT),
  },
  infinityUpgrade: {
    name: "Удвоитель ОБ",
    multValue: () => InfinityUpgrade.ipMult.effectOrDefault(1),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("infinity"),
  },
  achievement: {
    name: "Награды за достижения",
    multValue: () => DC.D1.timesEffectsOf(
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141).effects.ipGain,
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: "Иссследования Времени",
    multValue: () => DC.D1.timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  dilationUpgrade: {
    name: "Улучшение Замедления",
    multValue: () => DilationUpgrade.ipMultDT.effectOrDefault(1),
    isActive: () => DilationUpgrade.ipMultDT.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  glyph: {
    name: "Глифы Бесконечности",
    multValue: () => Pelle.specialGlyphEffect.infinity.times(Pelle.isDoomed ? 1 : getAdjustedGlyphEffect("infinityIP")),
    powValue: () => (GlyphAlteration.isAdded("infinity") ? getSecondaryGlyphEffect("infinityIP") : 1),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("infinity"),
  },
  alchemy: {
    name: "Алхимия",
    multValue: () => Replicanti.amount.powEffectOf(AlchemyResource.exponential),
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  pelle: {
    name: "Первый Разлом",
    multValue: () => DC.D1.timesEffectsOf(PelleRifts.vacuum),
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: () => ShopPurchase.IPPurchases.currentMult,
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
