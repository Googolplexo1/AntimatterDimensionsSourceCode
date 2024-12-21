<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EternityChallengeStartModal",
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
      return EternityChallenge(this.id);
    },
    challengeIsCompleted() {
      return this.challenge.isFullyCompleted;
    },
    message() {
      return `Вы совершите вечность (по возможности) и начнёте новую внутри Испытания, с
        соответствующим условием испытания.
        Чтобы выполнить Испытание${this.challengeIsCompleted ? "" : " и получить награду за него"},
        вы должны достичь цели Испытания в
        ${format(this.challenge.currentGoal)} Очков Бесконечности. Испытания Вечности могут быть выполнены до
        ${formatInt(5)} раз; при выполнении увеличивается как цель испытания, так и награда.`;
    },
    entranceLabel() {
      return `Вы запускаете ${this.id}-е Испытание Вечности`;
    },
    reward() {
      let rewardDescription = this.challenge._config.reward.description;
      if (typeof rewardDescription === "function") {
        rewardDescription = rewardDescription();
      }
      return `Награда за выполнение этого Испытания следующая: ${rewardDescription}`;
    },
    condition() {
      let conditionOfChallenge = this.challenge._config.description;
      if (typeof conditionOfChallenge === "function") {
        conditionOfChallenge = conditionOfChallenge();
      }
      return `В этом Испытаниии Вечности действует следующее условие: ${conditionOfChallenge}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      this.challenge.start(true);
      EventHub.ui.offAll(this);
    }
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
