<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "GlyphSetSaveDeleteModal",
  components: {
    ModalWrapperChoice,
    GlyphSetPreview
  },
  props: {
    glyphSetId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      glyphSet: []
    };
  },
  methods: {
    update() {
      this.glyphSet = Glyphs.copyForRecords(player.reality.glyphs.sets[this.glyphSetId].glyphs);
    },
    handleYesClick() {
      player.reality.glyphs.sets[this.glyphSetId].glyphs = [];
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="deleteGlyphSetSave"
    @confirm="handleYesClick"
  >
    <template #header>
      Удалить набор глифов
    </template>
    <div class="c-modal-message__text">
      Пожалуйста, подтвердите ваше намерение удалить этот набор глифов:
      <GlyphSetPreview
        :is-in-modal="true"
        :glyphs="glyphSet"
      />
      Собственно глифы не будут удалены, только сохранённая комбинация.
    </div>
    <template #confirm-text>
      Удалить
    </template>
  </ModalWrapperChoice>
</template>
