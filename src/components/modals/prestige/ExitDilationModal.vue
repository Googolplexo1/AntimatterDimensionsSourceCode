<script>
import FullScreenAnimationHandler from "@/core/full-screen-animation-handler";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitDilationModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      tachyonGain: new Decimal(0),
      isDoomed: false
    };
  },
  computed: {
    gainText() {
      if (this.tachyonGain.lte(0)) return `ничего не получите`;
      return `получите ${quantify("Тахион", this.tachyonGain, 2)}`;
    },
    isInEC() {
      return Player.anyChallenge instanceof EternityChallengeState;
    },
    confirmText() {
      return this.isDoomed ? "OK" : "Выйти";
    }
  },
  methods: {
    update() {
      // We force-close the modal if dilation is inactive because there are a few edge cases which allow it to be
      // opened while switching between dilated/regular. The only thing this results in is an incorrect TP gain value
      if (!player.dilation.active) this.emitClose();
      this.tachyonGain.copyFrom(getTachyonGain(true));
      this.isDoomed = Pelle.isDoomed;
    },
    handleYesClick() {
      if (!player.dilation.active) return;
      const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
      if (playAnimation) {
        animateAndUndilate();
      } else {
        eternity(false, false, { switchingDilation: true });
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
      <span v-if="isDoomed">
        Вы не можете выйти из Замедления в Обречении
      </span>
      <span v-else>
        Вы выходите из Замедления
      </span>
    </template>
    <div class="c-modal-message__text">
      <span v-if="isDoomed">
        Замедление необратимо. Вы {{ gainText }} и сбросите текущую вечность.
      </span>
      <span v-else>
        Если вы выйдете из Замедления прямо сейчас, вы {{ gainText }}.
      </span>
      <div v-if="isInEC">
        Вы также выйдете из текущего Испытания Вечности.
      </div>
      <br>
      <span v-if="isDoomed">
        Вы уверены, что хотите совершить вечность?
      </span>
      <span v-else>
        Вы уверены, что хотите выйти из Замедления?
      </span>
    </div>
    <template #confirm-text>
      {{ confirmText }}
    </template>
  </ModalWrapperChoice>
</template>
