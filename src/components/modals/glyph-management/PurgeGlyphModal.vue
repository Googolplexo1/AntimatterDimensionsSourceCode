<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    harsh: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    threshold() {
      return this.harsh ? 1 : 5;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `Ни один глиф не будет удалён.`;
      if (this.glyphsDeleted === this.glyphsTotal) return `Все глифы будут удалены.`;
      return `${this.glyphsDeleted} из ${this.glyphsTotal} будет ${pluralize("удалён", this.glyphsDeleted)}.`;
    },
    explanation() {
      if (this.harsh) return `Строгая прочистка удаляет все глифы, которые строго хуже любого другого глифа в вашем
        инвентаре. Например, если глиф имеет те же самые эффекты, что и некоторый другой глиф, но значения
        ВСЕХ эффектов хуже, то он будет удалён.`;
      return `Прочистка удаляет все глифы, которые строго хуже других глифов, сохраняя достаточное количество, чтобы занять все слоты
        глифами с одним и тем же эффектом. Это похоже на строгую прочистку, но обычная прочистка удаляет
        глиф, лишь если найдётся пять строго лучших глифов (вместо одного).`;
    },
    topLabel() {
      return `Вы осуществляете ${this.harsh ? `строгую` : ``} прочистку вашего инвентаря`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return quantifyInt("глифа", Glyphs.inventory.filter(slot => slot !== null).length);
    },
    glyphsDeleted() {
      return Glyphs.autoClean(this.threshold, false);
    },
  },
  methods: {
    handleYesClick() {
      Glyphs.autoClean(this.threshold, true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="autoClean"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      Из вашего инвентаря могут быть удалены глифы, достаточно сильные, чтобы вы захотели их использовать
      впоследствии. Прочистка удалит глифы в зависимости от режима. Вы уверены, что хотите её осуществить?
      <br>
      <br>
      {{ explanation }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
