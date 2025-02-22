<script>
export default {
  name: "AutomatorEventLog",
  data() {
    return {
      unsortedEvents: [],
      newestFirst: false,
      timestampMode: 0,
      currentTime: 0,
      maxEntries: 0,
      clearOnReality: false,
      clearOnRestart: false,
    };
  },
  computed: {
    events() {
      // eslint-disable-next-line no-nested-ternary
      const sorted = this.unsortedEvents.sort((a, b) => (a.timestamp === b.timestamp
        ? (a.thisReality === b.thisReality
          ? a.line - b.line
          : a.thisReality - b.thisReality)
        : a.timestamp - b.timestamp));
      return this.newestFirst ? sorted.reverse() : sorted;
    },
    clearTooltip() {
      return `Очистить журнал`;
    },
    buttonClassObject() {
      return "c-automator-docs--button fas";
    }
  },
  watch: {
    newestFirst(newValue) {
      player.options.automatorEvents.newestFirst = newValue;
    },
    timestampMode(newValue) {
      player.options.automatorEvents.timestampType = newValue;
    },
    clearOnReality(newValue) {
      player.options.automatorEvents.clearOnReality = newValue;
    },
    clearOnRestart(newValue) {
      player.options.automatorEvents.clearOnRestart = newValue;
    }
  },
  methods: {
    update() {
      const eventSettings = player.options.automatorEvents;
      this.unsortedEvents = AutomatorData.eventLog;
      this.newestFirst = eventSettings.newestFirst;
      this.timestampMode = eventSettings.timestampType;
      this.currentTime = Date.now();
      this.maxEntries = eventSettings.maxEntries;
      this.clearOnReality = eventSettings.clearOnReality;
      this.clearOnRestart = eventSettings.clearOnRestart;
    },
    clearLog() {
      AutomatorData.clearEventLog();
      this.update();
    },
    sortStyle(selected) {
      return {
        "background-color": selected ? "var(--color-reality)" : ""
      };
    },
    timestampStyle(key) {
      return {
        "background-color": this.timestampMode === AUTOMATOR_EVENT_TIMESTAMP_MODE[key] ? "var(--color-reality)" : ""
      };
    },
    clearRealityStyle() {
      return {
        "background-color": this.clearOnReality ? "var(--color-reality)" : ""
      };
    },
    clearRestartStyle() {
      return {
        "background-color": this.clearOnRestart ? "var(--color-reality)" : ""
      };
    },
    setTimestampMode(key) {
      this.timestampMode = AUTOMATOR_EVENT_TIMESTAMP_MODE[key];
    },
    timestamp(entry) {
      switch (this.timestampMode) {
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.DISABLED:
          return "";
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.THIS_REALITY:
          return `, ${TimeSpan.fromSeconds(entry.thisReality).toStringShort()} реального времени с начала реальности`;
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.RELATIVE_NOW:
          return `, ${TimeSpan.fromMilliseconds(this.currentTime - entry.timestamp).toStringShort()} назад`;
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.RELATIVE_PREV:
          if (entry.timegap === entry.timestamp) return `, первое записанное событие`;
          return `, через ${TimeSpan.fromMilliseconds(entry.timegap).toStringShort()} после прошлого события`;
        case AUTOMATOR_EVENT_TIMESTAMP_MODE.DATE_TIME:
          return `, ${Time.toDateTimeString(entry.timestamp)}`;
        default:
          throw Error("Unrecognized timestamp mode in Automator event log");
      }
    },
    scrollToLine(line) {
      AutomatorScroller.scrollToLine(line);
      AutomatorHighlighter.updateHighlightedLine(line, LineEnum.Event);
    }
  }
};

const AUTOMATOR_EVENT_TIMESTAMP_MODE = {
  DISABLED: 0,
  THIS_REALITY: 1,
  RELATIVE_NOW: 2,
  RELATIVE_PREV: 3,
  DATE_TIME: 4,
};
</script>

<template>
  <div class="c-automator-docs-page">
    <div>
      В этой панели вы можете просмотреть журнал команд, недавно выполненных Автоматизатором, с небольшим количеством
      дополнительной информации о некоторых командах. Он может пригодиться вам для обнаружения проблем с программой, если Автоматизатор
      застрянет в её определённой части.
      <br>
      <br>
      Хотя настройки журнала находятся в вашем сохранении, самих событий там нет, и журнал очищается при закрытии игры.
      <br>
      <br>
      <b>Сортировка записей:</b>
      <button
        v-tooltip="'Сначала старые'"
        :style="sortStyle(!newestFirst)"
        :class="buttonClassObject"
        class="fa-angle-down"
        @click="newestFirst = false"
      />
      <button
        v-tooltip="'Сначала новые'"
        :style="sortStyle(newestFirst)"
        :class="buttonClassObject"
        class="fa-angle-up"
        @click="newestFirst = true"
      />
      <button
        v-tooltip="clearTooltip"
        :class="buttonClassObject"
        class="fa-trash"
        @click="clearLog"
      />
      <button
        v-tooltip="'Очищать журнал на реальности'"
        :style="clearRealityStyle()"
        :class="buttonClassObject"
        class="fa-eraser"
        @click="clearOnReality = !clearOnReality"
      />
      <button
        v-tooltip="'Очищать журнал при перезапуске программы'"
        :style="clearRestartStyle()"
        :class="buttonClassObject"
        class="fa-backspace"
        @click="clearOnRestart = !clearOnRestart"
      />
    </div>
    <div>
      <b>Формат временных меток:</b>
      <button
        v-tooltip="'Скрыть'"
        :style="timestampStyle('DISABLED')"
        :class="buttonClassObject"
        class="fa-ban"
        @click="setTimestampMode('DISABLED')"
      />
      <button
        v-tooltip="'Реальное время в текущей реальности'"
        :style="timestampStyle('THIS_REALITY')"
        :class="buttonClassObject"
        class="fa-stopwatch"
        @click="setTimestampMode('THIS_REALITY')"
      />
      <button
        v-tooltip="'Время, прошедешее с момента события'"
        :style="timestampStyle('RELATIVE_NOW')"
        :class="buttonClassObject"
        class="fa-clock"
        @click="setTimestampMode('RELATIVE_NOW')"
      />
      <button
        v-tooltip="'Время от прошлого события до данного'"
        :style="timestampStyle('RELATIVE_PREV')"
        :class="buttonClassObject"
        class="fa-arrow-left"
        @click="setTimestampMode('RELATIVE_PREV')"
      />
      <button
        v-tooltip="'Дата и время'"
        :style="timestampStyle('DATE_TIME')"
        :class="buttonClassObject"
        class="fa-user-clock"
        @click="setTimestampMode('DATE_TIME')"
      />
    </div>
    <span
      v-for="(event, id) in events"
      :key="id"
    >
      <b>Строка {{ event.line }}{{ timestamp(event) }}:</b>
      <button
        v-tooltip="'Перейти к этой строке'"
        :class="buttonClassObject"
        class="fa-arrow-circle-right"
        @click="scrollToLine(event.line)"
      />
      <div class="c-automator-docs-page__indented">
        <i>{{ event.message }}</i>
      </div>
    </span>
  </div>
</template>

<style scoped>

</style>
