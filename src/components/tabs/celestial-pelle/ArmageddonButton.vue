<script>
export default {
  name: "ArmageddonButton",
  props: {
    isHeader: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      remnantsGain: 0,
      realityShardGain: new Decimal(0),
      nextRealityShardGain: new Decimal(0),
      canArmageddon: false,
    };
  },
  computed: {
    remnants() {
      return pluralize("Останок", this.remnantsGain);
    },
    remnantGain() {
      return format(this.remnantsGain, 2);
    },
    buttonClassObject() {
      return {
        "c-armageddon-button": true,
        "l-armageddon-button": !this.isHeader,
        "l-reality-button": this.isHeader,
        "l-armageddon-button--header": this.isHeader,
        "c-armageddon-button--unavailable": !this.canArmageddon
      };
    }
  },
  methods: {
    update() {
      this.remnantsGain = Pelle.remnantsGain;
      this.realityShardGain.copyFrom(Pelle.realityShardGainPerSecond);
      this.nextRealityShardGain.copyFrom(Pelle.nextRealityShardGain);
      this.canArmageddon = Pelle.canArmageddon;
    },
    manualArmageddon() {
      if (!this.canArmageddon) return;

      if (player.options.confirmations.armageddon) Modal.armageddon.show();
      else Pelle.armageddon(true);
    }
  }
};
</script>

<template>
  <button
    :class="buttonClassObject"
    @click="manualArmageddon"
  >
    <span v-if="isHeader">Нельзя выйти из Обречённой Реальности!<br></span>
    <span class="c-remnant-gain-display">
      Совершить армагеддон за
      <span class="c-remnant-gain">{{ remnantGain }}</span>
      {{ remnants }}
    </span>
    <br>
    Производство Осколков Реальности:
    <span class="c-reality-shard-gain">{{ format(realityShardGain, 2, 2) }}</span>/с ➜
    <span class="c-reality-shard-gain">{{ format(nextRealityShardGain, 2, 2) }}</span>/с
  </button>
</template>

<style scoped>
.c-armageddon-button {
  display: block;
  font-family: Typewriter;
  color: var(--color-text);
  background: var(--color-text-inverted);
  border: 0.1rem solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
}

.s-base--metro .c-armageddon-button {
  box-shadow: 0.1rem 0.1rem 0.1rem 0 #9e9e9e;
}

.l-armageddon-button {
  width: 100%;
  padding: 1.5rem;
}

.l-armageddon-button--header {
  font-size: 1rem;
  font-weight: bold;
  padding: 0rem;
}

.c-armageddon-button:hover {
  box-shadow: 0.1rem 0.1rem 0.5rem var(--color-pelle--base);
  transition-duration: 0.12s;
  cursor: pointer;
}

.c-armageddon-button--unavailable {
  opacity: 0.5;
  cursor: default !important;
}

.c-remnant-gain {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-pelle--base);
}

.c-remnant-gain-display {
  vertical-align: middle;
}

.c-reality-shard-gain {
  font-weight: bold;
  color: var(--color-pelle--base);
}
</style>
