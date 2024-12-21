<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ArmageddonModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      remnantsGain: 0,
      realityShardGain: new Decimal(0),
      nextRealityShardGain: new Decimal(0),
      canArmageddon: false,
    };
  },
  computed: {
    topLabel() {
      if (!this.isDoomed) return `Вы обрекаете Реальность`;
      return `Вы совершаете армагеддон`;
    },
    message() {
      const isFirstReset = (Currency.remnants.eq(0))
        ? `станете производить ${format(this.nextRealityShardGain, 2, 2)} Осколка Реальности в секунду`
        : `увеличите ваше получение Осколков Реальности с ${format(this.realityShardGain, 2, 2)}/c
          до ${format(this.nextRealityShardGain, 2, 2)}/c`;

      return `Армагеддон сбросит Обречённую Реальность. Вы получите
      ${quantify("Останок", this.remnantsGain, 2, 0)} и ${isFirstReset}`;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.remnantsGain = Pelle.remnantsGain;
      this.realityShardGain.copyFrom(Pelle.realityShardGainPerSecond);
      this.nextRealityShardGain.copyFrom(Pelle.nextRealityShardGain);
      this.canArmageddon = Pelle.canArmageddon;
    },
    handleYesClick() {
      Pelle.initializeRun();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :option="isDoomed ? 'armageddon' : undefined"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div
      v-if="!isDoomed"
      class="c-modal-message__text"
    >
      Обречение Реальности сбросит всё, кроме рекордов испытаний, прогресса по Небожителям и статистики в разделах
      "Общее" и "Реальность". Вы не получите наград за прогресс
      в текущей реальности. Обречение Реальности также удалит большинство ваших незащищённых глифов и отключит
      некоторые игровые механики.
      <br>
      <br>
      Вы уверены, что хотите обречь Реальность?
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
