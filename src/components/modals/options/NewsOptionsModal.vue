<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "NewsOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
    PrimaryButton,
    SliderComponent
  },
  data() {
    return {
      enabled: false,
      repeatBuffer: 40,
      AIChance: 0,
      speed: 1,
      includeAnimated: false,
    };
  },
  computed: {
    newsOnOffLabel() {
      return `Новости: ${this.enabled ? "ВКЛ." : "ВЫКЛ."}`;
    },
    sliderPropsRepeatBuffer() {
      return {
        min: 0,
        max: 80,
        interval: 1,
        width: "98%",
        tooltip: false
      };
    },
    sliderPropsAIChance() {
      return {
        min: 0,
        max: 1,
        interval: 0.01,
        width: "98%",
        tooltip: false
      };
    },
    sliderPropsSpeed() {
      return {
        min: 0.5,
        max: 2,
        interval: 0.01,
        width: "98%",
        tooltip: false
      };
    },
  },
  watch: {
    type(newValue) {
      player.options.news.type = newValue;
    },
    repeatBuffer(newValue) {
      player.options.news.repeatBuffer = parseInt(newValue, 10);
    },
    AIChance(newValue) {
      player.options.news.AIChance = parseFloat(newValue, 10);
    },
    speed(newValue) {
      player.options.news.speed = parseFloat(newValue, 10);
    },
    includeAnimated(newValue) {
      player.options.news.includeAnimated = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options.news;
      this.enabled = options.enabled;
      this.repeatBuffer = options.repeatBuffer;
      this.AIChance = options.AIChance;
      this.speed = options.speed;
      this.includeAnimated = options.includeAnimated;
    },
    adjustSliderValueRepeatBuffer(value) {
      this.repeatBuffer = value;
      player.options.repeatBuffer = this.repeatBuffer;
    },
    adjustSliderValueAIChance(value) {
      this.AIChance = value;
      player.options.AIChance = this.AIChance;
    },
    adjustSliderValueSpeed(value) {
      this.speed = value;
      player.options.speed = this.speed;
    }
  }
};
</script>

<template>
  <ModalWrapperOptions>
    <template #header>
      Настройки новостей
    </template>
    <PrimaryButton
      class="o-primary-btn o-primary-btn--option-wide"
      onclick="GameOptions.toggleNews()"
    >
      {{ newsOnOffLabel }}
    </PrimaryButton>
    <div class="o-primary-btn o-primary-btn--slider o-primary-btn--news-option">
      <b>{{ quantifyInt("сообщение", parseInt(repeatBuffer)) }} подряд без повторений гарантировано</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderPropsRepeatBuffer"
        :value="repeatBuffer"
        @input="adjustSliderValueRepeatBuffer($event)"
      />
    </div>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatPercents(parseFloat(AIChance)) }} сообщений от ИИ</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderPropsAIChance"
        :value="AIChance"
        @input="adjustSliderValueAIChance($event)"
      />
    </div>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatPercents(parseFloat(speed)) }} скорости прокрутки</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderPropsSpeed"
        :value="speed"
        @input="adjustSliderValueSpeed($event)"
      />
    </div>
    <ModalOptionsToggleButton
      v-model="includeAnimated"
      class="o-primary-btn o-primary-btn--option-wide"
      text="Анимации:"
    />
  </ModalWrapperOptions>
</template>
