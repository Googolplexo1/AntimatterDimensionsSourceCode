<script>
import PreviousSpeedrunInfo from "./PreviousSpeedrunInfo";
import PrimaryButton from "@/components/PrimaryButton";
import SpeedrunMilestoneCompare from "./SpeedrunMilestoneCompare";

export default {
  name: "PreviousSpeedrunTab",
  components: {
    PrimaryButton,
    SpeedrunMilestoneCompare,
    PreviousSpeedrunInfo,
  },
  data() {
    return {
      milestoneTimes: [],
      isSpectating: false,
      selectedRun: 0,
      runPage: 0,
    };
  },
  computed: {
    milestones: () => GameDatabase.speedrunMilestones,
    previousRuns() {
      const keys = Object.keys(player.speedrun.previousRuns);
      const allRuns = [];
      for (const key of keys) {
        const run = player.speedrun.previousRuns[key];
        run.id = Number(key);
        allRuns.push(run);
      }
      return allRuns;
    },
    bestPreviousTimes() {
      const recLength = GameDatabase.speedrunMilestones.length + 1;
      const bestTimes = Array.repeat(0, recLength);
      const bestRunIndices = [...bestTimes];
      for (const index of Object.keys(player.speedrun.previousRuns)) {
        const run = player.speedrun.previousRuns[index].records;
        for (let rec = 0; rec < recLength; rec++) {
          if (run[rec] !== 0 && (run[rec] < bestTimes[rec] || bestTimes[rec] === 0)) {
            bestTimes[rec] = run[rec];
            bestRunIndices[rec] = index;
          }
        }
      }

      const milestoneList = Array.repeat({}, recLength);
      for (let rec = 0; rec < recLength; rec++) {
        milestoneList[rec] = { time: bestTimes[rec], index: bestRunIndices[rec] };
      }
      return milestoneList;
    },
    numRuns() {
      return Object.keys(this.previousRuns).length;
    },
    highestIndex() {
      return Math.max(this.previousRuns.map(k => Number(k.id)).max(), player.records.fullGameCompletions);
    },
    spectateText() {
      return this.isSpectating
        ? "Чтобы вы могли просмотреть данные забега, мы не замещаем их словом КОНЕЦ."
        : null;
    }
  },
  methods: {
    update() {
      this.milestoneTimes = [...player.speedrun.records];
      this.isSpectating = GameEnd.endState > END_STATE_MARKERS.SPECTATE_GAME;
    },
    selectRun(index) {
      this.selectedRun = index;
    },
    findRun(index) {
      return this.previousRuns.find(r => r?.id === 10 * this.runPage + index);
    },
    changePage(dir) {
      this.runPage = Math.clamp(this.runPage + dir, 0, Math.floor(this.highestIndex / 10));
    }
  },
};
</script>

<template>
  <div class="c-previous-runs">
    <b>Вы завершили {{ quantify("спидран", numRuns, 0, 0, x => x) }} до текущего забега.</b>
    <b>Ниже приведены их данные.</b>
    <b>Нажмите на лупу, чтобы сравнить время прохождения стадий на текущем забеге и на одном из предыдущих.</b>
    <b>{{ spectateText }}</b>
    <br>
    <div
      v-if="highestIndex > 10"
      class="c-run-page-nav"
    >
      <PrimaryButton
        class="o-primary-btn--subtab-option fas fa-arrow-left"
        :class="{ 'o-primary-btn--disabled' : runPage === 0 }"
        @click="changePage(-1)"
      />
      Показаны забеги от №{{ 10 * runPage + 1 }} до №{{ 10 * (runPage + 1) }} (всего {{ highestIndex }})
      <PrimaryButton
        class="o-primary-btn--subtab-option fas fa-arrow-right"
        :class="{ 'o-primary-btn--disabled' : runPage + 1 > highestIndex / 10 }"
        @click="changePage(1)"
      />
    </div>
    <div class="c-previous-runs">
      <span
        v-for="entry in 10"
        :key="entry"
      >
        <span
          v-if="10 * runPage + entry <= highestIndex"
          class="c-single-run"
        >
          <PrimaryButton
            v-if="findRun(entry)"
            class="o-primary-btn--subtab-option fas fa-magnifying-glass"
            :class="{ 'o-selected-btn' : selectedRun === 10 * runPage + entry }"
            @click="selectRun(10 * runPage + entry)"
          />
          <PreviousSpeedrunInfo
            :prev-run-info="findRun(entry)"
            :index="10 * runPage + entry"
          />
        </span>
      </span>
    </div>
    <br>
    <div class="c-legend">
      <div class="c-legend-cell">
        <span class="o-box l-milestone-none" /> Ещё не достигнуто
      </div>
      <div class="c-legend-cell">
        <span class="o-box l-milestone-slow" /> Медленнее
      </div>
      <div class="c-legend-cell">
        <span class="o-box l-milestone-fast" /> Быстрее
      </div>
      <div class="c-legend-cell">
        <span class="o-box l-milestone-fastest" /> Лучший результат
      </div>
    </div>
    <div class="l-speedrun-milestone-tab">
      <SpeedrunMilestoneCompare
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :curr-time="milestoneTimes[milestone.id]"
        :ref-time="selectedRun ? previousRuns.find(run => run.id === selectedRun).records[milestone.id] : null"
        :best-time="bestPreviousTimes[milestone.id].time"
        :run-indices="[selectedRun, bestPreviousTimes[milestone.id].index]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-run-page-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  width: 60rem;
}

.c-previous-runs {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}

.c-single-run {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  border: 0.1rem solid;
  width: 100rem;
}

.o-selected-btn {
  background-color: var(--color-good);
}

.c-legend {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 95rem;
}

.c-legend-cell {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 30rem;
  font-size: 1.5rem;
}

.o-box {
  display: grid;
  width: 2rem;
  height: 2rem;
  margin: 0.3rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-text);
  border-radius: var(--var-border-radius, 0.5rem);
}

.l-milestone-none {
  background-color: var(--color-base);
}

.l-milestone-slow {
  background-color: var(--color-bad);
}

.l-milestone-fast {
  background-color: var(--color-good);
}

.l-milestone-fastest {
  background-color: var(--color-celestials);
}
</style>
