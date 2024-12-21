<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "HardResetModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      input: ""
    };
  },
  computed: {
    willHardReset() {
      return this.input === "Shrek is love, Shrek is life";
    },
    hasExtraNG() {
      return player.records.fullGameCompletions > 0;
    },
    hasSpeedrun() {
      return player.speedrun.isUnlocked;
    }
  },
  destroyed() {
    if (this.willHardReset) SecretAchievement(38).unlock();
  },
  methods: {
    hardReset() {
      if (this.willHardReset) GameStorage.hardReset();
      this.input = "";
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!willHardReset"
    :show-confirm="willHardReset"
    confirm-class="o-primary-btn--width-medium c-modal__confirm-btn c-modal-hard-reset-btn"
    @confirm="hardReset"
  >
    <template #header>
      ПОЛНЫЙ СБРОС
    </template>
    <div class="c-modal-message__text">
      Пожалуйста, подтвердите своё намерение полностью сбросить это сохранение.
      <span class="c-modal-hard-reset-danger">Сброс сохранения не разблокирует ничего секретного.</span>
      Введите "Shrek is love, Shrek is life", чтобы подтвердить.
      <div class="c-modal-hard-reset-danger">
        ВАШЕ СОХРАНЕНИЕ БУДЕТ УНИЧТОЖЕНО.
        <span v-if="hasExtraNG">
          <br>
          Вы также потеряете все косметические наборы глифов, данные вам за прохождение игры!
        </span>
        <span v-if="hasSpeedrun">
          <br>
          Вы потеряете доступ к режиму спидрана. Чтобы перезапустить забег, используйте кнопку "Начать спидран".
        </span>
      </div>
    </div>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-hard-reset__input"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-hard-reset-info">
      <div
        v-if="willHardReset"
        class="c-modal-hard-reset-danger"
      >
        Фраза подтверждена - ваше сохранение будет безвозвратно удалено!
      </div>
      <div v-else>
        Введите требуемую фразу для полного сброса.
      </div>
    </div>
    <template #confirm-text>
      СОВЕРШИТЬ ПОЛНЫЙ СБРОС
    </template>
  </ModalWrapperChoice>
</template>
