<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "AntimatterGalaxyModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      newGalaxies: 0,
      keepAntimatter: false,
      perkANRBought: false,
      keepDimBoost: false
    };
  },
  computed: {
    topLabel() {
      if (this.bulk) return `Вы получаете ${quantifyInt("Галактику", this.newGalaxies)} Антиматерии`;
      return `Вы получаете Галактику Антиматерии`;
    },
    message() {
      const resetResouces = [];
      if (Pelle.isDoomed) resetResouces.push("антиматерии", "Измерений Антиматерии", "ускорителей");
      if (!this.perkANRBought) resetResouces.push("Измерений Антиматерии", "ускорителей");
      if (!this.keepDimBoost) resetResouces.push("Расширений Измерений");
      if (!this.keepAntimatter && !this.perkANRBought) resetResouces.push("антиматерии");
      const resetList = makeEnumeration(resetResouces);
      let tickspeedFixed = "";
      if (InfinityChallenge(3).isRunning) {
        tickspeedFixed = `3-ем Испытании Бесконечности}`;
      } else if (Ra.isRunning) {
        tickspeedFixed = `Реальности Ра`;
      }
      const tickspeedInfo = (tickspeedFixed === "")
        ? "ускорители станут немного сильнее."
        : `ускорители не станут сильнее, так как вы в ${tickspeedFixed}.`;
      const message = (resetList === "")
        ? `Ничего не будет сброшено, и ${tickspeedInfo}`
        : `Будет сброшено ваше количество ${resetList}. Однако ${tickspeedInfo}`;

      if (this.bulk) return `Вы уверены, что хотите получить
      ${quantifyInt("Галактику", this.newGalaxies)} Антиматерии? ${message}`;
      return `Вы уверены, что хотите получить Галактику Антиматерии? ${message}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, () =>
      (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought ? undefined : this.emitClose()));
  },
  methods: {
    update() {
      if (this.bulk) {
        const req = Galaxy.requirement;
        const dim = AntimatterDimension(req.tier);
        const bulk = bulkBuyBinarySearch(dim.totalAmount, {
          costFunction: x => Galaxy.requirementAt(x).amount,
          cumulative: false,
        }, player.galaxies);
        if (bulk) {
          this.newGalaxies = Galaxy.buyableGalaxies(Math.round(dim.totalAmount.toNumber())) - player.galaxies;
        }
      }
      this.keepAntimatter = Achievement(111).isUnlocked;
      this.perkANRBought = Perk.antimatterNoReset.canBeApplied;
      this.keepDimBoost = (Achievement(143).isUnlocked && !Pelle.isDoomed) ||
        PelleUpgrade.galaxyNoResetDimboost.canBeApplied;
    },
    handleYesClick() {
      requestGalaxyReset(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="antimatterGalaxy"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>

    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
