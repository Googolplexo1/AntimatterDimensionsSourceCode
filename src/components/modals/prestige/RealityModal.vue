<script>
import GlyphComponent from "@/components/GlyphComponent";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RealityModal",
  components: {
    PrimaryButton,
    ModalWrapperChoice,
    GlyphComponent,
  },
  data() {
    return {
      firstReality: false,
      hasSpace: true,
      hasChoice: false,
      hasFilter: false,
      glyphs: [],
      bestLevel: 0,
      levelDifference: 0,
      selectedGlyph: undefined,
      canRefresh: false,
      level: 0,
      simRealities: 0,
      realityMachines: new Decimal(),
      shardsGained: 0,
      effarigUnlocked: false,
      willAutoPurge: false,
    };
  },
  computed: {
    firstRealityText() {
      return `Реальность сбросит всё, кроме рекордов испытаний и статистики в разделе "Общее".
        Достижения в первых ${formatInt(13)} рядах также будут сброшены,
        но они будут восстанавливаться по одному раз в 30 минут.
        Вы также получите определённое количество Машин Реальности в зависимости от максимального количества ваших Очков Вечности,
        глиф, уровень которого зависит от максимального количества ваших Очков Вечности, Репликанти и Замедленного Времени в этой реальности, и Очко Умения, которое можно потратить
        на улучшения, связанные с автоматизацией, и разблокируете различные улучшения.`;
    },
    canSacrifice() {
      return RealityUpgrade(19).isEffectActive;
    },
    warnText() {
      if (!this.hasChoice) {
        return `В данный момент вы не можете выбирать глиф, который вы получите
          на реальности. Вы можете разблокировать такую возможность, закрыв это окно и
          купив Навык СТАРТ.`;
      }

      if (this.hasFilter && this.selectedGlyph === undefined) {
        return `Если вы не выберете глиф, один из них будет автоматически выбран в соответствии с Фильтром Глифов.`;
      }
      return this.selectedGlyph === undefined
        ? `Вы должны выбрать глиф.`
        : null;
    },
    gained() {
      const gainedResources = [];
      gainedResources.push(`${quantifyInt("реальность", this.simRealities)}`);
      gainedResources.push(`${quantifyInt("Очко", this.simRealities)} Умения`);
      gainedResources.push(`${quantify("Машину", this.realityMachines, 2)} Реальности`);
      if (this.effarigUnlocked) {
        gainedResources.push(`${quantify("Реликтовый Осколок", this.shardsGained, 2)}`);
      }
      return `Вы получите ${makeEnumeration(gainedResources)}`;
    },
    levelStats() {
      // Bit annoying to read due to needing >, <, and =, with = needing a different format.
      return `При реальности вы получите глиф уровня ${formatInt(this.level)}, то есть 
        ${this.level === this.bestLevel ? "такого же, как" : `на
        ${formatInt(this.levelDifference)}
        ${this.level > this.bestLevel ? "выше" : "ниже"}, чем`} максимальный ранее достигнутый.`;
    },
    confirmationToDisable() {
      return ConfirmationTypes.glyphSelection.isUnlocked() ? "glyphSelection" : undefined;
    },
    canConfirm() {
      return this.firstReality || this.selectedGlyph !== undefined || this.hasFilter;
    }
  },
  created() {
    this.getGlyphs();
    GlyphSelection.realityProps = getRealityProps(false, false);
  },
  methods: {
    update() {
      this.firstReality = player.realities === 0;
      this.hasChoice = Perk.firstPerk.isEffectActive;
      this.effarigUnlocked = TeresaUnlocks.effarig.canBeApplied;
      this.hasFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.level = gainedGlyphLevel().actualLevel;
      this.simRealities = 1 + simulatedRealityCount(false);
      this.hasSpace = GameCache.glyphInventorySpace.value >= this.simRealities;
      const simRMGained = MachineHandler.gainedRealityMachines.times(this.simRealities);
      this.realityMachines.copyFrom(simRMGained.clampMax(MachineHandler.distanceToRMCap));
      this.shardsGained = Effarig.shardsGained * (simulatedRealityCount(false) + 1);
      this.willAutoPurge = player.reality.autoAutoClean;
      if (this.firstReality) return;
      for (let i = 0; i < this.glyphs.length; ++i) {
        const currentGlyph = this.glyphs[i];
        const newGlyph = GlyphSelection.glyphList(
          GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false }
        )[i];
        if (currentGlyph.level === newGlyph.level) continue;
        currentGlyph.level = newGlyph.level;
        currentGlyph.effects = newGlyph.effects;
      }
      this.bestLevel = player.records.bestReality.glyphLevel;
      this.levelDifference = Math.abs(this.bestLevel - this.level);
    },
    glyphClass(index) {
      return {
        "l-modal-glyph-selection__glyph": true,
        "l-modal-glyph-selection__glyph--selected": this.selectedGlyph === index,
      };
    },
    getGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.upcomingGlyphs;
    },
    select(index) {
      this.selectedGlyph = index;
    },
    confirmModal(sacrifice) {
      if (!this.canConfirm) return;
      if (sacrifice) {
        // Sac isn't passed through confirm so we have to close it manually
        this.emitClose();
      }
      startManualReality(sacrifice, this.selectedGlyph);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :option="confirmationToDisable"
    :show-confirm="canConfirm"
    @confirm="confirmModal(false)"
  >
    <template #header>
      Вы совершаете реальность
    </template>
    <div
      v-if="firstReality"
      class="c-modal-message__text"
    >
      {{ firstRealityText }}
    </div>

    <div class="c-modal-message__text">
      {{ gained }}
    </div>
    <div
      v-if="!firstReality"
      class="l-glyph-selection__row"
    >
      <GlyphComponent
        v-for="(glyph, index) in glyphs"
        :key="index"
        :class="glyphClass(index)"
        :glyph="glyph"
        :is-in-modal="true"
        :ignore-modified-level="true"
        :show-sacrifice="canSacrifice"
        @click.native="select(index)"
      />
    </div>
    <div v-if="!firstReality">
      {{ levelStats }}
      <br>
      <b class="o-warning">
        {{ warnText }}
      </b>
    </div>
    <div v-if="simRealities > 1">
      <br>
      После того как вы выберете глиф из этих вариантов, игра симулирует оставшиеся реальности,
      <br>
      автоматически выбирая ещё {{ quantifyInt("глиф", simRealities - 1) }}
      согласно Фильтру Глифов.
    </div>
    <div v-if="willAutoPurge">
      <br>
      Автоматическая прочистка в данный момент включена; выбранный вами глиф
      <br>
      может не появиться в вашем инвентаре, так как будет удалён.
    </div>
    <div
      v-if="!hasSpace"
      class="o-warning"
    >
      <span v-if="simRealities > 1">
        Вы симулируете больше реальностей, чем в вашем инвентаре свободных ячеек;
        вследствие этого некоторые выбираемые глифы могут быть пожертвованы.
      </span>
      <span v-else>
        В вашем инвентаре нет свободных ячеек - выбранный вами глиф будет автоматически
        {{ canSacrifice ? "пожертвован" : "удалён" }}!
      </span>
    </div>
    <div v-if="confirmationToDisable">
      <br>
      Вы можете вынудить это окно открыться (даже если оно отключено) при нажатии кнопки реальности, зажав клавишу Shift.
    </div>
    <template
      v-if="canSacrifice && canConfirm"
      #extra-buttons
    >
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="confirmModal(true)"
      >
        Пожертвовать
      </PrimaryButton>
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.o-warning {
  color: var(--color-infinity);
}
</style>
