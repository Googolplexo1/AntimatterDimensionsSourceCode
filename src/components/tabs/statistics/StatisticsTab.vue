<script>
import { MatterScale } from "./matter-scale";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realTimeDoomed: TimeSpan.zero,
      totalAntimatter: new Decimal(0),
      realTimePlayed: TimeSpan.zero,
      timeSinceCreation: 0,
      uniqueNews: 0,
      totalNews: 0,
      secretAchievementCount: 0,
      infinity: {
        isUnlocked: false,
        count: new Decimal(0),
        banked: new Decimal(0),
        projectedBanked: new Decimal(0),
        bankRate: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      eternity: {
        isUnlocked: false,
        count: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      reality: {
        isUnlocked: false,
        count: 0,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(0),
        bestRarity: 0,
      },
      matterScale: [],
      lastMatterTime: 0,
      paperclips: 0,
      fullTimePlayed: 0,
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    infinityCountString() {
      const num = this.infinity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("бесконечность", num.floor())}`
        : "нет бесконечностей";
    },
    eternityCountString() {
      const num = this.eternity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("вечность", num.floor())}`
        : "нет вечностей";
    },
    fullGameCompletions() {
      return player.records.fullGameCompletions;
    },
    startDate() {
      return Time.toDateTimeString(player.records.gameCreatedTime);
    },
    saveAge() {
      return TimeSpan.fromMilliseconds(this.timeSinceCreation, "accusative");
    },
  },
  methods: {
    update() {
      const records = player.records;
      this.totalAntimatter.copyFrom(records.totalAntimatter);
      this.realTimePlayed.setFrom(records.realTimePlayed);
      this.fullTimePlayed = TimeSpan.fromMilliseconds(records.previousRunRealTime + records.realTimePlayed, "accusative");
      this.uniqueNews = NewsHandler.uniqueTickersSeen;
      this.totalNews = player.news.totalSeen;
      this.secretAchievementCount = SecretAchievements.all.filter(a => a.isUnlocked).length;
      this.timeSinceCreation = Date.now() - player.records.gameCreatedTime;
      this.seenAlteredSpeed = PlayerProgress.seenAlteredSpeed();

      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      const bestInfinity = records.bestInfinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.projectedBanked = new Decimal(0).plusEffectsOf(
          Achievement(131).effects.bankedInfinitiesGain,
          TimeStudy(191)
        );
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.time)).times(60000);
        infinity.hasBest = bestInfinity.time < Number.MAX_VALUE;
        infinity.best.setFrom(bestInfinity.time);
        infinity.this.setFrom(records.thisInfinity.time);
        infinity.bestRate.copyFrom(bestInfinity.bestIPminEternity);
      }

      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      const bestEternity = records.bestEternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.hasBest = bestEternity.time < Number.MAX_VALUE;
        eternity.best.setFrom(bestEternity.time);
        eternity.this.setFrom(records.thisEternity.time);
        eternity.bestRate.copyFrom(bestEternity.bestEPminReality);
      }

      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      const bestReality = records.bestReality;
      reality.isUnlocked = isRealityUnlocked;
      reality.totalTimePlayed.setFrom(records.totalTimePlayed);

      if (isRealityUnlocked) {
        reality.count = Math.floor(Currency.realities.value);
        reality.best.setFrom(bestReality.time);
        reality.bestReal.setFrom(bestReality.realTime);
        reality.this.setFrom(records.thisReality.time);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(records.thisInfinity.realTime);
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.realTime)).times(60000);
        eternity.thisReal.setFrom(records.thisEternity.realTime);
        reality.thisReal.setFrom(records.thisReality.realTime);
        reality.bestRate.copyFrom(bestReality.RMmin);
        reality.bestRarity = Math.max(strengthToRarity(bestReality.glyphStrength), 0);
      }
      this.updateMatterScale();

      this.isDoomed = Pelle.isDoomed;
      this.realTimeDoomed.setFrom(player.records.realTimeDoomed);
      this.paperclips = player.news.specialTickerData.paperclips;
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3) : formatInt(Math.floor(value.toNumber()));
    },
    // Only updates once per second to reduce jitter
    updateMatterScale() {
      if (Date.now() - this.lastMatterTime > 1000) {
        this.matterScale = MatterScale.estimate(Currency.antimatter.value);
        this.lastMatterTime = Date.now();
      }
    },
    realityClassObject() {
      return {
        "c-stats-tab-title": true,
        "c-stats-tab-reality": !this.isDoomed,
        "c-stats-tab-doomed": this.isDoomed,
      };
    }
  },
};
</script>

