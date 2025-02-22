import { DC } from "../../constants";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const tickspeed = {
  total: {
    name: "Скорость тика",
    displayOverride: dimType => {
      const tickRate = Tickspeed.perSecond;
      if (!dimType) return `${format(tickRate, 2, 2)}`;
      const activeDims = MultiplierTabHelper.activeDimCount(dimType);
      return `${format(tickRate, 2, 2)} (с учётом количества измерений:
        ${formatX(tickRate.pow(activeDims), 2, 2)})`;
    },
    // This is necessary to make multValue entries from the other props scale properly, which are also all pow10
    // due to the multiplier tab splitting up entries logarithmically
    fakeValue: DC.E100,
    multValue: () => Tickspeed.perSecond,
    // No point in showing this breakdown at all unless both components are nonzero; however they will always be nonzero
    // due to the way the calculation works, so we have to manually hide it here
    isActive: dimType => Tickspeed.perSecond.gt(1) && (dimType === "AD" || EternityChallenge(7).isRunning),
    dilationEffect: () => {
      const baseEff = (player.dilation.active || Enslaved.isRunning)
        ? 0.75 * Effects.product(DilationUpgrade.dilationPenalty)
        : 1;
      return baseEff * (Effarig.isRunning ? Effarig.tickDilation : 1);
    },
    dimCount: dimType => (dimType ? MultiplierTabHelper.activeDimCount(dimType) : 1),
    overlay: ["<i class='fa-solid fa-clock' />"],
    icon: MultiplierTabIcons.TICKSPEED,
  },
  base: {
    name: "Награды за достижения",
    multValue: () => {
      return DC.D1.dividedByEffectsOf(
        Achievement(36),
        Achievement(45),
        Achievement(66),
        Achievement(83)
      ).pow(DilationUpgrade.tickspeedPower.effectOrDefault(1));
    },
    ignoresNerfPowers: true,
    isActive: () => [36, 45, 66, 83].some(a => Achievement(a).canBeApplied),
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  upgrades: {
    name: "Ускорители",
    displayOverride: () => `${formatInt(Tickspeed.totalUpgrades)}`,
    multValue: () => {
      let baseMultiplier = 1.1245;
      if (NormalChallenge(5).isRunning) baseMultiplier = 1.08;
      return baseMultiplier.toDecimal().pow(Tickspeed.totalUpgrades);
    },
    isActive: true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  galaxies: {
    name: "Галактики",
    displayOverride: () => {
      const ag = player.galaxies + GalaxyGenerator.galaxies;
      const rg = Replicanti.galaxies.total;
      const tg = player.dilation.totalTachyonGalaxies;
      return `${formatInt(ag + rg + tg)}`;
    },
    powValue: () => {
      let baseMultiplier = 1 / 1.1245;
      if (NormalChallenge(5).isRunning) baseMultiplier = 1 / 1.08;
      return Tickspeed.multiplier.log10() / Math.log10(baseMultiplier);
    },
    fakeValue: DC.E1,
    isActive: true,
    icon: MultiplierTabIcons.GALAXY,
  },
  pelleTickspeedPow: {
    name: "Улучшение Замедления",
    powValue: () => DilationUpgrade.tickspeedPower.effectValue,
    isActive: () => DilationUpgrade.tickspeedPower.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
};

export const tickspeedUpgrades = {
  purchased: {
    name: "Купленные",
    displayOverride: () => (Laitela.continuumActive
      ? formatFloat(Tickspeed.continuumValue, 2, 2)
      : formatInt(player.totalTickBought)),
    multValue: () => Decimal.pow10(Laitela.continuumActive ? Tickspeed.continuumValue : player.totalTickBought),
    isActive: () => true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  free: {
    name: "Полученные от ИВ",
    displayOverride: () => formatInt(player.totalTickGained),
    multValue: () => Decimal.pow10(player.totalTickGained),
    isActive: () => Currency.timeShards.gt(0),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("time"),
  }
};
