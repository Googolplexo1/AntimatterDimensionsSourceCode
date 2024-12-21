<script>
import ImaginaryUpgradeButton from "./ImaginaryUpgradeButton";

export default {
  name: "ImaginaryUpgradesTab",
  components: {
    ImaginaryUpgradeButton
  },
  data() {
    return {
      baseRMCap: new Decimal(),
      capRM: new Decimal(),
      scaleTime: 0,
      capStr: "",
    };
  },
  computed: {
    upgrades: () => ImaginaryUpgrades.all,
    lockTooltip: () => `Проверка требования только предотвращает действия, 
      а не выключает эффекты, делающие его выполнение невозможным.`,
  },
  methods: {
    update() {
      this.baseRMCap.copyFrom(MachineHandler.baseRMCap);
      this.capRM.copyFrom(MachineHandler.hardcapRM);
      this.scaleTime = MachineHandler.scaleTimeForIM;
      this.capStr = format(MachineHandler.currentIMCap, 2, 2);
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-cap-text">
      Предел количества Мнимых Машин: <span class="c-reality-tab__reality-machines">{{ capStr }}</span>.
    </div>
    <div class="c-info-text">
      Вы достигли ограничения на количество Машин Реальности: {{ format(capRM) }}.
      <br>
      Рекордное количество Машин Реальности, которое вы могли бы получить на реальности, не будь этого ограничения,
      влияет на предел количества Мнимых Машин.
      <br>
      Мнимые Машины пассивно производятся со временем, но их производство экспоненциально замедляется
      по мере приближения их количества к пределу.
      <br>
      Каждые {{ formatInt(scaleTime) }} секунд разность от количества ваших Мнимых Машин до
      его предела уменьшается вдвое.
      <br>
      <br>
      Улучшения из двух верхних рядов можно покупать сколь угодно много раз, а остальные - по одному,
      и у них есть требования.
      <br>
      Мнимые Улучшения ведут себя аналогично Улучшениям Реальности с той лишь разницей, что покупаются за Мнимые Машины.
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <ImaginaryUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-cap-text {
  color: var(--color-text);
  font-size: 1.5rem;
}

.c-info-text {
  color: var(--color-text);
  margin: 1.5rem;
}
</style>
