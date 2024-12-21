<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "BreakInfinityModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      const infinity = formatPostBreak(Number.MAX_VALUE, 2);
      return `Преодоление Бесконечности позволит вам набрать больше ${infinity} антиматерии${PlayerProgress.eternityUnlocked()
        ? "." : ` и читать числа, превышающие ${infinity}.`}
        Измерения и ускорители будут расти в цене быстрее после ${infinity} антиматерии.
        Вы будете получать больше Очков Бесконечности при Большом Сжатии в зависимости от наибольшего количества антиматерии в этой бесконечности.\
        ${EternityMilestone.keepAutobuyers.isReached ? "" : `\nВы также разблокируете Улучшения Преодоления и улучшите до предела\
        всю автоматику, разблокированную или улучшенную Обычными Испытаниями.`}`.split("\n");
    },
  },
  methods: {
    handleYesClick() {
      breakInfinity();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    @confirm="handleYesClick"
  >
    <template #header>
      Вы преодолеваете Бесконечность
    </template>
    <div class="c-modal-message__text">
      <span
        v-for="(line, index) in message"
        :key="index"
      >
        {{ line }} <br>
      </span>
    </div>
    <template #confirm-text>
      Преодолеть
    </template>
  </ModalWrapperChoice>
</template>
