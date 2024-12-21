<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitChallengeModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    challengeName: {
      type: String,
      required: true,
    },
    normalName: {
      type: String,
      required: true,
    },
    hasHigherLayers: {
      type: Boolean,
      required: true,
    },
    exitFn: {
      type: Function,
      required: true,
    }
  },
  computed: {
    isCelestial() {
      return this.challengeName.match("Реальность");
    },
    isRestarting() {
      return this.isCelestial ? player.options.retryCelestial : player.options.retryChallenge;
    }
  },
  methods: {
    handleYesClick() {
      this.exitFn();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="exitChallenge"
    @confirm="handleYesClick"
  >
    <template #header>
      Вы {{ isRestarting ? "перезапускаете" : "покидаете" }} {{ challengeName }}
    </template>

    <div class="c-modal-message__text">
      <span v-if="isRestarting">
        Вы немедленно запустите {{ challengeName }} вновь при подтверждении.
      </span>
      <span v-else>
        Вы окажетесь в обычной {{ normalName }}, не обременённой условиями {{ isCelestial ? "Небожителя" : "Испытания" }}.
      </span>
      <span v-if="hasHigherLayers">
        Условия испытаний высших слоёв продолжат действовать.
      </span>
    </div>
    <template #confirm-text>
      {{ isRestarting ? "Перезапустить" : "Выйти" }}
    </template>
  </ModalWrapperChoice>
</template>
