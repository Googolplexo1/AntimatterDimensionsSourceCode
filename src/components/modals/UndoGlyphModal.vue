<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UndoGlyphModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      showStoredGameTime: false,
    };
  },
  methods: {
    update() {
      this.showStoredGameTime = Enslaved.isUnlocked;
    },
    realityInvalidate() {
      this.emitClose();
      Modal.message.show("Деактивация глифов может быть произведена только на реальности!",
        { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.undo();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="glyphUndo"
    @confirm="handleYesClick"
  >
    <template #header>
      Вы деактивируете глиф
    </template>
    <div
      class="c-modal-message__text c-text-wrapper"
    >
      Последний активированный глиф будет убран из своего слота в инвентарь.
      Реальность сбросится, но некоторые параметры будут выставлены на те значения, которые они имели при активации глифа:
      <br>
      <div class="c-text-wrapper">
        <br>- Количества антиматерии, Очков Бесконечности и Очков Вечности
        <br>- Улучшения Замедления и количества Тахионов и Замедленного Времени
        <br>- Количество Теорем Времени и выполнения Испытаний Вечности
        <br>- Разблокировка Измерений Времени и Реальности
        <br>- Время в текущей Бесконечности/Вечности/Реальности
        <span v-if="showStoredGameTime"><br>- Stored game time</span>
      </div>
      <br>
      Обратите внимание: если вы нарушили определённые требования (например, условие достижения совершить
      реальность, не производя антиматерию), они сохранят статус нарушенных при деактивации глифа. Вам
      придётся выполнить такие требования, не деактивируя глифы в текущей реальности.
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-text-wrapper {
  text-align: left;
}
</style>