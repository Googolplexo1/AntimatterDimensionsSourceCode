"use strict";

Vue.component("challenge-box", {
  props: {
    name: String,
    isUnlocked: false,
    isRunning: false,
    isCompleted: false,
    canBeUnlocked: false,
    overrideLabel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isEC: false,
      challengeId: Number,
    };
  },
  computed: {
    update() {
      this.isEC = this.name.startsWith("EC");
      this.inC1 = this.name === "C1" && !this.isCompleted && !Player.isInAntimatterChallenge;
    },
    buttonClassObject() {
      const challengeDone = this.isCompleted && ((this.isUnlocked && !this.isEC) || (!this.isUnlocked && this.isEC));
      const classObject = {
        "o-challenge-btn": true
      };
      if (this.isRunning || this.inC1) {
        classObject["o-challenge-btn--running"] = true;
      } else if (challengeDone) {
        classObject["o-challenge-btn--completed"] = true;
      } else if (this.isCompleted && this.isUnlocked && this.isEC) {
        classObject["o-challenge-btn--redo"] = true;
      } else if (this.isUnlocked || this.canBeUnlocked) {
        classObject["o-challenge-btn--unlocked"] = true;
      } else {
        classObject["o-challenge-btn--locked"] = true;
      }
      // ECs can be not unlocked and also not locked, because they're fully completed,
      // but in that case you can't enter them and so it's important to give them a property
      // that disables cursor on hover. The same thing happens with challenges that are running,
      // of any type, and with Challenge 1.
      classObject["o-challenge-btn--unenterable"] = challengeDone || !(this.isUnlocked || this.canBeUnlocked) ||
        this.isRunning || this.name === "C1";
      return classObject;
    },
    buttonText() {
      if (this.overrideLabel.length) return this.overrideLabel;
      if (this.isRunning || this.inC1) return "Running";
      if (this.isCompleted) {
        if (this.isEC && this.isUnlocked) return "Redo";
        return "Completed";
      }
      if (this.isUnlocked) return "Start";
      if (this.isEC && this.canBeUnlocked) return "Unlock";
      return "Locked";
    }
  },
  template:
    `<div class="c-challenge-box l-challenge-box">
      <hint-text type="challenges" class="l-hint-text--challenge">{{name}}</hint-text>
      <slot name="top" />
      <div class="l-challenge-box__fill" />
      <button
        :class="buttonClassObject"
        @click="$emit('start')"
      >{{buttonText}}</button>
      <slot name="bottom" />
    </div>`
});
