<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import SingularityMilestoneComponent from "@/components/tabs/celestial-laitela/SingularityMilestoneComponent";

export default {
  name: "SingularityMilestonesModal",
  components: {
    SingularityMilestoneComponent,
    ModalWrapper,
  },
  data() {
    return {
      milestones: [],
      resourceVal: 0,
      sortVal: 0,
      completedVal: 0,
      orderVal: 0,
      milestoneGlow: false,
    };
  },
  computed: {
    resourceStr() {
      const states = ["Сингулярностях", "Сжатиях", "Оставшемся времени при сжатии вручную", "Оставшемся времени при автоматическом сжатии"];
      return states[this.resourceVal];
    },
    sortStr() {
      const states = ["Оставшимся Сингулярностям", "Количеству выполнений", "Доле от завершения",
        "Сингулярностям для завершения", "Порядку получения"];
      return states[this.sortVal];
    },
    completedStr() {
      const states = ["В начало", "В конец", "Без изменений"];
      return states[this.completedVal];
    },
    orderStr() {
      const states = ["Возрастающий", "Убывающий"];
      return states[this.orderVal];
    },
  },
  watch: {
    resourceVal(newValue) {
      player.celestials.laitela.singularitySorting.displayResource = newValue;
    },
    sortVal(newValue) {
      player.celestials.laitela.singularitySorting.sortResource = newValue;
    },
    completedVal(newValue) {
      player.celestials.laitela.singularitySorting.showCompleted = newValue;
    },
    orderVal(newValue) {
      player.celestials.laitela.singularitySorting.sortOrder = newValue;
    },
    milestoneGlow(newValue) {
      player.celestials.laitela.milestoneGlow = newValue;
    },
  },
  beforeDestroy() {
    player.celestials.laitela.lastCheckedMilestones = Currency.singularities.value;
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.sortedForCompletions(true);
      const settings = player.celestials.laitela.singularitySorting;
      this.resourceVal = settings.displayResource;
      this.sortVal = settings.sortResource;
      this.completedVal = settings.showCompleted;
      this.orderVal = settings.sortOrder;
      this.milestoneGlow = player.celestials.laitela.milestoneGlow;
    },
    cycleButton(id) {
      const settings = player.celestials.laitela.singularitySorting;
      let stateCount;
      switch (id) {
        case 0:
          stateCount = Object.keys(SINGULARITY_MILESTONE_RESOURCE).length;
          settings.displayResource = (settings.displayResource + 1) % stateCount;
          break;
        case 1:
          stateCount = Object.keys(SINGULARITY_MILESTONE_SORT).length;
          settings.sortResource = (settings.sortResource + 1) % stateCount;
          break;
        case 2:
          stateCount = Object.keys(COMPLETED_MILESTONES).length;
          settings.showCompleted = (settings.showCompleted + 1) % stateCount;
          break;
        case 3:
          stateCount = Object.keys(SORT_ORDER).length;
          settings.sortOrder = (settings.sortOrder + 1) % stateCount;
          break;
        default:
          throw new Error("Unrecognized Singularity milestone sorting button");
      }
    },
    glowOptionClass() {
      return {
        "c-modal__confirmation-toggle__checkbox": true,
        "c-modal__confirmation-toggle__checkbox--active": this.milestoneGlow
      };
    },
    toggleGlow() {
      this.milestoneGlow = !this.milestoneGlow;
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Этапы Сингулярностей
    </template>
    <div
      class="c-modal__confirmation-toggle"
      @click="toggleGlow"
    >
      <div :class="glowOptionClass()">
        <span
          v-if="milestoneGlow"
          class="fas fa-check"
        />
      </div>
      <span class="c-modal__confirmation-toggle__text">
        Включить подсветку кнопки при выполнении новых этапов
      </span>
    </div>
    <div class="l-singularity-milestone-modal-container-outer">
      <div class="l-singularity-milestone-modal-container-inner">
        <SingularityMilestoneComponent
          v-for="milestone in milestones"
          :key="milestone.id"
          :milestone="milestone"
        />
      </div>
    </div>
    <div class="l-singularity-milestone-sort-container">
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(0)"
      >
        Измерять расстояние до этапов в:
        <br>
        {{ resourceStr }}
      </button>
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(1)"
      >
        Сортировать по:
        <br>
        {{ sortStr }}
      </button>
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(2)"
      >
        Помесить завершённые этапы:
        <br>
        {{ completedStr }}
      </button>
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(3)"
      >
        Порядок:
        <br>
        {{ orderStr }}
      </button>
    </div>
  </ModalWrapper>
</template>
