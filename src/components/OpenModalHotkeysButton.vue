<script>
export default {
  name: "OpenModalHotkeysButton",
  methods: {
    handleClick() {
      Modal.hotkeys.show();
    }
  }
};
</script>

<template>
  <p
    class="c-options-tab__hotkeys-link"
    @click="handleClick"
  >
    Нажмите <kbd>?</kbd>, чтобы просмотреть список горячих клавиш.
  </p>
</template>
