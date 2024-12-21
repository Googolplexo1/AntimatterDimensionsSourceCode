<script>
export default {
  name: "SpeedrunMilestoneSingle",
  props: {
    milestone: {
      type: Object,
      required: true
    },
    display: {
      type: Boolean,
      required: false,
      default: false,
    },
    time: {
      type: Number,
      required: false,
      default: 0,
    }
  },
  computed: {
    displayName() {
      return this.display ? this.milestone.name : "???";
    },
    timeDisplay() {
      return this.time
        ? `Достигнуто за ${TimeSpan.fromMilliseconds(this.time).toStringShort(true, true)}`
        : "Ещё не достигнуто";
    },
    classObject() {
      return {
        "l-speedrun-milestone-entry": true,
        "l-speedrun-milestone-entry--completed": this.time
      };
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <b>{{ displayName }}</b>
    {{ timeDisplay }}
  </div>
</template>
