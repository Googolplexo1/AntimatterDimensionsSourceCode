<script>
import CurrentGlyphEffect from "./CurrentGlyphEffect";
import GlyphSetName from "@/components/GlyphSetName";

const glyphEffectsOrder =
  ["powerpow", "powermult", "powerdimboost", "powerbuy10",
    "infinitypow", "infinityinfmult", "infinityIP", "infinityrate",
    "replicationpow", "replicationdtgain", "replicationspeed", "replicationglyphlevel",
    "timepow", "timeshardpow", "timeEP", "timespeed", "timeetermult",
    "dilationpow", "dilationTTgen", "dilationDT", "dilationgalaxyThreshold",
    "effarigrm", "effarigglyph", "effarigblackhole", "effarigachievement",
    "effarigforgotten", "effarigdimensions", "effarigantimatter",
    "cursedgalaxies", "cursedtickspeed", "curseddimensions", "cursedEP",
    "realityglyphlevel", "realitygalaxies", "realityrow1pow", "realityDTglyph",
    "companiondescription", "companionEP"];

export default {
  name: "CurrentGlyphEffects",
  components: {
    GlyphSetName,
    CurrentGlyphEffect
  },
  data() {
    return {
      effects: [],
      isColored: false,
      hasEffarig: false,
      hasReality: false,
      logTotalSacrifice: 0,
      pelleChaosEffect: {},
    };
  },
  computed: {
    isSoftcapActive() {
      return this.effects.length && !this.effects.every(e => e.value.capped === false);
    },
    uniqueGlyphText() {
      if (!this.hasEffarig && !this.hasReality) return "";
      const uniqueGlyphs = [];
      if (this.hasEffarig) uniqueGlyphs.push(
        `<span style="color: ${GlyphAppearanceHandler.getBorderColor("effarig")};">Эффарига</span>`);
      if (this.hasReality) uniqueGlyphs.push(
        `<span style="animation: a-reality-glyph-description-cycle 10s infinite;">Реальности</span>`);
      return `Вы можете активировать не более ${uniqueGlyphs.length > 1 ? "чем по одному глифу" : "одного глифа"} ${uniqueGlyphs.join(" и ")}.`;
    },
    noEffects() {
      return !this.effects.length;
    },
    glyphSet() {
      return Glyphs.activeList;
    },
    showPelleGlyphText() {
      return Pelle.isDoomed;
    },
    pelleStrengthText() {
      return formatPercents(strengthToRarity(Pelle.glyphStrength));
    },
    pelleLevelText() {
      return formatInt(Pelle.glyphMaxLevel);
    },
    showChaosText() {
      return this.pelleChaosEffect.isUnlocked && !this.noEffects;
    },
    chaosEffect() {
      return this.pelleChaosEffect.description;
    },
  },
  watch: {
    logTotalSacrifice() {
      this.glyphsChanged();
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    update() {
      this.isColored = player.options.glyphTextColors;
      this.hasEffarig = Glyphs.active.some(g => g && g.type === "effarig");
      this.hasReality = Glyphs.active.some(g => g && g.type === "reality");

      this.logTotalSacrifice = GameCache.logTotalGlyphSacrifice.value;

      this.pelleChaosEffect = Pelle.specialGlyphEffect;
    },
    glyphsChanged() {
      this.effects = getActiveGlyphEffects();
      this.effects.sort((a, b) => glyphEffectsOrder.indexOf(a.id) - glyphEffectsOrder.indexOf(b.id));
    },
  }
};
</script>

<template>
  <div class="c-current-glyph-effects l-current-glyph-effects">
    <div v-if="showPelleGlyphText" class="pelle-current-glyph-effects">
      Редкость глифов выставлена на {{ pelleStrengthText }},
      <br>
      а их фактические уровни имеют ограничение в {{ pelleLevelText }}
    </div>
    <div class="c-current-glyph-effects__header">
      Действующие эффекты глифов:
    </div>
    <GlyphSetName :glyph-set="glyphSet" />
    <br v-if="isSoftcapActive || hasEffarig || hasReality">
    <span v-html="uniqueGlyphText" />
    <div
      v-if="isSoftcapActive"
      class="l-current-glyph-effects__capped-header"
    >
      Эффекты, выделенные <span class="c-current-glyph-effects__effect--capped">курсивом</span>, достигли
      мягкого ограничения
    </div>
    <br>
    <div v-if="noEffects">
      Нет (активируйте глифы, чтобы их эффекты вступили в силу)
    </div>
    <CurrentGlyphEffect
      v-for="effect in effects"
      :key="effect.id + logTotalSacrifice"
      :effect="effect"
      :is-colored="isColored"
    />
    <div
      v-if="showChaosText"
      class="pelle-current-glyph-effects"
    >
      {{ chaosEffect }}
    </div>
  </div>
</template>

<style scoped>

</style>
