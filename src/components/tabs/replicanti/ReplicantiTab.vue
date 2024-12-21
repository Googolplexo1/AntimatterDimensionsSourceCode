<script>
import wordShift from "@/core/word-shift";

import ReplicantiUpgradeButton, { ReplicantiUpgradeButtonSetup } from "./ReplicantiUpgradeButton";
import PrimaryButton from "@/components/PrimaryButton";
import ReplicantiGainText from "./ReplicantiGainText";
import ReplicantiGalaxyButton from "./ReplicantiGalaxyButton";

export default {
  name: "ReplicantiTab",
  components: {
    PrimaryButton,
    ReplicantiGainText,
    ReplicantiUpgradeButton,
    ReplicantiGalaxyButton,
  },
  data() {
    return {
      isUnlocked: false,
      isUnlockAffordable: false,
      isInEC8: false,
      ec8Purchases: 0,
      amount: new Decimal(),
      mult: new Decimal(),
      hasTDMult: false,
      multTD: new Decimal(),
      hasDTMult: false,
      multDT: new Decimal(),
      hasIPMult: false,
      multIP: new Decimal(),
      hasRaisedCap: false,
      replicantiCap: new Decimal(),
      capMultText: "",
      distantRG: 0,
      remoteRG: 0,
      effarigInfinityBonusRG: 0,
      isUncapped: false,
      nextEffarigRGThreshold: 0,
      canSeeGalaxyButton: false,
      unlockCost: new Decimal(),
      scrambledText: "",
      maxReplicanti: new Decimal(),
      estimateToMax: 0,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    replicantiChanceSetup() {
      return new ReplicantiUpgradeButtonSetup(
        ReplicantiUpgrade.chance,
        value => `Вероятность: ${formatPercents(value)}`,
        cost => `+${formatPercents(0.01)}; Цена: ${format(cost)} ОБ`
      );
    },
    replicantiIntervalSetup() {
      const upgrade = ReplicantiUpgrade.interval;
      function formatInterval(interval) {
        const actualInterval = upgrade.applyModifiers(interval);
        const intervalNum = actualInterval.toNumber();
        if (
          Number.isFinite(intervalNum) &&
          intervalNum > 1 &&
          upgrade.isCapped
        ) {
          // Checking isCapped() prevents text overflow when formatted as "__ ➜ __"
          return TimeSpan.fromMilliseconds(intervalNum).toStringShort(false);
        }
        if (actualInterval.lt(0.01)) return `< ${format(0.01, 2, 2)}мс`;
        if (actualInterval.gt(1000))
          return `${format(actualInterval.div(1000), 2, 2)}с`;
        return `${format(actualInterval, 2, 2)}мс`;
      }
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => `Интервал: ${formatInterval(value)}`,
        cost =>
          `➜ ${formatInterval(upgrade.nextValue)}; Цена: ${format(cost)} ОБ`
      );
    },
    maxGalaxySetup() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => {
          let description = `Максимальное количество Галактик Репликанти: `;
          const extra = upgrade.extra;
          if (extra > 0) {
            const total = value + extra;
            description += `<br>${formatInt(value)} + ${formatInt(extra)} = ${formatInt(total)}`;
          } else {
            description += formatInt(value);
          }
          return description;
        },
        cost => `+${formatInt(1)}; Цена: ${format(cost)} ОБ`
      );
    },
    boostText() {
      const boostList = [];
      boostList.push(`множитель <span class="c-replicanti-description__accent">${formatX(this.mult, 2, 2)}</span>
        ко всем Измерениям Бесконечности`);
      if (this.hasTDMult) {
        boostList.push(`множитель <span class="c-replicanti-description__accent">${formatX(this.multTD, 2, 2)}</span>
          ко всем Измерениям Времени (Улучшение Замедления)`);
      }
      if (this.hasDTMult) {
        const additionalEffect = GlyphAlteration.isAdded("replication") ? "и скорости репликации " : "";
        boostList.push(`множитель <span class="c-replicanti-description__accent">${formatX(this.multDT, 2, 2)}</span>
          к производству Замедленного Времени ${additionalEffect}(глифы)`);
      }
      if (this.hasIPMult) {
        boostList.push(`множитель <span class="c-replicanti-description__accent">${formatX(this.multIP)}</span>
          к получению Очков Бесконечности (алхимия)`);
      }
      if (boostList.length === 1) return `${boostList[0]}.`;
      return `${boostList.slice(0, -1).join(",<br>")}<br> и ${boostList[boostList.length - 1]}.`;
    },
    hasMaxText: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    toMaxTooltip() {
      if (this.amount.lte(this.replicantiCap)) return null;
      return this.estimateToMax.lt(0.01)
        ? "Возрастает"
        : TimeSpan.fromSeconds(this.estimateToMax.toNumber()).toStringShort();
    }
  },
  methods: {
    update() {
      this.isUnlocked = Replicanti.areUnlocked;
      this.unlockCost = new Decimal(1e140).dividedByEffectOf(PelleRifts.vacuum.milestones[1]);
      if (this.isDoomed) this.scrambledText = this.vacuumText();
      if (!this.isUnlocked) {
        this.isUnlockAffordable = Currency.infinityPoints.gte(this.unlockCost);
        return;
      }
      this.isInEC8 = EternityChallenge(8).isRunning;
      if (this.isInEC8) {
        this.ec8Purchases = player.eterc8repl;
      }
      this.amount.copyFrom(Replicanti.amount);
      this.mult.copyFrom(replicantiMult());
      this.hasTDMult = DilationUpgrade.tdMultReplicanti.isBought;
      this.multTD.copyFrom(DilationUpgrade.tdMultReplicanti.effectValue);
      this.hasDTMult = getAdjustedGlyphEffect("replicationdtgain") !== 0 && !Pelle.isDoomed;
      this.multDT = Math.clampMin(
        Decimal.log10(Replicanti.amount) *
          getAdjustedGlyphEffect("replicationdtgain"),
        1
      );
      this.hasIPMult = AlchemyResource.exponential.amount > 0 && !this.isDoomed;
      this.multIP = Replicanti.amount.powEffectOf(AlchemyResource.exponential);
      this.isUncapped = PelleRifts.vacuum.milestones[1].canBeApplied;
      this.hasRaisedCap = EffarigUnlock.infinity.isUnlocked && !this.isUncapped;
      this.replicantiCap.copyFrom(replicantiCap());
      if (this.hasRaisedCap) {
        const mult = this.replicantiCap.div(Decimal.NUMBER_MAX_VALUE);
        this.capMultText = TimeStudy(31).canBeApplied
          ? `по умолчанию: ${formatX(mult.pow(1 / TimeStudy(31).effectValue), 2)}; с учётом ИсслВ31: ${formatX(mult, 2)}`
          : formatX(mult, 2);
      }
      this.distantRG = ReplicantiUpgrade.galaxies.distantRGStart;
      this.remoteRG = ReplicantiUpgrade.galaxies.remoteRGStart;
      this.effarigInfinityBonusRG = Effarig.bonusRG;
      this.nextEffarigRGThreshold = Decimal.NUMBER_MAX_VALUE.pow(
        Effarig.bonusRG + 2
      );
      this.canSeeGalaxyButton =
        Replicanti.galaxies.max >= 1 || PlayerProgress.eternityUnlocked();
      this.maxReplicanti.copyFrom(player.records.thisReality.maxReplicanti);
      this.estimateToMax = this.calculateEstimate();
    },
    vacuumText() {
      return wordShift.wordCycle(["Вакуума", "Полости", "Пустоты"]);
    },
    // This is copied out of a short segment of ReplicantiGainText with comments and unneeded variables stripped
    calculateEstimate() {
      const updateRateMs = player.options.updateRate;
      const logGainFactorPerTick = Decimal.divide(getGameSpeedupForDisplay() * updateRateMs *
        (Math.log(player.replicanti.chance + 1)), getReplicantiInterval());
      const postScale = Math.log10(ReplicantiGrowth.scaleFactor) / ReplicantiGrowth.scaleLog10;
      const nextMilestone = this.maxReplicanti;
      const coeff = Decimal.divide(updateRateMs / 1000, logGainFactorPerTick.times(postScale));
      return coeff.times(nextMilestone.divide(this.amount).pow(postScale).minus(1));
    }
  },
};
</script>

