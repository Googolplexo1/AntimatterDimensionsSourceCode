<script>
export default {
  name: "EnterCelestialsRaPet",
  props: {
    petId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      isUnlocked: false,
    };
  },
  computed: {
    pet() {
      return Ra.pets.all[this.petId];
    },
    name() {
      return this.pet.nameNormal;
    },
    color() {
      return `color: ${this.pet.color}`;
    },
    gainText() {
      let endings = ["", "е"];
      if (this.pet.id === "enslaved") endings = ["ы", "ю"];
      if (this.pet.id === "teresa") endings = ["а", "е"];
      return this.pet.level === 25
        ? `полностью восстановлен${endings[0]} в памяти`
        : `получа${endings[1]}т Куски Памяти в зависимости от ${this.chunkGain}`;
    },
    chunkGain() {
      return this.pet.chunkGain;
    },
  },
  methods: {
    update() {
      this.isUnlocked = this.pet.isUnlocked;
    }
  },
};
</script>

<template>
  <span
    v-if="isUnlocked"
    :style="color"
  >
    {{ name }} {{ gainText }}.
    <br>
  </span>
</template>
