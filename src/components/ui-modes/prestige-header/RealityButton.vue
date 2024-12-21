<script>
export default {
  name: "RealityButton",
  data() {
    return {
      canReality: false,
      showSpecialEffect: false,
      hasRealityStudy: false,
      machinesGained: new Decimal(0),
      newIMCap: 0,
      realityTime: 0,
      glyphLevel: 0,
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: 0,
      currentShardsRate: 0,
      bestMachineRate: new Decimal(0),
      bestMachineRateVal: new Decimal(0),
      bestShardRate: 0,
      bestShardRateVal: 0,
      ppGained: 0,
      willAmplify: false,
      celestialRunText: ["", "", "", "", ""]
    };
  },
  computed: {
    formatMachinesGained() {
      if (this.machinesGained.gt(0)) return `Машин Реальности: ${format(this.machinesGained, 2)}`;
      return "Достигнут предел МР";
    },
    formatMachineStats() {
      if (!PlayerProgress.realityUnlocked() && this.nextMachineEP.gt("1e8000")) {
        return `(Ограничено на текущую реальность!)`;
      }
      if (this.machinesGained.gt(0) && this.machinesGained.lt(100)) {
        return `(Следующая на ${format(this.nextMachineEP, 2)} ОВ)`;
      }
      if (this.machinesGained.eq(0) && this.newIMCap === 0) {
        return `(Теоретически: ${format(this.projectedRM, 2)} МР)`;
      }
      if (this.newIMCap !== 0) {
        return `(Предел ММ: ${format(this.newIMCap, 2)})`;
      }
      if (this.machinesGained.lt(Number.MAX_VALUE) && !this.willAmplify) {
        return `(${format(this.machinesGained.divide(this.realityTime), 2, 2)} МР/мин)`;
      }
      return "";
    },
    additionalRMText() {
      if (this.newIMCap !== 0) {
        return `Теоретически: ${format(this.projectedRM, 2)} МР`;
      }
      if (!this.willAmplify && this.machinesGained.gte(100) && this.machinesGained.lt(Number.MAX_VALUE)) {
        return `Пик МР: ${format(this.bestMachineRate, 2)}/мин на ${format(this.bestMachineRateVal, 2)} МР`;
      }
      return "";
    },
    formatGlyphLevel() {
      if (this.glyphLevel >= 10000) return `Уровень глифа: ${formatInt(this.glyphLevel)}`;
      return `Уровень глифа: ${formatInt(this.glyphLevel)} (${this.nextGlyphPercent} до следующего)`;
    },
    showShardsRate() {
      return this.currentShardsRate;
    },
    shardsGainedText() {
      return quantify("Реликтовый Осколок", this.shardsGained, 2);
    },
    classObject() {
      return {
        "c-reality-button--unlocked": this.canReality,
        "c-reality-button--locked": !this.canReality,
        "c-reality-button--special": this.showSpecialEffect,
      };
    }
  },
  methods: {
    percentToNextGlyphLevelText() {
      const glyphState = getGlyphLevelInputs();
      let level = glyphState.actualLevel;
      if (!isFinite(level)) level = 0;
      const decimalPoints = this.glyphLevel > 1000 ? 0 : 1;
      return `${formatPercents(Math.min(((level - Math.floor(level))), 0.999), decimalPoints)}`;
    },
    update() {
      this.hasRealityStudy = TimeStudy.reality.isBought;
      this.canReality = isRealityAvailable();
      this.showSpecialEffect = this.hasSpecialReward();
      if (!this.canReality) {
        this.shardsGained = 0;
        return;
      }
      function EPforRM(rm) {
        const adjusted = Decimal.divide(rm, MachineHandler.realityMachineMultiplier);
        if (adjusted.lte(1)) return Decimal.pow10(4000);
        if (adjusted.lte(10)) return Decimal.pow10(4000 / 27 * (adjusted.toNumber() + 26));
        let result = Decimal.pow10(4000 * (adjusted.log10() / 3 + 1));
        if (!PlayerProgress.realityUnlocked() && result.gte("1e6000")) {
          result = result.div("1e6000").pow(4).times("1e6000");
        }
        return result;
      }

      const multiplier = simulatedRealityCount(false) + 1;
      this.willAmplify = Enslaved.boostReality;
      this.projectedRM = MachineHandler.uncappedRM;
      this.newIMCap = MachineHandler.projectedIMCap;
      this.machinesGained = gainedRealityMachines(true);
      this.realityTime = Time.thisRealityRealTime.totalMinutes;
      this.glyphLevel = gainedGlyphLevel().actualLevel;
      this.nextGlyphPercent = this.percentToNextGlyphLevelText();
      this.nextMachineEP = EPforRM(this.machinesGained.plus(1));
      this.ppGained = multiplier;
      this.shardsGained = Effarig.shardsGained * multiplier;
      this.currentShardsRate = (this.shardsGained / Time.thisRealityRealTime.totalMinutes);
      this.bestMachineRate = player.records.thisReality.bestRMmin;
      this.bestMachineRateVal = player.records.thisReality.bestRMminVal;
      this.bestShardRate = player.records.thisReality.bestRSmin * multiplier;
      this.bestShardRateVal = player.records.thisReality.bestRSminVal * multiplier;

      const teresaReward = this.formatScalingMultiplierText(
        "Награда за Реальность Терезы:",
        Teresa.runRewardMultiplier,
        Math.max(Teresa.runRewardMultiplier, Teresa.rewardMultiplier(Currency.antimatter.value)));
      const teresaThreshold = this.formatThresholdText(
        Teresa.rewardMultiplier(Currency.antimatter.value) > Teresa.runRewardMultiplier,
        player.celestials.teresa.bestRunAM,
        "антиматерии");
      this.celestialRunText = [
        [Teresa.isRunning, teresaReward, teresaThreshold]];
    },
    handleClick() {
      if (this.canReality) {
        requestManualReality();
      }
    },
    formatScalingMultiplierText(resource, before, after) {
      return `${resource} ${formatX(before, 2, 2)} ➜ ${formatX(after, 2, 2)}`;
    },
    formatThresholdText(condition, threshold, resourceName) {
      if (condition) return "";
      return `(необходимо ${format(threshold, 2, 2)} ${resourceName} для улучшения)`;
    },
    // Make the button have a visual animation if Realitying will give a reward
    hasSpecialReward() {
      if (Teresa.isRunning && Teresa.rewardMultiplier(Currency.antimatter.value) > Teresa.runRewardMultiplier) {
        return true;
      }
      return Currency.eternityPoints.value.exponent > 4000 &&
        ((Effarig.isRunning && !EffarigUnlock.reality.isUnlocked) || (Enslaved.isRunning && !Enslaved.isCompleted));
    }
  }
};
</script>

<template>
  <div class="l-reality-button">
    <button
      class="c-reality-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-reality-button__contents">
        <template v-if="canReality">
          <div class="c-reality-button__header">
            Создать новую реальность
          </div>
          <div>{{ formatMachinesGained }} {{ formatMachineStats }}</div>
          <div>{{ formatGlyphLevel }}</div>
        </template>
        <template v-else>
          <div>Разблокируйте реальность в Древе Исследований</div>
        </template>
        <div
          v-if="canReality"
          class="infotooltiptext"
        >
          <div>{{ additionalRMText }}</div>
          <div>Получение других ресурсов:</div>
          <div>{{ quantifyInt("Очко", ppGained) }} Умения</div>
          <div v-if="shardsGained !== 0">
            {{ shardsGainedText }}<span v-if="!willAmplify"> ({{ format(currentShardsRate, 2) }}/мин)
            <br>
            Пик: {{ format(bestShardRate, 2) }}/мин на {{ format(bestShardRateVal, 2) }} РО</span>
          </div>
          <div
            v-for="(celestialInfo, i) in celestialRunText"
            :key="i"
          >
            <span v-if="celestialInfo[0]">
              {{ celestialInfo[1] }}
              <br>
              {{ celestialInfo[2] }}
            </span>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
