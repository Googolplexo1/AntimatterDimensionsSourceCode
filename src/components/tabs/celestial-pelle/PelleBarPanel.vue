<script>
import PelleRift from "./PelleRift";

export default {
  name: "PelleBarPanel",
  components: {
    PelleRift
  },
  data() {
    return {
      decayRate: 0,
      isCollapsed: false,
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    }
  },
  methods: {
    update() {
      this.decayRate = Pelle.riftDrainPercent;
      this.isCollapsed = player.celestials.pelle.collapsed.rifts;
      this.strikes = PelleStrikes.all.filter(strikes => strikes.hasStrike);
      this.allStrikes = PelleStrikes.all;
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.rifts = !this.isCollapsed;
    },
  }
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        :class="collapseIcon"
        class="c-collapse-icon-clickable"
        @click="toggleCollapse"
      />
      Разломы и Удары Пелля
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      Заполнение Разлома можно включить, нажав на его полоску.
      <span v-if="strikes.length > 2">Вы можете заполнять не более двух Разломов одновременно.</span>
      <br v-else>
      На заполнение Разлома расходуется {{ formatPercents(decayRate) }} соответствующего ресурса в секунду.
      <br>
      Эффекты Разломов действуют вне зависимости от того, заполняются ли они в данный момент, и зависят от общего количества расходованного ресурса.
      <b class="o-strike-warning">Удары Пелля необратимы и не сбрасываются при армагеддоне!</b>
      <div class="c-pelle-bar-container">
        <PelleRift
          v-for="strike in allStrikes"
          :key="strike.config.id"
          :strike="strike"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-collapse-icon-clickable {
  position: absolute;
  top: 50%;
  left: 1.5rem;
  width: 3rem;
  align-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}

.c-pelle-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.o-strike-warning {
  color: var(--color-pelle--base);
  font-size: 1.4rem;
}
</style>
