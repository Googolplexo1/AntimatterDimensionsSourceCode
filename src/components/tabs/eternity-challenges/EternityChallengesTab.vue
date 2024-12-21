<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import EternityChallengeBox from "./EternityChallengeBox";

export default {
  name: "EternityChallengesTab",
  components: {
    ChallengeTabHeader,
    ChallengeGrid,
    EternityChallengeBox
  },
  data() {
    return {
      unlockedCount: 0,
      showAllChallenges: false,
      autoEC: false,
      isAutoECVisible: false,
      hasUpgradeLock: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
      hasECR: false,
    };
  },
  computed: {
    challenges() {
      return EternityChallenges.all;
    },
    upgradeLockNameText() {
      return RealityUpgrade(12).isLockingMechanics
        ? RealityUpgrade(12).name
        : ImaginaryUpgrade(15).name;
    },
    nextECText() {
      return this.untilNextEC.totalMilliseconds === 0 && !this.autoEC
        ? "немедленно при включении автоматики"
        : `через ${this.untilNextEC.toStringNoDecimals("accusative")} (по реальному времяисчислению)`;
    },
    allECText() {
      return this.untilAllEC.totalMilliseconds === 0 && !this.autoEC
        ? "немедленно при включении автоматики"
        : `через ${this.untilAllEC.toStringNoDecimals("accusative")} (по реальному времяисчислению)`;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.unlockedCount = EternityChallenges.all
        .filter(this.isChallengeVisible)
        .length;
      this.isAutoECVisible = Perk.autocompleteEC1.canBeApplied;
      this.autoEC = player.reality.autoEC;
      const shouldPreventEC7 = TimeDimension(1).amount.gt(0);
      this.hasUpgradeLock = RealityUpgrade(12).isLockingMechanics ||
        (ImaginaryUpgrade(15).isLockingMechanics && shouldPreventEC7 &&
          !Array.range(1, 6).some(ec => !EternityChallenge(ec).isFullyCompleted));
      const remainingCompletions = EternityChallenges.remainingCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Math.max(autoECInterval - player.reality.lastAutoEC, 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC + (autoECInterval * (remainingCompletions - 1)));
      }
      this.hasECR = Perk.studyECRequirement.isBought;
    },
    isChallengeVisible(challenge) {
      return challenge.completions > 0 || challenge.isUnlocked || challenge.hasUnlocked ||
        (this.showAllChallenges && PlayerProgress.realityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div v-if="isAutoECVisible">
      Испытания Вечности выполняются по порядку от первого к последнему по одному выполнению за раз.
    </div>
    <div
      v-if="isAutoECVisible && remainingECTiers > 0"
      class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
    >
      <div class="l-challenges-tab__auto-ec-timers">
        <span
          v-if="hasUpgradeLock"
          class="l-emphasis"
        >
          Автоматическое выполнение Испытаний Вечности отключено проверкой требования Улучшения "{{ upgradeLockNameText }}".
        </span>
        <span v-if="remainingECTiers > 0">
          Следующее автоматическое выполнение Испытания Вечности произойдёт {{ nextECText }}.
        </span>
        <span>
          Все Испытания Вечности будут автоматически выполнены {{ allECText }}.
        </span>
        <br>
      </div>
    </div>
    <div>
      Каждое Испытание Вечности может быть выполнено до {{ formatInt(5) }} раз, и при каждом выполнении его цель и награда растут.<br>
      Награды действуют вне зависимости от того, есть ли у вас Исследования Времени, разблокирующие соответствующие Испытания Вечности.
    </div>
    <div v-if="!hasECR">
      Однажды разблокировав Испытание Вечности, вы освобождаетесь от необходимости выполнять его вторичное требование,
      чтобы разблокировать его вновь, до тех пор пока вы не выполните его; вам требуется лишь соответствующее количество Теорем Времени.
    </div>
    <div v-if="unlockedCount !== 12">
      Вы узнали {{ formatInt(unlockedCount) }} из {{ formatInt(12) }} Испытаний Вечности.
    </div>
    <div v-else>
      Вы узнали все {{ formatInt(12) }} Испытаний Вечности.
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <EternityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
