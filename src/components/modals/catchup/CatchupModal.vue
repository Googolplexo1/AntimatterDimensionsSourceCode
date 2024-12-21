<script>
import { GameProgress, ProgressChecker } from "@/core/storage/progress-checker";

import CatchupGroup from "@/components/modals/catchup/CatchupGroup";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "CatchupModal",
  components: {
    CatchupGroup,
    PrimaryButton,
  },
  props: {
    diff: {
      type: Number,
      required: true
    }
  },
  computed: {
    progressStage: () => ProgressChecker.getProgressStage(player).id,
    suggestedResource() {
      return GameProgress(this.progressStage).suggestedResource;
    },
    timeString() {
      // If diff is zero, that means we opened it up via the button and don't need the text for last opening
      if (!this.diff) return null;
      return `Прошло ${TimeSpan.fromMilliseconds(this.diff).toString()}, с тех пор как вы открыли игру в прошлый раз.`;
    },
    titleText() {
      return "Краткое изложение контента";
    }
  },
  methods: {
    stageName(stage) {
      return GameProgress(stage).name;
    }
  }
};
</script>

<template>
  <div class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      {{ titleText }}
    </div>
    <div>
      {{ timeString }}
      На случай, если вам нужно освежить игру в памяти, представлено краткое изложение всего контента, разблокированного вами с начала
      игры, разделённое по стадиям прогресса. Это лишь очень краткие описания; вы можете открыть
      соответствующую статью помощи по игре, нажав название раздела или иконку <i class="fas fa-question-circle" />
      для просмотра более детальной информации.
    </div>
    <div
      class="l-catchup-group-container"
      :style="{ 'height' : `${Math.clamp(3 * progressStage + 5, 15, 35)}rem` }"
    >
      <CatchupGroup
        v-for="group of progressStage"
        :key="group"
        :group="group"
        :name="stageName(group)"
      />
    </div>
    <span class="c-suggestion-text">
      Судя по вашему прогрессу, возможно, будет полезно попытаться увеличить ваше количество {{ suggestedResource }}.
    </span>
    <div class="l-confirm-padding">
      <PrimaryButton
        @click="emitClose"
      >
        OK
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-catchup-group-container {
  overflow-y: scroll;
  width: 100%;
  text-align: left;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.4rem);
  margin: 1rem 0;
  padding: 1.5rem;
}

.l-confirm-padding {
  margin: 1rem;
}

.c-suggestion-text {
  font-size: 1.6rem;
  font-weight: bold;
}
</style>
