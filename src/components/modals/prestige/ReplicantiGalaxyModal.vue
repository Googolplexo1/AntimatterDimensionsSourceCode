<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ReplicantiGalaxyModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      replicanti: new Decimal(),
      divideReplicanti: false,
      canBeBought: 0,
    };
  },
  computed: {
    topLabel() {
      return `Вы получаете ${quantifyInt("Галактику", this.canBeBought)} Репликанти`;
    },
    message() {
      const reductionString = this.divideReplicanti
        ? `разделено на ${format(Number.MAX_VALUE, 2, 2)} за каждую полученную Галактику Репликанти
          (${format(this.replicanti, 2, 2)} ➜
          ${format(this.replicanti.divide(Decimal.NUMBER_MAX_VALUE.pow(this.canBeBought)), 2, 2)})`
        : `сброшено до ${formatInt(1)}`;
      return `Галактики Репликанти усиливают ускорители так же, как Галактики Антиматерии. Однако их получение не
        увеличивает цену Галактики Антиматерии, и эффекты, влияющие на Галактики Антиматерии, по умолчанию не влияют на Галактики Репликанти.
        Количество ваших Репликанти будет ${reductionString}.`;
    }
  },
  methods: {
    update() {
      this.replicanti.copyFrom(player.replicanti.amount);
      this.divideReplicanti = Achievement(126).isUnlocked;
      this.canBeBought = Replicanti.galaxies.gain;
      if (this.replicanti.lt(Number.MAX_VALUE)) this.emitClose();
    },
    handleYesClick() {
      replicantiGalaxy(false);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="replicantiGalaxy"
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
