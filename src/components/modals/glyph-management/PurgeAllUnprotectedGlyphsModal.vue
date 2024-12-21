<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllUnprotectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRefining: false,
      isSacrificing: false,
    };
  },
  computed: {
    refiningSacrificingOrDeleting1() {
      if (this.isRefining) return `облагораживаете`;
      if (this.isSacrificing) return `жертвуете`;
      return `удаляете`;
    },
    refiningSacrificingOrDeleting2() {
      if (this.isRefining) return `облагородить`;
      if (this.isSacrificing) return `пожертвовать`;
      return `удалить`;
    },
    refiningSacrificingOrDeleting3() {
      if (this.isRefining) return `облагорожен`;
      if (this.isSacrificing) return `пожертвован`;
      return `удалён`;
    },
    refiningSacrificingOrDeleting4() {
      if (this.isRefining) return `облагорожены`;
      if (this.isSacrificing) return `пожертвованы`;
      return `удалены`;
    },
    topLabel() {
      return `Вы ${this.refiningSacrificingOrDeleting1} все незащищённые глифы`;
    },
    message() {
      return `Вы уверены, что хотите ${this.refiningSacrificingOrDeleting2} все незащищённые глифы?`;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `Ни один глиф не будет ${this.refiningSacrificingOrDeleting3}.`;
      if (this.glyphsDeleted === this.glyphsTotal) {
        return `Все глифы будут ${this.refiningSacrificingOrDeleting4}.`;
      }
      return `${formatInt(this.glyphsDeleted)} из ${this.glyphsTotal} будет ${pluralize(this.refiningSacrificingOrDeleting3, this.glyphsDeleted)}.`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return quantifyInt("глифа", Glyphs.inventory.filter(slot => slot !== null).length);
    },
    glyphsDeleted() {
      return Glyphs.autoClean(0, false);
    },
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
      this.isSacrificing = GlyphSacrificeHandler.canSacrifice;
    },
    handleYesClick() {
      Glyphs.deleteAllUnprotected();
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
