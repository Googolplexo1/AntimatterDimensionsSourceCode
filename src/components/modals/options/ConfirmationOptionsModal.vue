<script>
import ConfirmationOptionsEntry from "@/components/modals/options/ConfirmationOptionsEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "ConfirmationOptionsModal",
  components: {
    ModalWrapperOptions,
    ConfirmationOptionsEntry,
  },
  computed: {
    count() {
      return ConfirmationTypes.index.length;
    },
    noConfirmations() {
      return ConfirmationTypes.index.every(x => !x.isUnlocked());
    }
  }
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Настройки подтверждений
    </template>
    <div class="c-modal-options__button-container">
      <span v-if="noConfirmations">
        Вы не разблокировали ничего, что требовало бы подтверждения,
        но оно появилось бы здесь.
      </span>
      <ConfirmationOptionsEntry
        v-for="entryNumber in count"
        :key="entryNumber"
        :index="entryNumber - 1"
      />
    </div>
  </ModalWrapperOptions>
</template>
