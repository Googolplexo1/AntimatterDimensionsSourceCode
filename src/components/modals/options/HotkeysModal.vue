<script>
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "HotkeysModal",
  components: {
    ModalWrapper
  },
  data() {
    return {
      updateIndicies: [],
      visible: [],
      timeStudyUnlocked: false,
      glyphSacUnlocked: false,
      isElectron: false
    };
  },
  computed: {
    moreShiftKeyInfo() {
      const shiftKeyFunctions = [];
      if (this.timeStudyUnlocked) {
        shiftKeyFunctions.push(", нажимая на Исследование Времени, чтобы купить вместе с ним и все предшествующие ему");
        shiftKeyFunctions.push("чтобы сохранять Древа Исследований");
      }
      if (this.glyphSacUnlocked) {
        shiftKeyFunctions.push("чтобы удалять глифы");
      }
      const shiftKeyInfo = makeEnumeration(shiftKeyFunctions);
      return (shiftKeyInfo === "")
        ? ""
        : `Вы можете зажать клавишу Shift ${shiftKeyInfo}.`;
    },
    hotkeyCount() {
      return shortcuts.length;
    },
    shortcutNames() {
      return shortcuts.map(x => x.name);
    },
    shortcutKeys() {
      return shortcuts.map(x => x.keys.map(key => this.format(key)));
    }
  },
  created() {
    for (let i = 0; i < this.hotkeyCount; i++) {
      const visible = shortcuts[i].visible;
      if (typeof visible === "function") {
        this.updateIndicies.push(i);
      } else {
        this.visible[i] = visible;
      }
    }
  },
  methods: {
    update() {
      for (const index of this.updateIndicies) {
        this.$set(this.visible, index, shortcuts[index].visible());
      }
      const progress = PlayerProgress.current;
      this.timeStudyUnlocked = progress.isEternityUnlocked;
      this.glyphSacUnlocked = RealityUpgrade(19).isBought;

      // ElectronRuntime is a global which only exists on Steam (throws a ReferenceError on web)
      try {
        this.isElectron = ElectronRuntime.isActive;
      } catch {
        this.isElectron = false;
      }
    },
    format(x) {
      switch (x) {
        case "mod":
          return "CTRL/⌘";
        default:
          return x.toUpperCase();
      }
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Список горячих клавиш
    </template>
    <span class="c-modal-hotkeys l-modal-hotkeys">
      <div class="l-modal-hotkeys__column">
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Купить 1 измерение</span>
          <kbd>SHIFT</kbd><kbd>1</kbd>-<kbd>SHIFT</kbd><kbd>8</kbd>
        </div>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Купить до 10 измерений</span>
          <kbd>1</kbd>-<kbd>8</kbd>
        </div>
        <div
          v-for="index in hotkeyCount"
          :key="index"
        >
          <span
            v-if="visible[index - 1]"
            class="l-modal-hotkeys-row"
          >
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ shortcutNames[index - 1] }}</span>
            <kbd
              v-for="(key, i) in shortcutKeys[index - 1]"
              :key="i"
            >
              {{ key }}
            </kbd>
          </span>
        </div>
      </div>
      <div class="l-modal-hotkeys__column l-modal-hotkeys__column--right">
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Корректировочная клавиша</span>
          <kbd>SHIFT</kbd>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          Shift - корректировочная клавиша, служащая для отображения дополнительной информации
          и для изменения функций определённых кнопок.
          <br>
          {{ moreShiftKeyInfo }}
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Управление автоматикой</span>
          <kbd>ALT</kbd>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          Alt - корректировочная клавиша, которая, будучи нажата вместе с любой клавишей, действие которой также совершает некоторая автоматика,
          переключает эту автоматику.
          <br>
          Одновременным нажатием клавиш Alt и Shift вы можете переключать оптовую покупку у автоматики Измерений Антиматерии
          и ускорителя.
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Перемещение по игре</span>
          <div>
            <kbd>←</kbd><kbd>↓</kbd><kbd>↑</kbd><kbd>→</kbd>
          </div>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          С помощью клавиш со стрелками вы можете перемещаться по страницам игры.
          Клавиши со стрелками вверх и вниз циклически перемещают вас между вкладками,
          а клавиши со стрелками влево и вправо - между отделами текущей вкладки.
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Поддержка цифровой клавиатуры</span>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          По техническим причинам нажатие клавиши цифровой клавиатуры вызывает покупку десятки измерений по возможности, но нажатие
          клавиши цифровой клавиатуры вместе с клавишей <kbd>SHIFT</kbd> не вызывает единичную покупку измерения. Вместо этого, в зависимости от вашего устройства, оно может
          вызвать прокрутку страницы или перемещение на другую вкладку. Клавиша <kbd>ALT</kbd> работает нормально.
        </span>
        <template v-if="isElectron">
          <br>
          <div class="l-modal-hotkeys-row">
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Масштабирование окна</span>
            <kbd>-</kbd><kbd>0</kbd><kbd>+</kbd>
          </div>
          <span class="c-modal-hotkeys__shift-description">
            Чтобы изменить масштаб, зажмите <kbd>ctrl</kbd> и нажмите либо <kbd>-</kbd>, либо <kbd>+</kbd> для уменьшения или
            увеличения масштаба соответственно. Нажатие <kbd>ctrl</kbd><kbd>0</kbd> выставит масштаб обратно на 100%.
          </span>
          <br>
          <div class="l-modal-hotkeys-row">
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Полноэкранный режим</span>
            <kbd>F10</kbd>
          </div>
          <span class="c-modal-hotkeys__shift-description">
            Чтобы переключить полноэкранный режим, нажмите <kbd>F10</kbd>.
          </span>
        </template>
      </div>
    </span>
  </ModalWrapper>
</template>

<style scoped>
.l-modal-hotkeys__column {
  display: flex;
  flex-direction: column;
  width: 28rem;
}

.l-modal-hotkeys__column--right {
  margin-left: 1rem;
}

.c-modal-hotkeys {
  font-size: 1.25rem;
}

.l-modal-hotkeys {
  display: flex;
  flex-direction: row;
}

.l-modal-hotkeys-row {
  display: flex;
  flex-direction: row;
  line-height: 1.6rem;
  padding-bottom: 0.3rem;
}

.c-modal-hotkeys-row__name {
  text-align: left;
}

.l-modal-hotkeys-row__name {
  flex: 1 1 auto;
}

.c-modal-hotkeys__shift-description {
  text-align: left;
  font-size: 1rem;
}
</style>
