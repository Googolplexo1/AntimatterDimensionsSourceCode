<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ClassicInfinityDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      hasPrevTier: false,
      isUnlocked: false,
      canUnlock: false,
      multiplier: new Decimal(0),
      baseAmount: 0,
      amount: new Decimal(0),
      purchases: 0,
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isCapped: false,
      capIP: new Decimal(0),
      isAutobuyerOn: false,
      isEC8Running: false,
      hardcap: InfinityDimensions.HARDCAP_PURCHASES,
      eternityReached: false,
      enslavedRunning: false,
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return `${this.tier}-е Измерение Бесконечности`;
    },
    costDisplay() {
      if (this.isUnlocked || this.shiftDown) {
        if (this.isCapped) return "Ограничено";
        return this.showCostTitle ? `Цена: ${format(this.cost)} ОБ` : `${format(this.cost)} ОБ`;
      }

      if (this.canUnlock) {
        return "Разблокировать";
      }

      return `Достигните ${formatPostBreak(InfinityDimension(this.tier).amRequirement)} антиматерии`;
    },
    hasLongText() {
      return this.costDisplay.length > 20;
    },
    hardcapPurchases() {
      return format(this.hardcap, 1, 1);
    },
    capTooltip() {
      if (this.enslavedRunning) return `В Реальности Безымянных нельзя купить более ${format(10)} Измерений Бесконечности одного уровня`;
      if (this.isCapped) return `Ограничение достигнуто на ${format(this.capIP)} ОБ`;
      return `Куплено ${quantifyInt("раз", this.purchases)}`;
    },
    showRow() {
      return this.eternityReached || this.isUnlocked || this.canUnlock || this.amount.gt(0) ||
        this.hasPrevTier;
    },
    showCostTitle() {
      return this.cost.exponent < 1e6;
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.infinityDimension(this.tier).isActive = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = InfinityDimension(tier);
      this.hasPrevTier = tier === 1 || InfinityDimension(tier - 1).isUnlocked;
      const autobuyer = Autobuyer.infinityDimension(tier);
      this.isUnlocked = dimension.isUnlocked;
      this.canUnlock = dimension.canUnlock;
      this.multiplier.copyFrom(dimension.multiplier);
      this.baseAmount = dimension.baseAmount;
      this.purchases = dimension.purchases;
      this.amount.copyFrom(dimension.amount);
      this.rateOfChange.copyFrom(dimension.rateOfChange);
      this.isAutobuyerUnlocked = autobuyer.isUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      this.isCapped = dimension.isCapped;
      if (this.isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
        this.hardcap = dimension.purchaseCap;
      }
      this.isEC8Running = EternityChallenge(8).isRunning;
      this.isAutobuyerOn = autobuyer.isActive;
      this.eternityReached = PlayerProgress.eternityUnlocked();
      this.enslavedRunning = Enslaved.isRunning;
    },
    buySingleInfinityDimension() {
      InfinityDimension(this.tier).buySingle();
    },
    buyMaxInfinityDimension() {
      InfinityDimension(this.tier).buyMax(false);
    },
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !canUnlock }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        :enabled="isAvailableForPurchase || (!isUnlocked && canUnlock)"
        class="o-primary-btn--buy-id o-primary-btn--buy-dim c-dim-tooltip-container"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buySingleInfinityDimension"
      >
        {{ costDisplay }}
        <div class="c-dim-purchase-count-tooltip">
          {{ capTooltip }}
        </div>
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="isAutobuyerUnlocked && !isEC8Running"
        v-model="isAutobuyerOn"
        class="o-primary-btn--id-auto"
        label="Автоматика:"
      />
      <PrimaryButton
        v-else
        :enabled="isAvailableForPurchase && isUnlocked"
        class="o-primary-btn--id-auto"
        @click="buyMaxInfinityDimension"
      >
        Купить все
      </PrimaryButton>
    </div>
  </div>
</template>
