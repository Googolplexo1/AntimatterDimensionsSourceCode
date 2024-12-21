<script>
export default {
  name: "RealityAmplifyButton",
  data: () => ({
    isDoomed: false,
    isVisible: false,
    isDisabled: false,
    isActive: false,
    ratio: 1,
    canAmplify: false,
  }),
  computed: {
    tooltip() {
      if (!this.canAmplify && !this.isDoomed) {
        return "Чтобы усилить реальность, необходимо либо сохранить больше реального времени, либо совершить её быстрее";
      }
      return null;
    },
    buttonClass() {
      return {
        "l-reality-amplify-button": true,
        "l-reality-amplify-button--clickable": !this.isDoomed && this.canAmplify,
        "o-enslaved-mechanic-button--storing-time": this.isActive,
      };
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isVisible = Enslaved.isUnlocked;
      this.isDisabled = isInCelestialReality();
      this.isActive = Enslaved.boostReality;
      this.ratio = Enslaved.realityBoostRatio;
      this.canAmplify = Enslaved.canAmplify;
    },
    toggleActive() {
      if (!this.canAmplify) return;
      Enslaved.boostReality = !Enslaved.boostReality;
    }
  }
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClass"
    :ach-tooltip="tooltip"
    @click="toggleActive"
  >
    <div v-if="isDoomed">
      Невозможно усилить Обречённую Реальность.
    </div>
    <div v-else-if="canAmplify">
      <span v-if="isActive">Реальность будет усилена:</span>
      <span v-else>Усилить текущую реальность:</span>
      <br>
      Множитель ×{{ formatInt(ratio) }} ко всем наградам
    </div>
    <div v-else>
      Недостаточно сохранённого реального времени.
    </div>
  </button>
</template>

<style scoped>

</style>
