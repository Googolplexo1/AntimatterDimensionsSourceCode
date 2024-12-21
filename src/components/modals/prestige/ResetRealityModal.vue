<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ResetRealityModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      canReality: false,
    };
  },
  computed: {
    resetTerm() { return this.isDoomed ? "армагеддон" : "реальность"; },
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.canReality = isRealityAvailable();
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="resetReality"
    @confirm="handleYesClick"
  >
    <template #header>
      Вы сбрасываете {{ resetTerm }}
    </template>
    <div class="c-modal-message__text">
      Вы полностью сбросите {{ resetTerm }} без получения наград за прогресс.
      <br>
      <br>
      Вы уверены, что хотите сбросить {{ resetTerm }}?
      <div
        v-if="canReality"
        class="c-has-rewards"
      >
        <br>
        В данный момент вы можете совершить реальность, получая все награды за прогресс в ней, однако вы их не получите, если вы сбросите
        реальность. Чтобы получить их, нажмите на кнопку "Создать новую реальность".
      </div>
      <br>
    </div>
    <template #confirm-text>
      Сбросить
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-has-rewards {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--color-bad);
}
</style>
