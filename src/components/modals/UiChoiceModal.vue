<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UiChoiceModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    listEntries() {
      return [
        `Больше игровых событий анимированы. Если это влияет на ваши производительность или геймплей, анимации могут быть
        отключены в отделе "Внешний вид" вкладки "Настройки".`,
        `Новые окна подтверждения пришли на замену встроенным в Javascript окнам оповещения. Они могут быть отключены в
        отделе "Геймплей" вкладки "Настройки".`,
        "Игра теперь обладает более изящным оформлением, созданным по современным принципам дизайна."
      ];
    }
  },
  methods: {
    handleYesClick() {
      GameOptions.toggleUI();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      Внешние изменения
    </template>
    <div class="c-modal-message__text">
      Мы заметили, что вы загрузили старое сохранение; со времени старых версий внешний вид игры претерпел несколько изменений:
      <br>
      <br>
      <div class="c-visual-change-list">
        <div
          v-for="(entry, i) in listEntries"
          :key="i"
          class="c-visual-change-list-entry"
        >
          <b>&bull;</b>
          {{ entry }}
        </div>
      </div>
      <br>
      <br>
      Вы можете свободно переключаться между Классическим интерфейсом, который использовался в старых версиях игры, и новейшим Современным интерфейсом в отделе "Внешний вид"
      вкладки "Настройки". Хотели ли бы вы переключиться на Современный интерфейс прямо сейчас?
    </div>
    <template #cancel-text>
      Нет
    </template>
    <template #confirm-text>
      Да
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-visual-change-list {
  display: inline-block;
  max-width: 45rem;
  text-align: left;
}

.c-visual-change-list-entry {
  display: flex;
  margin-bottom: 0.5rem;
  gap: 1rem;
}
</style>
