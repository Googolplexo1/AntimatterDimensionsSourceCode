<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "NormalChallengeStartModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    challenge() {
      return NormalChallenge(this.id);
    },
    challengeIsCompleted() {
      return this.challenge.isCompleted;
    },
    message() {
      return `Вы совершите Большое Сжатие (по возможности) и начнёте новую бесконечность внутри Испытания, с
        соответствующим условием испытания.
        Чтобы выполнить Испытание${this.challengeIsCompleted ? "" : " и получить награду за него"},
        вы должны вновь достичь бесконечности.
        У вас не будет начальных Расширений Измерений или Галактик вне зависимости от ваших улучшений.`;
    },
    entranceLabel() {
      return `Вы запускаете ${this.id}-е Обычное Испытание`;
    },
    reward() {
      return `Награда за выполнение этого Испытания следующая: разблокировать ${this.challenge._config.reward}.`;
    },
    condition() {
      let conditionOfChallenge = this.challenge._config.description;
      if (typeof conditionOfChallenge === "function") {
        conditionOfChallenge = conditionOfChallenge();
      }
      return `В этом Испытаниии действует следующее условие: ${conditionOfChallenge}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      this.challenge.start();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="challenges"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
      <br><br>
      {{ condition }}
    </div>
    <div
      v-if="!challengeIsCompleted"
      class="c-modal-message__text"
    >
      <br>
      {{ reward }}
    </div>
    <template #confirm-text>
      Начать
    </template>
  </ModalWrapperChoice>
</template>
