<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import InfinityChallengeBox from "./InfinityChallengeBox";

export default {
  name: "InfinityChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    InfinityChallengeBox
  },
  data() {
    return {
      nextIC: 0,
      showAllChallenges: false
    };
  },
  computed: {
    challenges() {
      return InfinityChallenges.all;
    },
    nextAtDisplay() {
      const first = this.nextIC?.id === 1;
      const next = InfinityChallenges.nextICUnlockAM;

      if (first) return `Первое Испытание Бесконечности разблокируется на ${format(next)} антиматерии.`;
      return next === undefined
        ? "Вы разблокировали все Испытания Бесконечности."
        : `Следующее Испытание Бесконечности разблокируется на ${format(next)} антиматерии.`;
    }
  },
  methods: {
    update() {
      this.nextIC = InfinityChallenges.nextIC;
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(challenge) {
      return challenge.isUnlocked || (this.showAllChallenges && PlayerProgress.eternityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>
      Если автоматика Большого Сжатия включена, она сработает немедленно по
      достижении цели текущего Испытания Бесконечности вне зависимости от настроек.
    </div>
    <div>{{ nextAtDisplay }}</div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <InfinityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
