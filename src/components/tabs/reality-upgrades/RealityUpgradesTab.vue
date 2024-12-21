<script>
import RealityUpgradeButton from "./RealityUpgradeButton";

export default {
  name: "RealityUpgradesTab",
  components: {
    RealityUpgradeButton
  },
  computed: {
    upgrades: () => RealityUpgrades.all,
    costScalingTooltip: () => `Цены растут принципиально быстрее после ${format(1e30)} МР,
      а после ${format(Decimal.NUMBER_MAX_VALUE, 1)} МР - кардинально быстрее`,
    possibleTooltip: () => `Улучшения, раскрашенные в красную клетку, невозможно разблокировать в текущей реальности,
      а раскрашенные в жёлтую полоску - возможно.`,
    lockTooltip: () => `Проверка будет работать, только если вы ещё не разблокировали улучшение, но ещё можете
      разблокировать его в текущей реальности.`,
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-reality-upgrade-infotext">
      Наводите курсор на иконки <i class="fas fa-question-circle" /> для просмотра дополнительной информации.
      <br>
      Улучшения из верхнего ряда можно покупать сколь угодно много раз за экспоненциально растущие цены
      <span :ach-tooltip="costScalingTooltip">
        <i class="fas fa-question-circle" />
      </span>, а остальные - по одному.
      <br>
      Последние имеют требования, которые, будучи однажды выполнены, навсегда разблокируют возможность купить эти улучшения.
      <span :ach-tooltip="possibleTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      Заблокированные улучшения по умолчанию показывают свои требования и эффекты, а разблокированные -
      эффекты, их значения и цены. При зажатии клавиши Shift они меняются ролями.
      <br>
      Вы можете нажать на улучшение, имеющее значок <i class="fas fa-lock-open" />, зажав клавишу Shift, чтобы игра предотвращала
      все действия, которые приведут к тому, что вы не сможете разблокировать это улучшение в текущей реальности.
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      Уровень получаемых глифов увеличивается на количество рядов, из которых вы купили все улучшения.
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <RealityUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-reality-upgrade-infotext {
  color: var(--color-text);
  margin: -1rem 0 1.5rem;
}
</style>
