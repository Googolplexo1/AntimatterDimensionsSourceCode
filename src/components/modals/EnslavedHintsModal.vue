<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "EnslavedHintsModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      currentStored: 0,
      nextHintCost: 0,
      canGetHint: false,
      shownEntries: [],
      realityHintsLeft: 0,
      glyphHintsLeft: 0,
      hints: 0,
    };
  },
  computed: {
    hintCost() {
      return `${format(TimeSpan.fromMilliseconds(this.nextHintCost).totalYears, 2)} года`;
    },
    formattedStored() {
      return `${format(TimeSpan.fromMilliseconds(this.currentStored).totalYears, 2)} года`;
    },
    hasProgress(id) {
      return this.progressEntries.some(entry => entry.id === id);
    },
    // Note: This calculation seems to behave extremely poorly if the goal has been raised more than 12 hints worth
    // of cost bumps and I'm not entirely sure why. There's probably a numerical issue I can't quite figure out, but
    // considering that much cost raising can't happen in practice I think I'm just going to leave it be.
    timeEstimate() {
      if (this.currentStored >= this.nextHintCost) return "";

      // Relevant values are stored as milliseconds, so multiply the rate by 1000 to get to seconds
      const storeRate = 1000 * (Enslaved.isStoringGameTime
        ? Enslaved.currentBlackHoleStoreAmountPerMs
        : getGameSpeedupFactor());
      const alreadyWaited = this.currentStored / storeRate;
      const decaylessTime = this.nextHintCost / storeRate;

      // Check if decay is irrelevant and don't do the hard calculations if so
      const minCostEstimate = (TimeSpan.fromYears(1e40).totalMilliseconds - this.currentStored) / storeRate;
      if (TimeSpan.fromSeconds(minCostEstimate).totalDays > this.hints) {
        return `${TimeSpan.fromSeconds(minCostEstimate).toStringShort(true)}`;
      }

      // Decay is 3x per day, but the math needs decay per second
      const K = Math.pow(3, 1 / 86400);
      const x = decaylessTime * Math.log(K) * Math.pow(K, alreadyWaited);
      const timeToGoal = productLog(x) / Math.log(K) - alreadyWaited;
      return `${TimeSpan.fromSeconds(timeToGoal).toStringShort(true)}`;
    }
  },
  methods: {
    update() {
      this.currentStored = player.celestials.enslaved.stored;
      this.nextHintCost = Enslaved.nextHintCost;
      this.canGetHint = this.currentStored >= this.nextHintCost;
      this.shownEntries = [];

      this.realityHintsLeft = EnslavedProgress.all.length;
      for (const prog of EnslavedProgress.all) {
        if (prog.hasHint) {
          this.shownEntries.push([false, prog]);
          this.realityHintsLeft--;
        }
      }

      const glyphHintCount = player.celestials.enslaved.glyphHintsGiven;
      for (let hintNum = 0; hintNum < glyphHintCount; hintNum++) {
        this.shownEntries.push([true, GameDatabase.celestials.enslaved.glyphHints[hintNum]]);
      }
      this.glyphHintsLeft = GameDatabase.celestials.enslaved.glyphHints.length - glyphHintCount;

      this.hints = Enslaved.hintCostIncreases;
    },
    giveRealityHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      EnslavedProgress.all.filter(prog => !prog.hasHint).randomElement().unlock();
    },
    giveGlyphHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      player.celestials.enslaved.glyphHintsGiven++;
    }
  },

};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Трещины в Реальности Безымянных
    </template>
    <div class="c-enslaved-hint-modal c-modal--short">
      <div>
        Кажется, эта Реальность сопротивляется вашим стараниям её выполнить. Пока что вы сделали следующее:
      </div>
      <br>
      <div
        v-for="(entry, index) in shownEntries"
        :key="index"
      >
        <div v-if="!entry[0]">
          <span v-if="entry[1].hasHint && !entry[1].hasProgress">
            <i class="c-icon-wrapper fas fa-question-circle" />
            <b>Вы пока что не поняли, что означает эта подсказка.</b>
          </span>
          <span v-else>
            <i class="c-icon-wrapper fa-solid fa-house-crack" />
            <b>Вы нашли трещину в этой Реальности:</b>
          </span>
          <br>
          - {{ entry[1].hintInfo }}
          <br>
          - {{ entry[1].hasProgress ? entry[1].completedInfo : "?????" }}
        </div>
        <div v-else>
          <i class="fa-solid fa-shapes" /> <b>Подсказка по глифам:</b>
          <br>
          {{ entry[1] }}
        </div>
        <br>
      </div>
      <div v-if="realityHintsLeft + glyphHintsLeft > 0">
        Вы можете тратить время на открытие каких-нибудь ещё трещин в этой Реальности, но каждый раз, когда вы тратие сохранённое время
        игры на подсказку, необходимое количество сохранённого времени игры увеличивается в {{ formatInt(3) }} раза. Это увеличение цены
        постепенно ослабевает в течение {{ formatInt(24) }} часов, и выяснение значения подсказки немедленно
        разделит цену на {{ formatInt(2) }}. Цена не может стать меньше {{ format(1e40) }} лет.
        <br><br>
        Следующая подсказка стоит {{ hintCost }} сохранённого времени игры. Сейчас у вас {{ formattedStored }}.
        <span v-if="currentStored < nextHintCost">
          Вы достигните необходимого количества, если вы будете заряжать Чёрную Дыру в течение {{ timeEstimate }}.
        </span>
        <br><br>
        <PrimaryButton
          :enabled="realityHintsLeft > 0 && canGetHint"
          class="l-enslaved-hint-button"
          @click="giveRealityHint(realityHintsLeft)"
        >
          Получить подсказку по самой Реальности ({{ formatInt(realityHintsLeft) }} осталось)
        </PrimaryButton>
        <br>
        <PrimaryButton
          :enabled="glyphHintsLeft > 0 && canGetHint"
          class="l-enslaved-hint-button"
          @click="giveGlyphHint(glyphHintsLeft)"
        >
          Получить подсказку по глифам, которые лучше использовать ({{ formatInt(glyphHintsLeft) }} осталось)
        </PrimaryButton>
      </div>
      <div v-else>
        <b>Подсказок больше не осталось!</b>
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-icon-wrapper {
  margin-right: 1rem;
}

.l-enslaved-hint-button {
  margin: 0.4rem 0;
}
</style>
