<script>
import { BlackHoleAnimation } from "./black-hole-animation";
import BlackHoleChargingSliders from "./BlackHoleChargingSliders";
import BlackHoleStateRow from "./BlackHoleStateRow";
import BlackHoleUnlockButton from "./BlackHoleUnlockButton";
import BlackHoleUpgradeRow from "./BlackHoleUpgradeRow";

export default {
  name: "BlackHoleTab",
  components: {
    BlackHoleUpgradeRow,
    BlackHoleStateRow,
    BlackHoleChargingSliders,
    BlackHoleUnlockButton
  },
  data() {
    return {
      isDoomed: false,
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      pauseMode: 0,
      detailedBH2: "",
      isPermanent: false,
      hasBH2: false,
      blackHoleUptime: [],
      stateChange: "",
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    pauseModeString() {
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          return "отключено";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          return this.hasBH2 ? "перед активацией ЧД1" : "перед активацией";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          return "перед активацией ЧД2";
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
    },
  },
  mounted() {
    this.startAnimation();
  },
  destroyed() {
    if (this.animation) this.animation.unmount();
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
      // If stop running enslaved, re-mount the black hole animation as it reappears
      if (this.isEnslaved && !Enslaved.isRunning) {
        if (this.animation) this.animation.unmount();
        this.startAnimation();
      }
      this.isEnslaved = Enslaved.isRunning;
      this.isPermanent = BlackHoles.arePermanent;
      this.pauseMode = player.blackHoleAutoPauseMode;
      this.hasBH2 = BlackHole(2).isUnlocked;
      this.blackHoleUptime = [BlackHole(1).duration / BlackHole(1).cycleLength,
        BlackHole(2).duration / BlackHole(2).cycleLength];
      this.detailedBH2 = this.bh2Status();

      if (player.blackHoleNegative < 1) this.stateChange = this.isPaused ? "Отменить инверсию ЧД" : "Инвертировать ЧД";
      else this.stateChange = this.isPaused ? "Возобновить цикл ЧД" : "Приостановить ЧД";
    },
    bh2Status() {
      const bh1Remaining = BlackHole(1).timeWithPreviousActiveToNextStateChange;
      const bh2Remaining = BlackHole(2).timeWithPreviousActiveToNextStateChange;

      // Both BH active
      if (BlackHole(1).isActive && BlackHole(2).isActive) {
        const bh2Duration = Math.min(bh1Remaining, bh2Remaining);
        return `2-я Чёрная Дыра будет действовать в течение ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}!`;
      }

      // BH1 active, BH2 will trigger before BH1 runs out
      if (BlackHole(1).isActive && (bh2Remaining < bh1Remaining)) {
        const bh2Duration = Math.min(bh1Remaining - bh2Remaining, BlackHole(2).duration);
        return `2-я Чёрная Дыра активируется, прежде чем деактивируется 1-я Чёрная Дыра,
          на ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}`;
      }

      // BH2 won't start yet next cycle
      if (BlackHole(1).isActive || (bh2Remaining > BlackHole(1).duration)) {
        const cycleCount = BlackHole(1).isActive
          ? Math.floor((bh2Remaining - bh1Remaining) / BlackHole(1).duration) + 1
          : Math.floor(bh2Remaining / BlackHole(1).duration);
        return `2-я Чёрная Дыра активируется через ${quantifyInt("цикл", cycleCount)} активности 1-й Чёрной Дыры.`;
      }

      // BH1 inactive, BH2 ready to go when BH1 activates
      if (BlackHole(2).isCharged) {
        const bh2Duration = Math.min(BlackHole(1).duration, bh2Remaining);
        return `2-я Чёрная Дыра активируется вместе с 1-й Чёрной Дырой
          на ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
      }

      // BH1 inactive, BH2 starts at some point after BH1 activates
      const bh2Duration = Math.min(BlackHole(1).duration - bh2Remaining, BlackHole(2).duration);
      return `2-я Чёрная Дыра активируется через ${TimeSpan.fromSeconds(bh2Remaining).toStringShort()} после
        активации 1-й Чёрной Дыры на ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
    },
    togglePause() {
      BlackHoles.togglePause();
      if (BlackHoles.arePaused) {
        player.celestials.enslaved.isAutoReleasing = false;
      }
      this.update();
    },
    changePauseMode() {
      let steps;
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          // Note: We don't need to check for permanent BH2 because the button disappears at that point
          steps = BlackHole(1).isPermanent ? 2 : 1;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          steps = this.hasBH2 ? 1 : 2;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          steps = 1;
          break;
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
      player.blackHoleAutoPauseMode = (this.pauseMode + steps) % Object.values(BLACK_HOLE_PAUSE_MODE).length;
    },
    startAnimation() {
      setTimeout(() => {
        if (this.$refs.canvas) {
          this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
        }
      }, 1);
    },
    gridStyle() {
      return this.isPermanent ? "l-black-hole-upgrade-permanent" : "l-black-hole-upgrade-grid";
    },
  },
};
</script>

<template>
  <div class="l-black-hole-tab">
    <div
      v-if="isEnslaved || isDoomed"
      class="c-black-hole-disabled-description"
    >
      <i v-if="isEnslaved">
        Ты должен... искать... другие пути...
        <br>
      </i>
      Физика этой реальности несовместима с существованием Чёрных Дыр.
    </div>
    <div
      v-else-if="!isUnlocked"
      class="l-pre-unlock-text"
    >
      <BlackHoleUnlockButton @blackholeunlock="startAnimation" />
      Чёрная Дыра значительно ускоряет всю игру на короткий промежуток времени.
      <br>
      (По умолчанию: ускорение в {{ formatInt(180) }} раз на {{ formatInt(10) }} секунд раз в час.)
      <br>
      <br>
      Разблокировка Чёрной Дыры также даёт {{ formatInt(10) }} Очков Автоматизации.
    </div>
    <template v-else>
      <div class="c-subtab-option-container">
        <button
          class="o-primary-btn o-primary-btn--subtab-option"
          @click="togglePause"
        >
          {{ stateChange }}
        </button>
        <button
          v-if="!isPermanent"
          class="o-primary-btn o-primary-btn--subtab-option"
          @click="changePauseMode"
        >
          Автоматически останавливать ЧД: {{ pauseModeString }}
        </button>
      </div>
      <canvas
        ref="canvas"
        class="c-black-hole-canvas"
        width="400"
        height="400"
      />
      <div class="l-black-hole-upgrade-grid">
        <BlackHoleStateRow
          v-for="(blackHole, i) in blackHoles"
          :key="'state' + i"
          :black-hole="blackHole"
        />
        <span v-if="hasBH2 && !isPermanent">
          <b>{{ detailedBH2 }}</b>
          <br>
          Цикл активности 2-й Чёрной Дыры продвигается, только пока действует 1-я Чёрная Дыра.
          <br>
          Улучшения влияют на внутренний таймер; в заглавии показано реальное время, оставшееся до перехода в другую фазу.
        </span>
        <br>
        <div v-if="!isPermanent">
          Каждая Чёрная Дыра начинает действовать беспрерывно, когда доля её действующей фазы по времени достигает {{ formatPercents(0.9999, 2) }}.
          <br>
          Доля времени действующей фазы: {{ formatPercents(blackHoleUptime[0], 3) }}
          <span v-if="hasBH2">и {{ formatPercents(blackHoleUptime[1], 3) }} для 1-й и 2-й Чёрных Дыр соответственно</span>
        </div>
        <BlackHoleChargingSliders class="l-enslaved-shop-container" />
      </div>
      <div :class="gridStyle()">
        <BlackHoleUpgradeRow
          v-for="(blackHole, i) in blackHoles"
          :key="'upgrades' + i"
          :black-hole="blackHole"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.l-auto-pause-button {
  width: 30rem;
}

.l-pre-unlock-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-black-hole-disabled-description {
  font-size: 2.5rem;
  line-height: 1.5;
}
</style>
