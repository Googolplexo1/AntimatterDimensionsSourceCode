<script>
import HoverMenu from "./HoverMenu";

export default {
  name: "TimeStudySaveLoadButton",
  components: {
    HoverMenu,
  },
  props: {
    saveslot: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      name: "",
      displayName: "",
      canEternity: false
    };
  },
  computed: {
    preset() {
      return player.timestudy.presets[this.saveslot - 1];
    },
  },
  methods: {
    update() {
      this.name = player.timestudy.presets[this.saveslot - 1].name;
      this.displayName = this.name === "" ? this.saveslot : this.name;
      this.canEternity = Player.canEternity;
    },
    nicknameBlur(event) {
      const newName = event.target.value.slice(0, 4).trim();
      if (!this.isASCII(newName)) return;

      const existingNames = player.timestudy.presets.map(p => p.name);
      if (existingNames.includes(newName)) return;

      this.preset.name = newName;
      this.name = this.preset.name;
    },
    hideContextMenu() {
      this.$viewModel.currentContextMenu = null;
    },
    // This is largely done because of UI reasons - there is no Unicode specification for character width, which means
    // that arbitrary Unicode inputs can allow for massive text overflow
    isASCII(input) {
      // eslint-disable-next-line no-control-regex
      return !/[^\u0000-\u00ff]/u.test(input);
    },
    save() {
      this.hideContextMenu();
      this.preset.studies = GameCache.currentStudyTree.value.exportString;
      const presetName = this.name ? `Древо Исследований "${this.name}"` : "Древо Исследований";
      GameUI.notify.eternity(`${presetName} сохранено в слоте №${this.saveslot}`);
    },
    load() {
      this.hideContextMenu();
      if (this.preset.studies) {
        // We need to use a combined tree for committing to the game state, or else it won't buy studies in the imported
        // tree are only reachable if the current tree is already bought
        const combinedTree = new TimeStudyTree();
        combinedTree.attemptBuyArray(TimeStudyTree.currentStudies, false);
        combinedTree.attemptBuyArray(combinedTree.parseStudyImport(this.preset.studies), true);
        TimeStudyTree.commitToGameState(combinedTree.purchasedStudies, false, combinedTree.startEC);

        const presetName = this.name ? `Древо Исследований "${this.name}"` : "Древо Исследований";
        GameUI.notify.eternity(`${presetName} загружено из слота №${this.saveslot}`);
      } else {
        Modal.message.show("Этот слот пустой.");
      }
    },
    respecAndLoad() {
      if (Player.canEternity) {
        player.respec = true;
        const newTree = new TimeStudyTree();
        newTree.attemptBuyArray(newTree.parseStudyImport(this.preset.studies));
        animateAndEternity(() => TimeStudyTree.commitToGameState(newTree.purchasedStudies, false, newTree.startEC));
      }
    },
    deletePreset() {
      this.hideContextMenu();
      if (this.preset.studies) Modal.studyString.show({ id: this.saveslot - 1, deleting: true });
      else Modal.message.show("Этот слот пустой.");
    },
    handleExport() {
      this.hideContextMenu();
      copyToClipboard(this.preset.studies);
      const presetName = this.name ? `Древо Исследований "${this.name}"` : "Древо Исследований";
      GameUI.notify.eternity(`${presetName} экспортировано из слота №${this.saveslot} в ваш буфер обмена`);
    },
    edit() {
      Modal.studyString.show({ id: this.saveslot - 1 });
    }
  },
};
</script>

