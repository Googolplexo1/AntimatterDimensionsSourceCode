<script>
export default {
  name: "SingularityPane",
  data() {
    return {
      darkEnergy: 0,
      darkEnergyGainPerSecond: 0,
      singularities: 0,
      singularityCapIncreases: 0,
      canPerformSingularity: false,
      unlockedBulkSingularity: false,
      singularityCap: 0,
      baseTimeToSingularity: 0,
      currentTimeToSingularity: 0,
      extraTimeAfterSingularity: 0,
      singularitiesGained: 0,
      autoSingularityFactor: 0,
      perStepFactor: 0,
      isAutoEnabled: false,
      hasAutoSingularity: false,
      nextLowerStep: 0,
      willCondenseOnDecrease: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    singularityFormText() {
      const formText = this.singularitiesGained === 1 ? "всю Тёмную Энергию в Сингулярность"
        : `всю Тёмную Энергию в ${quantify("Сингулярность", this.singularitiesGained, 2)}`;
      if (this.canPerformSingularity) {
        return `Сжать ${formText}`;
      }
      return `Достигните ${format(this.singularityCap, 2, 2)} Тёмной Энергии, чтобы сжать ${formText}`;
    },
    singularityWaitText() {
      let singularityTime = this.currentTimeToSingularity;
      if (this.canPerformSingularity) {
        singularityTime += this.extraTimeAfterSingularity;
        if (!this.isAutoEnabled) return "";
        return singularityTime > 0
          ? `(Автоматическое сжатие: через ${TimeSpan.fromSeconds(singularityTime).toStringShort()})`
          : "(Автоматическое сжатие: немедленно при включении)";
      }
      return `(Осталось ${TimeSpan.fromSeconds(singularityTime).toStringShort()})`;
    },
    baseSingularityTime() {
      return TimeSpan.fromSeconds(this.baseTimeToSingularity).toStringShort();
    },
    additionalSingularityTime() {
      return TimeSpan.fromSeconds(this.extraTimeAfterSingularity).toStringShort();
    },
    manualSingularityRate() {
      const totalTime = this.baseTimeToSingularity;
      return this.formatRate(this.singularitiesGained / totalTime);
    },
    autoSingularityRate() {
      if (this.hasAutoSingularity && !this.isAutoEnabled) return "Автоматика сжатия выключена";
      const totalTime = this.baseTimeToSingularity + this.extraTimeAfterSingularity;
      return this.formatRate(this.singularitiesGained / totalTime);
    },
    decreaseTooltip() {
      if (this.singularityCapIncreases === 0) return "Цель не может быть уменьшена!";
      const singularities = this.singularitiesGained / this.perStepFactor;
      return this.willCondenseOnDecrease
        ? `При уменьшении цели автоматически произойдёт сжатие за
          ${quantify("Сингулярность", singularities, 2)}!`
        : null;
    },
    increaseTooltip() {
      return this.singularityCapIncreases >= 50
        ? "Цель не может быть увеличена!"
        : null;
    }
  },
  methods: {
    update() {
      const laitela = player.celestials.laitela;
      this.darkEnergy = Currency.darkEnergy.value;
      this.darkEnergyGainPerSecond = Currency.darkEnergy.productionPerSecond;
      this.singularities = Currency.singularities.value;
      this.singularityCapIncreases = laitela.singularityCapIncreases;
      this.canPerformSingularity = Singularity.capIsReached;
      this.unlockedBulkSingularity = Currency.singularities.gte(10);
      this.singularityCap = Singularity.cap;
      this.baseTimeToSingularity = Singularity.timePerCondense;
      this.currentTimeToSingularity = Singularity.timeUntilCap;
      this.extraTimeAfterSingularity = Singularity.timeDelayFromAuto;
      this.singularitiesGained = Singularity.singularitiesGained;
      this.autoSingularityFactor = SingularityMilestone.autoCondense.effectOrDefault(Infinity);
      this.perStepFactor = Singularity.gainPerCapIncrease;
      this.isAutoEnabled = player.auto.singularity.isActive && SingularityMilestone.autoCondense.canBeApplied;
      this.hasAutoSingularity = Number.isFinite(this.autoSingularityFactor);
      this.nextLowerStep = this.singularityCap * this.autoSingularityFactor / 10;
      this.willCondenseOnDecrease = this.isAutoEnabled && this.darkEnergy > this.nextLowerStep;
    },
    doSingularity() {
      Singularity.perform();
    },
    increaseCap() {
      Singularity.increaseCap();
    },
    decreaseCap() {
      Singularity.decreaseCap();
    },
    formatRate(rate) {
      if (rate < 1 / 60) return `${format(3600 * rate, 2, 3)} в час`;
      if (rate < 1) return `${format(60 * rate, 2, 3)} в минуту`;
      return `${format(rate, 2, 3)} в секунду`;
    },
    condenseClassObject() {
      return {
        "c-laitela-singularity": true,
        "c-laitela-singularity--active": this.canPerformSingularity && !this.isDoomed,
        "o-pelle-disabled": this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed,
      };
    }
  }
};
</script>

<template>
  <div class="c-laitela-singularity-container">
    <div>
      <h2>
        У вас {{ quantify("Сингулярность", singularities, 2) }}
      </h2>
      <button
        :class="condenseClassObject()"
        @click="doSingularity"
      >
        <h2>
          {{ singularityFormText }}
        </h2>
        <br v-if="singularityWaitText !== ''">
        <h2>
          {{ singularityWaitText }}
        </h2>
      </button>
    </div>
    <div v-if="singularities !== 0">
      <div class="o-laitela-matter-amount">
        У вас {{ format(darkEnergy, 2, 4) }} Тёмной Энергии. (+{{ format(darkEnergyGainPerSecond, 2, 4) }}/с)
      </div>
      <div v-if="unlockedBulkSingularity">
        <button
          class="c-laitela-singularity__cap-control"
          :class="{ 'c-laitela-singularity__cap-control--available' : singularityCapIncreases > 0 }"
          :ach-tooltip="decreaseTooltip"
          @click="decreaseCap"
        >
          Уменьшить целевое количество ТЭ.
        </button>
        <button
          class="c-laitela-singularity__cap-control"
          :class="{ 'c-laitela-singularity__cap-control--available' : singularityCapIncreases < 50 }"
          :ach-tooltip="increaseTooltip"
          @click="increaseCap"
        >
          Увеличить целевое количество ТЭ.
        </button>
        <br>
        В то время как целевое количество Тёмной Энергии меняется в {{ format(10) }} раз,
        <br>
        оптовое получение Сингулярностей меняется в {{ format(perStepFactor) }} раз.
      </div>
      <div v-else>
        <br>
        Достигните {{ format(10) }} Сингулярностей,
        <br>
        чтобы разблокировать опт Сингулярностей.
        <br>
      </div>
      <br>
      Времени до <span v-if="hasAutoSingularity">(автоматического)</span> сжатия:
      {{ baseSingularityTime }}
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">
        (+{{ additionalSingularityTime }})
      </span>
      <br>
      Скорость получения сингулярностей
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1"> вручную </span>: {{ manualSingularityRate }}
      <br>
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">
        Скорость получения сингулярностей автоматически: {{ autoSingularityRate }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.c-laitela-singularity__cap-control {
  margin: 0 0.3rem 1rem;
}
</style>
