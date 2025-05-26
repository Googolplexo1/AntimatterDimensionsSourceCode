<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "EternityModal",
  components: {
    ResetModal
  },
  data() {
    return {
      exitingEC: false,
      startingIP: new Decimal(),
      gainedEternityPoints: new Decimal(),
      gainedEternities: new Decimal()
    };
  },
  computed: {
    message() {
      return PlayerProgress.eternityUnlocked()
        ? `Вечность сбросит всё, кроме достижений, рекордов испытаний и статистики в разделе "Общее".`
        : `Вечность сбросит всё, кроме достижений, рекордов испытаний и статистики в разделе "Общее".
          Вы также получите Очко Вечности и разблокируете различные улучшения.`;
    },
    gainedEPOnEternity() {
      return `Вы получите ${quantify("вечность", this.gainedEternities, 2)} 
      и ${quantify("Очко", this.gainedEternityPoints, 2)} Вечности.`;
    },
    startWithIP() {
      return this.startingIP.gt(0)
        ? `Вы начнёте следующую вечность с ${format(this.startingIP, 2)} Очков Бесконечности.`
        : ``;
    },
    eternityChallenge() {
      const ec = EternityChallenge.current;
      if (ec.isFullyCompleted) {
        return `${ec.id}-е Испытание Вечности уже полностью выполнено.`;
      }
      if (!Perk.studyECBulk.isBought) {
        return `Вы получите одно выполнение ${ec.id}-го Испытания Вечности.`;
      }
      const gainedCompletions = ec.gainedCompletionStatus.gainedCompletions;
      return `Вы получите ${quantifyInt("выполнение", gainedCompletions)} ${ec.id}-го Испытания Вечности.`;
    }
  },
  methods: {
    update() {
      this.exitingEC = EternityChallenge.isRunning;
      this.startingIP = Currency.infinityPoints.startingValue;
      this.gainedEternityPoints = gainedEternityPoints();
      this.gainedEternities = gainedEternities();
    },
    handleYesClick() {
      animateAndEternity();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ResetModal
    :header="exitingEC ? 'Вы завершаете Испытание Вечности' : 'Вы совершаете вечность'"
    :message="message"
    :gained-resources="gainedEPOnEternity"
    :starting-resources="startWithIP"
    :confirm-fn="handleYesClick"
    :alternate-condition="exitingEC"
    :alternate-text="exitingEC ? eternityChallenge : undefined"
    confirm-option="eternity"
  />
</template>
