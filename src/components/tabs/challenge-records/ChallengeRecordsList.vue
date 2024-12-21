<script>
export default {
  name: "ChallengeRecordsList",
  props: {
    names: {
      type: Array,
      required: true
    },
    start: {
      type: Number,
      required: true
    },
    times: {
      type: Array,
      required: true
    }
  },
  computed: {
    timeSum() {
      return this.times.sum();
    },
    completedAllChallenges() {
      return this.timeSum < Number.MAX_VALUE;
    }
  },
  methods: {
    timeDisplayShort
  }
};
</script>

<template>
  <div>
    <br>
    <div
      v-for="(time, i) in times"
      :key="i"
    >
      <span v-if="time < Number.MAX_VALUE">Рекорд {{ start + i }}-го {{ names[0] }}: {{ timeDisplayShort(time) }}</span>
      <span v-else>Вы ещё не выполнили {{ start + i }}-е {{ names[1] }}</span>
    </div>
    <br>
    <div v-if="completedAllChallenges">
      Сумма рекордов {{ names[2] }}: {{ timeDisplayShort(timeSum) }}
    </div>
    <div v-else>
      У вас есть невыполненное {{ names[1] }}.
    </div>
  </div>
</template>
