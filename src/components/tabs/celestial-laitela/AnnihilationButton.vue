<script>
export default {
  name: "AnnihilationButton",
  data() {
    return {
      darkMatter: new Decimal(0),
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      autobuyerUnlocked: false,
      annihilationButtonVisible: false,
      matterRequirement: 0,
      darkMatterMultRatio: 0,
      autoAnnihilationInput: player.auto.annihilation.multiplier,
      isEnabled: true,
    };
  },
  computed: {
    annihilationInputStyle() {
      return { "background-color": this.isEnabled ? "" : "var(--color-bad)" };
    }
  },
  methods: {
    update() {
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.darkMatterMult = Laitela.darkMatterMult;
      this.darkMatterMultGain = Laitela.darkMatterMultGain;
      this.autobuyerUnlocked = Autobuyer.annihilation.isUnlocked;
      this.annihilationButtonVisible = Laitela.canAnnihilate || this.autobuyerUnlocked;
      this.matterRequirement = Laitela.annihilationDMRequirement;
      this.darkMatterMultRatio = Laitela.darkMatterMultRatio;
      this.isEnabled = player.auto.annihilation.isActive;
    },
    annihilate() {
      Laitela.annihilate();
    },
    handleAutoAnnihilationInputChange() {
      const float = parseFloat(this.autoAnnihilationInput);
      if (isNaN(float)) {
        this.autoAnnihilationInput = player.auto.annihilation.multiplier;
      } else {
        player.auto.annihilation.multiplier = float;
      }
    }
  }
};
</script>

<template>
  <div class="l-laitela-annihilation-container">
    <button
      v-if="darkMatter.lt(matterRequirement)"
      class="l-laitela-annihilation-button"
    >
      Для аннигиляции требуется {{ format(matterRequirement, 2) }} Тёмной Материи
    </button>
    <button
      v-else
      class="l-laitela-annihilation-button c-laitela-annihilation-button"
      @click="annihilate"
    >
      <b>Аннигилировать ваши Измерения Тёмной Материи</b>
    </button>
    <br>
    <br>
    <span v-if="darkMatterMult > 1">
      Множитель ко всем Измерениям Тёмной Материи: <b>{{ formatX(darkMatterMult, 2, 2) }}</b>
      <br>
      <br>
      Аннигиляция сбросит количество ваших Тёмной Материи и Измерений Тёмной Материи, но увеличит
      ваш множитель аннигиляции на <b>{{ format(darkMatterMultGain, 2, 2) }}</b>.
      <br>
      (умножит на <b>{{ format(darkMatterMultRatio, 2, 2) }}</b>)
      <span v-if="autobuyerUnlocked">
        <br>
        <br>
        Автоматическая аннигиляция: при увеличении множителя на 
        <input
          v-model="autoAnnihilationInput"
          type="text"
          :style="annihilationInputStyle"
          class="c-small-autobuyer-input c-laitela-annihilation-input"
          @change="handleAutoAnnihilationInputChange()"
        >
        .
      </span>
    </span>
    <span v-else>
      Аннигиляция сбросит количество ваших Тёмной Материи и Измерений Тёмной Материи, но даст вам
      множитель <b>{{ formatX(1 + darkMatterMultGain, 2, 2) }}</b> ко всем Измерениям Тёмной Материи.
    </span>
  </div>
</template>
