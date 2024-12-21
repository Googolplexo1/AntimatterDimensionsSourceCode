<script>
export default {
  name: "GlyphSortButtonGroup",
  data() {
    return {
      showScoreFilter: false,
    };
  },
  methods: {
    update() {
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
    },
    sortByLevel() {
      Glyphs.sortByLevel();
    },
    sortByPower() {
      Glyphs.sortByPower();
    },
    sortByScore() {
      Glyphs.sortByScore();
    },
    sortByEffect() {
      Glyphs.sortByEffect();
    },
    collapseEmpty() {
      Glyphs.collapseEmptySlots();
    }
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      Упорядочить глифы:
    </div>
    <button
      class="c-glyph-inventory-option"
      @click="sortByLevel"
    >
      По уровню
      <div class="c-glyph-inventory-option__tooltip">
        Сортировать глифы в порядке убывания уровня
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByPower"
    >
      По мощности
      <div class="c-glyph-inventory-option__tooltip">
        Сортировать глифы в порядке убывания произведения уровня на редкость
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByEffect"
    >
      По эффектам
      <div class="c-glyph-inventory-option__tooltip">
        Группировать глифы с одинаковыми наборами эффектов
      </div>
    </button>
    <button
      v-if="showScoreFilter"
      class="c-glyph-inventory-option"
      @click="sortByScore"
    >
      По оценке
      <div class="c-glyph-inventory-option__tooltip">
        Сортировать глифы в порядке убывания оценки Фильтра
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="collapseEmpty"
    >
      Переместить глифы наверх
      <div class="c-glyph-inventory-option__tooltip">
        Переместить все глифы в самые верхние свободные ячейки
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
