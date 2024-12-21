<script>
import GameSpeedDisplay from "@/components/GameSpeedDisplay";

export default {
  name: "HeaderTickspeedInfo",
  components: {
    GameSpeedDisplay
  },
  data() {
    return {
      mult: new Decimal(0),
      tickspeed: new Decimal(0),
      galaxyCount: 0,
      purchasedTickspeed: 0,
      freeTickspeed: 0,
    };
  },
  computed: {
    tickspeedDisplay() {
      return `Скорость тика: ${format(this.tickspeed, 2, 3)}`;
    },
    perUpgrade() {
      if (InfinityChallenge(3).isRunning) return `Каждый ускоритель даёт множитель
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)} ко всем ИА`;
      return `ИА производят в ${format(this.mult.reciprocal(), 2, 3)} раза за ускоритель быстрее`;
    },
  },
  methods: {
    update() {
      this.mult.copyFrom(Tickspeed.multiplier);
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.galaxyCount = player.galaxies;
      this.purchasedTickspeed = player.totalTickBought;
      this.freeTickspeed = FreeTickspeed.amount;
    },
  },
};
</script>

<template>
  <div>
    <br>
    {{ perUpgrade }}
    <br>
    {{ tickspeedDisplay }}
    <br>
    <GameSpeedDisplay />
  </div>
</template>

<style scoped>

</style>
