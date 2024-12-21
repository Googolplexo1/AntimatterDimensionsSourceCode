<script>
export default {
  name: "StudyStringLine",
  props: {
    tree: {
      type: Object,
      required: true,
    },
    intoEmpty: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    importDestString() {
      return this.intoEmpty ? "при пустом Древе" : "при текущем Древе";
    }
  },
  methods: {
    formatTheoremCost(tt, st) {
      const strTT = `${formatWithCommas(tt)} ТВ`;
      const strST = `${formatWithCommas(st)} ТП`;
      return st === 0 ? strTT : `${strTT} + ${strST}`;
    }
  },
};
</script>

<template>
  <div class="l-modal-import-tree__tree-info-line">
    <div v-if="tree.timeTheorems === 0 && tree.spaceTheorems === 0">
      <i>Данный импорт {{ importDestString }} не приведёт к покупке каких-либо новых Исследований Времени.</i>
    </div>
    <div v-else>
      Данный импорт {{ importDestString }} приведёт к покупке следующих Исследований:
      <br>
      {{ tree.newStudies }}
      (Цена: {{ formatTheoremCost(tree.timeTheorems, tree.spaceTheorems) }})
    </div>
    <br>
  </div>
</template>
