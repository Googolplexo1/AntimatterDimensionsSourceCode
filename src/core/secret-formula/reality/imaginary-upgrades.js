import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => props.initialCost * Math.pow(props.costMult, player.reality.imaginaryRebuyables[props.id]);
  const { effect } = props;
  if (props.isDecimal) props.effect = () => Decimal.pow(effect, player.reality.imaginaryRebuyables[props.id]);
  else props.effect = () => effect * player.reality.imaginaryRebuyables[props.id];
  if (!props.formatEffect) props.formatEffect = value => `+${format(value, 2, 2)}`;
  props.formatCost = value => format(value, 2, 0);
  return props;
};

export const imaginaryUpgrades = [
  rebuyable({
    name: "Временной Обостритель",
    id: 1,
    initialCost: 3,
    costMult: 60,
    description: () => `Увеличить множитель за покупку Улучшения Реальности "Временной Усилитель" на ${format(0.15, 2, 2)}`,
    effect: 0.15
  }),
  rebuyable({
    name: "Репликативный Обостритель",
    id: 2,
    initialCost: 4,
    costMult: 60,
    description: () => `Увеличить множитель за покупку Улучшения Реальности "Репликативный Усилитель" на ${format(0.15, 2, 2)}`,
    effect: 0.15
  }),
  rebuyable({
    name: "Вечный Обостритель",
    id: 3,
    initialCost: 1,
    costMult: 40,
    description: () => `Увеличить множитель за покупку Улучшения Реальности "Вечный Усилитель" на ${format(0.4, 2, 2)}`,
    effect: 0.4
  }),
  rebuyable({
    name: "Сверхсветовой Обостритель",
    id: 4,
    initialCost: 5,
    costMult: 80,
    description: () => `Увеличить множитель за покупку Улучшения Реальности "Сверхсветовой Усилитель" на ${format(0.15, 2, 2)}`,
    effect: 0.15
  }),
  rebuyable({
    name: "Безграничный Обостритель",
    id: 5,
    initialCost: 1,
    costMult: 30,
    description: () => `Увеличить множитель за покупку Улучшения Реальности "Безграничный Усилитель" на ${format(0.6, 2, 2)}`,
    effect: 0.6
  }),
  rebuyable({
    name: "Эллиптическая Материальность",
    id: 6,
    initialCost: 1e4,
    costMult: 500,
    description: () => `Множитель ${formatX(1e100)} к ограничению на количество Машин Реальности`,
    effect: 1e100,
    formatEffect: value => `${formatX(value)}`,
    isDecimal: true
  }),
  rebuyable({
    name: "Рунное Заверение",
    id: 7,
    initialCost: 2e5,
    costMult: 500,
    description: () => `Неустойчивость глифов начинается на ${formatInt(200)} уровней позже`,
    effect: 200,
    formatEffect: value => `на ${formatInt(value)} позже`
  }),
  rebuyable({
    name: "Бесконечноугольник Лобачевского",
    id: 8,
    initialCost: 1e7,
    costMult: 800,
    description: () => `Множитель ${formatX(DC.E100000)} к Измерениям Бесконечности`,
    effect: DC.E100000,
    formatEffect: value => `${formatX(value)}`,
    isDecimal: true
  }),
  rebuyable({
    name: "Космическая Нить",
    id: 9,
    initialCost: 1e9,
    costMult: 1000,
    description: () => `Галактики сильнее`,
    effect: 0.03,
    formatEffect: value => `+${formatPercents(value)}`,
  }),
  rebuyable({
    name: "Энтропийное Сжатие",
    id: 10,
    initialCost: 8e9,
    costMult: 2000,
    description: () => `Множитель к получению Сингулярностей`,
    effect: 1,
    formatEffect: value => `${formatX(1 + value, 2)}`
  }),
  {
    name: "Подозрительность Интерференции",
    id: 11,
    cost: 5e7,
    requirement: () => `${format(1e90)} Реликтовых Осколков
      (у вас ${format(player.celestials.effarig.relicShards, 2)})`,
    hasFailed: () => false,
    checkRequirement: () => player.celestials.effarig.relicShards >= 1e90,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    description: "Множители Измерений Времени возведены в степень в зависимости от общего количества произведённой антиматерии",
    effect: () => 1 + Math.log10(player.records.totalAntimatter.log10()) / 100,
    formatEffect: value => `${formatPow(value, 0, 4)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Последствия Иллюзии",
    id: 12,
    cost: 5e7,
    requirement: () => `Получите глиф уровня хотя бы ${formatInt(9000)}, когда один из факторов уровня глифа имеет вес
    ${formatPercents(1)}`,
    hasFailed: () => false,
    checkRequirement: () => Object.values(player.celestials.effarig.glyphWeights).some(w => w === 100) &&
      gainedGlyphLevel().actualLevel >= 9000,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: () => `Получать ${formatInt(2e4)} Расширений за каждый купленный уровень повторяемых Мнимых Улучшений`,
    effect: () => 2e4 * ImaginaryUpgrades.totalRebuyables,
    formatEffect: value => `${format(value, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Быстротечность Информации",
    id: 13,
    cost: 5e7,
    requirement: () => `Сделайте так, чтобы при отсутствии ограничения вы могли бы получить ${format(Number.MAX_VALUE, 2)}
      Машин Реальности при завершении Реальности Безымянных`,
    hasFailed: () => !Enslaved.isRunning,
    // This is for consistency with the UI, which displays an amplified "projected RM" value on the reality button
    checkRequirement: () => Enslaved.isRunning &&
      MachineHandler.uncappedRM.times(simulatedRealityCount(false) + 1).gte(Number.MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Множитель к ограничению на количество Мнимых Машин в зависимости от купленных Мнимых Улучшений",
    effect: () => 1 + ImaginaryUpgrades.totalRebuyables / 20 + ImaginaryUpgrades.totalSinglePurchase / 2,
    formatEffect: value => `${formatX(value, 2, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Восстановление Интервенции",
    id: 14,
    cost: 3.5e8,
    formatCost: x => format(x, 1),
    requirement: () => `Сделайте скорость тика не менее ${format(Decimal.pow(10, 7.5e10))} в 5-м Испытании Вечности`,
    hasFailed: () => false,
    checkRequirement: () => EternityChallenge(5).isRunning && Tickspeed.perSecond.exponent >= 7.5e10,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Все множители за покупку измерений возведены в степень ${formatPow(1.5, 0, 1)}`,
    effect: 1.5,
    isDisabledInDoomed: true
  },
  {
    name: "Фальсификация Идеологии",
    id: 15,
    cost: 1e9,
    requirement: () => `Достигните ${format(Decimal.pow(10, 1.5e12))} антиматерии, не получив 
      ни одного 1-го Измерения Бесконечности в текущей реальности`,
    hasFailed: () => player.requirementChecks.reality.maxID1.gt(0),
    checkRequirement: () => player.requirementChecks.reality.maxID1.eq(0) && player.antimatter.exponent >= 1.5e12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    // This upgrade lock acts in multiple different conditions, but isn't 100% foolproof and also blocks a few edge
    // cases which technically should be allowed but would be hard to communicate in-game. Forbidden actions are:
    // - Purchasing any ID (edge case: this is acceptable for ID2-8 inside EC2 or EC10)
    // - Purchasing any TD with any amount of EC7 completions (edge case: acceptable within EC1 or EC10)
    // - Entering EC7 with any amount of purchased TD
    description: "Разблокировать континуум, 1-е Измерение Тёмной Материи и Лайтелу, Небожителя Измерений",
  },
  {
    name: "Невесомый Импульс",
    id: 16,
    cost: 3.5e9,
    formatCost: x => format(x, 1),
    requirement: () => `Дестабилизируйте Реальность Лайтелы дважды`,
    hasFailed: () => false,
    checkRequirement: () => Laitela.maxAllowedDimension <= 6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Разблокировать 2-е Измерение Тёмной Материи",
  },
  {
    name: "Хиральное Колебание",
    id: 17,
    cost: 6e9,
    requirement: () => `Совершите сжатие не менее чем за ${formatInt(20)} Сингулярностей автоматически`,
    hasFailed: () => false,
    checkRequirement: () => Singularity.singularitiesGained >= 20 &&
      Currency.darkEnergy.gte(Singularity.cap * SingularityMilestone.autoCondense.effectOrDefault(Infinity)),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE,
    description: "Разблокировать 3-е Измерение Тёмной Материи",
  },
  {
    name: "Многомерная Симметрия",
    id: 18,
    cost: 1.5e10,
    formatCost: x => format(x, 1),
    requirement: () => `Достигните ${formatInt(80000)} галактик`,
    hasFailed: () => false,
    checkRequirement: () => Replicanti.galaxies.total + player.galaxies +
      player.dilation.totalTachyonGalaxies >= 80000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Разблокировать 4-е Измерение Тёмной Материи",
  },
  {
    name: "Детерминированная Радиация",
    id: 19,
    cost: 2.8e10,
    formatCost: x => format(x, 1),
    requirement: () => `Сделайте значение континуума ускорителя не менее ${formatInt(3.85e6)}, имея не более
      ${formatInt(8)} Исследований Времени на протяжении реальности`,
    hasFailed: () => player.requirementChecks.reality.maxStudies > 8,
    checkRequirement: () => player.requirementChecks.reality.maxStudies <= 8 &&
      Tickspeed.continuumValue >= 3.85e6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: () => `купить более ${formatInt(8)} Исследований Времени`,
    description: "Разблокировать аннигиляцию"
  },
  {
    name: "Вакуумное Ускорение",
    id: 20,
    cost: 3e12,
    requirement: () => `Сделайте эффект Тёмной Материи не менее ${formatPercents(1)}`,
    hasFailed: () => false,
    checkRequirement: () => Laitela.matterExtraPurchaseFactor >= 2,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Разблокировать автоматику повторяемых Мнимых Улучшений.
      Вы производите Мнимые Машины в ${formatInt(10)} раз быстрее`,
    effect: 10,
    isDisabledInDoomed: true
  },
  {
    name: "Экзистенциальное Удаление",
    id: 21,
    cost: 1e13,
    requirement: () => `Достигните ${format(Decimal.pow(10, 7.4e12))} антиматерии с континуумом, выключенным на протяжении реальности`,
    hasFailed: () => !player.requirementChecks.reality.noContinuum,
    checkRequirement: () => player.requirementChecks.reality.noContinuum &&
      Currency.antimatter.value.log10() >= 7.4e12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "включить континуум",
    description: "Множитель к получению множителя аннигиляции в зависимости от количества Мнимых Машин",
    effect: () => Math.clampMin(Math.pow(Math.log10(Currency.imaginaryMachines.value) - 10, 3), 1),
    formatEffect: value => `${formatX(value, 2, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Полное Завершение",
    id: 22,
    cost: 1.5e14,
    formatCost: x => format(x, 1),
    requirement: () => `Достигните ${format(Decimal.pow(10, 1.5e11))} антиматерии в Реальности Эффарига, имея не менее
      ${formatInt(4)} действующих Проклятых Глифов на протяжении реальности`,
    // Note: 4 cursed glyphs is -12 glyph count, but equipping a positive glyph in the last slot is allowed
    hasFailed: () => !Effarig.isRunning || player.requirementChecks.reality.maxGlyphs > -10,
    checkRequirement: () => Effarig.isRunning && player.requirementChecks.reality.maxGlyphs < -10 &&
      Currency.antimatter.value.exponent >= 1.5e11,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Увеличить суммарную жетрвенную ценность глифов каждого типа до ограничения в ${format(1e100)}`,
    effect: 1e100,
    isDisabledInDoomed: true
  },
  {
    name: "Планарное Очищение",
    id: 23,
    cost: 6e14,
    requirement: () => `Сделайте уровень получаемого глифа не менее ${formatInt(20000)} в Реальности Ра, имея не более
      ${formatInt(0)} действующих глифов на протяжении реальности`,
    hasFailed: () => !Ra.isRunning || player.requirementChecks.reality.maxGlyphs > 0,
    checkRequirement: () => Ra.isRunning && player.requirementChecks.reality.maxGlyphs <= 0 &&
      gainedGlyphLevel().actualLevel >= 20000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Тессеракты дают множитель к эффекту Мнимого Улучшения "Последствия Иллюзии"`,
    effect: () => Math.floor(0.25 * Math.pow(Tesseracts.effectiveCount, 2)),
    formatEffect: value => `${formatX(value)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Абсолютное Аннулирование",
    id: 24,
    cost: 6e14,
    // We unfortunately don't have the UI space to be more descriptive on this button without causing text overflow,
    // so hopefully the additional modals (from the upgrade lock) will mostly communicate the idea that this is under
    // the same conditions as hard V's Post-destination
    requirement: () => `Достигните ${formatInt(13000)} Галактик Антиматерии в Реальности Ра с Чёрной Дырой, интвертированной
      на полную мощность на протяжении реальности`,
    hasFailed: () => !Ra.isRunning || player.requirementChecks.reality.slowestBH > 1e-300,
    checkRequirement: () => Ra.isRunning && player.requirementChecks.reality.slowestBH <= 1e-300 &&
      player.galaxies >= 13000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    // Three locking events: uninvert, discharge, and entering (but not auto-completing) EC12
    description: `Расширения Измерений от Мнимого Улучшения "Последствия Иллюзии" сильнее в зависимости от количества Сингулярностей`,
    effect: () => Decimal.pow(player.celestials.laitela.singularities, 300),
    formatEffect: value => `${formatX(value, 2, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Вездесущее Уничтожение",
    id: 25,
    cost: 1.6e15,
    formatCost: x => format(x, 1),
    requirement: () => `Разблокируйте реальность в полностью дестабилизированной Реальности Лайтелы,
      имея не более одного действующего глифа без особого учёта Проклятых Глифов на протяжении реальности`,
    hasFailed: () => !Laitela.isRunning || Laitela.maxAllowedDimension !== 0 ||
      Glyphs.activeWithoutCompanion.length > 1,
    checkRequirement: () => Laitela.isRunning && Laitela.maxAllowedDimension === 0 &&
      Glyphs.activeWithoutCompanion.length <= 1 && TimeStudy.reality.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "активировать ещё один глиф",
    description: "Разблокировать Пелля, Небожителя Антиматерии",
  },
];
