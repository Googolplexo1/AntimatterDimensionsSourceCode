<script>
import PrimaryButton from "@/components/PrimaryButton";
import TimeDimensionRow from "./ClassicTimeDimensionRow";

export default {
  name: "ClassicTimeDimensionsTab",
  components: {
    PrimaryButton,
    TimeDimensionRow
  },
  data() {
    return {
      totalUpgrades: 0,
      multPerTickspeed: 0,
      tickspeedSoftcap: 0,
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
      showLockedDimCostNote: true,
    };
  },
  computed: {
    costIncreases: () => TimeDimension(1).costIncreaseThresholds,
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !TimeDimension(8).isUnlocked && player.realities >= 1;
      this.totalUpgrades = player.totalTickGained;
      this.multPerTickspeed = FreeTickspeed.multToNext;
      this.tickspeedSoftcap = FreeTickspeed.softcap;
      this.timeShards.copyFrom(Currency.timeShards);
      this.upgradeThreshold.copyFrom(FreeTickspeed.fromShards(Currency.timeShards.value).nextShards);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerRealSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "8-го Измерения Бесконечности" : "Осколка Времени";
      this.areAutobuyersUnlocked = Autobuyer.timeDimension(1).isUnlocked;
    },
    maxAll() {
      tryUnlockTimeDimensions();
      maxAllTimeDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllTimeDims();
    }
  }
};
</script>

<template>
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Купить всё
      </PrimaryButton>
      <PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Переключить всю автоматику
      </PrimaryButton>
    </div>
    <div>
      <p>
        У вас
        <span class="c-time-dim-description__accent">{{ format(timeShards, 2, 1) }}</span> Осколка Времени, что даёт вам
        <span class="c-time-dim-description__accent">{{ formatInt(totalUpgrades) }}</span> {{ pluralize("ускоритель", totalUpgrades) }}.
      </p>
      <p>
        Следующий на
        <span class="c-time-dim-description__accent">{{ format(upgradeThreshold, 2, 1) }}</span> (наценка равна
        <span class="c-time-dim-description__accent">{{ formatX(multPerTickspeed, 2, 2) }}</span>).
      </p>
    </div>
    <div>
      Наценка на ускорители от Осколков Времени растёт
      после {{ formatInt(tickspeedSoftcap) }} ускорителей.
    </div>
    <div>
      Вы получаете {{ format(shardsPerSecond, 2, 0) }} {{ incomeType }} в секунду.
    </div>
    <div class="l-dimensions-container">
      <TimeDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      Цены на Измерения Времени резко возрастают на {{ format(costIncreases[0], 2, 2) }} и
      {{ format(costIncreases[1]) }} Очков Вечности,
      <br>
      начиная при этом расти быстрее, и растут гораздо быстрее после {{ format(costIncreases[2]) }} Очков Вечности.
      <br>
      <div v-if="showLockedDimCostNote">
        Зажмите клавишу Shift, чтобы просмотреть цены на заблокированные Измерения Времени.
      </div>
      Покупки 8-го Измерения Времени после первых {{ format(1e8) }} не дают множителя.
    </div>
  </div>
</template>
