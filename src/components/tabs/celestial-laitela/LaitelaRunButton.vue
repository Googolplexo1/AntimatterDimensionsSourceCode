<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "LaitelaRunButton",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      realityTime: 0,
      maxDimTier: 0,
      isRunning: false,
      realityReward: 1,
      singularitiesUnlocked: false,
      bestSet: [],
      tierNotCompleted: true,
    };
  },
  computed: {
    completionTime() {
      if (this.tierNotCompleted) return "Не выполнена на этом слое";
      return `Рекордное время выполнения: ${TimeSpan.fromSeconds(this.realityTime).toStringShort()}`;
    },
    runEffects() {
      return GameDatabase.celestials.descriptions[5].effects().split("\n");
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[5].description();
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.realityTime = player.celestials.laitela.fastestCompletion;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.isRunning = Laitela.isRunning;
      this.singularitiesUnlocked = Currency.singularities.gt(0);
      this.bestSet = Glyphs.copyForRecords(player.records.bestReality.laitelaSet);
      this.tierNotCompleted = this.realityTime === 3600 || (this.realityTime === 300 && this.maxDimTier < 8);
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Лайтелы", number: 5 });
    },
    classObject() {
      return {
        "o-laitela-run-button": true,
        "o-laitela-run-button--large": !this.singularitiesUnlocked
      };
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
  }
};
</script>

<template>
  <button :class="classObject()">
    <span :class="{ 'o-pelle-disabled': isDoomed }">
      <b>Запустить Реальность Лайтелы</b>
    </span>
    <div
      :class="runButtonClassObject()"
      @click="startRun"
    />
    <div v-if="realityReward > 1">
      <b>
        Множитель {{ formatX(realityReward, 2, 2) }} ко всем Измерениям Тёмной Материи.
      </b>
      <span v-if="maxDimTier > 0">
        <br><br>
        {{ completionTime }}
        <br>
        <span v-if="maxDimTier <= 7">
          <b>Действующих уровней измерений: {{ formatInt(maxDimTier) }}</b>
        </span>
        <br><br>
        Лучший набор глифов:
        <GlyphSetPreview
          text="Глифы, использованные при рекордном выполнении Реальности Лайтелы"
          :text-hidden="true"
          :force-name-color="false"
          :glyphs="bestSet"
        />
      </span>
      <span v-else>
        <br>
        <b>
          Также вы получили множитель {{ formatX(8) }} к производству Тёмной Энергии.
        </b>
        <br><br>
        Реальность Лайтелы полностью дестабилизирована. Улучшить полученную за неё награду невозможно.
      </span>
      <br>
    </div>
    <div
      v-for="(line, lineId) in runEffects"
      :key="lineId + '-laitela-run-desc' + maxDimTier"
    >
      {{ line }} <br>
    </div>
    <br>
    <div>{{ runDescription }}</div>
  </button>
</template>