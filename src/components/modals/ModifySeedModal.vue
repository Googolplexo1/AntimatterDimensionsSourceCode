<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModifySeedModal",
  components: {
    ModalWrapper,
    PrimaryButton,
  },
  data() {
    return {
      mode: 0,
      inputSeed: "",
      seedText: "",
      convertedInput: false,
      seedValue: 0,
    };
  },
  computed: {
    choiceEnum: () => SPEEDRUN_SEED_STATE,
    officialSeed: () => Speedrun.officialFixedSeed,
  },
  created() {
    this.seedValue = player.speedrun.initialSeed;
    this.inputSeed = `${player.speedrun.initialSeed}`;
    this.convertedInput = false;
  },
  methods: {
    update() {
      this.mode = player.speedrun.seedSelection;
      this.seedText = Speedrun.seedModeText();
    },
    handleSeedInput() {
      if (this.inputSeed.match(/^-?\d+$/gu)) {
        const num = Number(this.inputSeed);
        this.seedValue = Math.abs(num) > 9e15
          ? this.hashStringToSeed(this.inputSeed)
          : Number(this.inputSeed);
      } else {
        this.seedValue = this.hashStringToSeed(this.inputSeed);
      }
      this.convertedInput = this.seedValue !== Number(this.inputSeed);

      if (this.seedValue === 0) this.setMode(this.choiceEnum.FIXED);
      else this.setMode(this.choiceEnum.PLAYER, this.seedValue);
    },
    setMode(mode, seed) {
      if (mode === this.choiceEnum.PLAYER && this.seedValue === 0) return;
      Speedrun.modifySeed(mode, parseInt(seed, 10));
    },
    buttonClass(mode) {
      return {
        "o-primary-btn--subtab-option": true,
        "o-selected": mode === this.mode,
      };
    },
    // String-to-number hashing function, using a fixed numerical seed inspired by Number.MAX_VALUE
    // See https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    hashStringToSeed(str) {
      const seed = 17977308;
      let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Изменение зерна для генерации глифов
    </template>
    <div>
      Все наборы выбираемых глифов после первой Реальности на всю игру случайно определяются с самого
      первого запуска игры по начальному значению числа, которое называется "зерном". Его роль заключается в генерации
      <i>определёной</i> последовательности наборов выбираемых глифов. Если кто-то выберет то же зерно, что и вы,
      в другом забеге, вы будете выбирать глифы из одинаковых наборов.
      <br>
      <br>
      Вы можете свободно переключаться между следующими тремя опциями, до тех пор пока вы не получите первый глиф.
      <br>
      Текущая настройка: <b>{{ seedText }}</b>
      <br>
      <br>
      <PrimaryButton
        :class="buttonClass(choiceEnum.FIXED)"
        @click="setMode(choiceEnum.FIXED)"
      >
        Официально утверждённое зерно
      </PrimaryButton>
      <br>
      Эта настройка, выставленная по умолчанию, выбирает зерно <b>{{ officialSeed }}</b>. Любой, кто
      не будет менять зерно, увидит те же самые наборы выбираемых глифов.
      <br>
      <br>
      <PrimaryButton
        :class="buttonClass(choiceEnum.RANDOM)"
        @click="setMode(choiceEnum.RANDOM)"
      >
        Случайное зерно
      </PrimaryButton>
      <br>
      Зерно будет выбрано случайным образом, что почти гарантированно сделает наборы выбираемых глифов
      другими, нежели в забеге любого другого игрока, если только они не выбрали то же самое значение намеренно.
      <br>
      <br>
      <PrimaryButton
        v-tooltip="seedValue === 0 ? 'Зерно не может быть равно нулю!' : ''"
        :class="buttonClass(choiceEnum.PLAYER)"
        @click="setMode(choiceEnum.PLAYER, seedValue)"
      >
        Зерно по выбору игрока:
      </PrimaryButton>
      <input
        ref="inputSeed"
        v-model="inputSeed"
        type="text"
        class="c-modal-input"
        @input="handleSeedInput()"
      >
      <br>
      Ваше зерно примет введённое вами значение.
      <br>
      <span v-if="seedValue !== 0">
        Вы ввели значение, которое будет {{ convertedInput ? "преобразовано в" : "использовано как" }} число <b>{{ seedValue }}</b>.
      </span>
      <span v-else>
        Введённое вами значение {{ convertedInput ? "преобразуется в" : "равно" }} <b>0</b>;
        зерно примет значение по умолчанию.
      </span>
      <br>
      По техническим причинам значение зерна должно быть ненулевым для корректной генерации глифов.
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-selected {
  color: var(--color-text-inverted);
  background-color: var(--color-good);
}
</style>
