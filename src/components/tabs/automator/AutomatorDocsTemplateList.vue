<script>
export default {
  name: "AutomatorDocsTemplateList",
  data() {
    return {
      isBlock: false,
      blockTemplates: [],
      selectedTemplateID: -1,
    };
  },
  computed: {
    templates: () => GameDatabase.reality.automator.templates.scripts,
    pasteText() {
      return this.isBlock
        ? `будет создан специальный блок, который вы сможете перетянуть в то место в поле программы, где вы хотите его поместить. При этом
          он будет автоматически преобразован в группу блоков, соответствующих шаблону`
        : `шаблон будет скопирован в буфер обмена в виде текста. Затем вы сможете напрямую вставить его в желаемое место программы`;
    }
  },
  methods: {
    update() {
      this.isBlock = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
      this.blockTemplates = AutomatorData.blockTemplates;
    },
    showModal(template) {
      Modal.automatorScriptTemplate.show(template);
    },
    unpackTemplateBlocks(event) {
      const templateBlocks = this.blockTemplates[this.selectedTemplateID].blocks;
      const beforeBlocks = BlockAutomator.lines.slice(0, event.newIndex);
      // Note that slice will also pick up the Vue observer, so we need to remove that as well
      const afterBlocks = BlockAutomator.lines.slice(event.newIndex).filter(b => b.cmd);

      // Remap IDs, in case the template gets added more than once
      const maxExistingID = Math.max(...BlockAutomator._idArray.filter(id => id));
      const minTemplateID = Math.min(...templateBlocks.map(b => b.id));
      const blocksToAdd = [];
      for (const block of templateBlocks) {
        blocksToAdd.push({
          ...block,
          id: block.id + maxExistingID - minTemplateID + 1
        });
      }
      BlockAutomator.lines = beforeBlocks;
      BlockAutomator.lines.push(...blocksToAdd);
      BlockAutomator.lines.push(...afterBlocks);
      BlockAutomator.updateIdArray();
    },
    setIndex(index) {
      this.selectedTemplateID = index;
    }
  }
};
</script>

<template>
  <div>
    Эти шаблоны позволяют вам быстро составить блок кода для выполнения часто возникающих задач. Генерированный код может оказаться немного медленнее, чем
    код, написанный вручную, зато вам не нужно разбираться в программировании, если вы никогда им не занимались. При нажатии любой
    из этих кнопок откроется окно с определёнными полями ввода, которое генерирует шаблонный блок кода, который вы сможете использовать в
    вашей программе для Автоматизатора.
    <button
      v-for="template in templates"
      :key="template.name"
      class="o-primary-btn c-automator-docs-template--button l-automator__button"
      @click="showModal(template)"
    >
      Шаблон: {{ template.name }}
    </button>
    Поскольку вы сейчас в {{ isBlock ? "блочном" : "текстовом" }} режиме редактирования, {{ pasteText }}.
    <br>
    <br>
    <draggable
      v-if="isBlock"
      :key="blockTemplates.length"
      class="template-container"
      :list="blockTemplates"
      :group="{ name: 'code-blocks', pull: 'clone', put: false }"
      :sort="false"
      @end="unpackTemplateBlocks"
    >
      <div
        v-for="(template, i) in blockTemplates"
        :key="i"
        class="o-automator-command o-automator-block-list draggable-blocks"
        @dragstart="setIndex(i)"
      >
        {{ template.name }}
      </div>
    </draggable>
  </div>
</template>

<style scoped>
.c-automator-docs-template--button {
  margin: 0.4rem;
  border-radius: var(--var-border-radius, 0.4rem);
  border-width: var(--var-border-width, 0.2rem);
  cursor: pointer;
}

.template-container {
  display: flex;
  flex-direction: column;
}
</style>
