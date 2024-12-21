<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "GlyphSetRecordsTab",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      recordGlyphInfo: [],
    };
  },
  methods: {
    update() {
      const bestReality = player.records.bestReality;
      const laitelaDim = 8 - Laitela.difficultyTier;
      this.recordGlyphInfo = [
        [true, Glyphs.copyForRecords(bestReality.RMSet), "Рекордное количество полученных Машин Реальности",
          `${format(bestReality.RM, 2, 2)} МР`],
        [true, Glyphs.copyForRecords(bestReality.RMminSet), "Рекордный прирост Машин Реальности за время",
          `${format(bestReality.RMmin, 2, 2)} МР/мин`],
        [true, Glyphs.copyForRecords(bestReality.glyphLevelSet), "Рекордный уровень полученного глифа",
          `уровень ${formatInt(bestReality.glyphLevel)}`],
        [true, Glyphs.copyForRecords(bestReality.bestEPSet), "Рекордное количество Очков Вечности",
          `${format(bestReality.bestEP, 2, 2)} ОВ`],
        [true, Glyphs.copyForRecords(bestReality.speedSet), "Рекордное время (по реальному времяисчислению)",
          `${TimeSpan.fromMilliseconds(bestReality.realTime).toStringShort()}`],
        [Currency.imaginaryMachines.gt(0), Glyphs.copyForRecords(bestReality.iMCapSet),
          "Рекордный предел количества Мнимых Машин",
          `${format(MachineHandler.currentIMCap, 2, 2)} ММ`],
      ];
    },
  }
};
</script>

<template>
  <div class="l-glyph-set-tab">
    <div
      v-for="(set, idx) in recordGlyphInfo"
      :key="idx"
    >
      <div
        v-if="set[0]"
        class="l-glyph-set-entry"
      >
        {{ set[2] }}:
        <GlyphSetPreview
          v-if="set[0]"
          :key="idx"
          :glyphs="set[1]"
          :text="set[2]"
          :text-hidden="true"
        />
        {{ set[3] }}
        <br>
      </div>
    </div>
  </div>
</template>
