<script>
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "AlchemyResourceInfo",
  components: {
    EffectDisplay
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: 0,
      cap: 0,
      capped: false,
      flow: 0,
      isReactionActive: false,
      reactionProduction: 0,
      isUnlocked: false,
      unlockRequirement: ""
    };
  },
  computed: {
    classObject() {
      return {
        "c-alchemy-resource-info": true,
        "c-alchemy-resource-info--locked": !this.isUnlocked
      };
    },
    divisibleByThree() {
      return this.reaction.reagents.every(r => r.cost % 3 === 0);
    },
    reaction() {
      return this.resource.reaction;
    },
    isBaseResource() {
      return this.resource.isBaseResource;
    },
    reactionText() {
      if (this.resource === AlchemyResource.reality) return this.realityReactionText;
      const reagents = this.reaction.reagents
        .map(r => `${this.formatCoefficient(this.divisibleByThree ? r.cost * 2 / 3 : r.cost * 2)}${r.resource.symbol}`)
        .join(" + ");
      return `${reagents} ➜ ${this.formatCoefficient(this.divisibleByThree ? 1 : 3)}${this.resource.symbol}`;
    },
    realityReactionText() {
      const reagents = this.reaction.reagents
        .map(r => r.resource.symbol)
        .join(" + ");
      return `${reagents} ➜ ${this.resource.symbol} (на эту реакцию не влияет Синергия)`;
    },
    effectConfig() {
      const resource = this.resource;
      return {
        effect: () => resource.effectValue,
        formatEffect: resource.config.formatEffect
      };
    },
    resourceAmount() {
      return formatFloat(this.amount, 1);
    },
    resourceCap() {
      return formatFloat(this.cap, 1);
    },
    formattedFlow() {
      const sign = this.flow >= 0 ? "+" : "-";
      if (Math.abs(this.flow) < 0.01) return "Нет";
      const resourceText = `${sign}${format(Math.abs(this.flow), 2, 2)}/с`;
      const color = this.flow > 0 ? "9CCC65" : "CC6666";
      return `<span style="color:#${color}">${resourceText}</span>`;
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      const resource = this.resource;
      this.amount = resource.amount;
      this.cap = resource.cap;
      this.capped = resource.capped;
      this.flow = resource.flow;
      this.isUnlocked = resource.isUnlocked;
      this.unlockRequirement = resource.lockText;
      if (!this.isBaseResource) {
        this.isReactionActive = !this.isDoomed && this.reaction.isActive;
        this.reactionProduction = this.reaction.reactionProduction;
      }
    },
    formatCoefficient(x) {
      return x === 1 ? "" : formatInt(x);
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    :class="classObject"
  >
    <span class="c-alchemy-resource-info__title">
      {{ resource.symbol }} {{ resource.name }} {{ resource.symbol }}
    </span>
    <span v-if="isDoomed">
      Разрушено Пеллем
    </span>
    <span v-else>
      {{ capped ? "Ограничено" : "Количество" }}: {{ resourceAmount }}/{{ resourceCap }}
      (Недавнее изменение: <span v-html="formattedFlow" />)
    </span>
    <span v-if="isBaseResource">Основной ресурс</span>
    <span v-else>Реакция: {{ isReactionActive ? "включена" : "отключена" }} ({{ reactionText }})</span>
    <span :class="{ 'o-pelle-disabled': isDoomed }">
      <EffectDisplay
        label="Эффект"
        :config="effectConfig"
      />
    </span>
  </div>
  <div
    v-else
    :class="classObject"
  >
    Требование разблокировки: {{ unlockRequirement }}
  </div>
</template>

<style scoped>

</style>