<template>
  <HoverMenu class="l-tt-save-load-btn__wrapper">
    <template #object>
      <button
        class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked"
        @click.shift.exact="save"
        @click.exact="load"
      >
        {{ displayName }}
      </button>
    </template>
    <template #menu>
      <div class="l-tt-save-load-btn__menu c-tt-save-load-btn__menu">
        <span ach-tooltip="Название Древа (до 4 символов ASCII)">
          <input
            type="text"
            size="4"
            maxlength="4"
            class="l-tt-save-load-btn__menu-rename c-tt-save-load-btn__menu-rename"
            :value="name"
            @keyup.esc="hideContextMenu"
            @blur="nicknameBlur"
          >
        </span>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click="edit"
        >
          Редактировать
        </div>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click="handleExport"
        >
          Экспортировать
        </div>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click="save"
        >
          Сохранить
        </div>
        <div class="l-tt-save-load-btn__menu-item">
          <div
            class="c-tt-save-load-btn__menu-item"
            @click="load"
          >
            Загрузить
          </div>
          <div class="c-tt-save-load-btn__menu-item__hover-options">
            <div
              :class="{
                'c-tt-save-load-btn__menu-item__hover-option': true,
                'c-tt-save-load-btn__menu-item__hover-option--disabled': !canEternity,
              }"
              @click="respecAndLoad"
            >
              Сбросить текущее Древо и загрузить
            </div>
          </div>
        </div>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click="deletePreset"
        >
          Удалить
        </div>
      </div>
    </template>
  </HoverMenu>
</template>

<style scoped>
.l-tt-save-load-btn__wrapper {
  position: relative;
  margin: 0.3rem;
}

.l-tt-save-load-btn {
  min-width: 2rem;
}

.l-tt-save-load-btn__menu {
  position: absolute;
  top: -0.5rem;
  left: 50%;
  padding: 0.5rem 0;
  transform: translate(-50%, -100%);
}

.c-tt-save-load-btn__menu {
  text-align: left;
  font-family: Typewriter;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  background: black;
  border-radius: var(--var-border-radius, 0.5rem);
}

.l-tt-save-load-btn__menu::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  border-color: black transparent transparent;
  border-style: solid;
  border-width: var(--var-border-width, 0.5rem);
  margin-left: -0.5rem;
}

.l-tt-save-load-btn__menu-rename {
  margin: 0.3rem 0.5rem 0.5rem 0.7rem;
}

.c-tt-save-load-btn__menu-rename {
  text-align: left;
  font-family: Typewriter;
  font-size: 1.4rem;
  font-weight: bold;
  border: none;
  border-radius: var(--var-border-radius, 0.3rem);
  padding: 0.2rem;
}

.l-tt-save-load-btn__menu-item {
  position: relative;
  cursor: pointer;
}

.c-tt-save-load-btn__menu-item {
  text-align: left;
  padding: 0.25rem 1rem;
}

.c-tt-save-load-btn__menu-item:hover {
  color: black;
  background: white;
}

.c-tt-save-load-btn__menu-item__hover-options {
  visibility: hidden;
  width: fit-content;
  position: absolute;
  top: 0;
  left: 100%;
  opacity: 0;
  color: white;
  background: black;
  border: 0.1rem solid black;
  border-radius: var(--var-border-width, 0.5rem);
  transform: translateX(0.5rem);
  transition: visibility 0.2s, opacity 0.2s;
  transition-delay: 0.5s;
  cursor: pointer;
}

.c-tt-save-load-btn__menu-item__hover-option {
  white-space: nowrap;
  padding: 0.25rem 1rem;
}

.c-tt-save-load-btn__menu-item__hover-options::after {
  content: "";
  position: absolute;
  /* A single menu item is 26px tall, minus 5px from the border */
  top: 0.8rem;
  right: 100%;
  border-top: 0.5rem solid transparent;
  border-right: 0.5rem solid black;
  border-bottom: 0.5rem solid transparent;
}

.c-tt-save-load-btn__menu-item:hover,
.c-tt-save-load-btn__menu-item__hover-option:hover {
  color: black;
  background: white;
}

.l-tt-save-load-btn__menu-item:hover .c-tt-save-load-btn__menu-item__hover-options {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}

.c-tt-save-load-btn__menu-item__hover-option--disabled {
  opacity: 0.7;
  cursor: default;
}

.c-tt-save-load-btn__menu-item__hover-option--disabled:hover {
  color: white;
  background: transparent;
}
</style>
