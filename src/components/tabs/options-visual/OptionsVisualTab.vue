<script>
import ExpandingControlBox from "@/components/ExpandingControlBox";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import OptionsButton from "@/components/OptionsButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SelectNotationDropdown from "@/components/tabs/options-visual/SelectNotationDropdown";
import SelectThemeDropdown from "@/components/tabs/options-visual/SelectThemeDropdown";
import SelectSidebarDropdown from "@/components/tabs/options-visual/SelectSidebarDropdown";
import UpdateRateSlider from "./UpdateRateSlider";

export default {
  name: "OptionsVisualTab",
  components: {
    UpdateRateSlider,
    PrimaryToggleButton,
    ExpandingControlBox,
    OptionsButton,
    OpenModalHotkeysButton,
    SelectThemeDropdown,
    SelectNotationDropdown,
    SelectSidebarDropdown
  },
  data() {
    return {
      theme: "",
      notation: "",
      sidebarResource: "",
      headerTextColored: true,
      gender: "",
    };
  },
  computed: {
    sidebarDB: () => GameDatabase.sidebarResources,
    themeLabel() {
      return `Тема: ${Themes.find(this.theme).displayName()}`;
    },
    notationLabel() {
      return `Нотация: ${this.notation}`;
    },
    sidebarLabel() {
      return `Левый верхний угол (в Современном интерфейсе): ${this.sidebarResource}`;
    },
    UILabel() {
      return `Интерфейс: ${this.$viewModel.newUI ? "Современный" : "Классический"}`;
    }
  },
  watch: {
    headerTextColored(newValue) {
      player.options.headerTextColored = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.theme = Theme.currentName();
      this.notation = options.notation;
      this.sidebarResource = player.options.sidebarResourceID === 0
        ? "Новейший ресурс"
        : this.sidebarDB.find(e => e.id === player.options.sidebarResourceID).optionName;
      this.headerTextColored = options.headerTextColored;
      this.gender = options.genderMale ? "Мужской" : "Женский";
    },
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="GameOptions.toggleUI()"
        >
          {{ UILabel }}
        </OptionsButton>
        <UpdateRateSlider />
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.newsOptions.show();"
        >
          Раскрыть настройки новостей
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="themeLabel"
        >
          <template #dropdown>
            <SelectThemeDropdown />
          </template>
        </ExpandingControlBox>
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="notationLabel"
        >
          <template #dropdown>
            <SelectNotationDropdown />
          </template>
        </ExpandingControlBox>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.notation.show();"
        >
          Раскрыть настройки записи порядка
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.animationOptions.show();"
        >
          Раскрыть настройки анимаций
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.infoDisplayOptions.show()"
        >
          Раскрыть настройки отображения дополнительной информации
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.awayProgressOptions.show()"
        >
          Раскрыть настройки отображения офлайн-прогресса
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.hiddenTabs.show()"
        >
          Изменение отображаемых вкладок
        </OptionsButton>
        <PrimaryToggleButton
          v-model="headerTextColored"
          class="o-primary-btn--option l-options-grid__button"
          label="Цветовое отображение относительного прироста валюты престижа:"
        />
        <ExpandingControlBox
          v-if="$viewModel.newUI"
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="sidebarLabel"
        >
          <template #dropdown>
            <SelectSidebarDropdown />
          </template>
        </ExpandingControlBox>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="GameOptions.toggleGender()"
        >
          Ваш пол: {{ gender }}
        </OptionsButton>
      </div>
      <OpenModalHotkeysButton />
    </div>
  </div>
</template>
