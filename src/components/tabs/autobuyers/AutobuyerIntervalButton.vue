<script>
export default {
  name: "AutobuyerIntervalButton",
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cost: 0,
      isMaxed: false,
      isUpgradeable: false,
      isAffordable: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-autobuyer-btn": true,
        "l-autobuyer-box__button": true,
        "o-autobuyer-btn--unavailable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      this.cost = this.autobuyer.cost;
      this.isMaxed = this.autobuyer.hasMaxedInterval;
      this.isUpgradeable = this.autobuyer.canBeUpgraded;
      this.isAffordable = Currency.infinityPoints.gte(this.cost);
    },
    upgradeInterval() {
      this.autobuyer.upgradeInterval();
    }
  }
};
</script>

<template>
  <button
    v-if="!isMaxed && isUpgradeable"
    :class="classObject"
    @click="upgradeInterval"
  >
    Уменьшить интервал на {{ formatPercents(0.4) }}
    <br>
    Цена: {{ format(cost, 2) }} ОБ
  </button>
  <button
    v-else-if="!isMaxed"
    class="o-autobuyer-btn l-autobuyer-box__button o-autobuyer-btn--unavailable"
  >
    Выполните Испытание, чтобы разблокировать возможность уменьшать интервал
  </button>
</template>

<style scoped>

</style>
