<script>
import { forbiddenConstantPatterns } from "@/core/automator";

export default {
  name: "AutomatorDefineSingleEntry",
  props: {
    constant: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      oldAlias: "",
      aliasString: "",
      valueString: "",
    };
  },
  computed: {
    maxNameLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_NAME_LENGTH;
    },
    maxValueLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_VALUE_LENGTH;
    },
  },
  created() {
    this.aliasString = this.constant;
    this.oldAlias = this.aliasString;
    this.valueString = player.reality.automator.constants[this.aliasString];
  },
  methods: {
    // We combine error checking from both input fields together and only show one of them because showing multiple
    // errors at once is unnecessary and results in some bad UI overlapping
    currentError() {
      if (!this.aliasString) return null;

      const isValidName = this.aliasString.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/u);
      const alreadyExists = Object.keys(player.reality.automator.constants).includes(this.aliasString) &&
        this.aliasString !== this.oldAlias;
      // Use toLowerCase() in order to check against key words in a case-insensitive manner; all the stored regex
      // patterns in forbiddenConstantPatterns which get meaningfully checked against are a mixture of lowercase
      // letters and regex metacharacters
      const hasCommandConflict = forbiddenConstantPatterns.some(p => {
        const matchObj = this.aliasString.toLowerCase().match(p);
        return matchObj ? matchObj[0] === this.aliasString.toLowerCase() : false;
      });
      const shadowsPrototype = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable",
        "toLocaleString", "toString", "toValueOf"].some(p => this.aliasString.match(p));

      if (!isValidName) return "Имя постоянной может содержать только цифры и буквы английского алфавита и не может начинаться с цифры";
      if (alreadyExists) return "Вы уже определили постоянную с таким же именем";
      if (hasCommandConflict) return "Имя постоянной не может совпадать с ключевым словом команды";
      if (shadowsPrototype) return "Имя постоянной не может начинаться со встроенного в Javascript свойства прототипа";

      if (!this.valueString) return "Значение постоянной не может быть пустой строкой";

      const isNumber = this.valueString.match(/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/u);
      // Note: Does not do validation for studies existing
      const isStudyString = TimeStudyTree.isValidImportString(this.valueString);

      if (!isNumber && !isStudyString) return "Значение постоянной должно быть либо числом, либо кодом Древа Исследований";
      return null;
    },
    errorTooltip() {
      const error = this.currentError();
      if (!error) return undefined;
      return {
        content:
          `<div class="c-block-automator-error">
          <div>${error}</div>
        </div>`,
        html: true,
        trigger: "manual",
        show: true,
        classes: ["general-tooltip"]
      };
    },
    handleFocus(focus) {
      if (focus || this.currentError()) return;
      if (!this.aliasString) AutomatorBackend.deleteConstant(this.oldAlias);
      else if (!this.oldAlias) AutomatorBackend.addConstant(this.aliasString, this.valueString);
      else if (this.oldAlias === this.aliasString) AutomatorBackend.modifyConstant(this.aliasString, this.valueString);
      else AutomatorBackend.renameConstant(this.oldAlias, this.aliasString);
      this.oldAlias = this.aliasString;

      // This makes scripts respond immediately to newly-defined constants if the player types them into the
      // script before defining them here
      AutomatorData.recalculateErrors();
      if (player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) BlockAutomator.parseTextFromBlocks();
    },
    deleteConstant() {
      AutomatorBackend.deleteConstant(this.aliasString);
      this.oldAlias = "";
      this.aliasString = "";
      this.valueString = "";
    }
  }
};
</script>

<template>
  <div class="l-single-definition-container">
    <input
      v-model="aliasString"
      class="c-define-textbox c-alias"
      :class="{ 'l-limit-textbox' : aliasString.length === maxNameLength }"
      placeholder="Имя новой постоянной..."
      :maxlength="maxNameLength"
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
    <span
      v-if="aliasString"
      v-tooltip="errorTooltip()"
      class="o-arrow-padding"
    >
      🠈
    </span>
    <input
      v-if="aliasString"
      v-model="valueString"
      class="c-define-textbox c-value"
      :class="{ 'l-limit-textbox' : valueString && valueString.length === maxValueLength }"
      placeholder="Значение новой постоянной..."
      :maxlength="maxValueLength"
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
    <button
      v-if="aliasString"
      v-tooltip="'Удалить эту постоянную'"
      class="c-delete-button fas fa-eraser"
      @click="deleteConstant"
    />
  </div>
</template>

<style scoped>
.c-delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: var(--var-border-width, 0.2rem) solid var(--color-automator-controls-border);
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0.1rem -0.4rem 0.1rem 0.6rem;
  cursor: pointer;
  color: var(--color-automator-docs-font);
  background-color: var(--color-automator-controls-inactive);
}

.c-delete-button:hover {
  background-color: var(--color-automator-error-background);
}

.l-single-definition-container {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
}

.o-arrow-padding {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1rem;
}

.c-define-textbox {
  display: inline-block;
  font-family: PTMono, Typewriter, serif;
  font-size: 1.1rem;
  background: var(--color-blockmator-block-background);
  border: 0.1rem solid var(--color-blockmator-block-border);
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 0.5rem;
  color: #00ac00;
}

.l-error-textbox {
  background: var(--color-automator-error-background);
}

.l-limit-textbox {
  border-style: dotted;
  border-color: var(--color-automator-error-outline);
}

.c-alias {
  min-width: 14.5rem;
}

.c-value {
  width: 100%;
}
</style>
