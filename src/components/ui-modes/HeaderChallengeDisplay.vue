<script>
import FailableEcText from "./FailableEcText";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HeaderChallengeDisplay",
  components: {
    FailableEcText,
    PrimaryButton
  },
  data() {
    return {
      activityTokens: [],
      infinityUnlocked: false,
      showExit: false,
      exitText: "",
      resetCelestial: false,
      inPelle: false
    };
  },
  computed: {
    parts() {
      // We need activityToken for NC/IC/EC because plain check of WhateverChallenge.isRunning
      // won't trigger display update if we, say, switch from one challenge to another
      function celestialReality(celestial, name, tab) {
        return {
          name: () => `в Реальности ${name}`,
          isActive: token => token,
          activityToken: () => celestial.isRunning,
          tabName: () => tab,
        };
      }
      return [
        {
          name: token => `${this.numberText(token)} Обычном Испытании`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.normal.current
        },
        {
          name: token => `${this.numberText(token)} Испытании Бесконечности`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.infinity.current
        },
        {
          name: token => `${this.numberText(token)} Испытании Вечности`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.eternity.current
        },
        {
          name: () => "в Замедлении Времени",
          isActive: token => token,
          activityToken: () => player.dilation.active
        },
        celestialReality(Teresa, "Терезы", "teresa"),
        celestialReality(Effarig, "Эффарига", "effarig"),
        celestialReality(Enslaved, "Безымянных", "enslaved"),
        celestialReality(V, "Ви", "v"),
        celestialReality(Ra, "Ра", "ra"),
        celestialReality(Laitela, "Лайтелы", "laitela"),
        {
          name: () => "в Обречённой Реальности. Удачи",
          isActive: token => token,
          activityToken: () => this.inPelle
        }
      ];
    },
    activeChallengeNames() {
      const names = [];
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        if (part.name(token).includes("Испытании Вечности")) {
          const currEC = player.challenge.eternity.current;
          const nextCompletion = EternityChallenge(currEC).completions + 1;
          let completionText = "";
          if (Enslaved.isRunning && currEC === 1) {
            completionText = `(${formatInt(nextCompletion)}/???)`;
          } else if (nextCompletion === 6) {
            completionText = `(уже выполнено)`;
          } else {
            completionText = `(${formatInt(nextCompletion)}/${formatInt(5)})`;
          }
          names.push(`${part.name(token)} ${completionText}`);
        } else {
          names.push(part.name(token));
        }
      }
      return names;
    },
    isVisible() {
      return this.infinityUnlocked || this.activeChallengeNames.length > 0;
    },
    challengeDisplay() {
      if (this.activeChallengeNames.length === 0) {
        return "вне всех испытаний";
      }
      return this.activeChallengeNames.join(" ");
    }
  },
  methods: {
    update() {
      this.infinityUnlocked = PlayerProgress.infinityUnlocked();
      this.activityTokens = this.parts.map(part => part.activityToken());
      // Dilation in Pelle can't be left once entered, but we still want to allow leaving more nested challenges
      this.showExit = this.activeChallengeNames.length > this.inPelle * (1 + player.dilation.active);
      this.exitText = this.exitDisplay();
      this.resetCelestial = player.options.retryCelestial;
      this.inPelle = Pelle.isDoomed
      this.isInFailableEC = [4, 12].includes(player.challenge.eternity.current);
    },
    // Process exit requests from the inside out; Challenges first, then dilation, then Celestial Reality. If the
    // relevant option is toggled, we pass a bunch of information over to a modal - otherwise we immediately exit
    exitButtonClicked() {
      let names, clickFn;
      const isEC = Player.anyChallenge instanceof EternityChallengeState;

      // Dilation and ECs can't be exited independently and we have a special dilation-exit modal, so we have
      // to treat that particular case differently. The dilation modal itself will account for EC state
      if (player.dilation.active && (!Player.isInAnyChallenge || isEC)) {
        if (player.options.confirmations.dilation) Modal.exitDilation.show();
        else startDilatedEternityRequest();
        return;
      }

      if (Player.isInAnyChallenge) {
        // Regex replacement is used to remove the "(X/Y)" which appears after ECs. The ternary statement is there
        // because this path gets called for NCs, ICs, and ECs
        const toExit = this.activeChallengeNames[0].replace(/ \(..5\)|в |во /gu, "").replaceAll("м", "е").replace("ии", "ие");
        names = { chall: toExit, normal: isEC ? "вечности" : "бесконечности" };
        clickFn = () => {
          const oldChall = Player.anyChallenge;
          Player.anyChallenge.exit(false);
          if (player.options.retryChallenge) oldChall.requestStart();
        };
      } else {
        names = { chall: this.activeChallengeNames[0].replace("в ", "").replace("и", "ь"), normal: "реальности" };
        clickFn = () => beginProcessReality(getRealityProps(true));
      }

      if (player.options.confirmations.exitChallenge) {
        Modal.exitChallenge.show(
          {
            challengeName: names.chall,
            normalName: names.normal,
            hasHigherLayers: this.activeChallengeNames.length > 1,
            exitFn: clickFn
          }
        );
      } else {
        clickFn();
      }
    },
    // Bring the player to the tab related to the innermost challenge
    textClicked() {
      if (this.activeChallengeNames.length === 0) return;

      // Iterating back-to-front and breaking ensures we get the innermost restriction
      let fullName = "", celestial = "";
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        fullName = part.name(token);
        celestial = part.tabName?.();
        break;
      }

      // Normal challenges are matched with an end-of-string metacharacter
      if (fullName.match("Обычном Испытании")) Tab.challenges.normal.show(true);
      else if (fullName.match("Испытании Бесконечности")) Tab.challenges.infinity.show(true);
      else if (fullName.match("Испытании Вечности")) Tab.challenges.eternity.show(true);
      else if (player.dilation.active) Tab.eternity.dilation.show(true);
      else if (this.inPelle) Tab.celestials.pelle.show(true);
      else Tab.celestials[celestial].show(true);
    },
    exitDisplay() {
      if (Player.isInAnyChallenge) return player.options.retryChallenge ? "Перезапустить Испытание" : "Покинуть Испытание";
      if (player.dilation.active) return "Выйти из Замедления";
      if (this.resetCelestial) return "Перезапустить Реальность";
      return "Покинуть Реальность";
    },
    textClassObject() {
      return {
        "l-challenge-display": true,
        "l-challenge-display--clickable": this.activeChallengeNames.length !== 0,
      };
    },
    numberText(id) {
      return `${id === 2 ? "во" : "в"} ${id}-м`;
    }
  },
};
</script>

<template>
  <div
    v-if="isVisible"
    class="l-game-header__challenge-text"
  >
    <span
      :class="textClassObject()"
      @click="textClicked"
    >
      Вы {{ challengeDisplay }}.
    </span>
    <FailableEcText v-if="isInFailableEC" />
    <span class="l-padding-line" />
    <PrimaryButton
      v-if="showExit"
      @click="exitButtonClicked"
    >
      {{ exitText }}
    </PrimaryButton>
  </div>
</template>

<style scoped>
.l-game-header__challenge-text {
  display: flex;
  height: 2rem;
  top: 50%;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  margin: 0.5rem;
}

.l-challenge-display {
  padding: 0.5rem;
  cursor: default;
}

.l-challenge-display--clickable {
  cursor: pointer;
  user-select: none;
}

.l-challenge-display--clickable:hover {
  text-decoration: underline;
}

.l-padding-line {
  padding: 0.3rem;
}
</style>
