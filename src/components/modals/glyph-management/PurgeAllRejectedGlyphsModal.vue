<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllRejectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRefining: false,
    };
  },
  computed: {
    refiningOrSacrificing1() {
      if (this.isRefining) return `облагораживаете`;
      return `жертвуете`;
    },
    refiningOrSacrificing2() {
      if (this.isRefining) return `облагородить`;
      return `пожертвовать`;
    },
    topLabel() {
      return `Вы ${this.refiningOrSacrificing1} все глифы, отвергнутые Фильтром`;
    },
    message() {
      const negativeWarning = AutoGlyphProcessor.hasNegativeEffectScore()
        ? ` Обратите внимание, что некоторые веса эффектов для Фильтра Глифов отрицательные, из-за чего вы можете потерять глифы,
          которые вы хотите сохранить.`
        : "";
      return `Вы уверены, что хотите ${this.refiningOrSacrificing2} все глифы, отвергнутые
        текущими настройками вашего Фильтра Глифов?${negativeWarning}`;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `Ни один глиф не будет удалён.`;
      if (this.glyphsDeleted === this.glyphsTotal) return `Все глифы будут удалены.`;
      return `${this.glyphsDeleted} из ${this.glyphsTotal} будет ${pluralize("удалён", this.glyphsDeleted)}.`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return quantifyInt("глифа", Glyphs.inventory.filter(slot => slot !== null).length);
    },
    glyphsDeleted() {
      return Glyphs.deleteAllRejected(false);
    },
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
    },
    handleYesClick() {
      Glyphs.deleteAllRejected(true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrificeAll"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
