<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ChangeNameModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      input: "",
      actualName: ""
    };
  },
  created() {
    this.input = player.speedrun.name;
    this.actualName = Speedrun.generateName(this.input);
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    updateName() {
      this.actualName = Speedrun.generateName(this.input);
    },
    confirmChange() {
      player.speedrun.name = this.actualName;
      this.emitClose();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="confirmChange">
    <template #header>
      Изменить ваше имя игрока
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup="updateName"
      @keyup.enter="confirmChange"
      @keyup.esc="emitClose"
    >
    <i>
      Имя больше не сможет быть изменено, как только запустится таймер, и его длина не может превышать {{ formatInt(40) }} символов.
    </i>
    <div>
      Ваше новое имя: {{ actualName }}
    </div>
    <template #confirm-text>
      Изменить имя
    </template>
  </ModalWrapperChoice>
</template>
