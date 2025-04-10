import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.reality.rebuyables[props.id],
    1e30,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect } = props;
  props.effect = () => Math.pow(
    effect + ImaginaryUpgrade(props.id).effectOrDefault(0),
    player.reality.rebuyables[props.id] * getAdjustedGlyphEffect("realityrow1pow"));
  props.description = () => props.textTemplate.replace("{value}",
    ImaginaryUpgrade(props.id).effectValue === 0
      ? formatInt(effect)
      : format(effect + ImaginaryUpgrade(props.id).effectValue, 2, 2));
  props.formatEffect = value => formatX(value, 2, 0);
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const realityUpgrades = [
  rebuyable({
    name: "Временной Усилитель",
    id: 1,
    initialCost: 1,
    costMult: 30,
    textTemplate: "Множитель ×{value} к производству Замедленного Времени",
    effect: 3
  }),
  rebuyable({
    name: "Репликативный Усилитель",
    id: 2,
    initialCost: 1,
    costMult: 30,
    textTemplate: "Множитель ×{value} к скорости репликации",
    effect: 3
  }),
  rebuyable({
    name: "Вечный Усилитель",
    id: 3,
    initialCost: 2,
    costMult: 30,
    textTemplate: "Множитель ×{value} к получению вечностей",
    effect: 3
  }),
  rebuyable({
    name: "Сверхсветовой Усилитель",
    id: 4,
    initialCost: 2,
    costMult: 30,
    textTemplate: "Множитель ×{value} к получению Тахионов",
    effect: 3
  }),
  rebuyable({
    name: "Безграничный Усилитель",
    id: 5,
    initialCost: 3,
    costMult: 50,
    textTemplate: "Множитель ×{value} к получению бесконечностей",
    effect: 5
  }),
  {
    name: "Космическое Дублирование",
    id: 6,
    cost: 15,
    requirement: "Совершите вечность, не получив ни одной Галактики Репликанти в текущей реальности",
    // Note that while noRG resets on eternity, the reality-level check will be false after the first eternity.
    // The noRG variable is eternity-level as it's also used for an achievement check
    hasFailed: () => !(player.requirementChecks.eternity.noRG && player.requirementChecks.reality.noEternities),
    checkRequirement: () => player.requirementChecks.eternity.noRG && player.requirementChecks.reality.noEternities,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    lockEvent: "получить Галактику Репликанти",
    description: "Множитель к скорости репликации в зависимости от количества Галактик Репликанти",
    effect: () => 1 + Replicanti.galaxies.total / 50,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Бессчётное Построение",
    id: 7,
    cost: 15,
    requirement: "Совершите бесконечность, имея не более одной Галактики Антиматерии на протяжении реальности",
    hasFailed: () => !(player.galaxies <= 1 && player.requirementChecks.reality.noInfinities),
    checkRequirement: () => player.galaxies <= 1 && player.requirementChecks.reality.noInfinities,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    canLock: true,
    lockEvent: "получить вторую Галактику Антиматерии",
    description: "Множитель к получению бесконечностей в зависимости от количества Галактик Антиматерии",
    effect: () => 1 + player.galaxies / 30,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Парадоксальное Приобретение",
    id: 8,
    cost: 15,
    requirement: "Совершите вечность без достижений, автоматически восстановленных в текущей реальности",
    hasFailed: () => player.reality.gainedAutoAchievements,
    checkRequirement: () => !player.reality.gainedAutoAchievements,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    // We don't have lockEvent because the modal can never show up for this upgrade
    description: "Множитель достижений влияет на получение Тахионов с ослабленным эффектом",
    effect: () => Math.sqrt(Achievements.power),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Лингвистическое Распространение",
    id: 9,
    cost: 15,
    requirement: () => `Получите не менее ${format(DC.E4000)} Очков Вечности на вечности, имея 
      глиф уровня хотя бы ${formatInt(3)}, который является единственным действующим глифом`,
    hasFailed: () => {
      const invalidEquippedGlyphs = Glyphs.activeWithoutCompanion.length > 1 ||
        (Glyphs.activeWithoutCompanion.length === 1 && Glyphs.activeWithoutCompanion[0].level < 3);
      const hasValidGlyphInInventory = Glyphs.inventory.countWhere(g => g && g.level >= 3) > 0;
      return invalidEquippedGlyphs || (Glyphs.activeWithoutCompanion.length === 0 && !hasValidGlyphInInventory);
    },
    checkRequirement: () => Currency.eternityPoints.exponent >= 4000 &&
      Glyphs.activeWithoutCompanion.length === 1 && Glyphs.activeWithoutCompanion[0].level >= 3,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    // There are two locking events - equipping a glyph with too low a level, and equipping a second glyph
    description: "Разблокировать дополнительный слот для глифов",
    effect: () => 1
  },
  {
    name: "Экзистенциальное Продление",
    id: 10,
    cost: 15,
    requirement: () => `Совершите первую вечность в текущей реальности, имея не менее ${formatPostBreak(DC.E400)} Очков Бесконечности`,
    hasFailed: () => !player.requirementChecks.reality.noEternities,
    checkRequirement: () => Currency.infinityPoints.exponent >= 400 &&
      player.requirementChecks.reality.noEternities,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    lockEvent: "совершить вечность",
    bypassLock: () => Currency.infinityPoints.exponent >= 400,
    description: () => `Начинать со ${formatInt(100)} вечностями`,
    automatorPoints: 15,
    shortDescription: () => `Начинать со ${formatInt(100)} вечностями`,
    effect: () => 100
  },
  {
    name: "Безграничный Поток",
    id: 11,
    cost: 50,
    requirement: () => `${format(Currency.infinitiesBanked.value, 2)}/${format(DC.E12)} сохранённых бесконечностей`,
    checkRequirement: () => Currency.infinitiesBanked.exponent >= 12,
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_FIRST_UNLOCKED],
    description: () => `Ежесекундно вы получаете ${formatPercents(0.1)} от количества бесконечностей, которое вы могли бы получить при Большом Сжатии`,
    automatorPoints: 5,
    shortDescription: () => `Производство бесконечностей`,
    effect: () => gainedInfinities().times(0.1),
    formatEffect: value => `${format(value)} в секунду`
  },
  {
    name: "Знающее Бытие",
    id: 12,
    cost: 50,
    requirement: () => `Получите не менее ${format(DC.E70)} Очков Вечности на вечности без выполнений 1-го Испытания Вечности`,
    hasFailed: () => EternityChallenge(1).completions !== 0,
    checkRequirement: () => Currency.eternityPoints.exponent >= 70 && EternityChallenge(1).completions === 0,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: "выполнить 1-е Испытание Вечности",
    description: "Множитель к получению Очков Вечности в зависимости от количества реальностей и Теорем Времени",
    effect: () => Currency.timeTheorems.value
      .minus(DC.E3).clampMin(2)
      .pow(Math.log2(Math.min(Currency.realities.value, 1e4))).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Телемеханический Процесс",
    id: 13,
    cost: 50,
    requirement: () => `Получите не менее ${format(DC.E4000)} Очков Вечности на вечности без Измерений Времени с 5-го по 8-е`,
    hasFailed: () => !Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
    checkRequirement: () => Currency.eternityPoints.exponent >= 4000 &&
      Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: "купить это Измерение Времени",
    description: "Разблокировать два новых режима автоматики вечности и автоматику Измерений Времени и упятерителя ОВ",
    automatorPoints: 10,
    shortDescription: () => `Автоматика ИВ и упятерителя ОВ и улучшенная автоматика вечности`,
  },
  {
    name: "Вечный Поток",
    id: 14,
    cost: 50,
    requirement: () => `${format(Currency.eternities.value, 2)}/${format(1e7)} вечностей`,
    checkRequirement: () => Currency.eternities.gte(1e7),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_FIRST_UNLOCKED],
    description: "Ежесекундно вы получаете столько вечностей, сколько у вас реальностей",
    automatorPoints: 5,
    shortDescription: () => `Производство вечностей`,
    effect: () => Currency.realities.value * Ra.unlocks.continuousTTBoost.effects.eternity.effectOrDefault(1),
    formatEffect: value => `${format(value / Ra.unlocks.continuousTTBoost.effects.eternity.effectOrDefault(1))} per second`
  },
  {
    name: "Парадоксальное Время",
    id: 15,
    cost: 50,
    requirement: () => `Достигните ${format(DC.E10)} Очков Вечности без упятерителей ОВ`,
    hasFailed: () => player.epmultUpgrades !== 0,
    checkRequirement: () => Currency.eternityPoints.exponent >= 10 && player.epmultUpgrades === 0,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: "купить упятеритель ОВ",
    description: "Множитель к получению Тахионов в зависимости от количества упятерителей ОВ",
    effect: () => Math.max(Math.sqrt(Decimal.log10(EternityUpgrade.epMult.effectValue)) / 9, 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Неравенство Редкости",
    id: 16,
    cost: 1500,
    requirement: () => `Совершите реальность ровно с ${formatInt(4)} действующими глифами Необычной или более высокой редкости
      (у вас ${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && g.strength >= 1.5))})`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.strength >= 1.5);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => g.strength >= 1.5);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4 || equipped > 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => g.strength >= 1.5) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Улучшить формулу редкости получаемых глифов",
    effect: 1.3,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Двойственность Силы",
    id: 17,
    cost: 1500,
    requirement: () => `Совершите реальность ровно с ${formatInt(4)} действующими глифами, имеющими не менее чем по ${formatInt(2)} эффекта
      (у вас ${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && countValuesFromBitmask(g.effects) >= 2))})`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && countValuesFromBitmask(g.effects) >= 2);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => countValuesFromBitmask(g.effects) >= 2);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4 || equipped > 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => countValuesFromBitmask(g.effects) >= 2) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: () => `Каждый получаемый глиф с вероятностью ${formatPercents(0.5)} имеет на один эффект больше`,
    effect: 0.5,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Мера Времени",
    id: 18,
    cost: 1500,
    requirement: () => `Совершите реальность ровно с ${formatInt(4)} действующими глифами уровня хотя бы ${formatInt(10)}
      (у вас ${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && g.level >= 10))})`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.level >= 10);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => g.level >= 10);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4 || equipped > 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => g.level >= 10) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Разблокировать новый фактор уровня глифа: количество вечностей",
    effect: () => Math.max(Math.sqrt(Currency.eternities.value.plus(1).log10()) * 0.45, 1),
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Амбиция Мощности",
    id: 19,
    cost: 1500,
    requirement: () => `Получите ${formatInt(30)} глифов
      (у вас ${formatInt(Glyphs.allGlyphs.countWhere(g => g.type !== "companion"))})`,
    hasFailed: () => Glyphs.allGlyphs.countWhere(g => g.type !== "companion") < 30,
    checkRequirement: () => Glyphs.allGlyphs.countWhere(g => g.type !== "companion") >= 30,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Разблокировать Пожертвование Глифов",
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Парность Сингулярности",
    id: 20,
    cost: 1500,
    requirement: () => `Проведите в игре ${formatInt(100)} дней после разблокировки Чёрной Дыры
      (прошло ${Time.timeSinceBlackHole.toStringShort(false)})`,
    hasFailed: () => !BlackHole(1).isUnlocked && Currency.realityMachines.lt(100),
    checkRequirement: () => Time.timeSinceBlackHole.totalDays >= 100 && BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Разблокировать 2-ю Чёрную Дыру",
    automatorPoints: 10,
    shortDescription: () => `2-я Чёрная Дыра`,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Космический Конгломерат",
    id: 21,
    cost: 100000,
    requirement: () => `${formatInt(Replicanti.galaxies.total + player.galaxies +
      player.dilation.totalTachyonGalaxies)}/${formatInt(2800)} галактик`,
    checkRequirement: () =>
      Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies >= 2800,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Отсрочить наценку на Сверхдалёкие Галактики до ${formatInt(1e5)} Галактик Антиматерии`,
    effect: 1e5
  },
  {
    name: "Временная Трансцендентность",
    id: 22,
    cost: 100000,
    requirement: () => `${format(Currency.timeShards.value, 1)}/${format(DC.E28000)} Осколков Времени`,
    checkRequirement: () => Currency.timeShards.exponent >= 28000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Множитель к Измерениям Времени в зависимости от длительности текущей реальности",
    effect: () => Decimal.pow10(Math.pow(1 + 2 * Math.log10(Time.thisReality.totalDays + 1), 1.6)),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Репликативная Быстрота",
    id: 23,
    cost: 100000,
    requirement: () => `Совершите реальность за ${formatInt(15)} минут или быстрее
      (рекорд: ${Time.bestReality.toStringShort()})`,
    hasFailed: () => Time.thisReality.totalMinutes >= 15,
    checkRequirement: () => Time.thisReality.totalMinutes < 15,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Множитель к скорости репликации в зависимости от рекордного времени реальности",
    effect: () => 15 / Math.clamp(Time.bestReality.totalMinutes, 1 / 12, 15),
    cap: 180,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Синтетический Символизм",
    id: 24,
    cost: 100000,
    requirement: () => `Получите не менее ${formatInt(5000)} Машин Реальности на реальности без действующих глифов`,
    hasFailed: () => Glyphs.activeWithoutCompanion.length > 0,
    checkRequirement: () => MachineHandler.gainedRealityMachines.gte(5000) &&
      Glyphs.activeWithoutCompanion.length === 0,
    canLock: true,
    lockEvent: "активировать глиф",
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Разблокировать дополнительный слот для глифов",
    effect: () => 1
  },
  {
    name: "Беспечное Существование",
    id: 25,
    cost: 100000,
    requirement: () => `Достигните ${format(DC.E11111)} ОВ (рекорд: ${format(player.records.bestReality.bestEP, 2)} ОВ)`,
    checkRequirement: () => player.records.bestReality.bestEP.exponent >= 11111,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    description: "Разблокировать автоматику реальности и команду Автоматизатора для совершения реальности",
    automatorPoints: 100,
    shortDescription: () => `Автоматика реальности`,
  },
];
