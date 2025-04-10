<script>
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphProtectedRowButtonGroup",
  components: {
    ToggleButton
  },
  data() {
    return {
      protectedRows: 0,
      moveGlyphs: false,
    };
  },
  computed: {
    questionMarkTooltip() {
      return `Глифы в защищённых ячейках никогда не удаляются и не перемещаются.
        Новые глифы никогда не помещаются в защищённые ячейки.`;
    }
  },
  watch: {
    moveGlyphs(newValue) {
      player.reality.moveGlyphsOnProtection = newValue;
    },
  },
  methods: {
    update() {
      this.moveGlyphs = player.reality.moveGlyphsOnProtection;
      this.protectedRows = player.reality.glyphs.protectedRows;
    },
    addRow() {
      Glyphs.changeProtectedRows(1);
    },
    removeRow() {
      Glyphs.changeProtectedRows(-1);
    },
    isProtectedRowsMax() {
      return this.protectedRows === Glyphs.totalSlots / 10 - 1;
    },
    addRowButtonClass() {
      return {
        "c-glyph-inventory-option": true,
        "o-non-clickable": this.isProtectedRowsMax()
      };
    },
    removeRowButtonClass() {
      return {
        "c-glyph-inventory-option": true,
        "o-non-clickable": this.protectedRows === 0
      };
    }
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      <div
        v-tooltip="questionMarkTooltip"
        class="o-questionmark"
      >
        ?
      </div>
      Защищённые ячейки: ({{ quantifyInt("ряд", protectedRows) }})
    </div>
    <button
      :class="addRowButtonClass()"
      @click="addRow"
    >
      Добавить защищённый ряд
      <div
        v-if="isProtectedRowsMax()"
        class="c-glyph-inventory-option__tooltip"
      >
        Необходимо оставить незащищённый ряд для новых глифов
      </div>
    </button>
    <button
      :class="removeRowButtonClass()"
      @click="removeRow"
    >
      Убрать защищённый ряд
    </button>
    <ToggleButton
      v-model="moveGlyphs"
      class="c-glyph-inventory-option"
      label="Перемещать глифы при изменении количества защищённых рядов:"
    />
  </div>
</template>

<style scoped>
.o-non-clickable {
  cursor: auto;
}
</style>
