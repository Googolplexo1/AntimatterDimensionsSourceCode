<script>
export default {
  name: "EternityButton",
  data() {
    return {
      isVisible: false,
      type: EP_BUTTON_DISPLAY_TYPE.FIRST_TIME,
      gainedEP: new Decimal(0),
      currentEP: new Decimal(0),
      currentEPRate: new Decimal(0),
      peakEPRateVal: new Decimal(0),
      peakEPRate: new Decimal(0),
      currentTachyons: new Decimal(0),
      gainedTachyons: new Decimal(0),
      challengeCompletions: 0,
      gainedCompletions: 0,
      fullyCompleted: false,
      failedRestriction: undefined,
      hasMoreCompletions: false,
      nextGoalAt: new Decimal(0),
      canEternity: false,
      eternityGoal: new Decimal(0),
      hover: false,
      headerTextColored: true,
      creditsClosed: false,
      showEPRate: false,
      isDilation: false,
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-eternity-button": !this.isDilation,
        "o-eternity-button--dilation": this.isDilation,
        "o-eternity-button--unavailable": !this.canEternity,
        "o-pelle-disabled-pointer": this.creditsClosed,
      };
    },
    // Show EP/min below this threshold, color the EP number above it (1e40 is roughly when TS181 is attainable)
    rateThreshold: () => 1e100,
    amountStyle() {
      if (!this.headerTextColored || this.currentEP.lt(this.rateThreshold)) return {
        "transition-duration": "0s"
      };
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };

      // Dynamically generate red-text-green based on the CSS entry for text color, returning a raw 6-digit hex color
      // code. stepRGB is an array specifying the three RGB codes, which are then interpolated between in order to
      // generate the final color; only ratios between 0.9-1.1 give a color gradient
      const textHexCode = getComputedStyle(document.body).getPropertyValue("--color-text").split("#")[1];
      const stepRGB = [
        [255, 0, 0],
        [
          parseInt(textHexCode.substring(0, 2), 16),
          parseInt(textHexCode.substring(2, 4), 16),
          parseInt(textHexCode.substring(4), 16)
        ],
        [0, 255, 0]
      ];
      const ratio = this.gainedEP.log10() / this.currentEP.log10();
      const interFn = index => {
        if (ratio < 0.9) return stepRGB[0][index];
        if (ratio < 1) {
          const r = 10 * (ratio - 0.9);
          return Math.round(stepRGB[0][index] * (1 - r) + stepRGB[1][index] * r);
        }
        if (ratio < 1.1) {
          const r = 10 * (ratio - 1);
          return Math.round(stepRGB[1][index] * (1 - r) + stepRGB[2][index] * r);
        }
        return stepRGB[2][index];
      };
      const rgb = [interFn(0), interFn(1), interFn(2)];
      return {
        color: `rgb(${rgb.join(",")})`,
        "transition-duration": "0.2s"
      };
    },
    tachyonAmountStyle() {
      // Hovering over the button makes all the text on the button black; this text inherits that
      // without us needing to specify a color.
      if (!this.headerTextColored || this.hover) return {
        "transition-duration": "0s"
      };
      // Note that Infinity and 0 can show up here. We have a special case for
      // this.currentTachyons being 0 because dividing a Decimal by 0 returns 0.
      let ratio;
      if (this.currentTachyons.eq(0)) {
        // In this case, make it always red or green.
        // (Is it possible to gain 0 tachyons? Probably somehow it is.)
        ratio = this.gainedTachyons.eq(0) ? 0 : Infinity;
      } else {
        ratio = this.gainedTachyons.div(this.currentTachyons).toNumber();
      }

      const rgb = [
        Math.round(Math.clampMax(1 / ratio, 1) * 255),
        Math.round(Math.clampMax(ratio, 1) * 255),
        Math.round(Math.clampMax(ratio, 1 / ratio) * 255),
      ];
      return { color: `rgb(${rgb.join(",")})` };
    }
  },
  methods: {
    update() {
      this.isVisible = Player.canEternity ||
        EternityMilestone.autoUnlockID.isReached || InfinityDimension(8).isUnlocked;
      this.isDilation = player.dilation.active;
      if (!this.isVisible) return;
      this.canEternity = Player.canEternity;
      this.eternityGoal.copyFrom(Player.eternityGoal);
      this.headerTextColored = player.options.headerTextColored;

      if (!this.canEternity) {
        this.type = EP_BUTTON_DISPLAY_TYPE.CANNOT_ETERNITY;
        return;
      }

      if (!PlayerProgress.eternityUnlocked()) {
        this.type = EP_BUTTON_DISPLAY_TYPE.FIRST_TIME;
        return;
      }

      if (EternityChallenge.isRunning) {
        if (!Perk.studyECBulk.isBought) {
          this.type = EP_BUTTON_DISPLAY_TYPE.CHALLENGE;
          return;
        }
        this.type = EP_BUTTON_DISPLAY_TYPE.CHALLENGE_RUPG;
        this.updateChallengeWithRUPG();
        return;
      }

      const gainedEP = gainedEternityPoints();
      this.currentEP.copyFrom(Currency.eternityPoints);
      this.gainedEP.copyFrom(gainedEP);
      const hasNewContent = !PlayerProgress.realityUnlocked() &&
        Currency.eternityPoints.exponent >= 4000 &&
        !TimeStudy.reality.isBought;
      if (this.isDilation) {
        this.type = hasNewContent
          ? EP_BUTTON_DISPLAY_TYPE.DILATION_EXPLORE_NEW_CONTENT
          : EP_BUTTON_DISPLAY_TYPE.DILATION;
        this.currentTachyons.copyFrom(Currency.tachyonParticles);
        this.gainedTachyons.copyFrom(getTachyonGain(true));
        return;
      }

      this.type = hasNewContent
        ? EP_BUTTON_DISPLAY_TYPE.NORMAL_EXPLORE_NEW_CONTENT
        : EP_BUTTON_DISPLAY_TYPE.NORMAL;
      this.currentEPRate.copyFrom(gainedEP.dividedBy(
        TimeSpan.fromMilliseconds(player.records.thisEternity.realTime).totalMinutes));
      this.peakEPRateVal.copyFrom(player.records.thisEternity.bestEPminVal);
      this.peakEPRate.copyFrom(player.records.thisEternity.bestEPmin);
      this.showEPRate = this.peakEPRate.lte(this.rateThreshold);
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    updateChallengeWithRUPG() {
      const ec = EternityChallenge.current;
      this.fullyCompleted = ec.isFullyCompleted;
      if (this.fullyCompleted) return;
      const status = ec.gainedCompletionStatus;
      this.gainedCompletions = status.gainedCompletions;
      this.failedRestriction = status.failedRestriction;
      this.hasMoreCompletions = status.hasMoreCompletions;
      this.nextGoalAt.copyFrom(status.nextGoalAt);
    }
  },
};

