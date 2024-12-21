<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DimensionBoostModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    topLabel() {
      return `Вы получаете Расширение Измерений`;
    },
    message() {
      const canKeepDimensions = Pelle.isDoomed
        ? PelleUpgrade.dimBoostResetsNothing.canBeApplied
        : Perk.antimatterNoReset.canBeApplied;
      const canKeepAntimatter = Pelle.isDoomed
        ? PelleUpgrade.dimBoostResetsNothing.canBeApplied
        : (Achievement(111).isUnlocked || Perk.antimatterNoReset.canBeApplied);
      return canKeepDimensions
        ? `Поскольку у вас есть улучшение, предотвращающее сброс антиматерии, Измерений Антиматерии и ускорителей
          в этой ситуации, они не будут сброшены. Как обычно, вы получите множитель от Расширения.`
        : `Ваши ${canKeepAntimatter ? "" : "антиматерия, "}Измерения Антиматерии и ускорители будут сброшены. Вы уверены, что хотите получить Расширение?`;
    },
  },
  methods: {
    handleYesClick() {
      requestDimensionBoost(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="dimensionBoost"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
