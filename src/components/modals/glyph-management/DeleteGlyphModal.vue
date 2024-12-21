<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DeleteGlyphModal",
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
      confirmedDelete: false
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.idx);
    },
  },
  methods: {
    update() {
      const newGlyph = Glyphs.findByInventoryIndex(this.idx);
      if (this.glyph !== newGlyph && !this.confirmedDelete) {

        // Why is confirmedDelete here: refer to SacrificeGlyphModal.vue

        this.emitClose();
        Modal.message.show("Выбранный глиф был перемещён или изменён иначе!");
      }
    },
    handleYesClick() {
      this.confirmedDelete = true;
      Glyphs.removeFromInventory(this.glyph);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      Вы удаляете глиф
    </template>
    <div class="c-modal-message__text">
      Глиф будет убран из вашего инвентаря!
      <div class="c-modal-hard-reset-danger">
        Удаление глифа не приносит выгоды, до тех пор пока вы не разблокировали Пожертвование Глифов!
      </div>
    </div>
  </ModalWrapperChoice>
</template>
