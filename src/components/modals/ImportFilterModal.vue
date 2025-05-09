<script>
import ImportFilterSingleType from "./ImportFilterSingleType";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ImportFilterModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton,
    ImportFilterSingleType
  },
  data() {
    return {
      currentSettings: {},
      input: "",
    };
  },
  computed: {
    inputIsValid() {
      let decoded;
      try {
        decoded = GameSaveSerializer.decodeText(this.input, "glyph filter");
        return decoded.length > 0 && decoded.match(/^[0-9,.|/-]*$/u) !== null;
      } catch {
        return false;
      }
    },
    parsedSettings() {
      if (!this.inputIsValid) return null;

      const decoded = GameSaveSerializer.decodeText(this.input, "glyph filter");
      const parts = decoded.split("|");
      const typeInfo = {};
      let partIndex = 3;
      for (const type of ALCHEMY_BASIC_GLYPH_TYPES) {
        if (!type) continue;
        const subparts = parts[partIndex].split(",");
        typeInfo[type] = {
          rarity: Number(subparts[0]),
          score: Number(subparts[1]),
          effectCount: Number(subparts[2]),
          specifiedMask: Number(subparts[3]),
          effectScores: subparts[4].split("/").map(s => Number(s)),
        };
        partIndex++;
      }

      return {
        select: Number(parts[0]),
        simple: Number(parts[1]),
        trash: Number(parts[2]),
        types: typeInfo,
      };
    },
    selectStr() {
      return this.changedValue(this.parsedSettings.select, this.currentSettings.select,
        x => AutoGlyphProcessor.filterModeName(x));
    },
    basicCountStr() {
      return this.changedValue(this.parsedSettings.simple, this.currentSettings.simple, formatInt);
    },
    trashStr() {
      return this.changedValue(this.parsedSettings.trash, this.currentSettings.trash,
        x => AutoGlyphProcessor.trashModeDesc(x));
    },
    // Hide effarig if it hasn't been unlocked yet
    availableTypes() {
      return ALCHEMY_BASIC_GLYPH_TYPES.filter(t => !GlyphTypes.locked.map(e => e.id).includes(t));
    },
    settingTooltipText() {
      return `Наводите мышь на клетки для просмотра подробностей. Символы ✔ и ✘ означают
        выбранный/не выбранный эффект в режиме "Заданные эффекты".`;
    }
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    update() {
      this.currentSettings = JSON.parse(JSON.stringify(player.reality.glyphs.filter));
    },
    changedValue(oldVal, newVal, applyFn) {
      if (oldVal === newVal) return "(No change)";
      return `${applyFn(oldVal)} ➜ ${applyFn(newVal)}`;
    },
    importFilter() {
      if (this.parsedSettings === null) return;
      this.emitClose();
      player.reality.glyphs.filter = this.parsedSettings;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      Импортировать настройки Фильтра Глифов
    </template>
    Примечание: настройки Фильтра будут перезаписаны
    <br>
    во всех режимах, а не только в выбранном в данный момент.
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-import__save-info">
      <div v-if="!input" />
      <div v-else-if="inputIsValid">
        <b>Режим фильтрации:</b> {{ selectStr }}
        <br>
        <b>"Количество эффектов":</b> {{ basicCountStr }}
        <br>
        <b>Отвергаемые глифы:</b> {{ trashStr }}
        <br>
        <u><b>Настройки, разделённые по типам</b></u> <span :ach-tooltip="settingTooltipText">
          <i class="fas fa-question-circle" />
        </span>
        <br>
        <ImportFilterSingleType
          v-for="type in availableTypes"
          :key="type"
          class="c-single-type"
          :type="type"
          :curr-settings="currentSettings.types[type]"
          :new-settings="parsedSettings.types[type]"
        />
      </div>
      <div v-else>
        Недопустимая кодировка настроек Фильтра Глифов
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importFilter"
    >
      Импортировать
    </PrimaryButton>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-single-type {
  left: 0;
  text-align: left;
  padding: 0.5rem;
}
</style>
