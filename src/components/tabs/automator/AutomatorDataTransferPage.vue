<script>
import AutomatorDataTransferSingleEntry from "./AutomatorDataTransferSingleEntry";

export default {
  name: "AutomatorDataTransferPage",
  components: {
    AutomatorDataTransferSingleEntry,
  },
  data() {
    return {
      scripts: 0,
    };
  },
  computed: {
    maxScriptCount: () => AutomatorData.MAX_ALLOWED_SCRIPT_COUNT,
  },
  created() {
    this.loadScripts();
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => {
      this.loadScripts();
    });
  },
  methods: {
    loadScripts() {
      this.scripts = Object.values(player.reality.automator.scripts).map(script => ({
        id: script.id,
        name: script.name,
      }));
    },
  }
};
</script>

<template>
  <div class="l-panel-padding">
    Эта страница позволяет вам импортировать и экспортировать программы с прикреплением дополнительных данных; закодированный текст также будет содержать данные
    о всех сохранённых Древах Исследований и постоянных, использованных в программе. Это позволяет более легко перемещать работающие
    программы между сохранениями, но, возможно, вам придётся заместить часть существующих данных ввиду ограниченности
    памяти, отведённой на сохранённые Древа и постоянные. Данные, экспортируемые с данной страницы, могут быть импортированы таким же образом, как
    импортируются данные отдельной программы.
    <br>
    <br>
    Примечание: упоминание имени постоянной или команды закупки сохранённого Древа в комментариях также будут считаться
    "использованиями" их в программе. Так сделанно намеренно, так как предполагается, что комментарий отражает то, что сама программа
    пытается делать с сохранёнными Древами и постоянными.
    <br>
    <br>
    <div
      v-for="(script, id) in scripts"
      :key="id"
    >
      <AutomatorDataTransferSingleEntry
        class="l-entry-margin"
        :script="script"
      />
    </div>
  </div>
</template>

<style scoped>
.l-panel-padding {
  padding: 0.5rem 2rem 1rem 0;
}

.l-entry-margin {
  margin-bottom: 1rem;
}

.c-import-button {
  margin: 1rem 1rem -1rem;
  border-radius: var(--var-border-radius, 0.4rem);
  border-width: var(--var-border-width, 0.2rem);
  cursor: pointer;
}
</style>
