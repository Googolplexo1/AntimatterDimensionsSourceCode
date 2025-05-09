<script>
import { DC } from "@/core/constants";

import { BreakdownEntryInfo } from "./breakdown-entry-info";
import { getResourceEntryInfoGroups } from "./breakdown-entry-info-group";
import { PercentageRollingAverage } from "./percentage-rolling-average";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

// A few props are special-cased because they're base values which can be less than 1, but we don't want to
// show them as nerfs
const nerfBlacklist = ["IP_base", "EP_base", "TP_base"];

function padPercents(percents) {
  // Add some padding to percents to prevent text flicker
  // Max length is for "-100.0%"
  return percents.padStart(7, "\xa0");
}

export default {
  name: "MultiplierBreakdownEntry",
  components: {
    PrimaryToggleButton
  },
  props: {
    resource: {
      type: BreakdownEntryInfo,
      required: true,
    },
    higherEntries: {
      type: Array,
      required: false,
      default: () => [],
    },
    isRoot: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      selected: 0,
      percentList: [],
      averagedPercentList: [],
      showGroup: [],
      hadChildEntriesAt: [],
      mouseoverIndex: -1,
      lastNotEmptyAt: 0,
      dilationExponent: 1,
      isDilated: false,
      // This is used to temporarily remove the transition function from the bar styling when changing the way
      // multipliers are split up; the animation which results from not doing this looks very awkward
      lastLayoutChange: Date.now(),
      now: Date.now(),
      seenNC12: false,
    };
  },
  computed: {
    groups() {
      return getResourceEntryInfoGroups(this.resource.key);
    },
    /**
     * @returns {BreakdownEntryInfo[]}
     */
    entries() {
      return this.groups[this.selected].entries;
    },
    allEntries() {
      return this.resource.isNotARealThing ? this.entries.concat(this.higherEntries) : this.entries;
    },
    rollingAverage() {
      return new PercentageRollingAverage();
    },
    containerClass() {
      return {
        "c-multiplier-entry-container": true,
        "c-multiplier-entry-root-container": this.isRoot,
      };
    },
    isEmpty() {
      return !this.isRecent(this.lastNotEmptyAt);
    },
    disabledText() {
      if (!this.resource.isBase) return `Эффект не действует, отключён или равен ${formatX(1)}`;
      return Decimal.eq(this.resource.mult, 0)
        ? `Вы не можете получить эту валюту (требование престижа не выполнено)`
        : `У вас нет множителей к получению этой валюты (вы получите ${format(1)} единицу на сбросе)`;
    },
  },
  created() {
    if (this.groups.length > 1 && player.options.multiplierTab.showAltGroup) {
      this.changeGroup();
    }
  },
  methods: {
    update() {
      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i];
        entry.update();
        const hasChildEntries = getResourceEntryInfoGroups(this.neutralize(entry).key)
          .some(group => group.hasVisibleEntries);
        if (hasChildEntries) {
          this.hadChildEntriesAt[i] = Date.now();
        }
      }
      this.dilationExponent = this.resource.dilationEffect;
      this.isDilated = this.dilationExponent !== 1;
      this.calculatePercents();
      this.now = Date.now();
      this.seenNC12 = player.infinities.gte(16) || PlayerProgress.eternityUnlocked();
    },
    changeGroup() {
      this.selected = (this.selected + 1) % this.groups.length;
      player.options.multiplierTab.showAltGroup = this.selected === 1;
      this.showGroup = Array.repeat(false, this.entries.length);
      this.hadChildEntriesAt = Array.repeat(0, this.entries.length);
      this.lastLayoutChange = Date.now();
      this.rollingAverage.clear();
      this.update();
    },
    calculatePercents() {
      const log10Mult = (this.resource.fakeValue ?? this.resource.mult).log10();
      const isEmpty = log10Mult === 0;
      if (!isEmpty) {
        this.lastNotEmptyAt = Date.now();
      }
      const totalEffect = this.combineEffects(this.allEntries);
      let percentList = this.entries.map(entry => totalEffect.div(this.combineEffects(this.allEntries.filter(e => e !== entry))).log10());
      const unit = Math.max(percentList.filter(x => x >= 0).sum(), -percentList.filter(x => x < 0).sum());
      percentList = percentList ? percentList.map(x => x / unit) : [];
      this.percentList = percentList;
      this.rollingAverage.add(isEmpty ? undefined : percentList);
      this.averagedPercentList = this.rollingAverage.average;
    },
    styleObject(index) {
      const netPerc = this.averagedPercentList.map(perc => Math.abs(perc)).sum();
      const isNerf = this.averagedPercentList[index] < 0;
      const iconObj = this.entries[index].icon;
      const percents = this.averagedPercentList[index];
      const barSize = perc => (Math.abs(perc) / netPerc);
      return {
        position: "absolute",
        top: `${100 * this.averagedPercentList.slice(0, index).map(p => barSize(p)).sum()}%`,
        height: `${100 * barSize(percents)}%`,
        width: "100%",
        "transition-duration": this.isRecent(this.lastLayoutChange) ? undefined : "0.2s",
        border: percents === 0 ? "" : "0.1rem solid var(--color-text)",
        color: iconObj?.textColor ?? "black",
        background: isNerf
          ? `repeating-linear-gradient(-45deg, var(--color-bad), ${iconObj?.color} 0.8rem)`
          : iconObj?.color,
      };
    },
    singleEntryClass(index) {
      return {
        "c-single-entry": true,
        "c-single-entry-highlight": this.mouseoverIndex === index,
      };
    },
    shouldShowEntry(entry) {
      return entry.data.isVisible || this.isRecent(entry.data.lastVisibleAt);
    },
    barSymbol(index) {
      return this.entries[index].icon?.symbol ?? null;
    },
    hasChildEntries(index) {
      return this.isRecent(this.hadChildEntriesAt[index]);
    },
    expandIcon(index) {
      return this.showGroup[index] ? "far fa-minus-square" : "far fa-plus-square";
    },
    expandIconStyle(index) {
      return {
        opacity: this.hasChildEntries(index) ? 1 : 0
      };
    },
    entryString(index) {
      const percents = this.percentList[index];
      if (percents < 0 && !nerfBlacklist.includes(this.entries[index].key)) {
        return this.nerfString(index);
      }

      // We want to handle very small numbers carefully to distinguish between "disabled/inactive" and
      // "too small to be relevant"
      let percString;
      if (percents === 0) percString = formatPercents(0);
      else if (percents === 1) percString = formatPercents(1);
      else if (percents < 0.001) percString = `<${formatPercents(0.001, 1)}`;
      else if (percents > 0.9995) percString = `~${formatPercents(1)}`;
      else percString = formatPercents(percents, 1);
      percString = padPercents(percString);

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const entry = this.entries[index];
      if (!entry.data.isVisible) {
        return `${percString}: ${entry.name}`;
      }
      const overrideStr = entry.displayOverride;
      let valueStr;
      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];
        const formatFn = x => {
          const isDilated = entry.isDilated;
          if (isDilated && this.dilationExponent !== 1) {
            const undilated = this.applyDilationExp(x, 1 / this.dilationExponent);
            return `${formatX(undilated, 2, 2)} ➜ ${formatX(x, 2, 2)}`;
          }
          return entry.isBase
            ? format(x, 2, 2)
            : formatX(x, 2, 2);
        };
        if (Decimal.neq(entry.data.mult, 1)) values.push(formatFn(entry.data.mult.pow(entry.dimCount)));
        if (entry.data.pow !== 1) values.push(formatPow(entry.data.pow, 2, 3));
        valueStr = values.length === 0 ? "" : `(${values.join(", ")})`;
      }

      return `${percString}: ${entry.name} ${valueStr}`;
    },
    nerfString(index) {
      const entry = this.entries[index];
      const percString = padPercents(formatPercents(this.percentList[index], 1));

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const overrideStr = entry.displayOverride;
      let valueStr;
      const formatFn = entry.isBase
        ? x => format(x, 2, 2)
        : x => `/${format(x.reciprocal(), 2, 2)}`;

      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];
        if (Decimal.neq(entry.data.mult, 1)) values.push(formatFn(entry.data.mult.pow(entry.dimCount)));
        if (entry.data.pow !== 1) values.push(formatPow(entry.data.pow, 2, 3));
        valueStr = values.length === 0 ? "" : `(${values.join(", ")})`;
      }

      return `${percString}: ${entry.name} ${valueStr}`;
    },
    totalString() {
      const resource = this.resource;
      const name = resource.name;
      const overrideStr = resource.displayOverride;
      if (overrideStr) return `${name}: ${overrideStr}`;

      const val = resource.mult.pow(resource.dimCount);
      return resource.isBase
        ? `${name}: ${format(val, 2, 2)}`
        : `${name}: ${formatX(val, 2, 2)}`;
    },
    applyDilationExp(value, exp) {
      return Decimal.pow10(value.log10() ** exp);
    },
    dilationString() {
      const resource = this.resource;
      const gamespeed = this.entries.find(entry => entry.name === "Скорость игры");
      const value = gamespeed ? gamespeed.data.mult : 1;
      const baseMult = resource.mult.div(value);

      let beforeMult = this.applyDilationExp(baseMult, 1 / this.dilationExponent).times(value).pow(resource.dimCount);
      let afterMult = baseMult.times(value).pow(resource.dimCount);

      const formatFn = resource.isBase
        ? x => format(x, 2, 2)
        : x => formatX(x, 2, 2);
      return `Замедление: десятичный логарифм возведён в степень ${format(this.dilationExponent, 2, 3)}
        (${formatFn(beforeMult, 2, 2)} ➜ ${formatFn(afterMult, 2, 2)})`;
    },
    isRecent(date) {
      return (this.now - date) < 200;
    },
    combineEffects(entryList) {
      return entryList.filter(entry => entry.ignoresNerfPowers).reduce((x, y) => x.times(y.data.mult.pow(y.dimCount)),
        entryList.reduce((x, y) => x.pow(y.data.pow),
        entryList.filter(entry => !entry.ignoresNerfPowers).reduce((x, y) => x.times(y.data.mult.pow(y.dimCount)), DC.D1)));
    },
    neutralize(entry) {
      const k = entry.key;
      return new BreakdownEntryInfo(k.includes("speed_total") ? k.slice(0, 15) : k);
    }
  },
};
</script>

