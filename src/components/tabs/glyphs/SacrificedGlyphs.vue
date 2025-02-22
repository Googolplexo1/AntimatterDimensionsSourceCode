<script>
import { DC } from "@/core/constants";

import TypeSacrifice from "./TypeSacrifice";

export default {
  name: "SacrificedGlyphs",
  components: {
    TypeSacrifice
  },
  data() {
    return {
      anySacrifices: false,
      hasDragover: false,
      hasAlteration: false,
      hideAlteration: false,
      maxSacrifice: 0,
      teresaMult: 0,
      lastMachinesTeresa: new Decimal(0),
    };
  },
  computed: {
    types: () => GLYPH_TYPES.filter(type => type !== "cursed" && type !== "companion"),
    lastMachines() {
      return this.lastMachinesTeresa.lt(DC.E10000)
        ? `${quantify("Машиной", this.lastMachinesTeresa, 2)} Реальности`
        : `${format(this.lastMachinesTeresa.dividedBy(DC.E10000), 2)} Мнимой Машины`;
    },
    dropDownIconClass() {
      return this.hideAlteration ? "far fa-plus-square" : "far fa-minus-square";
    },
    isDoomed() {
      return Pelle.isDoomed;
    },
    addThreshold() {
      return GlyphAlteration.additionThreshold;
    },
    empowerThreshold() {
      return GlyphAlteration.empowermentThreshold;
    },
    boostThreshold() {
      return GlyphAlteration.boostingThreshold;
    },
    cosmeticTypes: () => CosmeticGlyphTypes,
    addStyle() {
      return { color: GlyphAlteration.baseAdditionColor() };
    },
    empowerStyle() {
      return { color: GlyphAlteration.baseEmpowermentColor() };
    },
    boostStyle() {
      return { color: GlyphAlteration.baseBoostColor() };
    },
    hasSeenRealityGlyph() {
      return player.reality.glyphs.createdRealityGlyph;
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.$recompute("cosmeticTypes");
    });
  },
  methods: {
    update() {
      this.anySacrifices = GameCache.logTotalGlyphSacrifice !== 0;
      this.hasAlteration = Ra.unlocks.alteredGlyphs.canBeApplied;
      this.hideAlteration = player.options.hideAlterationEffects;
      this.maxSacrifice = GlyphSacrificeHandler.maxSacrificeForEffects;
      this.teresaMult = Teresa.runRewardMultiplier;
      this.lastMachinesTeresa.copyFrom(player.celestials.teresa.lastRepeatedMachines);
    },
    dragover(event) {
      if (Pelle.isDoomed) return;
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.hasDragover = true;
    },
    dragleave(event) {
      if (
        this.isDoomed ||
        !event.relatedTarget ||
        !event.relatedTarget.classList ||
        event.relatedTarget.classList.contains("c-current-glyph-effects") ||
        event.relatedTarget.classList.contains("c-sacrificed-glyphs__header") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type-symbol") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type-amount") ||
        event.relatedTarget.classList.contains("c-sacrificed-glyphs__type-new-amount") ||
        event.relatedTarget.classList.length === 0) return;
      this.hasDragover = false;
    },
    drop(event) {
      if (this.isDoomed || !event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      GlyphSacrificeHandler.sacrificeGlyph(glyph, true);
      this.hasDragover = false;
    },
    toggleAlteration() {
      player.options.hideAlterationEffects = !player.options.hideAlterationEffects;
    },
    glyphSymbol(type) {
      return this.cosmeticTypes[type].currentSymbol.symbol;
    }
  }
};
</script>

<template>
  <div
    class="c-current-glyph-effects l-current-glyph-effects"
    :class="{'c-sacrificed-glyphs--dragover': hasDragover}"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <div class="l-sacrificed-glyphs__help">
      <span
        v-if="isDoomed"
        class="pelle-current-glyph-effects"
      >
        Вы не можете жертвовать глифы в Обречении.
      </span>
      <span v-else>
        <div>Чтобы пожертвовать глиф, перетяните его сюда или нажмите на него, зажав клавишу Shift.</div>
        <div>Подтверждение пожертвования можно отключить во вкладке "Настройки" или путём зажатия клавиши Ctrl.</div>
      </span>
    </div>
    <div v-if="hasAlteration">
      <span
        class="c-altered-glyphs-toggle-button"
        @click="toggleAlteration"
      >
        <i :class="dropDownIconClass" />
        <b> Расширение Глифов</b>
      </span>
      <br>
      <div v-if="hideAlteration">
        (Нажмите, чтобы показать подробности)
      </div>
      <div v-else>
        У каждого типа глифов будет улучшен один из эффектов,<br>
        когда суммарная ценность пожертвованных глифов этого типа превысит:
        <br><br>
        <b>
          <span :style="addStyle">{{ format(addThreshold) }} - добавление второго эффекта</span>
          <br>
          <span :style="empowerStyle">{{ format(empowerThreshold) }} - принципиальное улучшение формулы</span>
          <br>
          <span :style="boostStyle">{{ format(boostThreshold) }} - усиление в зависимости от суммарной ценности пожертвованных глифов этого типа</span>
        </b>
        <br><br>
        Суммарная ценность пожертвованных глифов одного типа имеет ограничение, равное {{ format(maxSacrifice) }}.
      </div>
    </div>
    <br>
    <div class="c-sacrificed-glyphs__header">
      Эффекты Пожертвования Глифов:
    </div>
    <div v-if="anySacrifices && !isDoomed">
      <div v-if="teresaMult > 1">
        Награда за Реальность Терезы даёт множитель {{ formatX(teresaMult, 2, 2) }}
        к жертвенной ценности глифов; достигнута с {{ lastMachines }}.
        <span v-if="hasSeenRealityGlyph">
          На Глифы Реальности не влияет ни этот множитель, ни Расширение Глифов.
        </span>
      </div>
      <template v-for="type in types">
        <TypeSacrifice
          :key="type + glyphSymbol(type)"
          :type="type"
          :has-dragover="hasDragover"
        />
      </template>
    </div>
    <div
      v-else-if="isDoomed"
      class="pelle-current-glyph-effects"
    >
      Все эффекты Пожертвования и Расширения Глифов отключены в Обречении.
    </div>
    <div v-else>
      Вы ещё не пожетрвовали ни одного глифа!
    </div>
  </div>
</template>

<style scoped>

</style>
