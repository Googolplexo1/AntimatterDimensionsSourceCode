<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "BigCrunchModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedInfinities: new Decimal(),
      gainedInfinityPoints: new Decimal(),
      startingBoosts: 0,
      startingAM: 10,
      willStartWithGalaxy: false
    };
  },
  computed: {
    isFirstInfinity() {
      return !PlayerProgress.infinityUnlocked();
    },
    message() {
      const info = this.isFirstInfinity ? this.firstInfinityInfo : ``;
      return `Бесконечность сбрасывает антиматерию, Измерения Антиматерии, ускорители, Расширения Измерений и Галактики Антиматерии.${info}`;
    },
    firstInfinityInfo() {
      return ` В награду вы получаете Очко Бесконечности (ОБ). Это позволит вам покупать определённые улучшения, которые вы можете
        найти во вкладке "Бесконечность". Вы также получаете одну бесконечность, которая будет отображена во вкладке "Статистика".`;
    },
    ipGainInfo() {
      return `Вы получите ${quantify("бесконечность", this.gainedInfinities, 2, 0)}
        and ${quantify("Очко", this.gainedInfinityPoints, 2, 0)} Бесконечности.`;
    },
    startingResources() {
      const gainedResources = [];
      if (this.startingAM.gte(10)) gainedResources.push(`${format(this.startingAM, 2, 1)} антиматерии`);
      if (this.startingBoosts > 0) gainedResources.push(`${quantify("Расширением", this.startingBoosts)} Измерений`);
      if (this.willStartWithGalaxy) gainedResources.push(`1 Галактикой Антиматерии`);

      return `Вы начнёте новую бесконечность с ${makeEnumeration(gainedResources)}.`;
    }
  },
  methods: {
    update() {
      this.gainedInfinities = gainedInfinities().round();
      this.gainedInfinityPoints = gainedInfinityPoints().round();
      this.startingBoosts = DimBoost.startingDimensionBoosts;
      this.startingAM = Currency.antimatter.startingValue;
      this.willStartWithGalaxy = InfinityUpgrade.skipResetGalaxy.isBought;
    },
    handleYesClick() {
      bigCrunchResetRequest();
      EventHub.ui.offAll(this);
      if (this.isFirstInfinity) {
        setTimeout(() => Modal.message.show(`Эта анимация будет воспроизводиться после каждой бесконечности, совершённой вручную. Если
          вы хотите её отключить, это можно сделать во вкладке "Настройки". Отключить можно и любую другую
          анимацию в игре, после того как вы увидите её впервые.`, {}, 3), 2000);
      }
    }
  },
};
</script>

<template>
  <ResetModal
    header="Вы совершаете бесконечность"
    :message="message"
    :gained-resources="ipGainInfo"
    :starting-resources="startingResources"
    :confirm-fn="handleYesClick"
    :alternate-condition="isFirstInfinity"
    :alternate-text="message"
    :confirm-option="isFirstInfinity ? undefined : 'bigCrunch'"
  />
</template>
