<script>
export default {
  name: "NewGame",
  data() {
    return {
      opacity: 0,
      visible: false,
      hasMoreCosmetics: false,
      selectedSetName: "",
    };
  },
  computed: {
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    }
  },
  methods: {
    update() {
      this.visible = GameEnd.endState > END_STATE_MARKERS.SHOW_NEW_GAME && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.SHOW_NEW_GAME) * 2;
      this.hasMoreCosmetics = GlyphAppearanceHandler.lockedSets.length > 0;
      this.selectedSetName = GlyphAppearanceHandler.chosenFromModal?.name ?? "Нет (будет выбран случайно)";
    },
    startNewGame() {
      NG.startNewGame();
    },
    openSelectionModal() {
      Modal.cosmeticSetChoice.show();
    }
  }
};
</script>

<template>
  <div
    class="c-new-game-container"
    :style="style"
  >
    <h2>
      Сбросить всю игру, кроме программ для Автоматизатора, сохранённых Древ, разблокированных секретных тем и достижений
      и Глифа-компаньона.
    </h2>
    <h3>Вы можете просмотреть игру в её текущем состоянии, нажав кнопку в правом верхнем углу.</h3>
    <div class="c-new-game-button-container">
      <button
        class="c-new-game-button"
        @click="startNewGame"
      >
        Начать заново?
      </button>
    </div>
    <br>
    <h3 v-if="hasMoreCosmetics">
      В честь завершения игры вы получаете новый косметический набор глифов по вашему выбору. Вы сможете свободно настраивать
      внешний вид глифов, когда вы вновь достигнете реальности, но это никак не отразится собственно на геймплее.
      <br>
      <button
        class="c-new-game-button"
        @click="openSelectionModal"
      >
        Выбрать косметический набор
      </button>
      <br>
      <br>
      Выбрано: {{ selectedSetName }}
    </h3>
    <h3 v-else>
      Вы уже разблокировали все наборы глифов!
    </h3>
    <br>
    <h3>
      Вы также можете импортировать "спидран", чтобы перезапустить игру с дополнительной отслежкой скорости вашего прогресса.
    </h3>
  </div>
</template>

<style scoped>
.c-new-game-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.t-s12 .c-new-game-container {
  color: white;
}

.c-new-game-button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.c-new-game-button {
  font-family: Typewriter;
  background: grey;
  border: black;
  border-radius: var(--var-border-radius, 0.5rem);
  margin-top: 1rem;
  padding: 1rem;
  cursor: pointer;
}
</style>
