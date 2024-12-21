<script>
export default {
  name: "SpeedrunStatus",
  data() {
    return {
      isActive: false,
      isSegmented: false,
      usedSTD: false,
      hasStarted: false,
      startDate: 0,
      saveName: "",
      timePlayedStr: "",
      offlineProgress: false,
      offlineFraction: 0,
      mostRecent: {},
      isCollapsed: false,
      timeSince: 0,
      seedText: 0,
      canModifySeed: false,
      isComplete: false,
    };
  },
  computed: {
    statusText() {
      if (this.isComplete) return `<span style="color: var(--color-good)">Завершён!</span>`;
      return this.hasStarted
        ? `<span style="color: var(--color-good)">Запущен!</span>`
        : `<span style="color: var(--color-bad)">Не начат</span>`;
    },
    segmentText() {
      return this.isSegmented ? "Сегментированный забег (импортированное сохранение)" : "Непрерывный забег (без импорта сохранения)";
    },
    iapText() {
      return this.usedSTD ? "Использованы внутриигровые покупки" : "Без внутриигровых покупок";
    },
    offlineText() {
      const stateText = this.offlineProgress
        ? `<span style="color: var(--color-good)">Включён</span>`
        : `<span style="color: var(--color-bad)">Отключён</span>`;
      const fractionText = this.offlineFraction === 0
        ? "(Офлайн-прогресс не использован)"
        : `(${formatPercents(this.offlineFraction, 2)} времени проведено офлайн)`;
      return `${stateText} ${fractionText}`;
    },
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    }
  },
  methods: {
    update() {
      const speedrun = player.speedrun;
      this.isActive = speedrun.isActive;
      this.canModifySeed = Speedrun.canModifySeed();
      // Short-circuit if speedrun isn't active; updating some later stuff can cause vue errors outside of speedruns
      if (!this.isActive) return;
      this.isSegmented = speedrun.isSegmented;
      this.usedSTD = speedrun.usedSTD;
      this.hasStarted = speedrun.hasStarted;
      this.startDate = speedrun.startDate;
      this.saveName = speedrun.name;
      this.isCollapsed = speedrun.hideInfo;
      this.isComplete = Achievement(188).isUnlocked;

      this.timePlayedStr = Time.realTimePlayed.toStringShort();
      this.offlineProgress = player.options.offlineProgress;
      this.offlineFraction = speedrun.offlineTimeUsed / Math.clampMin(player.records.realTimePlayed, 1);
      this.mostRecent = Speedrun.mostRecentMilestone();
      this.timeSince = Time.realTimePlayed.minus(TimeSpan.fromMilliseconds(speedrun.records[this.mostRecent] ?? 0))
        .toStringShort();
      this.seedText = Speedrun.seedModeText();
    },
    milestoneName(id) {
      const db = GameDatabase.speedrunMilestones;
      return id === 0 ? "None" : db.find(m => m.id === id).name;
    },
    changeName() {
      if (this.hasStarted) return;
      Modal.changeName.show();
    },
    collapseText() {
      return this.isCollapsed ? "Раскрыть" : `Нажмите, чтобы скрыть информацию о спидране`;
    },
    toggleCollapse() {
      player.speedrun.hideInfo = !this.isCollapsed;
    },
    openSeedModal() {
      if (!this.canModifySeed) return;
      Modal.modifySeed.show();
    }
  },
};
</script>

<template>
  <div
    v-if="isActive"
    class="c-speedrun-status"
  >
    <div v-if="!isCollapsed">
      <b>Статус спидрана (<span v-html="statusText" />)</b>
      <br>
      <span
        :class="{ 'c-speedrun-status--can-change': !hasStarted }"
        @click="changeName"
      >
        Имя игрока: {{ saveName }}
      </span>
      <br>
      <i>{{ segmentText }}</i>
      <br>
      <i>{{ iapText }}</i>
      <br>
      <span
        :class="{ 'c-speedrun-status--can-change': canModifySeed }"
        @click="openSeedModal()"
      >{{ seedText }}</span>
      <br>
      Общее реальное время: {{ timePlayedStr }}
      <br>
      Офлайн-прогресс: <span v-html="offlineText" />
      <br>
      Последняя достигнутая стадия: {{ milestoneName(mostRecent) }} <span v-if="mostRecent">({{ timeSince }} назад)</span>
      <br>
    </div>
    <div
      class="c-speedrun-status--collapse"
      @click="toggleCollapse"
    >
      <i :class="collapseIcon" />
      {{ collapseText() }}
      <i :class="collapseIcon" />
    </div>
  </div>
</template>

<style scoped>
.c-speedrun-status {
  white-space: nowrap;
  position: absolute;
  right: 2rem;
  bottom: 1rem;
  z-index: 5;
  font-size: 1.2rem;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid var(--color-accent);
  padding: 0.8rem 2rem;
  pointer-events: auto;
  -webkit-user-select: none;
  user-select: none;
}

.c-speedrun-status--can-change {
  text-decoration: underline;
  cursor: pointer;
}

.c-speedrun-status--collapse {
  padding: 0.2rem;
  cursor: pointer;
}
</style>
