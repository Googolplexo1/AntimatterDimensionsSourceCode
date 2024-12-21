import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const eternities = {
  total: {
    name: "Получение вечностей",
    isBase: true,
    multValue: () => gainedEternities(),
    isActive: () => (PlayerProgress.realityUnlocked() || Achievement(113).isUnlocked) && !Pelle.isDoomed,
    overlay: ["Δ", "<i class='fa-solid fa-arrows-rotate' />"],
  },
  achievement: {
    name: "Награда за достижение 113",
    multValue: () => Achievement(113).effectOrDefault(1),
    isActive: () => Achievement(113).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  amplifierEter: {
    name: `Улучшение Реальности "Вечный Усилитель"`,
    multValue: () => RealityUpgrade(3).effectOrDefault(1),
    isActive: () => RealityUpgrade(3).canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  glyph: {
    name: "Глифы Времени",
    multValue: () => getAdjustedGlyphEffect("timeetermult"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  ra: {
    name: "Этап Ра: 10-й Уровень Ви",
    multValue: () => Ra.unlocks.continuousTTBoost.effects.eternity.effectOrDefault(1),
    isActive: () => Ra.unlocks.continuousTTBoost.isUnlocked,
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  alchemy: {
    name: `Алхимический ресурс "Вечность"`,
    powValue: () => AlchemyResource.eternity.effectOrDefault(1),
    isActive: () => AlchemyResource.eternity.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
};
