<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import RaPet from "./RaPet";
import RaPetRemembranceButton from "./RaPetRemembranceButton";

export default {
  name: "RaTab",
  components: {
    RaPet,
    RaPetRemembranceButton,
    CelestialQuoteHistory
  },
  data() {
    return {
      memoriesPerChunk: 0,
      showReality: false,
      isRaCapped: false,
      totalLevels: 0,
      showRemembrance: false,
      hasRemembrance: false,
      remembranceReq: 0,
      remembranceMult: 1,
      remembranceNerf: 1,
      petWithRemembrance: "",
      isRunning: false,
      memoryBoosts: "",
    };
  },
  computed: {
    laitelaUnlock: () => Laitela.isUnlocked,
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeVisible: () => Ra.unlocks.chargedInfinityUpgrades.isUnlocked,
        scalingUpgradeText: () => `Вы можете заряжать до ${quantifyInt("Улучшения", Ra.totalCharges)} Бесконечности.`,
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeVisible: () => AlchemyResources.all.filter(r => r.isUnlocked).length > 0,
        scalingUpgradeText: () => {
          const resources = AlchemyResources.all.filter(r => r.isUnlocked).length;
          return `Вы разблокировали ${quantifyInt("алхимический ресурс", resources)}.`;
        },
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeVisible: () => Ra.unlocks.improvedStoredTime.isUnlocked,
        scalingUpgradeText: () => `Множитель
          ${formatX(Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1), 2)} к сохранённому игровому времени и
          +${quantifyInt("час", Ra.unlocks.improvedStoredTime.effects.realTimeCap.effectOrDefault(0) / (1000 * 3600))} к максимальному количеству сохранённого реального времени.`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeVisible: () => Ra.unlocks.unlockHardV.isUnlocked,
        scalingUpgradeText: () => {
          const triadCount = Ra.unlocks.unlockHardV.effectOrDefault(0);
          return `Вы разблокировали ${quantifyInt("Тройственное Исследование", triadCount)}.`;
        },
      }
    ],
    petStyle() {
      return {
        color: (this.petWithRemembrance === "")
          ? "white"
          : this.pets.find(pet => pet.pet.name === this.petWithRemembrance).pet.color,
      };
    },
    runButtonClassObject() {
      return {
        "c-ra-run-button__icon": true,
        "c-ra-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[4].effects().replace(/^\w/u, c => c.toUpperCase()).split("\n");
    },
    memoryDescription() {
      return `В Реальности Ра вы производите Куски Памяти для Небожителей
        в зависимости от определённых параметров.`;
    },
    achievementBonusText() {
      return Achievement(168).isUnlocked ? "; также достижение 168 даёт постоянный бонус" : "";
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.memoriesPerChunk = Ra.productionPerMemoryChunk;
      this.isRaCapped = Ra.totalPetLevel === 100;
      this.totalLevels = Ra.totalPetLevel;
      this.showRemembrance = Ra.unlocks.effarigUnlock.canBeApplied;
      this.hasRemembrance = Ra.remembrance.isUnlocked;
      this.remembranceReq = Ra.remembrance.requiredLevels;
      this.remembranceMult = Ra.remembrance.multiplier;
      this.remembranceNerf = Ra.remembrance.nerf;
      this.petWithRemembrance = Ra.petWithRemembrance;
      this.isRunning = Ra.isRunning;
      this.memoryBoosts = Ra.memoryBoostResources;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Ра", number: 4 });
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
};
</script>

<template>
  <div class="l-ra-celestial-tab">
    <div class="c-ra-memory-header">
      <CelestialQuoteHistory celestial="ra" />
      <div v-if="!isRaCapped">
        Каждый Кусок Памяти генерирует одну единицу соответствующей Памяти в секунду<span v-if="memoriesPerChunk > 1">,
          что с учётом множителей даёт {{ format(memoriesPerChunk, 2, 3) }} Памяти в секунду</span>.
        <span v-if="memoriesPerChunk > 1">
          <br>
          Множители к производству Памяти зависят от {{ memoryBoosts }}{{ achievementBonusText }}.
        </span>
        <br>
        Хранение реального времени останавливает производство Кусков Памяти, но не влияет на производство Памяти.
      </div>
      <div v-else>
        Все Небожители полностью восстановлены в памяти.
      </div>
    </div>
    <div>
      Вы можете наводить курсор на значки Этапов Небожителей, расположенные под их полосами прогресса, чтобы просмотреть их эффекты,
      <br>
      и на иконки <i class="fas fa-question-circle" /> для просмотра информации о том, от чего зависит получение ресурсов.
    </div>
    <div class="l-ra-all-pets-container">
      <RaPet
        v-for="(pet, i) in pets"
        :key="i"
        :pet-config="pet"
      />
    </div>
    <div class="l-ra-non-pets">
      <button class="c-ra-run-button">
        <h2 :class="{ 'o-pelle-disabled': isDoomed }">
          Запустить Реальность Ра
        </h2>
        <div
          :class="runButtonClassObject"
          @click="startRun"
        >
          <span class="c-ra-run-button__icon__sigil fas fa-sun" />
        </div>
        <span
          v-for="(line, lineId) in runDescription"
          :key="lineId + '-ra-run-desc'"
        >
          {{ line }}
        </span>
        <br>
        <span>
          {{ memoryDescription }}
        </span>
      </button>
      <div
        v-if="showRemembrance && !isRaCapped"
        class="c-ra-remembrance-unlock"
      >
        <h1 :style="petStyle">
          Напоминание
        </h1>
        <span :style="petStyle">
          Напоминание действует так, что один из Небожителей получает в {{ format(remembranceMult) }} раз больше Кусков Памяти, а остальные
          - в {{ format(1 / remembranceNerf) }} раза меньше.
        </span>
        <div
          v-if="hasRemembrance"
          class="c-ra-remembrance-unlock-inner"
        >
          <RaPetRemembranceButton
            v-for="(pet, i) in pets"
            :key="i"
            :pet-config="pet"
          />
        </div>
        <div
          v-else
          class="c-ra-remembrance-unlock-inner"
        >
          Разблокируется, когда суммарный уровень всех Небожителей достигнет {{ formatInt(remembranceReq) }}
          (необходимо увеличить его ещё на {{ formatInt(remembranceReq - totalLevels) }})
        </div>
      </div>
    </div>
  </div>
</template>
