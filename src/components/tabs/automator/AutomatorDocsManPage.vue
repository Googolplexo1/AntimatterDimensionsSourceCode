<script>
export default {
  name: "AutomatorDocsManPage",
  props: {
    command: {
      type: Object,
      required: true
    }
  },
  computed: {
    description() {
      const desc = this.command.description;
      return typeof desc === "function" ? desc() : desc;
    }
  }
};
</script>

<template>
  <div class="c-automator-docs-page">
    <b>КЛЮЧЕВОЕ СЛОВО</b>
    <div
      class="c-automator-docs-page__indented"
      v-html="command.keyword"
    />
    <b>СИНТАКСИС</b>
    <div
      class="c-automator-docs-page__indented"
      v-html="command.syntax"
    />
    <template v-if="command.description">
      <b>ОПИСАНИЕ</b>
      <div
        class="c-automator-docs-page__indented"
        v-html="description"
      />
    </template>
    <template v-for="section in command.sections">
      <b :key="section.name">{{ section.name }}</b>
      <template v-for="item in section.items">
        <div
          :key="item.header"
          class="c-automator-docs-page__indented"
        >
          <div v-html="item.header" />
          <div
            class="c-automator-docs-page__indented"
            v-html="item.description"
          />
        </div>
      </template>
    </template>
    <template v-if="command.examples">
      <b>ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ</b>
      <div
        v-for="example in command.examples"
        :key="example"
        class="c-automator-docs-page__indented"
        v-html="example"
      />
    </template>
  </div>
</template>

<style scoped>

</style>
