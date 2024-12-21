<script>
export default {
  name: "AutomatorDataTransferSingleEntry",
  props: {
    script: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      presets: [],
      constants: [],
      hidePresets: true,
      hideConstants: true,
    };
  },
  computed: {
    presetData: () => player.timestudy.presets,
    constantData: () => player.reality.automator.constants,
    hasPresets() {
      return (this.presets?.length ?? 0) !== 0;
    },
    hasConstants() {
      return (this.constants?.length ?? 0) !== 0;
    },
  },
  methods: {
    update() {
      this.presets = AutomatorBackend.getUsedPresets(this.script.id);
      this.constants = AutomatorBackend.getUsedConstants(this.script.id);
    },
    iconClass(state) {
      return state ? "far fa-plus-square" : "far fa-minus-square";
    },
    exportData(id) {
      const toExport = AutomatorBackend.exportFullScriptData(id);
      if (toExport) {
        copyToClipboard(toExport);
        GameUI.notify.automator(`Все данные, связанные с программой "${this.script.name}", экспортированы в буфер обмена`, 6000);
      } else {
        GameUI.notify.error("Невозможно экспортировать данные пустой программы!");
      }
    }
  }
};
</script>

<template>
  <div class="l-entry-padding">
    <button
      v-tooltip="'Экспорт полных данных программы'"
      class="l-button-margin fas fa-file-export"
      @click="exportData(script.id)"
    />
    <b>Название программы: {{ script.name }}</b>
    <br>
    <span v-if="hasPresets">
      <span
        :class="iconClass(hidePresets)"
        @click="hidePresets = !hidePresets"
      />
      Использует {{ quantifyInt("опознанное сохранённое Древо", presets.length) }}
      <span v-if="!hidePresets">
        <div
          v-for="id in presets"
          :key="id"
        >
          <span v-if="presetData[id].name">"{{ presetData[id].name }}" (слот {{ id + 1 }}):</span>
          <span v-else>Слот для Древа {{ id + 1 }}:</span>
          <br>
          <div class="l-value-padding">
            <span v-if="presetData[id].studies">{{ presetData[id].studies }}</span>
            <i v-else>Пустое Древо</i>
          </div>
        </div>
      </span>
    </span>
    <span v-else>
      Не использует сохранённых Древ.
    </span>
    <br>
    <span v-if="hasConstants">
      <span
        :class="iconClass(hideConstants)"
        @click="hideConstants = !hideConstants"
      />
      Использует {{ quantifyInt("определённую постоянную", constants.length) }}
      <span v-if="!hideConstants">
        <div
          v-for="name in constants"
          :key="name"
        >
          "{{ name }}":
          <br>
          <div class="l-value-padding">
            {{ constantData[name] }}
          </div>
        </div>
      </span>
    </span>
    <span v-else>
      Не использует определённых постоянных.
    </span>
  </div>
</template>

<style scoped>
.l-entry-padding {
  border: solid 0.1rem var(--color-automator-docs-font);
  border-radius: var(--var-border-radius, 0.5rem);
  overflow-wrap: break-word;
  padding: 1rem 1.5rem;
}

.l-value-padding {
  padding-left: 1.5rem;
}

.l-button-margin {
  margin-right: 1rem;
}
</style>
