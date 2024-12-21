<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SwitchAutomatorEditorModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    callback: {
      type: Function,
      required: false,
      default: () => ({})
    },
    lostBlocks: {
      type: Number,
      required: false,
      default: 0,
    }
  },
  data() {
    return {
      errorCount: 0,
      isCurrentlyBlocks: false
    };
  },
  computed: {
    currentScriptID: {
      get() {
        return this.$viewModel.tabs.reality.automator.editorScriptID;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.editorScriptID = value;
      }
    },
    otherMode() {
      return this.isCurrentlyBlocks ? "тесктовый" : "блочный";
    }
  },
  methods: {
    update() {
      this.errorCount = AutomatorData.currentErrors().length;
      this.isCurrentlyBlocks = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
    },
    toggleAutomatorMode() {
      AutomatorBackend.changeModes(this.currentScriptID);
      this.callback?.();
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    option="switchAutomatorMode"
    @confirm="toggleAutomatorMode"
  >
    <template #header>
      Переключить редактирование программм для Автоматизатора на {{ otherMode }} режим
    </template>
    <div class="c-modal-message__text">
      Если у вас есть запущеннная программа, она будет остановлена!
      <div v-if="errorCount">
        <br>
        Ваша программа содержит ошибки, которые могут быть неправильно переведены в {{ otherMode }} режим. Если вы решите продолжить,
        Автоматизатор всё равно попытается интерпретировать их, хотя некоторая информация может быть утрачена или
        неправильно перведена.
      </div>
      <!-- Note: this can only ever appear on text-to-block -->
      <b v-if="lostBlocks">
        <br>
        Внимание: ваша программа содержит строки, которые не могут быть интерпретированы как команды. Они
        будут удалены, так как не существует блока, в который их можно было бы преобразовать.
        Если ошибка будет в начале цикла или условного оператора, вы можете потерять крупные части вашей программы!
        <span class="l-lost-text">
          Переключение режима редактирования прямо сейчас приведёт к необратимой потере {{ quantifyInt("строки", lostBlocks) }} кода!
        </span>
      </b>
      <br>
      <span class="l-lost-text">
        Скрывать эту информацию не рекомендуется, так как это может привести к тому, что части программы будут немедленно и безвозвратно
        утрачены, если она содержала ошибки во время попытки переключения режима редактирования.
      </span>
      <br>
      <br>
      Вы уверены, что хотите переключиться на {{ otherMode }} режим редактирования?
    </div>
    <template #confirm-text>
      Подтвердить
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-lost-text {
  color: var(--color-bad);
}
</style>
