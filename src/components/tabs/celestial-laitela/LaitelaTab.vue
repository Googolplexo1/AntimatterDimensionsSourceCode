<script>
import AnnihilationButton from "./AnnihilationButton";
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import DarkMatterDimensionGroup from "./DarkMatterDimensionGroup";
import LaitelaAutobuyerPane from "./LaitelaAutobuyerPane";
import LaitelaRunButton from "./LaitelaRunButton";
import PrimaryButton from "@/components/PrimaryButton";
import SingularityMilestonePane from "./SingularityMilestonePane";
import SingularityPane from "./SingularityPane";

export default {
  name: "LaitelaTab",
  components: {
    LaitelaRunButton,
    SingularityPane,
    SingularityMilestonePane,
    DarkMatterDimensionGroup,
    AnnihilationButton,
    LaitelaAutobuyerPane,
    CelestialQuoteHistory,
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      darkMatter: new Decimal(0),
      darkMatterGain: new Decimal(0),
      isDMCapped: false,
      maxDarkMatter: new Decimal(0),
      darkEnergy: 0,
      matterExtraPurchasePercentage: 0,
      autobuyersUnlocked: false,
      singularityPanelVisible: false,
      singularitiesUnlocked: false,
      singularityCap: 0,
      singularityWaitTime: 0,
      showAnnihilation: false
    };
  },
  computed: {
    styleObject() {
      return {
        color: this.isDMCapped ? "var(--color-bad)" : "",
      };
    },
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.isDMCapped = this.darkMatter.eq(Number.MAX_VALUE);
      this.maxDarkMatter.copyFrom(Currency.darkMatter.max);
      this.darkEnergy = player.celestials.laitela.darkEnergy;
      this.matterExtraPurchasePercentage = Laitela.matterExtraPurchaseFactor - 1;
      this.autobuyersUnlocked = SingularityMilestone.darkDimensionAutobuyers.canBeApplied ||
        SingularityMilestone.darkDimensionAutobuyers.canBeApplied ||
        SingularityMilestone.autoCondense.canBeApplied ||
        Laitela.darkMatterMult > 1;
      this.singularityPanelVisible = Currency.singularities.gt(0);
      this.singularitiesUnlocked = Singularity.capIsReached || this.singularityPanelVisible;
      this.singularityCap = Singularity.cap;
      this.singularityWaitTime = TimeSpan.fromSeconds((this.singularityCap - this.darkEnergy) /
        Currency.darkEnergy.productionPerSecond).toStringShort();
      this.showAnnihilation = Laitela.annihilationUnlocked;

      const d1 = DarkMatterDimension(1);
      this.darkMatterGain = d1.amount.times(d1.powerDM).divide(d1.interval).times(1000);
    },
    maxAll() {
      Laitela.maxAllDMDimensions(4);
    },
    showLaitelaHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Лайтела")[0];
      Modal.h2p.show();
    },
  }
};
</script>

<template>
  <div class="l-laitela-celestial-tab">
    <CelestialQuoteHistory celestial="laitela" />
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="showLaitelaHowTo()"
      >
        Нажмите для просмотра информации о Лайтеле
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Купить все Измерения Тёмной Материи
      </PrimaryButton>
    </div>
    <div class="o-laitela-matter-amount">
      У вас
      <span :style="styleObject">{{ format(darkMatter, 2) }}</span>
      Тёмной Материи<span v-if="isDMCapped"> (ограничено)</span>.
      <span v-if="!isDMCapped">(Средний прирост: {{ format(darkMatterGain, 2, 2) }}/с)</span>
    </div>
    <div class="o-laitela-matter-amount">
      Количество вашей Тёмной Материи достигало максимума в
      <span :style="styleObject">{{ format(maxDarkMatter, 2) }}</span><span v-if="!isDoomed">,
        что увеличивает ваши значения континуума на {{ formatPercents(matterExtraPurchasePercentage, 2) }}</span>.
    </div>
    <div class="o-laitela-matter-amount">
      На Измерения Тёмной Материи не влияет хранение реального времени.
    </div>
    <h2
      v-if="!singularitiesUnlocked"
      class="c-laitela-singularity-container"
    >
      Сингулярность разблокируется через {{ singularityWaitTime }}.
      ({{ format(darkEnergy, 2, 2) }}/{{ format(singularityCap, 2) }} Тёмной Энергии)
    </h2>
    <SingularityPane v-if="singularitiesUnlocked" />
    <LaitelaAutobuyerPane v-if="autobuyersUnlocked" />
    <div class="l-laitela-mechanics-container">
      <LaitelaRunButton />
      <div>
        <DarkMatterDimensionGroup />
        <AnnihilationButton v-if="showAnnihilation" />
      </div>
      <SingularityMilestonePane v-if="singularityPanelVisible" />
    </div>
  </div>
</template>
