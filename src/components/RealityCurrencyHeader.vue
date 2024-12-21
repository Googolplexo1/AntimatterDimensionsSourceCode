<script>
export default {
  name: "RealityCurrencyHeader",
  data() {
    return {
      isDoomed: false,
      currencyValue: new Decimal(),
      currencyName: "",
      im: new Decimal(),
      showIM: false,
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.im = format(Currency.imaginaryMachines.value, 2, 2);
      this.showIM = Currency.imaginaryMachines.value && !this.isDoomed;
      if (this.isDoomed) {
        const shards = Currency.realityShards.value;
        this.currencyValue = format(shards, 2);
        this.currencyName = "Осколка";
      } else {
        const rm = Currency.realityMachines.value;
        this.currencyValue = format(rm, 2);
        this.currencyName = pluralize("Машина", rm);
      }
    },
    resourceClass() {
      return {
        "c-reality-tab__reality-machines": true,
        "c-shard-color": this.isDoomed
      };
    }
  }
};
</script>

<template>
  <div class="c-reality-currency">
    У вас
    <b :class="resourceClass()">
      {{ currencyValue }}
    </b>
    {{ currencyName }} Реальности.
    <br>
    <span v-if="showIM">
      У вас
      <b :class="resourceClass()">
        {{ im }}
      </b>
      Мнимой Машины.
    </span>
  </div>
</template>

<style scoped>
.c-reality-currency {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.c-shard-color {
  color: var(--color-pelle--base);
}
</style>