<template>
  <div class="l-replicanti-tab">
    <br>
    <PrimaryButton
      v-if="!isUnlocked"
      :enabled="isUnlockAffordable"
      class="o-primary-btn--replicanti-unlock"
      onclick="Replicanti.unlock();"
    >
      Разблокировать Репликанти
      <br>
      Цена: {{ format(unlockCost) }} ОБ
    </PrimaryButton>
    <template v-else>
      <div
        v-if="isDoomed"
        class="modified-cap"
      >
        Второй этап {{ scrambledText }} снимает ограничение на количество Репликанти.
      </div>
      <div
        v-else-if="hasRaisedCap"
        class="modified-cap"
      >
        Награда за Реальность Эффарига на слое бесконечности:
        <br>
        Ограничение на Репликанти без ИсслВ192 увеличено до {{ format(replicantiCap, 2) }}
        ({{ capMultText }})
        <br>
        {{ quantifyInt("дополнительная", effarigInfinityBonusRG) }} {{ pluralize("Галактика", effarigInfinityBonusRG) }} Репликанти
        (следующая на ограничении в {{ format(nextEffarigRGThreshold, 2) }})
      </div>
      <p class="c-replicanti-description">
        У вас
        <span class="c-replicanti-description__accent">{{ format(amount, 2, 0) }}</span>
        Репликанти, которые дают вам
        <br>
        <span v-html="boostText" />
      </p>
      <div
        v-if="hasMaxText"
        class="c-replicanti-description"
      >
        Рекордное количество Репликанти в текущей реальности:
        <span
          v-tooltip="toMaxTooltip"
          class="max-accent"
        >{{ format(maxReplicanti, 2) }}</span>.
      </div>
      <br>
      <div v-if="isInEC8">
        {{ quantifyInt("покупка осталась", ec8Purchases) }} (см. условие 8-го Испытания Вечности).
      </div>
      <div class="l-replicanti-upgrade-row">
        <ReplicantiUpgradeButton :setup="replicantiChanceSetup" />
        <ReplicantiUpgradeButton :setup="replicantiIntervalSetup" />
        <ReplicantiUpgradeButton :setup="maxGalaxySetup" />
      </div>
      <div>
        Улучшение, увеличивающее максимальное количество Галактик Репликанти, можно покупать сколь угодно много раз,
        <br>
        но оно дорожает быстрее после {{ quantifyInt("Галактики", distantRG) }} Репликанти,
        а после {{ quantifyInt("Галактики", remoteRG) }} Репликанти - принципиально быстрее.
      </div>
      <br><br>
      <ReplicantiGainText />
      <br>
      <ReplicantiGalaxyButton v-if="canSeeGalaxyButton" />
    </template>
  </div>
</template>

<style scoped>
.max-accent {
  color: var(--color-accent);
  text-shadow: 0 0 0.2rem var(--color-reality-dark);
  cursor: default;
}

.modified-cap {
  margin: -0.8rem 0 0.8rem;
  font-weight: bold;
}
</style>
