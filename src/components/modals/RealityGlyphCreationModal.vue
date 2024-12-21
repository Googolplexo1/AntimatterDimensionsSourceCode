<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RealityGlyphCreationModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realityGlyphLevel: 0,
      // This contains an array where each entry is an array looking like [4000, "realitygalaxies"]
      possibleEffects: [],
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.realityGlyphLevel = AlchemyResource.reality.effectValue;
      const realityEffectConfigs = GlyphEffects.all
        .filter(eff => eff.glyphTypes.includes("reality"))
        .sort((a, b) => a.bitmaskIndex - b.bitmaskIndex);
      const minRealityEffectIndex = realityEffectConfigs.map(cfg => cfg.bitmaskIndex).min();
      this.possibleEffects = realityEffectConfigs
        .map(cfg => [realityGlyphEffectLevelThresholds[cfg.bitmaskIndex - minRealityEffectIndex], cfg.id]);
    },
    createRealityGlyph() {
      if (GameCache.glyphInventorySpace.value === 0) {
        Modal.message.show("Нет свободных ячеек; пожертвуйте некоторые глифы, чтобы освободить место.",
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      Glyphs.addToInventory(GlyphGenerator.realityGlyph(this.realityGlyphLevel));
      AlchemyResource.reality.amount = 0;
      player.reality.glyphs.createdRealityGlyph = true;
      this.emitClose();
    },
    formatGlyphEffect(effect) {
      if (this.realityGlyphLevel < effect[0]) return `(Требуется уровень ${formatInt(effect[0])})`;
      const config = GlyphEffects[effect[1]];
      const value = config.effect(this.realityGlyphLevel, rarityToStrength(100));
      const effectTemplate = config.singleDesc;
      return effectTemplate.replace("{value}", config.formatEffect(value));
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Создание Глифа Реальности
    </template>
    <div class="c-reality-glyph-creation">
      <div>
        Создать Глиф Реальности уровня {{ formatInt(realityGlyphLevel) }}.
        Редкость Глифа Реальности всегда равна {{ formatPercents(1) }},
        а уровень равен количеству Реальности (которая траится полностью) при создании глифа. Остальные алхимические ресурсы
        не тратятся. Глифы Реальности имеют уникальные эффекты, каждый из которых разблокируется на определённом уровне.
        Глифы Реальности могут быть пожертвованы для множителя к получению Кусков Памяти. Подобно Глифам Эффарига,
        из Глифов Реальности в любой момент времени может действовать лишь один.
      </div>
      <div class="o-available-effects-container">
        <div class="o-available-effects">
          Эффекты:
        </div>
        <div
          v-for="(effect, index) in possibleEffects"
          :key="index"
        >
          {{ formatGlyphEffect(effect) }}
        </div>
      </div>
      <PrimaryButton
        v-if="isDoomed"
        :enabled="false"
      >
        Нельзя создавать Глифы Реальности в Обречении
      </PrimaryButton>
      <PrimaryButton
        v-else-if="realityGlyphLevel !== 0"
        @click="createRealityGlyph"
      >
        Создать Глиф Реальности!
      </PrimaryButton>
      <PrimaryButton
        v-else
        :enabled="false"
      >
        Уровень Глифа Реальности должен быть выше {{ formatInt(0) }}
      </PrimaryButton>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-available-effects-container {
  margin: 1.5rem 0 2rem;
}

.o-available-effects {
  font-weight: bold;
}
</style>
