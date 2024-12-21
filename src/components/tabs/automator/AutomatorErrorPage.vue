<script>
export default {
  name: "AutomatorErrorPage",
  data() {
    return {
      errors: [],
    };
  },
  methods: {
    update() {
      this.errors = AutomatorData.currentErrors();
    },
    scrollToLine(line) {
      AutomatorScroller.scrollToLine(line);
      AutomatorHighlighter.updateHighlightedLine(line, LineEnum.Error);
    }
  }
};
</script>

<template>
  <div class="c-automator-docs-page">
    <div v-if="errors.length === 0">
      Программа не содержит ошибок!
    </div>
    <div v-else>
      <b>В вашей программе {{ pluralize("найдена", errors.length) }} {{ quantify("ошибка", errors.length) }}:</b>
      <br>
      <span
        v-for="(error, i) in errors"
        :key="i"
      >
        <b>В строке {{ error.startLine }}:</b>
        <button
          v-tooltip="'Перейти к этой строке'"
          class="c-automator-docs--button fas fa-arrow-circle-right"
          @click="scrollToLine(error.startLine)"
        />
        <div class="c-automator-docs-page__indented">
          {{ error.info }}
        </div>
        <div class="c-automator-docs-page__indented">
          <i>Предлагаемый способ устранения: {{ error.tip }}</i>
        </div>
      </span>
      <i>
        Примечание: иногда Автоматизатор не может правильно интерпретировать часть программы после ошибки.
        Это может привести к тому, что некоторые ошибки "исчезнут" из-за ошибки на одной из предыдущих строк, или
        ошибка в команде, имеющей внутренний блок кода (например, IF, WHILE), приведёт к отображению ошибки
        на одной из следующих строк, даже если она на самом деле не содержит ошибку.
        Кроме того, иногда предлагаемый способ устранения ошибки может навредить программе, так как причина появления
        ошибки неясна.
      </i>
    </div>
  </div>
</template>

<style scoped>

</style>
