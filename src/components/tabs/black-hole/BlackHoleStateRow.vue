<script>
export default {
  name: "BlackHoleStateRow",
  props: {
    blackHole: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isPermanent: false,
      isActive: false,
      isCharged: false,
      nextChange: "",
      state: "",
    };
  },
  computed: {
    description() {
      return this.blackHole.description();
    },
    id() {
      return this.blackHole.id;
    }
  },
  methods: {
    update() {
      const { blackHole } = this;
      this.isUnlocked = blackHole.isUnlocked;
      if (!this.isUnlocked) return;
      this.isPermanent = blackHole.isPermanent;
      this.isActive = blackHole.isActive;
      this.isCharged = blackHole.isCharged;
      this.nextChange = TimeSpan.fromSeconds(blackHole.timeWithPreviousActiveToNextStateChange).toStringShort();
      this.state = blackHole.displayState;
    }
  }
};
</script>

<template>
  <h3 v-if="isUnlocked">
    Состояние {{ description }}:
    <template v-if="isPermanent">
      действует беспрерывно
    </template>
    <template v-else-if="isActive">
      действует ({{ nextChange }} осталось)
    </template>
    <template v-else-if="id === 2 && isCharged">
      готова (активируется вместе с 1-й Чёрной Дырой через {{ nextChange }})
    </template>
    <template v-else>
      бездействует ({{ nextChange }} осталось)
    </template>
  </h3>
</template>

<style scoped>

</style>