<template>
  <div class="c-stats-tab">
    <div>
      <PrimaryButton onclick="Modal.catchup.show(0)">
        Просмотреть краткое изложение контента
      </PrimaryButton>
      <div class="c-stats-tab-title c-stats-tab-general">
        Общее
      </div>
      <div class="c-stats-tab-general">
        <div>Вы произвели {{ format(totalAntimatter, 2, 1) }} антиматерии всего.</div>
        <div>Вы играли {{ realTimePlayed.toString("accusative") }}<span v-if="seenAlteredSpeed"> (по реальному времяисчислению)</span>.</div>
        <div v-if="seenAlteredSpeed">
          Ваше существование продлилось {{ reality.totalTimePlayed.toString("accusative") }} (по игровому времяисчислению).
        </div>
        <div>
          Ваше текущее сохранение было создано {{ startDate }} ({{ saveAge }} назад).
        </div>
        <br>
        <div>
          Вы просмотрели {{ quantifyInt("новость", totalNews) }}.
        </div>
        <div>
          Вы увидели {{ quantifyInt("новость", uniqueNews) }} без учёта повторений.
        </div>
        <div>
          Вы выполнили {{ quantifyInt("секретное достижение", secretAchievementCount) }}.
        </div>
        <div v-if="paperclips">
          У вас {{ quantifyInt("бесполезная скрепка", paperclips) }}.
        </div>
        <div v-if="fullGameCompletions">
          <br>
          <b>
            Вы завершили игру целиком {{ quantifyInt("раз", fullGameCompletions) }}.
            <br>
            Вы играли {{ fullTimePlayed }} в сумме по всем забегам.
          </b>
        </div>
      </div>
      <div>
        <br>
        <div class="c-matter-scale-container c-stats-tab-general">
          <div
            v-for="(line, i) in matterScale"
            :key="i"
          >
            {{ line }}
          </div>
          <br v-if="matterScale.length < 2">
          <br v-if="matterScale.length < 3">
        </div>
      </div>
      <br>
    </div>
    <div
      v-if="infinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-infinity">
        Бесконечность
      </div>
      <div>
        У вас {{ infinityCountString }}<span v-if="eternity.isUnlocked"> в текущей вечности</span>.
      </div>
      <div v-if="infinity.banked.gt(0)">
        У вас {{ formatDecimalAmount(infinity.banked.floor()) }}
        {{ pluralize("сохранённая бесконечность", infinity.banked.floor()) }}.
      </div>
      <div v-if="infinity.hasBest">
        Рекорд бесконечности<span v-if="eternity.isUnlocked"> в текущей вечности</span>: {{ infinity.best.toStringShort() }}.
      </div>
      <div>
        Текущая бесконечность длится {{ infinity.this.toStringShort() }}<span v-if="reality.isUnlocked">
          ({{ infinity.thisReal.toStringShort() }} по реальному времяисчислению)</span>.
      </div>
      <div>
        Рекордный прирост Очков Бесконечности за время<span v-if="eternity.count.gt(0)"> в текущей вечности</span>:
        {{ format(infinity.bestRate, 2, 2) }} в минуту.
      </div>
      <br>
    </div>
    <div
      v-if="eternity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-eternity">
        Вечность
      </div>
      <div>
        У вас {{ eternityCountString }}<span v-if="reality.isUnlocked"> в текущей реальности</span>.
      </div>
      <div v-if="infinity.projectedBanked.gt(0)">
        Вы получите {{ formatDecimalAmount(infinity.projectedBanked.floor()) }}
        {{ pluralize("сохранённую бесконечность", infinity.projectedBanked.floor()) }} на вечности
        ({{ formatDecimalAmount(infinity.bankRate) }} в минуту).
      </div>
      <div v-if="eternity.hasBest">
        Рекорд вечности<span v-if="reality.isUnlocked"> в текущей реальности</span>: {{ eternity.best.toStringShort() }}.
      </div>
      <div>
        Текущая вечность длится {{ eternity.this.toStringShort() }}<span v-if="reality.isUnlocked">
          ({{ eternity.thisReal.toStringShort() }} по реальному времяисчислению)</span>.
      </div>
      <div>
        Рекордный прирост Очков Вечности за время<span v-if="reality.isUnlocked"> в текущей реальности</span>:
        {{ format(eternity.bestRate, 2, 2) }} в минуту.
      </div>
      <br>
    </div>
    <div
      v-if="reality.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div :class="realityClassObject()">
        {{ isDoomed ? "Обречённая Реальность" : "Реальность" }}
      </div>
      <div>У вас {{ quantifyInt("реальность", reality.count) }}.</div>
      <div>Рекорд реальности по игровому времяисчислению: {{ reality.best.toStringShort() }}.</div>
      <div>Рекорд реальности по реальному времяисчислению: {{ reality.bestReal.toStringShort() }}.</div>
      <div :class="{ 'c-stats-tab-doomed' : isDoomed }">
        {{ isDoomed ? "Текущий армагеддон" : "Текущая реальность" }} длится
        {{ reality.this.toStringShort() }}
        ({{ reality.thisReal.toStringShort() }} по реальному времяисчислению).
      </div>
      <div
        v-if="isDoomed"
        class="c-stats-tab-doomed"
      >
        Вы обрекли Реальность {{ realTimeDoomed.toStringShort() }} назад по реальному времяисчислению.
      </div>
      <div>
        Рекордный прирост Машин Реальности за время: {{ format(reality.bestRate, 2, 2) }} в минуту.
      </div>
      <div>Рекордная редкость глифа: {{ formatRarity(reality.bestRarity) }}.</div>
      <br>
    </div>
  </div>
</template>

<style scoped>
.c-matter-scale-container {
  height: 5rem;
}

.c-stats-tab-general {
  color: var(--color-text);
}

.c-stats-tab-title {
  font-size: 2rem;
  font-weight: bold;
}

.c-stats-tab-subheader {
  height: 15rem;
}

.c-stats-tab-infinity {
  color: var(--color-infinity);
}

.c-stats-tab-eternity {
  color: var(--color-eternity);
}

.c-stats-tab-reality {
  color: var(--color-reality);
}

.c-stats-tab-doomed {
  color: var(--color-pelle--base);
}
</style>