<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SpeedrunMilestoneSingle from "./SpeedrunMilestoneSingle";

export default {
  name: "SpeedrunMilestonesTab",
  components: {
    PrimaryToggleButton,
    SpeedrunMilestoneSingle,
  },
  data() {
    return {
      milestoneTimes: [],
      maxMilestone: 1,
      startTimeStr: "",
      displayAll: false,
      isSpectating: false,
    };
  },
  computed: {
    milestones: () => GameDatabase.speedrunMilestones,
    spectateText() {
      return this.isSpectating
        ? "Чтобы вы могли просмотреть данные забега, мы не замещаем их словом КОНЕЦ."
        : null;
    }
  },
  watch: {
    displayAll(newValue) {
      player.speedrun.displayAllMilestones = newValue;
    }
  },
  methods: {
    update() {
      this.milestoneTimes = [...player.speedrun.records];
      this.maxMilestone = this.milestoneTimes.map(i => Boolean(i)).lastIndexOf(true) + 1;
      this.startTimeStr = player.speedrun.startDate === 0
        ? "Спидран ещё не начат."
        : `Дата начала спидрана: ${Time.toDateTimeString(player.speedrun.startDate)}`;
      this.displayAll = player.speedrun.displayAllMilestones;
      this.isSpectating = GameEnd.endState > END_STATE_MARKERS.SPECTATE_GAME;
    },
  },
};
</script>

<template>
  <div>
    <PrimaryToggleButton
      v-model="displayAll"
      class="o-primary-btn--subtab-option"
      label="Показать описания всех стадий:"
    />
    <br>
    <b>{{ startTimeStr }}</b>
    <br>
    <b>{{ spectateText }}</b>
    <br>
    <div class="l-speedrun-milestone-tab">
      <SpeedrunMilestoneSingle
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :display="displayAll || milestone.id <= maxMilestone"
        :time="milestoneTimes[milestone.id]"
      />
    </div>
  </div>
</template>
