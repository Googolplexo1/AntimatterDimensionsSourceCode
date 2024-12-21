<script>
import AutomatorDefineSingleEntry from "./AutomatorDefineSingleEntry";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "AutomatorDefinePage",
  components: {
    AutomatorDefineSingleEntry,
    PrimaryButton,
  },
  data() {
    return {
      constants: [],
      count: 0,
      refreshConstants: false,
    };
  },
  computed: {
    maxConstantCount() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_COUNT;
    },
    maxNameLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_NAME_LENGTH;
    },
    maxValueLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_VALUE_LENGTH;
    },
    hasConstants() {
      return this.constants.length > 1 || this.constants[0] !== "";
    }
  },
  created() {
    // This key-swaps the container for all the constants in order to force a re-render when externally changed
    this.on$(GAME_EVENT.AUTOMATOR_CONSTANT_CHANGED, () => {
      this.refreshConstants = true;
      this.$nextTick(() => this.refreshConstants = false);
    });
  },
  methods: {
    update() {
      const existingValues = player.reality.automator.constantSortOrder;
      this.count = existingValues.length;
      this.constants = this.count < this.maxConstantCount ? [...existingValues, ""] : [...existingValues];
    },
    deleteAllConstants() {
      if (this.hasConstants) Modal.clearAutomatorConstants.show();
    },
    importPresets() {
      Modal.importTSConstants.show();
    },
  }
};
</script>

<template>
  <div class="l-panel-padding">
    Эта панель позволяет вам определять постоянные, которые могут быть использованы вместо чисел или кодов Древ Исследований.
    Постоянные общие для всех ваших программ. Вы не можете определить более
    {{ quantifyInt("постоянной", maxConstantCount) }}. Кроме того, имена и значения постоянных не могут быть длиннее
    {{ maxNameLength }} и {{ quantifyInt("символа", maxValueLength) }} соответственно. Изменение постоянных не будет учтено,
    пока текущая программа не будет перезапущена или не завершит свою работу.
    <br>
    <br>
    Например, вы можете определить
    <b>first 🠈 11,21,22,31,32,33</b>,
    чтобы использовать команду
    <b>studies purchase first</b>
    для покупки всех Исследований в первых трёх рядах.
    <br>
    <br>
    <PrimaryButton
      v-tooltip="hasConstants ? null : 'У вас нет определённых постоянных, которые можно было бы удалить!'"
      class="c-delete-margin o-primary-btn--subtab-option"
      :class="{ 'o-primary-btn--disabled' : !hasConstants }"
      @click="deleteAllConstants"
    >
      Удалить все постоянные
    </PrimaryButton>
    <br>
    <br>
    <PrimaryButton
      class="c-delete-margin o-primary-btn--subtab-option"
      @click="importPresets"
    >
      Импортировать сохранённые Древа Исследований
    </PrimaryButton>
    <div
      :key="count + refreshConstants"
      class="l-definition-container"
    >
      <AutomatorDefineSingleEntry
        v-for="(constant, i) in constants"
        :key="i"
        :constant="constant"
      />
    </div>
  </div>
</template>

<style scoped>
.c-delete-margin {
  margin: 0;
}

.l-panel-padding {
  padding: 0.5rem 2rem 0 0;
}

.l-definition-container {
  display: flex;
  flex-direction: column;
  border: solid 0.1rem var(--color-automator-docs-font);
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 0.5rem;
  margin-top: 1rem;
}
</style>
