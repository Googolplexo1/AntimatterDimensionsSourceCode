<script>
import HiddenTabGroup from "@/components/modals/options/hidden-tabs/HiddenTabGroup";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HiddenTabsModal",
  components: {
    HiddenTabGroup,
    ModalWrapperOptions,
    PrimaryButton,
  },
  data() {
    return {
      isEnslaved: false,
      isAlmostEnd: false,
    };
  },
  computed: {
    tabs: () => Tabs.currentUIFormat,
    ending: () => player.options.genderMale ? "ен" : "на",
  },
  methods: {
    update() {
      this.isEnslaved = Enslaved.isRunning;
      this.isAlmostEnd = Pelle.hasGalaxyGenerator;
    },
    showAllTabs() {
      for (const tab of this.tabs) {
        tab.unhideTab();
        for (const subtab of tab.subtabs)
          subtab.unhideTab();
      }
    }
  },
};
</script>

<template>
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      Изменить отображаемые вкладки
    </template>
    <div class="c-modal--short">
      Нажмите на кнопку, чтобы переключить отображение вкладки.
      <br>
      Некоторые вкладки нельзя скрыть, как и текущую.
      <br>
      При раскрытии вкладки, все отделы которой скрыты, каждый из них также будет показан,
      а при скрытии всех отделов вкладки она также будет скрыта.
      <br>
      <div v-if="isAlmostEnd">
        Вы не можете скрыть вкладки после разблокировки Генератора Галактик.
      </div>
      <div v-if="isEnslaved">
        <br>
        <i>Ты долж{{ ending }}... смотреть всюду...</i>
        <br>
        (Вы не можете скрыть вкладки в этой Реальности)
      </div>
      <PrimaryButton
        @click="showAllTabs"
      >
        Показать все вкладки
      </PrimaryButton>
      <HiddenTabGroup
        v-for="(tab, index) in tabs"
        :key="index"
        :tab="tab"
        :change-enabled="!isEnslaved && !isAlmostEnd"
        class="l-hide-modal-tab-container"
      />
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.l-wrapper {
  width: 62rem;
}

.t-s12 .l-wrapper {
  width: 65rem;
}
</style>