import { DC } from "../../constants";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const replicanti = {
  total: {
    name: "Скорость репликации",
    multValue: () => totalReplicantiSpeedMult(Replicanti.amount.gt(replicantiCap())),
    isActive: () => PlayerProgress.eternityUnlocked(),
    overlay: ["Ξ"],
  },
  achievement: {
    name: "Награда за достижение 134",
    // This is explicitly 2 in the replicanti code as well, inside of a replicanti amount check
    multValue: 2,
    isActive: () => Achievement(134).canBeApplied && Replicanti.amount.lte(replicantiCap()) && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: "Исследования Времени",
    multValue: () => {
      const preReality = Effects.product(TimeStudy(62), TimeStudy(213)) * (TimeStudy(132).isBought ? 1.5 : 1);
      return preReality * (Perk.studyPassive.isBought && TimeStudy(132).isBought ? 2 : 1);
    },
    isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  glyph: {
    name: "Глифы Репликации",
    multValue: () => {
      const baseEffect = (Pelle.isDoomed ? DC.D1 : getAdjustedGlyphEffect("replicationspeed"))
        .times(Pelle.specialGlyphEffect.replication);
      const alteredEffect = Math.clampMin(
        Decimal.log10(Replicanti.amount) * getSecondaryGlyphEffect("replicationdtgain"), 1);
      return GlyphAlteration.isAdded("replication") ? baseEffect.times(alteredEffect) : baseEffect;
    },
    isActive: () => PlayerProgress.realityUnlocked() && (!Pelle.isDoomed || Pelle.specialGlyphEffect.replication > 1),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("replication"),
  },
  amplifierRep: {
    name: `Улучшение Реальности "Репликативный Усилитель"`,
    multValue: () => RealityUpgrade(2).effectOrDefault(1),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  realityUpgrade1: {
    name: `Улучшение Реальности "Космическая Репликация"`,
    multValue: () => RealityUpgrade(6).effectOrDefault(1),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  realityUpgrade2: {
    name: `Улучшение Реальности "Репликативная Быстрота"`,
    multValue: () => RealityUpgrade(23).effectOrDefault(1),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  alchemy: {
    name: `Алхимический ресурс "Репликация"`,
    multValue: () => AlchemyResource.replication.effectOrDefault(1),
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  ra: {
    name: "Этап Ра: 10-й Уровень Ви",
    multValue: () => Ra.unlocks.continuousTTBoost.effects.replicanti.effectOrDefault(1),
    isActive: () => Ra.unlocks.continuousTTBoost.isUnlocked,
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  pelle: {
    name: "Второй Разлом",
    multValue: () => PelleRifts.decay.effectValue,
    isActive: () => Pelle.isDoomed && PelleRifts.decay.effectValue.gt(1),
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: () => ShopPurchase.replicantiPurchases.currentMult,
    isActive: () => ShopPurchaseData.totalSTD > 0 && ShopPurchase.replicantiPurchases.currentMult > 1,
    icon: MultiplierTabIcons.IAP,
  },
};
