<script>
import ChallengeRecordsList from "./ChallengeRecordsList";

export default {
  name: "ChallengeRecordsTab",
  components: {
    ChallengeRecordsList
  },
  data() {
    return {
      infinityChallengesUnlocked: false,
      normalChallenges: [],
      infinityChallenges: [],
      normalNames: [],
      infinityNames: []
    };
  },
  methods: {
    update() {
      this.infinityChallengesUnlocked = PlayerProgress.infinityChallengeCompleted() ||
        PlayerProgress.eternityUnlocked();
      this.normalChallenges = player.challenge.normal.bestTimes.slice(0);
      this.infinityChallenges = player.challenge.infinity.bestTimes.slice(0);
      this.normalNames = [`Обычного Испытания`, `Обычное Испытание`, `Обычных Испытаний`];
      this.infinityNames = [`Испытания Бесконечности`, `Испытание Бесконечности`, `Испытаний Бесконечности`];
    }
  }
};
</script>

<template>
  <div class="l-challenge-records-tab c-stats-tab">
    <ChallengeRecordsList
      :start="2"
      :times="normalChallenges"
      :names="normalNames"
    />
    <ChallengeRecordsList
      v-if="infinityChallengesUnlocked"
      :start="1"
      :times="infinityChallenges"
      :names="infinityNames"
      class="l-challenge-records-tab__infinity_challenges"
    />
  </div>
</template>
