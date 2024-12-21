export class DimensionState {
  constructor(getData, tier) {
    this._tier = tier;
    this._getData = getData;
  }

  get tier() { return this._tier; }

  get data() { return this._getData()[this.tier - 1]; }

  /** @returns {Decimal} */
  get amount() { return this.data.amount; }
  /** @param {Decimal} value */
  set amount(value) { this.data.amount = value; }

  /** @returns {number} */
  get bought() { return this.data.bought; }
  /** @param {number} value */
  set bought(value) { this.data.bought = value; }

  /** @abstract */
  get productionPerSecond() { throw new NotImplementedError(); }

  get productionPerRealSecond() {
    return this.productionPerSecond.times(getGameSpeedupForDisplay());
  }

  productionForDiff(diff) {
    return this.productionPerSecond.times(diff / 1000);
  }

  produceCurrency(currency, diff) {
    currency.add(this.productionForDiff(diff));
  }

  produceDimensions(dimension, diff) {
    dimension.amount = dimension.amount.plus(this.productionForDiff(diff));
  }

  static get dimensionCount() { return 8; }

  static createAccessor() {
    const index = Array.range(1, this.dimensionCount).map(tier => new this(tier));
    index.unshift(null);
    const accessor = tier => index[tier];
    accessor.index = index;
    return accessor;
  }
}
