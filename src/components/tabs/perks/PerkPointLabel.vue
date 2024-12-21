<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PerkPointLabel",
  components: {
    PrimaryButton
  },
  data() {
    return {
      pp: 0,
      treeLayout: 0,
      physicsEnabled: false,
      physicsOverride: false,
    };
  },
  computed: {
    layoutText() {
      return PerkLayouts[this.treeLayout].buttonText;
    },
    physicsText() {
      return (this.physicsOverride ?? this.physicsEnabled) ? "ВКЛ." : "ВЫКЛ.";
    }
  },
  created() {
    this.treeLayout = player.options.perkLayout;
    this.physicsOverride = PerkLayouts[this.treeLayout].forcePhysics;
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
      this.physicsEnabled = player.options.perkPhysicsEnabled;
    },
    togglePhysics() {
      if (this.physicsOverride !== undefined) return;
      player.options.perkPhysicsEnabled = !player.options.perkPhysicsEnabled;
      PerkNetwork.setPhysics(player.options.perkPhysicsEnabled);
    },
    physicsClassObject() {
      return {
        "o-primary-btn c-button-physics": true,
        "o-primary-btn--disabled": this.physicsOverride !== undefined
      };
    },
    centerTree() {
      PerkNetwork.resetPosition(true);
    },
    straightenEdges() {
      PerkNetwork.setEdgeCurve(false);
      PerkNetwork.setEdgeCurve(true);
    },
    cycleLayout() {
      // Step forward once, but if this lands us on a locked layout, keep stepping until it doesn't
      let newIndex = (player.options.perkLayout + 1) % PerkLayouts.length;
      while (!(PerkLayouts[newIndex].isUnlocked?.() ?? true)) {
        newIndex = (newIndex + 1) % PerkLayouts.length;
      }

      player.options.perkLayout = newIndex;
      this.treeLayout = newIndex;
      this.physicsOverride = PerkLayouts[this.treeLayout].forcePhysics;
      PerkNetwork.currentLayout = PerkLayouts[this.treeLayout];
      PerkNetwork.setPhysics(player.options.perkPhysicsEnabled);
      PerkNetwork.moveToDefaultLayoutPositions(this.treeLayout);
    }
  }
};
</script>

<template>
  <div class="c-perk-tab__header">
    У вас <span class="c-perk-tab__perk-points">{{ format(pp, 2) }}</span> {{ pluralize("Очко", pp) }} Умения.
    <br>
    Навыки невозможно сбросить.
    <br>
    Квадратные Навыки при покупке дают Очки Автоматизации.
    <br>
    <div class="perk-settings">
      <PrimaryButton
        class="o-primary-btn c-button-perk-layout"
        @click="cycleLayout"
      >
        Конфигурация древа: {{ layoutText }}
      </PrimaryButton>
      <PrimaryButton
        :class="physicsClassObject()"
        @click="togglePhysics"
      >
        Физика: {{ physicsText }}
      </PrimaryButton>
      <br>
      <PrimaryButton
        class="o-primary-btn"
        @click="centerTree"
      >
        Переместить древо с Навыком СТАРТ в центре
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn"
        @click="straightenEdges"
      >
        Выпрямить рёбра
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.perk-settings > button {
  margin-right: 1rem;
}

.c-button-perk-layout {
  width: 40rem;
  margin-bottom: 1rem;
}

.c-button-physics {
  width: 27rem;
  margin-bottom: 1rem;
}
</style>
