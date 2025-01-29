import { GameDatabase } from "./secret-formula/game-database";
import { GameMechanicState } from "./game-mechanics";

export const Speedrun = {
  officialFixedSeed: 69420,
  unlock() {
    if (player.speedrun.isUnlocked) return;
    Modal.message.show(`Вы разблокировали режим спидрана! Теперь вы можете начать новый забег с небольшими
      изменениями, которые полезны, если вы стараетесь завершить игру как можно скорее. Опция
      начала спидрана теперь доступна в этой вкладке. Если вы решите начать спидран,
      всплывёт другое окно с более подробной информацией.`, {}, 3);
    player.speedrun.isUnlocked = true;
  },
  // Used to block the seed-changing modal from opening (other functions assume this is checked beforehand)
  canModifySeed() {
    return player.realities < 1;
  },
  modifySeed(key, seed) {
    player.speedrun.seedSelection = key;
    let newSeed;
    switch (key) {
      case SPEEDRUN_SEED_STATE.FIXED:
        player.reality.initialSeed = this.officialFixedSeed;
        player.speedrun.initialSeed = this.officialFixedSeed;
        return;
      case SPEEDRUN_SEED_STATE.RANDOM:
        // This gives seeds of roughly the same magnitude that the first-run Date.now() would give
        newSeed = Math.floor(1e13 * Math.random());
        player.reality.initialSeed = newSeed;
        player.speedrun.initialSeed = newSeed;
        return;
      case SPEEDRUN_SEED_STATE.PLAYER:
        player.reality.initialSeed = seed;
        player.speedrun.initialSeed = seed;
        return;
      default:
        throw new Error("Unrecognized speedrun seed setting option");
    }
  },
  seedModeText(rec) {
    const record = rec ?? player.speedrun;
    switch (record.seedSelection) {
      case SPEEDRUN_SEED_STATE.UNKNOWN:
        return `Данные о зерне отсутсвуют (старое сохранение)`;
      case SPEEDRUN_SEED_STATE.FIXED:
        return `Официально утверждённое зерно (${record.initialSeed})`;
      case SPEEDRUN_SEED_STATE.RANDOM:
        return `Случайное зерно (${record.initialSeed})`;
      case SPEEDRUN_SEED_STATE.PLAYER:
        return `Зерно по выбору игрока (${record.initialSeed})`;
      default:
        throw new Error("Unrecognized speedrun seed option in seedModeText");
    }
  },
  // If a name isn't given, choose a somewhat-likely-to-be-unique big number instead
  generateName(name) {
    if (name.trim() === "") {
      const id = Math.floor((1e7 - 1) * Math.random()) + 1;
      return `Игрок ИА №${"0".repeat(6 - Math.floor(Math.log10(id)))}${id}`;
    }
    if (name.length > 40) return `${name.slice(0, 37)}...`;
    return name;
  },
  // Hard-resets the current save and puts it in a state ready to be "unpaused" once resources start being generated
  prepareSave(name) {
    // Carry all relevant post-completion variables over too
    NG.restartWithCarryover();

    player.speedrun.isUnlocked = true;
    player.speedrun.isActive = true;
    this.modifySeed(SPEEDRUN_SEED_STATE.FIXED);
    player.speedrun.name = name;

    // We make a few assumptions on settings which are likely to be changed for all speedrunners
    for (const key of Object.keys(player.options.confirmations)) player.options.confirmations[key] = false;
    player.options.confirmations.glyphSelection = true;
    for (const key of Object.keys(player.options.animations)) {
      if (typeof player.options.animations[key] === "boolean") player.options.animations[key] = false;
    }

    // A few achievements are given for free to mitigate weird strategies at the beginning of runs or unavoidable
    // timewalls for particularly fast/optimized runs
    Achievement(22).unlock();
    Achievement(35).unlock();
    Achievement(76).unlock();

    // Some time elapses after the reset and before the UI is actually ready, which ends up getting "counted" as offline
    player.speedrun.offlineTimeUsed = 0;
    GameStorage.save();
  },
  // Speedruns are initially paused until startTimer is called, which happens as soon as the player purchases a AD or
  // uses the Konami code. Until then, they're free to do whatever they want with the UI
  startTimer() {
    if (player.speedrun.hasStarted) return;
    player.speedrun.hasStarted = true;
    player.speedrun.startDate = Date.now();
    player.lastUpdate = Date.now();

    // This needs to be calculated "live" because using spentSTD includes any offline progress purchases too
    let currentSpent = 0;
    for (const purchase of ShopPurchase.all) {
      if (purchase.config.instantPurchase) continue;
      currentSpent += purchase.purchases * purchase.cost;
    }
    this.setSTDUse(ShopPurchaseData.isIAPEnabled && currentSpent > 0);
  },
  isPausedAtStart() {
    return player.speedrun.isActive && !player.speedrun.hasStarted;
  },
  // This needs to be here due to JS applying "function scope" to the player object within importing in storage.js,
  // which causes any direct changes done in storage.js to fall out of scope afterwards. We also don't want to change
  // this state at the beginning in case people want to share identical single-segment saves before starting the timer.
  setSegmented(state) {
    if (this.isPausedAtStart()) return;
    player.speedrun.isSegmented = state;
  },
  setSTDUse(state) {
    if (this.isPausedAtStart() || ShopPurchaseData.spentSTD === 0) return;
    player.speedrun.usedSTD = state;
  },
  mostRecentMilestone() {
    const newestTime = player.speedrun.records.max();
    if (newestTime === 0) return 0;
    return player.speedrun.records.indexOf(newestTime);
  }
};

class SpeedrunMilestone extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryComplete(args));
  }

  get name() {
    return this.config.name;
  }

  get isReached() {
    return player.speedrun.records[this.config.id] !== 0;
  }

  tryComplete(args) {
    if (!this.config.checkRequirement(args)) return;
    this.complete();
  }

  complete() {
    if (this.isReached || !player.speedrun.isActive) return;
    // Rounding slightly reduces filesize by removing weird float rounding
    player.speedrun.records[this.config.id] = Math.round(player.records.realTimePlayed);
    GameUI.notify.success(`Достигнута стадия спидрана: ${this.name}`);
  }
}

export const SpeedrunMilestones = SpeedrunMilestone.createAccessor(GameDatabase.speedrunMilestones);
