<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ReplaceGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    targetSlot: {
      type: Number,
      required: true
    },
    inventoryIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      target: 0,
      idx: 0,
      isDoomed: false,
    };
  },
  computed: {
    resetTerm() { return this.isDoomed ? "текущий Армагеддон будет перезапущен" : "текущая Реальность будет перезапущена"; },
  },
  methods: {
    update() {
      this.target = this.targetSlot;
      this.idx = this.inventoryIndex;
      this.glyph = Glyphs.findByInventoryIndex(this.idx);
      this.isDoomed = Pelle.isDoomed;
    },
    handleYesClick() {
      Glyphs.swapIntoActive(this.glyph, this.targetSlot);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="glyphReplace"
    @confirm="handleYesClick"
  >
    <template #header>
      Вы заменяете глиф
    </template>
    При замене глифа {{ resetTerm }}.
  </ModalWrapperChoice>
</template>
