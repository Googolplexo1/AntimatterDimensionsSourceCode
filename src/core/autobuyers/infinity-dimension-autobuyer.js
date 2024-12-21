import { IntervaledAutobuyerState } from "./autobuyer";

export class InfinityDimensionAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get dimension() {
    return InfinityDimension(this.tier);
  }

  get name() {
    return `${this.tier}-х`;
  }

  get fullName() {
    return `${this.tier}-х Измерений Бесконечности`;
  }

  get data() {
    return player.auto.infinityDims.all[this.tier - 1];
  }

  get interval() {
    return 1000 * Perk.autobuyerFasterID.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return EternityMilestone[`autobuyerID${this.tier}`].isReached || PelleUpgrade.IDAutobuyers.canBeApplied;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  get canTick() {
    return InfinityDimensions.canAutobuy() && this.dimension.isAvailableForPurchase && super.canTick;
  }

  tick() {
    super.tick();
    this.dimension.buyMax(true);
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Измерений Бесконечности"; }
  static get isActive() { return player.auto.infinityDims.isActive; }
  static set isActive(value) { player.auto.infinityDims.isActive = value; }
}
