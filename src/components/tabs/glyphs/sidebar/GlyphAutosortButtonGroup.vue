<script>
import ButtonCycle from "@/components/ButtonCycle";
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphAutosortButtonGroup",
  components: {
    ToggleButton,
    ButtonCycle
  },
  data() {
    return {
      autoSort: 0,
      showScoreFilter: false,
      autoCollapse: false,
      showAutoAutoClean: false,
      autoAutoClean: false,
      applyFilterToPurge: false,
    };
  },
  computed: {
    sortModes() {
      // These are the keys for AUTO_SORT_MODE, with SCORE only added conditionally if unlocked
      const availableSortModes = ["НЕТ", "УРОВЕНЬ", "МОЩНОСТЬ", "ЭФФЕКТЫ"];
      if (this.showScoreFilter) availableSortModes.push("ОЦЕНКА");
      return availableSortModes;
    },
    questionMarkTooltip() {
      return `Автоматическая уборка инвентаря осуществляется каждую реальность`;
    }
  },
  watch: {
    autoSort(newValue) {
      player.reality.autoSort = newValue;
    },
    autoCollapse(newValue) {
      player.reality.autoCollapse = newValue;
    },
    autoAutoClean(newValue) {
      player.reality.autoAutoClean = newValue;
    },
    applyFilterToPurge(newValue) {
      player.reality.applyFilterToPurge = newValue;
    },
  },
  methods: {
    update() {
      this.autoSort = player.reality.autoSort;
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.autoCollapse = player.reality.autoCollapse;
      this.showAutoAutoClean = VUnlocks.autoAutoClean.canBeApplied;
      this.autoAutoClean = player.reality.autoAutoClean;
      this.applyFilterToPurge = player.reality.applyFilterToPurge;
    },
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
      Автоматическая уборка инвентаря:
    </div>
    <ButtonCycle
      v-model="autoSort"
      class="c-glyph-inventory-option"
      text="Параметр сортировки глифов:"
      :labels="sortModes"
    />
    <ToggleButton
      v-model="autoCollapse"
      class="c-glyph-inventory-option"
      label="Перемещать глифы наверх:"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="autoAutoClean"
      class="c-glyph-inventory-option"
      label="Автоматическая прочистка:"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="applyFilterToPurge"
      class="c-glyph-inventory-option"
      label="Защищать глифы, принимаемые Фильтром, от автоматической прочистки:"
    />
  </div>
</template>

<style scoped>

</style>