const EP_BUTTON_DISPLAY_TYPE = {
  CANNOT_ETERNITY: -1,
  FIRST_TIME: 0,
  NORMAL: 1,
  CHALLENGE: 2,
  DILATION: 3,
  NORMAL_EXPLORE_NEW_CONTENT: 4,
  DILATION_EXPLORE_NEW_CONTENT: 5,
  CHALLENGE_RUPG: 6
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClassObject"
    class="o-prestige-button"
    onclick="eternityResetRequest()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Eternity -->
    <template v-if="type === -1">
      Достигните {{ format(eternityGoal, 2, 2) }}
      <br>
      Очков Бесконечности
    </template>

    <!-- First time -->
    <template v-else-if="type === 0">
      Иные времена ждут...
      <br>
      Пора стать Вечным
    </template>

    <!-- Normal -->
    <template v-else-if="type === 1">
      Совершить вечность за <br v-if="!showEPRate">
      <span :style="amountStyle">{{ format(gainedEP, 2) }}</span>
      <span v-if="showEPRate"> ОВ</span>
      <span v-else> {{ pluralize("Очко", gainedEP) }} Вечности</span>
      <br>
      <template v-if="showEPRate">
        Текущий прирост: {{ format(currentEPRate, 2, 2) }} ОВ/мин
        <br>
        Пик: {{ format(peakEPRate, 2, 2) }} ОВ/мин
        <br>
        при {{ format(peakEPRateVal, 2, 2) }} ОВ
      </template>
    </template>

    <!-- Challenge -->
    <template v-else-if="type === 2 || (type === 6 && !canEternity)">
      Иные испытания ждут...
      <br>
      Пора стать Вечным
    </template>

    <!-- Dilation -->
    <template v-else-if="type === 3">
      Совершить вечность за <span :style="tachyonAmountStyle">{{ format(gainedTachyons, 2, 1) }}</span>
      {{ pluralize("Тахион", gainedTachyons) }}
    </template>

    <!-- New content available -->
    <template v-else-if="type === 4 || type === 5">
      <template v-if="type === 4">
        Совершить вечность за <span :style="amountStyle">{{ format(gainedEP, 2, 2) }}</span> ОВ
      </template>
      <template v-else>
        Совершить вечность за <span :style="tachyonAmountStyle">{{ format(gainedTachyons, 2, 1) }}</span> {{ pluralize("Тахион", gainedTachyons) }}
      </template>
      <br>
      Обратите внимание на новый контент!
    </template>

    <!-- Challenge with multiple completions -->
    <template v-else-if="type === 6">
      Иные испытания ждут...
      <template v-if="fullyCompleted">
        <br>
        (Это Испытание уже полностью завершено)
      </template>
      <template v-else>
        <br>
        {{ quantifyInt("выполнение", gainedCompletions) }} на вечности
        <template v-if="failedRestriction">
          <br>
          {{ failedRestriction }}
        </template>
        <template v-else-if="hasMoreCompletions">
          <br>
          Следующая цель: {{ format(nextGoalAt) }} ОБ
        </template>
      </template>
    </template>
  </button>
</template>

<style scoped>

</style>
