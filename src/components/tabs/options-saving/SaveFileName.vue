<script>
export default {
  name: "SaveFileName",
  components: {
  },
  data() {
    return {
      saveFileName: ""
    };
  },
  methods: {
    update() {
      this.saveFileName = player.options.saveFileName;
    },
    removeNotAvailableCharacters(input) {
      return input.replace(/[^a-zA-Z0-9 -]/gu, "");
    },
    handleChange(event) {
      const newName = this.removeNotAvailableCharacters(event.target.value.trim());
      player.options.saveFileName = newName;
      event.target.value = newName;
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--input l-options-grid__button">
    <b>Имя сохранения:</b>
    <span ach-tooltip="Выставить имя сохранения (должно состоять только из букв английского алфавита, цифр, пробелов и дефисов, максимальная длина 16 символов)">
      <input
        class="c-custom-save-name__input"
        type="text"
        maxlength="16"
        placeholder="Имя сохранения"
        :value="saveFileName"
        @change="handleChange"
      >
    </span>
  </div>
</template>

<style scoped>
.c-custom-save-name__input {
  text-align: center;
  font-family: Typewriter;
  font-size: 1.3rem;
  font-weight: bold;
  border: 0.1rem solid black;
  border-radius: var(--var-border-radius, 0.3rem);
}
</style>
