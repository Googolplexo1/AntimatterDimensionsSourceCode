import { AutobuyerState } from "./autobuyer";

export class BlackHolePowerAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.blackHolePower.all[this.id - 1];
  }

  get name() {
    return `Усиления ${this.id}-й Чёрной Дыры`;
  }

  get isUnlocked() {
    return Ra.unlocks.blackHolePowerAutobuyers.canBeApplied;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const bh = BlackHole(this.id);
    while (Currency.realityMachines.gte(bh.powerUpgrade.cost)) bh.powerUpgrade.purchase();
  }

  static get entryCount() { return 2; }
  static get autobuyerGroupName() { return "Улучшений Чёрных Дыр"; }
  static get isActive() { return player.auto.blackHolePower.isActive; }
  static set isActive(value) { player.auto.blackHolePower.isActive = value; }
}
