<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UpgradeMechanicLockModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    isImaginary: {
      type: Boolean,
      required: true,
    },
    specialLockText: {
      type: String,
      required: false,
      default: null,
    }
  },
  computed: {
    upgradeStr() {
      return this.isImaginary ? "Мнимого Улучшения" : "Улучшения Реальности";
    },
    lockEvent() {
      return this.specialLockText ?? this.upgrade.lockEvent;
    }
  },
  methods: {
    disableLock() {
      this.upgrade.setMechanicLock(false);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="disableLock"
  >
    <template #header>
      Проверка требования {{ upgradeStr }}
    </template>
    <div class="c-modal-message__text">
      Вы уверены, что хотите {{ lockEvent }}? Если вы сделаете это прямо сейчас,
      <span class="l-emphasis">
        вы нарушите требование {{ upgradeStr }} "{{ upgrade.name }}"
      </span>
      <span :ach-tooltip="upgrade.requirement">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      <br>
      Нажав "Отменить", вы закроете это окно без последствий, в то время как при выборе варианта "Отключить проверку"
      проверка требования этого Улучшения будет отключена, и это сообщение больше не всплывёт, если только вы не включите проверку вновь.
      <br>
      <br>
      В любом случае действие, которое вы попытались совершить, не будет совершено, так что вам придётся попробовать совершить его снова.
    </div>
    <template #confirm-text>
      Отключить проверку
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