<template>
  <div :class="containerClass">
    <div
      v-if="!isEmpty"
      class="c-stacked-bars"
    >
      <div
        v-for="(perc, index) in averagedPercentList"
        :key="100 + index"
        :style="styleObject(index)"
        :class="{ 'c-bar-highlight' : mouseoverIndex === index }"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
        @click="showGroup[index] = !showGroup[index]"
      >
        <span
          class="c-bar-overlay"
          v-html="barSymbol(index)"
        />
      </div>
    </div>
    <div />
    <div class="c-info-list">
      <div class="c-total-mult">
        <b>
          {{ totalString() }}
        </b>
        <span class="c-display-settings">
          <i
            v-if="groups.length > 1"
            v-tooltip="'Переключить группировку эффектов'"
            class="o-primary-btn c-change-display-btn fas fa-arrows-rotate"
            @click="changeGroup"
          />
        </span>
      </div>
      <div
        v-if="isEmpty"
        class="c-no-effect"
      >
        Нет эффектов
        <br>
        <br>
        {{ disabledText }}
      </div>
      <div
        v-for="(entry, index) in entries"
        v-else
        :key="entry.key"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      >
        <div
          v-if="shouldShowEntry(entry)"
          :class="singleEntryClass(index)"
        >
          <div @click="showGroup[index] = !showGroup[index]">
            <span
              :class="expandIcon(index)"
              :style="expandIconStyle(index)"
            />
            {{ entryString(index) }}
          </div>
          <MultiplierBreakdownEntry
            v-if="showGroup[index] && hasChildEntries(index)"
            :resource="neutralize(entry)"
            :higherEntries="allEntries"
          />
        </div>
      </div>
      <div v-if="isDilated && !isEmpty">
        <div class="c-single-entry c-dilation-entry">
          <div>
            {{ dilationString() }}
          </div>
        </div>
      </div>
      <div
        v-if="resource.key === 'AD_total'"
        class="c-no-effect"
      >
        <div>
          "Производство ИА" вычисляется как произведение всех множителей Измерений Антиматерии. Оно соответствует
          количеству антиматерии, произведённому за некоторое время ({{ formatInt(10) }}-{{ formatInt(40) }} секунд в
          зависимости от количества производящих ИА) после Пожертвования Измерений. На самом деле ваше количество
          антиматерии растёт полиномиально, поэтому со временем эта характеристика расходится с настоящим
          производством, но чем сильнее ваши ИА, тем этот эффект менее заметен.
        </div>
        <div v-if="seenNC12">
          Внутри 12-го Обычного Испытания вся представленная здесь статистика катастрофически ошибочна, так как она
          воспринимает усиление Измерений как постоянный множитель, что не соответствует действительности. Мы не
          собираемся исправлять эту неточность ввиду несоразмерности возникающих технических трудностей с потенциальной
          пользой от такого уточнения.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-multiplier-entry-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 100rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-text);
  padding: 0.5rem;
  font-weight: normal;
  background-color: var(--color-base);

  -webkit-tap-highlight-color: transparent;
}

