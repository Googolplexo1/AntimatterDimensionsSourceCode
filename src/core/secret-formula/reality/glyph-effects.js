import { DC } from "../../constants";

export const GlyphCombiner = Object.freeze({
  /**
   * @param {number[]} x
   * @returns {number}
   */
  add: x => x.reduce(Number.sumReducer, 0),
  /**
   * @param {number[]} x
   * @returns {number}
   */
  multiply: x => x.reduce(Number.prodReducer, 1),
  /**
   * For exponents, the base value is 1, so when we add two exponents a and b we want to get a + b - 1,
   * so that if a and b are both close to 1 so is their sum. In general, when we add a list x of exponents,
   * we have to add 1 - x.length to the actual sum, so that if all the exponents are close to 1 the result
   * is also close to 1 rather than close to x.length.
   * @param {number[]} x
   * @returns {number}
   */
  addExponents: x => x.reduce(Number.sumReducer, 1 - x.length),
  /**
   * @param {Decimal[]} x
   * @returns {Decimal}
   */
  multiplyDecimal: x => x.reduce(Decimal.prodReducer, DC.D1)
});

export const glyphEffects = {
  timepow: {
    id: "timepow",
    bitmaskIndex: 0,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Увеличить степень множителей Измерений Времени на {value}",
    totalDesc: "Множители Измерений Времени возведены в степень {value}",
    genericDesc: "Увеличить степень множителей Измерений Времени",
    shortDesc: "+{value} к степени ИВ",
    effect: (level, strength) => 1.01 + Math.pow(level, 0.32) * Math.pow(strength, 0.45) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  timespeed: {
    id: "timespeed",
    bitmaskIndex: 1,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Множитель ×{value} к скорости игры",
    genericDesc: "Множитель к скорости игры",
    shortDesc: "×{value} к скорости игры",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("time")
      ? 1 + Math.pow(level, 0.35)
      : 1 + Math.pow(level, 0.3) * Math.pow(strength, 0.65) / 20),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("time"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  timeetermult: {
    id: "timeetermult",
    bitmaskIndex: 2,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Множитель ×{value} к получению вечностей",
    genericDesc: "Множитель к получению вечностей",
    shortDesc: "×{value} вечностей",
    effect: (level, strength) => Math.pow((strength + 3) * level, 0.9) *
      Math.pow(3, GlyphAlteration.sacrificeBoost("time")),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("time"),
    alterationType: ALTERATION_TYPE.BOOST
  },
  timeEP: {
    id: "timeEP",
    bitmaskIndex: 3,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => (GlyphAlteration.isAdded("time")
      ? "Множитель ×{value} к получению Очков Вечности. [Оно возведено в степень ]{value2}"
      : "Множитель ×{value} к получению Очков Вечности"),
    totalDesc: () => (GlyphAlteration.isAdded("time")
      ? "Множитель ×{value} к получению Очков Вечности. Оно возведено в степень {value2}"
      : "Множитель ×{value} к получению Очков Вечности"),
    genericDesc: () => (GlyphAlteration.isAdded("time")
      ? "Множитель к получению Очков Вечности; оно возведено в степень"
      : "Множитель к получению Очков Вечности"),
    shortDesc: () => (GlyphAlteration.isAdded("time")
      ? "×{value} и ^{value2} ОВ"
      : "×{value} ОВ"),
    effect: (level, strength) => Math.pow(level * strength, 3) * 100,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    conversion: x => 1 + Math.log10(x) / 1000,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("time"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  dilationDT: {
    id: "dilationDT",
    bitmaskIndex: 4,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Множитель ×{value} к производству Замедленного Времени",
    genericDesc: "Множитель к производству Замедленного Времени",
    shortDesc: "×{value} ЗВ",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("dilation")
      ? DC.D1_005.pow(level).times(15)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("dilation"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  dilationgalaxyThreshold: {
    id: "dilationgalaxyThreshold",
    bitmaskIndex: 5,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => `Множитель ×{value} к значению, на которое наценка на Тахионные Галактики превышает ${formatInt(1)}`,
    genericDesc: () => `Множитель к значению, на которое наценка на Тахионные Галактики превышает ${formatInt(1)}`,
    shortDesc: () => `×{value} к наценке ТГ сверх ${formatInt(1)}`,
    effect: (level, strength) => 1 - Math.pow(level, 0.17) * Math.pow(strength, 0.35) / 100 -
      GlyphAlteration.sacrificeBoost("dilation") / 50,
    formatEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getBoostColor("dilation"),
    alterationType: ALTERATION_TYPE.BOOST,
    combine: effects => {
      const prod = effects.reduce(Number.prodReducer, 1);
      return prod < 0.4
        ? { value: 0.4 - Math.pow(0.4 - prod, 1.7), capped: true }
        : { value: prod, capped: false };
    },
    enabledInDoomed: true,
  },
  dilationTTgen: {
    // TTgen slowly generates TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    bitmaskIndex: 6,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Вы производите {value} Теоремы Времени в час. [Множитель ×]{value2}[ к производству Теорем Времени]"
      : "Вы производите {value} Теоремы Времени в час"),
    totalDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Вы производите {value} Теоремы Времени в час. Множитель ×{value2} к производству Теорем Времени"
      : "Вы производите {value} Теоремы Времени в час"),
    genericDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Производство Теорем Времени и множитель к производству Теорем Времени"
      : "Производство Теорем Времени"),
    shortDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "+{value} ТВ/час; ×{value2} ТВ"
      : "+{value} ТВ/час"),
    effect: (level, strength) => Math.pow(level * strength, 0.5) / 10000,
    /** @type {function(number): string} */
    formatEffect: x => format(3600 * x, 2, 2),
    combine: GlyphCombiner.add,
    conversion: x => Math.clampMin(Math.pow(10000 * x, 1.6), 1),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("dilation"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  dilationpow: {
    id: "dilationpow",
    bitmaskIndex: 7,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Увеличить степень множителей Измерений Антиматерии на {value} в Замедлении",
    totalDesc: "Множители Измерений Антиматерии возведены в степень {value} в Замедлении",
    genericDesc: "Увеличить степень множителей Измерений Антиматерии в Замедлении",
    shortDesc: "+{value} к степени ИА в Замедлении",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.7) * Math.pow(strength, 0.7) / 25,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  replicationspeed: {
    id: "replicationspeed",
    bitmaskIndex: 8,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Множитель ×{value} к скорости репликации",
    genericDesc: "Множитель к скорости репликации",
    shortDesc: "×{value} Репликанти",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("replication")
      ? DC.D1_007.pow(level).times(10)
      : Decimal.times(level, strength).times(3)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("replication"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  replicationpow: {
    id: "replicationpow",
    bitmaskIndex: 9,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Увеличить степень множителя Репликанти на {value}",
    totalDesc: "Множитель Репликанти возведён в степень {value}",
    shortDesc: "+{value} к степени Репликанти",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.5) * strength / 25 +
      GlyphAlteration.sacrificeBoost("replication") * 3,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("replication"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  replicationdtgain: {
    id: "replicationdtgain",
    bitmaskIndex: 10,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Множитель к производству Замедленного Времени [и скорости репликации] в зависимости от количества Репликанти ({value}×log_${format(Decimal.pow(10, 10000))}_(x), ВАЖНО: при наложении нескольких таких эффектов логарифм учитывается только один раз)`
      : `Множитель к производству Замедленного Времени в зависимости от количества Репликанти ({value}×log_${format(Decimal.pow(10, 10000))}_(x), ВАЖНО: при наложении нескольких таких эффектов логарифм учитывается только один раз)`),
    totalDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Множитель к производству Замедленного Времени и скорости репликации в зависимости от количества Репликанти ({value}×log₁₀(x))`
      : `Множитель к производству Замедленного Времени в зависимости от количества Репликанти ({value}×log₁₀(x))`),
    genericDesc: () => (GlyphAlteration.isAdded("replication")
      ? "Множитель к производству Замедленного Времени и скорости репликации в зависимости от количества Репликанти"
      : "Множитель к производству Замедленного Времени в зависимости от количества Репликанти"),
    shortDesc: () => (GlyphAlteration.isAdded("replication")
      ? `×ЗВ и Репликанти от Репликанти ({value}×log_${format(Decimal.pow(10, 10000))}_(x))`
      : `×ЗВ от Репликанти ({value}×log_${format(Decimal.pow(10, 10000))}_(x))`),
    effect: (level, strength) => 0.0003 * Math.pow(level, 0.3) * Math.pow(strength, 0.65),
    formatEffect: x => format(x, 6, 6),
    formatSingleEffect: x => format(x * 1e4, 2, 2),
    // It's bad to stack this one additively (N glyphs acts as a DT mult of N) or multiplicatively (the raw number is
    // less than 1), so instead we do a multiplicative stacking relative to the "base" effect of a level 1, 0% glyph.
    // We also introduce a 3x mult per glyph after the first, so that stacking level 1, 0% glyphs still has an effect.
    // This is still just a flat DT mult when stacking multiple glyphs, but at least it's bigger than 2 or 3.
    combine: effects => ({
      value: effects.length === 0 ? 0 : effects.reduce(Number.prodReducer, Math.pow(0.0001, 1 - effects.length)),
      capped: false
    }),
    conversion: x => x,
    formatSecondaryEffect: x => format(x, 2, 3),
    formatSingleSecondaryEffect: x => format(x, 5, 5),
    alteredColor: () => GlyphAlteration.getAdditionColor("replication"),
    alterationType: ALTERATION_TYPE.ADDITION,
  },
  replicationglyphlevel: {
    id: "replicationglyphlevel",
    bitmaskIndex: 11,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => `Увеличить степень Репликанти в формуле расчёта уровня глифа на {value} (по умолчанию ^${format(0.4, 1, 1)})`,
    genericDesc: "Увеличить степень Репликанти в формуле расчёта уровня глифа",
    shortDesc: "+{value} к степени Репликанти для уровня",
    effect: (level, strength) => Math.pow(Math.pow(level, 0.25) * Math.pow(strength, 0.4), 0.5) / 50,
    formatEffect: x => format(x, 3, 3),
    combine: effects => {
      let sum = effects.reduce(Number.sumReducer, 0);
      if (effects.length > 2) sum *= 6 / (effects.length + 4);
      return sum > 0.1
        ? { value: 0.1 + 0.2 * (sum - 0.1), capped: true }
        : { value: sum, capped: effects.length > 2 };
    },
    enabledInDoomed: true,
  },
  infinitypow: {
    id: "infinitypow",
    bitmaskIndex: 12,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Увеличить степень множителей Измерений Бесконечности на {value}",
    totalDesc: "Множители Измерений Бесконечности возведены в степень {value}",
    genericDesc: "Увеличить степень множителей Измерений Бесконечности",
    shortDesc: "+{value} к степени Силы Бесконечности",
    effect: (level, strength) => 1.007 + Math.pow(level, 0.21) * Math.pow(strength, 0.4) / 75 +
      GlyphAlteration.sacrificeBoost("infinity") / 50,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("infinity"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  infinityrate: {
    id: "infinityrate",
    bitmaskIndex: 13,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => `Увеличить степень эффекта Силы Бесконечности на {value} (по умолчанию ^${formatInt(7)})`,
    genericDesc: "Увеличить степень эффекта Силы Бесконечности",
    shortDesc: "+{value} к степени эффекта ИБ",
    effect: (level, strength) => Math.pow(level, 0.2) * Math.pow(strength, 0.4) * 0.04,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  infinityIP: {
    id: "infinityIP",
    bitmaskIndex: 14,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Множитель ×{value} к получению Очков Бесконечности. [Оно возведено в степень ]{value2}"
      : "Множитель ×{value} к получению Очков Бесконечности"),
    totalDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Множитель ×{value} к получению Очков Бесконечности. Оно возведено в степень {value2}"
      : "Множитель ×{value} к получению Очков Бесконечности"),
    genericDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Множитель к получению Очков Бесконечности; оно возведено в степень"
      : "Множитель к получению Очков Бесконечности"),
    shortDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "×{value} и ^{value2} ОБ"
      : "×{value} ОБ"),
    effect: (level, strength) => Math.pow(level * (strength + 1), 6) * 10000,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    // eslint-disable-next-line no-negated-condition
    softcap: value => ((Effarig.eternityCap !== undefined) ? Math.min(value, Effarig.eternityCap.toNumber()) : value),
    conversion: x => 1 + Math.log10(x) / 1800,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("infinity"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  infinityinfmult: {
    id: "infinityinfmult",
    bitmaskIndex: 15,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Множитель ×{value} к получению бесконечностей",
    genericDesc: "Множитель к получению бесконечностей",
    shortDesc: "×{value} бесконечностей",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("infinity")
      ? DC.D1_02.pow(level)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("infinity"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  powerpow: {
    id: "powerpow",
    bitmaskIndex: 16,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => (GlyphAlteration.isAdded("power")
      ? "Увеличить степень множителей Измерений Антиматерии на {value}. [Множитель ×]{value2}[ к цене Галактик Антиматерии]"
      : "Увеличить степень множителей Измерений Антиматерии на {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("power")
      ? "Множители Измерений Антиматерии возведены в степень {value}. Множитель ×{value2} к цене Галактик Антиматерии"
      : "Множители Измерений Антиматерии возведены в степень {value}"),
    genericDesc: () => (GlyphAlteration.isAdded("power")
      ? "Увеличить степень множителей Измерений Антиматерии; множитель к цене Галактик Антиматерии"
      : "Увеличить степень множителей Измерений Антиматерии"),
    shortDesc: () => (GlyphAlteration.isAdded("power")
      ? "+{value} к степени ИА; ×{value2} к цене ГА"
      : "+{value} к степени ИА"),
    effect: (level, strength) => 1.015 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    conversion: x => 2 / (x + 1),
    formatSecondaryEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getAdditionColor("power"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: true,
  },
  powermult: {
    id: "powermult",
    bitmaskIndex: 17,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Множитель ×{value} к Измерениям Антиматерии",
    genericDesc: "Множитель к Измерениям Антиматерии",
    shortDesc: "×{value} к ИА",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("power")
      ? DC.D11111.pow(level * 220)
      : Decimal.pow(level * strength * 10, level * strength * 10)),
    formatEffect: x => formatPostBreak(x, 2, 0),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("power"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  powerdimboost: {
    id: "powerdimboost",
    bitmaskIndex: 18,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Множитель ×{value} ко множителю Расширения Измерений",
    genericDesc: "Множитель ко множителю Расширения Измерений",
    shortDesc: "×{value} ко множителю Расширения",
    effect: (level, strength) => Math.pow(level * strength, 0.5) *
      Math.pow(1 + GlyphAlteration.sacrificeBoost("power"), 3),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("power"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  powerbuy10: {
    id: "powerbuy10",
    bitmaskIndex: 19,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => `Увеличить множитель ко множителю за покупку ${formatInt(10)} Измерений Антиматерии на {value}`,
    totalDesc: () => `Множитель ×{value} ко множителю за покупку ${formatInt(10)} Измерений Антиматерии`,
    genericDesc: () => `Увеличить множитель ко множителю за покупку ${formatInt(10)} Измерений Антиматерии`,
    shortDesc: () => `×{value} ко множителю за ${formatInt(10)} ИА`,
    effect: (level, strength) => 1 + level * strength / 12,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  effarigrm: {
    id: "effarigrm",
    bitmaskIndex: 20,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Множитель ×{value} к получению Машин Реальности",
    genericDesc: "Множитель к получению Машин Реальности",
    shortDesc: "×{value} МР",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("effarig")
      ? Math.pow(level, 1.5)
      : Math.pow(level, 0.6) * strength),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("effarig"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  effarigglyph: {
    id: "effarigglyph",
    bitmaskIndex: 21,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Неустойчивость глифов начинается на {value} позже",
    genericDesc: "Неустойчивость глифов начинается позже",
    shortDesc: "Неустойчивость на {value}",
    effect: (level, strength) => Math.floor(10 * Math.pow(level * strength, 0.5)),
    formatEffect: x => quantifyInt("уровень", x),
    combine: GlyphCombiner.add,
  },
  effarigblackhole: {
    id: "effarigblackhole",
    bitmaskIndex: 22,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Увеличить степень скорости игры на {value}",
    totalDesc: "Скорость игры возведена в степень {value}",
    genericDesc: "Увеличить степень скорости игры",
    shortDesc: "+{value} к степени скорости игры",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  effarigachievement: {
    id: "effarigachievement",
    bitmaskIndex: 23,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Увеличить степень множителя достижений на {value}",
    totalDesc: "Множитель достижений возведён в степень {value}",
    genericDesc: "Увеличить степень множителя достижений",
    shortDesc: "+{value} к степени множителя достижений",
    effect: (level, strength) => 1 + Math.pow(level, 0.4) * Math.pow(strength, 0.6) / 60 +
      GlyphAlteration.sacrificeBoost("effarig") / 10,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("effarig"),
    alterationType: ALTERATION_TYPE.BOOST
  },
  effarigforgotten: {
    id: "effarigforgotten",
    bitmaskIndex: 24,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Множитель за покупку ${formatInt(10)} Измерений Антиматерии возведён в степень {value}. [Множитель Расширения Измерений возведён в степень] {value2}`
      : `Множитель за покупку ${formatInt(10)} Измерений Антиматерии возведён в степень {value}`),
    totalDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Множитель за покупку ${formatInt(10)} Измерений Антиматерии возведён в степень {value}. Множитель Расширения Измерений возведён в степень {value2}`
      : `Множитель за покупку ${formatInt(10)} Измерений Антиматерии возведён в степень {value}`),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Множитель за покупку ${formatInt(10)} Измерений Антиматерии возведён в степень; множитель Расширения Измерений возведён в степень`
      : `Множитель за покупку ${formatInt(10)} Измерений Антиматерии возведён в степень`),
    shortDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `^{value} ко множителю за ${formatInt(10)} ИА; ^{value2} ко множителю Расширения`
      : `^{value} ко множителю за ${formatInt(10)} ИА`),
    effect: (level, strength) => 1 + 2 * Math.pow(level, 0.25) * Math.pow(strength, 0.4),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    conversion: x => Math.pow(x, 0.4),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("effarig"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  effarigdimensions: {
    id: "effarigdimensions",
    bitmaskIndex: 25,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Множители всех измерений возведены в степень {value}",
    genericDesc: "Множители всех измерений возведены в степень",
    shortDesc: "^{value} ко всем измерениям",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 500,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  effarigantimatter: {
    id: "effarigantimatter",
    bitmaskIndex: 26,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Производство антиматерии в секунду замедлено со степенью {value}",
    genericDesc: "Производство антиматерии в секунду замедлено",
    shortDesc: "Антиматерия замедлена ^{value}",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 5000,
    formatEffect: x => format(x, 4, 4),
    combine: GlyphCombiner.multiply,
  },
  timeshardpow: {
    id: "timeshardpow",
    bitmaskIndex: 27,
    isGenerated: true,
    // This gets explicitly added to time glyphs elsewhere (once unlocked)
    glyphTypes: [],
    singleDesc: "Увеличить степень производства Осколков Времени в секунду на {value}",
    totalDesc: "Производство Осколков Времени в секунду возведено в степень {value}",
    genericDesc: "Увеличить степень производства Осколков Времени в секунду",
    shortDesc: "+{value} к степени производства Осколков Времени в секунду",
    effect: (level, strength) => 1 + (strength / 3.5) * Math.pow(level, 0.35) / 400,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  cursedgalaxies: {
    id: "cursedgalaxies",
    bitmaskIndex: 0,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Галактики на {value} слабее",
    shortDesc: "-{value} силы галактик",
    // Multiplies by 0.768 per glyph
    effect: level => Math.pow(level, -0.03),
    formatEffect: x => formatPercents(1 - x, 2),
    combine: GlyphCombiner.multiply,
  },
  curseddimensions: {
    id: "curseddimensions",
    bitmaskIndex: 1,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Множители всех измерений возведены в степень {value}",
    shortDesc: "^{value} ко всем измерениям",
    // Multiplies by 0.734 per glyph
    effect: level => Math.pow(level, -0.035),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
  },
  cursedtickspeed: {
    id: "cursedtickspeed",
    bitmaskIndex: 2,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Увеличить наценку на ускорители, получаемые от Осколков Времени",
    totalDesc: "Наценка на ускорители, получаемые от Осколков Времени, в {value} раза больше",
    shortDesc: "Осколки Времени слабее",
    // Additive 3.82 per glyph
    effect: level => Math.clampMin(Math.log10(level), 1),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.add,
  },
  cursedEP: {
    id: "cursedEP",
    bitmaskIndex: 3,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Получение Очков Вечности разделено на {value}",
    shortDesc: "ОВ / {value}",
    // Divides e666.6 per glyph
    effect: level => Decimal.pow10(-level / 10),
    formatEffect: x => format(x.reciprocal()),
    combine: GlyphCombiner.multiplyDecimal,
  },
  realityglyphlevel: {
    id: "realityglyphlevel",
    bitmaskIndex: 4,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Увеличить фактические уровни действующих глифов на {value}",
    shortDesc: "+{value} к уровням действующих глифов",
    effect: level => Math.floor(Math.sqrt(level * 90)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  },
  realitygalaxies: {
    id: "realitygalaxies",
    bitmaskIndex: 5,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Галактики на {value} сильнее",
    shortDesc: "+{value} к силе галактик",
    effect: level => 1 + Math.pow(level / 100000, 0.5),
    formatEffect: x => formatPercents(x - 1, 2),
    combine: GlyphCombiner.multiply,
  },
  realityrow1pow: {
    id: "realityrow1pow",
    bitmaskIndex: 6,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Эффекты повторяемых Улучшений Реальности возведены в степень {value}",
    shortDesc: "^{value} к эффектам повторяемых Улучшений Реальности",
    effect: level => 1 + level / 125000,
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  realityDTglyph: {
    id: "realityDTglyph",
    bitmaskIndex: 7,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => `Увеличить степень Замедленного Времени в формуле расчёта уровня глифа на {value} (по умолчанию ^${format(1.3, 1, 1)})`,
    genericDesc: "Увеличить степень Замедленного Времени в формуле расчёта уровня глифа",
    shortDesc: "+{value} к степени ЗВ для уровня",
    // You can only get this effect on level 25000 reality glyphs anyway, might as well make it look nice
    effect: () => 0.1,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
  },
  companiondescription: {
    id: "companiondescription",
    bitmaskIndex: 8,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "Он ничего не делает, разве что сидит и мило улыбается вам, вежливо нашёптывает вам сны " +
      "и замышляет кару для всех, кто против вас. Это единственный в своём роде глиф, который никогда вас не покинет.",
    totalDesc: "Счастье увеличено на {value}",
    shortDesc: "Не хочет обидеть вас",
    effect: () => {
      if (Enslaved.isRunning) return 0;
      const cursedCount = Glyphs.active.countWhere(g => g?.type === "cursed");
      if (cursedCount > 0) return Math.pow(0.2 + 0.2 * Math.random(), cursedCount);
      return 0.4 + 0.6 * Math.random();
    },
    formatEffect: x => formatPercents(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  companionEP: {
    id: "companionEP",
    bitmaskIndex: 9,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "Спасибо за вашу приверженность игре! Вы достигли {value} Очков Вечности на первой реальности.",
    shortDesc: "Очень, очень сильно любит вас",
    totalDesc: () => ((Enslaved.isRunning || Glyphs.active.countWhere(g => g?.type === "cursed")) ? "Помоги" : "Ура!"),
    // The EP value for this is entirely encoded in rarity, but level needs to be present to
    // make sure the proper parameter is being used. The actual glyph level shouldn't do anything.
    // eslint-disable-next-line no-unused-vars
    effect: (level, strength) => Decimal.pow10(1e6 * strengthToRarity(strength)),
    formatEffect: x => formatPostBreak(x, 2),
    combine: GlyphCombiner.multiplyDecimal,
    enabledInDoomed: true,
  }
};
