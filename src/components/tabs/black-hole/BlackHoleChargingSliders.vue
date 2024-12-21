<script>
import { Laitela } from "@/core/globals";

import SliderComponent from "@/components/SliderComponent";

export default {
  name: "BlackHoleChargingSliders",
  components: {
    SliderComponent
  },
  data() {
    return {
      isNegativeBHUnlocked: false,
      isInverted: false,
      isLaitela: false,
      negativeSlider: 0,
      negativeBHDivisor: 1,
      maxNegativeBlackHole: 300,
      isDisabled: false,
    };
  },
  computed: {
    infoTooltip() {
      return this.isLaitela
        ? "Физика этой реальности несовместима с инверсией Чёрных Дыр"
        : "Чёрная Дыра должна быть приостановлена при инверсии";
    },
    reqLockText() {
      return `Сила инверсии не может быть изменена из-за требования Мнимого Улучшения`;
    }
  },
  methods: {
    update() {
      this.isNegativeBHUnlocked = V.isFlipped && BlackHoles.arePermanent;
      this.isInverted = BlackHoles.areNegative;
      this.isLaitela = Laitela.isRunning;
      this.negativeSlider = -Math.log10(player.blackHoleNegative);
      this.negativeBHDivisor = Math.pow(10, this.negativeSlider);
      const maxInversion = player.requirementChecks.reality.slowestBH <= 1e-300;
      this.isDisabled = ImaginaryUpgrade(24).isLockingMechanics && Ra.isRunning && maxInversion;
    },
    adjustSliderNegative(value) {
      this.negativeSlider = value;
      player.blackHoleNegative = Math.pow(10, -this.negativeSlider);
      player.requirementChecks.reality.slowestBH = Math.max(
        player.requirementChecks.reality.slowestBH,
        player.blackHoleNegative
      );
    },
    sliderProps(negative) {
      return {
        min: 0,
        max: negative ? this.maxNegativeBlackHole : 990,
        interval: 1,
        width: "57rem",
        tooltip: false
      };
    },
  }
};
</script>

<template>
  <div>
    <div
      v-if="isNegativeBHUnlocked"
      class="l-black-hole-sliders"
    >
      <b>
        Инвертированная Чёрная Дыра делит скорость игры на {{ format(negativeBHDivisor, 2, 2) }}.
        (В данный момент {{ isInverted ? "включено" : "отключено" }}<span
          v-if="negativeSlider !== 0 && !isInverted"
          :ach-tooltip="infoTooltip"
        >
          <i class="fas fa-question-circle l-margin-left" />
        </span>)
      </b>
      <SliderComponent
        v-if="!isDisabled"
        v-bind="sliderProps(true)"
        :value="negativeSlider"
        @input="adjustSliderNegative($event)"
      />
      <div
        v-else
        class="l-lock-text"
      >
        {{ reqLockText }}
      </div>
      <br>
      Инверсия Чёрной Дыры влияет только на её собственный эффект, а не на финальную скорость игры, хотя
      она также влияет на фактическое значение эффекта Глифа Эффарига, возводящего скорость игры в степень.
    </div>
  </div>
</template>

<style scoped>
.l-black-hole-sliders {
  width: 57rem;
  color: var(--color-text);
}

.l-margin-left {
  margin-left: 0.5rem;
}

.l-lock-text {
  font-weight: bold;
  color: var(--color-bad);
  margin: 0.5rem 0 -0.5rem;
}
</style>
