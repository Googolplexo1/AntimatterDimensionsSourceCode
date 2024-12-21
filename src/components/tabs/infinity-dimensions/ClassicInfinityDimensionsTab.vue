<script>
import InfinityDimensionRow from "./ClassicInfinityDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicInfinityDimensionsTab",
  components: {
    PrimaryButton,
    InfinityDimensionRow
  },
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isEC9Running: false,
      isEnslavedRunning: false,
      isAnyAutobuyerUnlocked: false,
      conversionRate: 0,
      nextDimCapIncrease: 0,
      tesseractCost: new Decimal(0),
      totalDimCap: 0,
      canBuyTesseract: false,
      enslavedCompleted: false,
      boughtTesseracts: 0,
      extraTesseracts: 0,
      creditsClosed: false,
      showLockedDimCostNote: true,
    };
  },
  computed: {
    tesseractCountString() {
      const extra = this.extraTesseracts > 0 ? ` + ${format(this.extraTesseracts, 2, 2)}` : "";
      return `${formatInt(this.boughtTesseracts)}${extra}`;
    },
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !InfinityDimension(8).isUnlocked;
      this.isEC9Running = EternityChallenge(9).isRunning;
      this.infinityPower.copyFrom(Currency.infinityPower);
      this.conversionRate = InfinityDimensions.powerConversionRate;
      if (this.isEC9Running) {
        this.dimMultiplier.copyFrom(Decimal.pow(Math.max(this.infinityPower.log2(), 1), 4).max(1));
      } else {
        this.dimMultiplier.copyFrom(this.infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerRealSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "7-го Измерения Антиматерии" : "Силы Бесконечности";
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isEnslavedRunning = Enslaved.isRunning;
      this.isAnyAutobuyerUnlocked = Autobuyer.infinityDimension(1).isUnlocked;
      this.nextDimCapIncrease = Tesseracts.nextTesseractIncrease;
      this.tesseractCost.copyFrom(Tesseracts.nextCost);
      this.totalDimCap = InfinityDimensions.totalDimCap;
      this.canBuyTesseract = Tesseracts.canBuyTesseract;
      this.enslavedCompleted = Enslaved.isCompleted;
      this.boughtTesseracts = Tesseracts.bought;
      this.extraTesseracts = Tesseracts.extra;
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    maxAll() {
      InfinityDimensions.buyMax();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    },
    buyTesseract() {
      Tesseracts.buyTesseract();
    }
  }
};
</script>

<template>
  <div class="l-infinity-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        v-if="!isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Купить всё
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked && !isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Переключить всю автоматику
      </PrimaryButton>
    </div>
    <div>
      <p>
        У вас
        <span class="c-infinity-dim-description__accent">{{ format(infinityPower, 2, 1) }}</span>
        Силы Бесконечности, что
        <br>
        <span v-if="!isEC9Running">
          при возведении в степень
          <span class="c-infinity-dim-description__accent">{{ format(conversionRate, 2, 3) }}</span>
        </span>
        даёт множитель
        <span class="c-infinity-dim-description__accent">{{ formatX(dimMultiplier, 2, 1) }}</span>
        ко всем
        <span v-if="!isEC9Running">Измерениям Антиматерии.</span>
        <span v-else>Измерениям Времени по условию 9-го Испытания Вечности.</span>
      </p>
    </div>
    <div
      v-if="enslavedCompleted"
      class="l-infinity-dim-tab__enslaved-reward-container"
    >
      <button
        class="c-infinity-dim-tab__tesseract-button"
        :class="{
          'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract,
          'o-pelle-disabled-pointer': creditsClosed
        }"
        @click="buyTesseract"
      >
        <p>
          Купить Тессеракт ({{ tesseractCountString }})
        </p>
        <p>Увеличить ограничение на количество покупок Измерений на {{ format(nextDimCapIncrease, 2) }}</p>
        <p><b>Цена: {{ format(tesseractCost) }} ОБ</b></p>
      </button>
    </div>
    <div v-if="isEnslavedRunning">
      Каждое Измерение Бесконечности может быть куплено не более одного раза.
    </div>
    <div v-else>
      Каждое Измерение Бесконечности, кроме 8-го, может быть куплено не более {{ quantify("раз", totalDimCap, 2) }}.
    </div>
    <div>Вы получаете {{ format(powerPerSecond, 2) }} {{ incomeType }} в секунду.</div>
    <b
      v-if="isEC8Running"
      class="l-infinity-dim-tab__ec8-purchases"
    >
      {{ quantifyInt("покупка осталась", EC8PurchasesLeft) }} (см. условие 8-го Испытания Вечности).
    </b>
    <div class="l-dimensions-container">
      <InfinityDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div v-if="showLockedDimCostNote">
      Зажмите клавишу Shift, чтобы показать цены заблокированных Измерений Бесконечности.
    </div>
  </div>
</template>
