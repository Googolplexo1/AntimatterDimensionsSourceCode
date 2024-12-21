<script>
export default {
  name: "EffarigRunUnlockReward",
  props: {
    unlock: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isCompleted: false
    };
  },
  computed: {
    descriptionLines() {
      return this.unlock.config.description.split("\n").map(x => x.trim());
    },
    symbol: () => GLYPH_SYMBOLS.effarig,
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.isCompleted = this.unlock.isUnlocked;
      this.isUnlocked = this.isCompleted || Effarig.currentStageName === this.unlock.config.label
    }
  }
};
</script>

<template>
  <div class="l-effarig-tab__reward">
    <div class="c-effarig-tab__reward-label">
      {{ unlock.config.label }}:
    </div>
    <div
      v-if="isUnlocked"
      class="l-effarig-tab__reward-descriptions"
      :class="{ 'c-effarig-reward': isCompleted }"
    >
      <div
        v-for="(description, descriptionKey) in descriptionLines"
        :key="descriptionKey + '-effarig-reward-description'"
        class="c-effarig-tab__reward-description"
      >
        <span class="c-effarig-tab__reward-symbol">
          {{ symbol }}
        </span>
        <span :class="{ 'o-pelle-disabled': isDoomed }">
          {{ description }}
        </span>
      </div>
    </div>
    <span
      v-else
      class="c-effarig-tab__reward-symbol"
    >?</span>
  </div>
</template>