<script>
export default {
  name: "RealityReminder",
  data() {
    return {
      canReality: false,
      isVisible: false,
      isExpanded: false,
      ecCount: 0,
      missingAchievements: 0,
      unpurchasedDilationUpgrades: 0,
      currLog10EP: 0,
      cheapestLog10TD: 0,
      multEPLog10Cost: 0,
      purchasableTS: 0,
      hasDilated: 0,
      availableCharges: 0,
    };
  },
  computed: {
    suggestions() {
      const arr = [];
      if (this.purchasableTS > 0) {
        arr.push(`Купить оставшиеся Исследования Времени (${formatInt(this.purchasableTS)} доступно)`);
      }
      if (this.missingAchievements > 0) {
        arr.push(`Выполнить оставшиеся достижения из первых тринадцати рядов (${formatInt(this.missingAchievements)} осталось)`);
      }
      if (this.unpurchasedDilationUpgrades > 0) {
        arr.push(`Купить оставшиеся Улучшения Замедления (${formatInt(this.unpurchasedDilationUpgrades)} доступно)`);
      }
      if (this.currLog10EP > 1.3 * this.cheapestLog10TD) {
        arr.push(`Купить оставшиеся Измерения Времени (наименьшая цена: ${format(Decimal.pow10(this.cheapestLog10TD))} ОВ)`);
      }
      if (this.currLog10EP > 1.3 * this.multEPLog10Cost) {
        arr.push(`Купить оставшиеся упятерители ОВ (цена: ${format(Decimal.pow10(this.multEPLog10Cost))} ОВ)`);
      }
      if (this.ecCount < 60) {
        arr.push(`Выполнить оставшиеся ИспВ (выполнено ${formatInt(this.ecCount)}/${formatInt(60)})`);
      }
      if (!this.hasDilated) {
        arr.push("Совершить вечность в Замедлении");
      }
      if (this.availableCharges > 0) {
        arr.push(`Зарядить больше Улучшений Бесконечности (ещё ${formatInt(this.availableCharges)})`);
      }
      return arr;
    },
    canBeExpanded() {
      return this.canReality && this.suggestions.length !== 0;
    },
    styleObject() {
      const color = (!this.canReality || this.canBeExpanded) ? "var(--color-bad)" : "var(--color-good)";
      // Has both is and canBe in order to force the height back to its minimum size when all suggestions are done
      const height = (this.canBeExpanded && this.isExpanded) ? `${6.5 + 1.5 * this.suggestions.length}rem` : "5rem";
      return {
        color,
        height,
      };
    },
    clickText() {
      return `(нажмите, чтобы ${this.isExpanded ? "скрыть" : "показать"})`;
    },
    realityReminderClass() {
      return {
        "c-reality-reminder": true,
        "c-reality-reminder-pointer": this.canBeExpanded,
      };
    },
    dropDownIconClass() {
      return this.isExpanded ? "far fa-minus-square" : "far fa-plus-square";
    }
  },
  created() {
    // Collapsing it after every reality resets the height to its fixed minimum value, stopping screen jitter
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, () => this.isExpanded = false);
  },
  methods: {
    update() {
      this.canReality = TimeStudy.reality.isBought;
      this.isVisible = !isInCelestialReality();
      this.ecCount = EternityChallenges.completions;
      this.missingAchievements = Achievements.preReality.countWhere(a => !a.isUnlocked);
      // Repeatable dilation upgrades don't have isBought, but do have boughtAmount
      this.unpurchasedDilationUpgrades = DilationUpgrade.all
        .countWhere(u => (u.isBought === undefined ? u.boughtAmount === 0 : !u.isBought) && !u.config.pelleOnly);
      this.currLog10EP = player.eternityPoints.log10();
      this.cheapestLog10TD = Math.min(...TimeDimensions.all.map(x => x.cost.log10()));
      this.multEPLog10Cost = EternityUpgrade.epMult.cost.log10();
      this.purchasableTS = NormalTimeStudyState.studies.countWhere(s => s && s.canBeBought && !s.isBought);
      this.hasDilated = Perk.startTP.canBeApplied ? player.dilation.lastEP.gt(0)
        : player.dilation.tachyonParticles.gt(0);
      this.availableCharges = Ra.chargesLeft;
    },
    clicked() {
      if (!this.canBeExpanded) return;
      this.isExpanded = !this.isExpanded;
    },
  }
};
</script>

<template>
  <div
    v-if="isVisible"
    :class="realityReminderClass"
    :style="styleObject"
    @click="clicked"
  >
    <span v-if="!canReality">
      Вы ещё не разблокировали реальность в Древе Исследований.
    </span>
    <span v-else-if="suggestions.length === 0">
      Вы совершили все необходимые действия для максимизации наград и готовы совершить реальность!
    </span>
    <span v-else>
      <i :class="dropDownIconClass" />
      Есть {{ quantifyInt("действие", suggestions.length) }},
      что вам рекомендуется совершить в текущей реальности {{ clickText }}:
      <div
        v-if="isExpanded"
        class="l-suggestions"
      >
        <br>
        <div
          v-for="suggestion in suggestions"
          :key="suggestion"
        >
          {{ suggestion }}
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.l-suggestions {
  font-size: 1rem;
}

.c-reality-reminder-pointer {
  cursor: pointer;
}
</style>
