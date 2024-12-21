<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SacrificeModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      currentMultiplier: new Decimal(),
      nextMultiplier: new Decimal(),
    };
  },
  computed: {
    message() {
      if (Achievement(118).isUnlocked && !Pelle.isDoomed) {
        return `Пожертвование Измерений даст вам множитель к 8-м Измерениям Антиматерии в зависимости от количества
          1-х Измерений Антиматерии при Пожертвовании.`;
      }
      return `Пожертвование Измерений уничтожит все ваши Измерения Антиматерии с 1-го по 7-е
        (не меняя их цены и множители), но даст множитель к 8-м Измерениям Антиматерии в зависимости от общего
        количества пожертвованных 1-х Измерений Антиматерии. Восстановление производства займёт некоторое время.`;
    },
    multiplierText() {
      return `Множитель в данный момент равен ${formatX(this.currentMultiplier, 2, 2)} и возрастёт до
        ${formatX(this.nextMultiplier, 2, 2)} при Пожертвовании Измерений.`;
    },
  },
  methods: {
    update() {
      this.currentMultiplier.copyFrom(Sacrifice.totalBoost);
      this.nextMultiplier.copyFrom(Sacrifice.nextBoost.times(Sacrifice.totalBoost));
    },
    handleYesClick() {
      sacrificeReset();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrifice"
    @confirm="handleYesClick"
  >
    <template #header>
      Пожертвование Измерений
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ multiplierText }}
      <br>
    </div>
  </ModalWrapperChoice>
</template>
