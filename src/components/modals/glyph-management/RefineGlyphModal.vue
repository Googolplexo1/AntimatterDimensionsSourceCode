<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "RefineGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    idx: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      resourceAmount: 0,
      resourceUnlocked: false,
      gain: 0,
      after: 0,
      cap: 0,
      confirmedRefine: false
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.idx);
    },
    resource() {
      return GlyphSacrificeHandler.glyphAlchemyResource(this.glyph);
    },
    resourceName() {
      return translateGlyph(this.glyph.type);
    },
  },
  methods: {
    update() {
      const resource = this.resource;
      this.resourceAmount = resource.amount;
      this.resourceUnlocked = resource.isUnlocked;
      this.gain = GlyphSacrificeHandler.glyphRefinementGain(this.glyph);
      this.cap = GlyphSacrificeHandler.glyphEffectiveCap(this.glyph);

      this.after = this.resourceAmount + this.gain;

      const newGlyph = Glyphs.findByInventoryIndex(this.idx);
      if (this.glyph !== newGlyph && !this.confirmedRefine) {

        // Why is confirmedRefine here: refer to SacrificeGlyphModal.vue

        this.emitClose();
        Modal.message.show("Выбранный глиф был перемещён или изменён иначе!");
      }
    },
    handleYesClick() {
      this.confirmedRefine = true;
      GlyphSacrificeHandler.refineGlyph(this.glyph);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="glyphRefine"
    @confirm="handleYesClick"
  >
    <template #header>
      Вы облагораживаете глиф
    </template>
    <div
      v-if="resourceUnlocked"
      class="c-modal-message__text"
    >
      Глиф будет удалён из инвентаря, взамен чего
      ваше количество {{ resourceName }} в алхимии возрастёт с
      {{ format(resourceAmount, 2, 2) }} до {{ format(after, 2, 2) }}.
      Этот глиф может повысить количество {{ resourceName }} не более чем до {{ format(cap, 2, 2) }}.
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      Вы не получите {{ resourceName }}, так как вы
      ещё не разблокировали этот алхимический ресурс. Вы всё равно можете облагородить этот глиф, но ничего
      не произойдёт. Вместо этого лучше пожертвовать глиф.
    </div>
  </ModalWrapperChoice>
</template>
