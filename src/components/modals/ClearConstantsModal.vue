<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ClearConstantsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      constantCount: 0,
    };
  },
  methods: {
    update() {
      this.constantCount = Object.keys(player.reality.automator.constants).length;
      if (this.constantCount === 0) this.emitClose();
      this.number = quantify("постоянная", this.constantCount);
      this.deleted = pluralize("удалена", this.constantCount);
    },
    deleteConstants() {
      player.reality.automator.constants = {};
      player.reality.automator.constantSortOrder = [];
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="deleteConstants"
  >
    <template #header>
      Удаление постоянных для Автоматизатора
    </template>
    <div class="c-modal-message__text">
      Вы уверены, что хотите удалить все определённые в данный момент постоянные для Автоматизатора?
      <br>
      <span class="l-lost-text">
        {{ number }} будет безвозвратно {{ deleted }}!
      </span>
    </div>
    <template #confirm-text>
      Удалить все
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-lost-text {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
