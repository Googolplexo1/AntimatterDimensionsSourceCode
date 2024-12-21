<script>
import FullScreenAnimationHandler from "@/core/full-screen-animation-handler";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterDilationModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      return `Замедление Времени начнёт новую вечность, в которой порядки всех множителей Измерений и
        скорости тика будут возведены в степень ${formatPow(0.75, 2, 2)}. Если вы совершите вечность в Замедлении,
        количество ваших Тахионов возрастёт до определённого значения в зависимости от максимального
        количества антиматерии, достигнутого вами в Замедлении.`;
    },
    entranceLabel() {
      return `Вы замедляете Время`;
    },
    EPSinceLabel() {
      if (player.dilation.lastEP.eq(-1)) {
        return "Это ваше первое Замедление";
      }
      if (!isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied) {
        return `Вы уже получили достаточное количество Тахионов от этапа за
          ${formatInt(25)}-й Уровень Терезы.`;
      }
      return `У вас было ${quantify("Очко", player.dilation.lastEP)} Вечности на момент завершения последнего Замедления.`;
    }
  },
  methods: {
    handleYesClick() {
      if (player.dilation.active) return;
      if (player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying) {
        // Strike trigger happens within the delayed dilation callback in this function
        animateAndDilate();
      } else {
        startDilatedEternity();
        if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
      }
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="dilation"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ EPSinceLabel }}
      <br>
      <br>
      {{ message }}
    </div>
    <template #confirm-text>
      Начать
    </template>
  </ModalWrapperChoice>
</template>
