<script>
import { Settings } from "../../../ad-notations.esm"

import ModalWrapper from "@/components/modals/ModalWrapper";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "NotationModal",
  components: {
    ModalWrapper,
    SliderComponent
  },
  data() {
    return {
      commaDigits: 0,
      notationDigits: 0,
    };
  },
  computed: {
    sampleNums() {
      const largestExponent = "123456789012345";
      const numbers = [];
      for (let digits = 4; digits < 16; digits++) numbers.push(Decimal.pow10(largestExponent.substring(0, digits)));
      return numbers;
    },
    sliderProps() {
      return {
        min: 3,
        max: 15,
        interval: 1,
        width: "100%",
        tooltip: false
      };
    },
  },
  watch: {
    commaDigits(newValue) {
      player.options.notationDigits.comma = newValue;
      Settings.exponentCommas.min = 10 ** newValue;
    },
    notationDigits(newValue) {
      player.options.notationDigits.notation = newValue;
      Settings.exponentCommas.max = 10 ** newValue;
    },
  },
  // This puts the sliders in the right spots on initialization
  created() {
    const options = player.options.notationDigits;
    this.commaDigits = options.comma;
    this.notationDigits = options.notation;
  },
  methods: {
    update() {
      const options = player.options.notationDigits;
      this.commaDigits = options.comma;
      this.notationDigits = options.notation;
    },

    // These need a bit of extra logic to ensure that the notation threshold is always >= the comma threshold
    adjustSliderComma(value) {
      this.commaDigits = value;
      player.options.notationDigits.comma = value;
      if (value > this.notationDigits) this.adjustSliderNotation(value);
    },
    adjustSliderNotation(value) {
      this.notationDigits = value;
      player.options.notationDigits.notation = value;
      if (value < this.commaDigits) this.adjustSliderComma(value);
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Настройки записи порядка
    </template>
    Вы можете контролировать запись огромных чисел в игре. Порядок числа, если он достаточно мал, будет
    отображён без дополнительного форматирования. У досаточно больших чисел в порядок для ясности будут вставлены пробелы,
    а у самых больших чисел порядок будет форматирован в соответствии с текущей нотацией. Ниже вы можете
    изменить, сколько цифр должен иметь порядок, чтобы он был отформатирован описанным образом:
    <br>
    <br>
    <div class="c-single-slider">
      <b class="o-digit-text">Вставка пробелов в порядок: с {{ formatInt(commaDigits + 1) }} цифр</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="commaDigits"
        @input="adjustSliderComma($event)"
      />
    </div>
    <div class="c-single-slider">
      <b class="o-digit-text">Форматирование порядка в соответствии с нотацией: с {{ formatInt(notationDigits + 1) }} цифр</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="notationDigits"
        @input="adjustSliderNotation($event)"
      />
    </div>
    <br>
    Примеры форматированных чисел:
    <div class="c-sample-numbers">
      <span
        v-for="(num, id) in sampleNums"
        :key="id"
        class="o-single-number"
      >
        {{ formatPostBreak(num) }}
      </span>
    </div>
    <br>
    Примечание: интерфейс, как правило, оптимизирован под Научную нотацию с настройками в {{ formatInt(6) }}
    и {{ formatInt(10) }} цифр соответственно. Некоторые строки текста могут выглядеть странно или вылезать за пределы блоков, если ваши настройки
    значительно отличаются. Кроме того, эти настройки не влияют на запись чисел
    в некоторых нотациях.
  </ModalWrapper>
</template>

<style scoped>
.c-single-slider {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.o-digit-text {
  width: 40rem;
}

.o-slider {
  width: 25rem;
}

.c-sample-numbers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 1.5rem;
}

.o-single-number {
  width: 33%;
}
</style>