.c-multiplier-entry-root-container {
  min-height: 45rem;
}

.c-stacked-bars {
  position: relative;
  width: 5rem;
  background-color: var(--color-disabled);
  margin-right: 1.5rem;
}

.c-bar-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  top: -5%;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
  opacity: 0.8;
  z-index: 1;
}

.c-bar-highlight {
  animation: a-glow-bar 2s infinite;
}

@keyframes a-glow-bar {
  0% { box-shadow: inset 0 0 0.3rem 0; }
  50% {
    box-shadow: inset 0 0 0.6rem 0;
    filter: brightness(130%);
  }
  100% { box-shadow: inset 0 0 0.3rem 0; }
}

.c-info-list {
  height: 100%;
  width: 90%;
  padding: 0.2rem;
}

.c-display-settings {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 8rem;
}

.c-change-display-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  margin: 0 0.5rem;
}

.c-total-mult {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.c-no-effect {
  color: var(--color-text);
  user-select: none;
}

.c-single-entry {
  text-align: left;
  color: var(--color-text);
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border: 0.1rem dashed;
  cursor: pointer;
  user-select: none;
}

.c-single-entry-highlight {
  border: 0.1rem solid;
  font-weight: bold;
  animation: a-glow-text 2s infinite;
}

@keyframes a-glow-text {
  50% { background-color: var(--color-accent); }
}

.c-dilation-entry {
  border: 0.2rem solid;
  font-weight: bold;
  animation: a-glow-dilation-nerf 3s infinite;
}

@keyframes a-glow-dilation-nerf {
  50% { background-color: var(--color-bad); }
}
</style>
