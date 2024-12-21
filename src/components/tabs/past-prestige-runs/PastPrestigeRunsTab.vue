<script>
import PastPrestigeRunsContainer from "./PastPrestigeRunsContainer";

export default {
  name: "PastPrestigeRunsTab",
  components: {
    PastPrestigeRunsContainer
  },
  data() {
    return {
      layers: {
        reality: {
          name: "реальность",
          plural: "реальностей",
          uppercase: "Реальностей",
          currency: "МР",
          condition: () => PlayerProgress.realityUnlocked(),
          getRuns: () => player.records.recentRealities,
          extra: ["Уровень глифа", "РО"],
          showExtra: [() => true, () => TeresaUnlocks.effarig.canBeApplied],
          formatExtra: [x => formatInt(x), x => format(x, 2)],
          allowRate: [false, true],
          rateString: ["", "РО за время"],
        },
        eternity: {
          name: "вечность",
          plural: "вечностей",
          uppercase: "Вечностей",
          currency: "ОВ",
          condition: () => PlayerProgress.eternityUnlocked(),
          getRuns: () => player.records.recentEternities,
          extra: ["Тахионов"],
          showExtra: [() => PlayerProgress.dilationUnlocked()],
          formatExtra: [x => format(x, 2)],
          allowRate: [false],
        },
        infinity: {
          name: "бесконечность",
          plural: "бесконечностей",
          uppercase: "Бесконечностей",
          currency: "ОБ",
          condition: () => PlayerProgress.infinityUnlocked(),
          getRuns: () => player.records.recentInfinities,
        },
      },
      resourceType: false,
    };
  },
  computed: {
    resourceText() {
      switch (this.resourceType) {
        case RECENT_PRESTIGE_RESOURCE.ABSOLUTE_GAIN:
          return "Полученные ресурсы";
        case RECENT_PRESTIGE_RESOURCE.RATE:
          return "Прирост ресурсов за время";
        case RECENT_PRESTIGE_RESOURCE.CURRENCY:
          return "Валюта престижа";
        case RECENT_PRESTIGE_RESOURCE.PRESTIGE_COUNT:
          return "Статистика престижа";
        default:
          throw new Error("Unrecognized Statistics tab resource type");
      }
    }
  },
  methods: {
    update() {
      this.resourceType = player.options.statTabResources;
    },
    cycleButton() {
      const stateCount = Object.keys(RECENT_PRESTIGE_RESOURCE).length;
      player.options.statTabResources = (player.options.statTabResources + 1) % stateCount;
    },
  }
};
</script>

<template>
  <div class="c-stats-tab">
    <div class="c-subtab-option-container">
      <button
        class="o-primary-btn o-primary-btn--subtab-option"
        @click="cycleButton()"
      >
        {{ resourceText }}
      </button>
    </div>
    <PastPrestigeRunsContainer
      v-for="layer in layers"
      :key="layer.name"
      :layer="layer"
    />
  </div>
</template>
