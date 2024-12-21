import { DC } from "../../constants";

export const normalAchievements = [
  {
    id: 11,
    name: "Надо с чего-нибудь начинать",
    description: "Купите 1-е Измерение Антиматерии.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 12,
    get name() { return `${formatInt(100)} антиматерии - это много` },
    description: "Купите 2-е Измерение Антиматерии.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 13,
    name: "Half-Life 3 ПОДТВЕРЖДЕНА",
    description: "Купите 3-е Измерение Антиматерии.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 14,
    name: "L4D: Left 4 Dimensions",
    description: "Купите 4-е Измерение Антиматерии.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 15,
    name: "Пятимерный удар антиматерией",
    description: "Купите 5-е Измерение Антиматерии.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 16,
    name: "Мы не смогли позволить себе девятку",
    get description() {
      return Enslaved.isRunning
        ? "Купите 6-е Измерение Антиматерии (они никому не нужны)."
        : "Купите 6-е Измерение Антиматерии.";
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 17,
    name: "Не связанное с удачей достижение",
    description: "Купите 7-е Измерение Антиматерии.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 18,
    get name() { return `${formatInt(90)} градусов до бесконечности` },
    get description() {
      return Enslaved.isRunning
        ? "Купите 8-е Измерение Антиматерии (не привыкай к ним)."
        : "Купите 8-е Измерение Антиматерии.";
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 21,
    name: "К бесконечности!",
    description: "Совершите Большое Сжатие.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `начинать с ${formatInt(100)} антиматерии.`; },
    effect: 100
  },
  {
    id: 22,
    name: "ФАЛЬШИВЫЕ НОВОСТИ!",
    get description() { return `Просмотрите ${formatInt(50)} различных новостей.`; },
    checkRequirement: () => NewsHandler.uniqueTickersSeen >= 50,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER
  },
  {
    id: 23,
    name: "9-е Измерение - ложь",
    get description() { return `Имейте ровно ${formatInt(99)} 8-х Измерений Антиматерии.`; },
    checkRequirement: () => AntimatterDimension(8).amount.eq(99),
    get reward() { return `8-е Измерение Антиматерии на ${formatPercents(0.1)} сильнее.`; },
    effect: 1.1
  },
  {
    id: 24,
    name: "Апокалипсис антиматерии",
    get description() { return `Достигните ${format(DC.E80)} антиматерии.`; },
    checkRequirement: () => Currency.antimatter.exponent >= 80,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 25,
    name: "Максимальное расширение",
    get description() { return `Получите ${formatInt(10)} Расширений Измерений.`; },
    checkRequirement: () => DimBoost.purchasedBoosts >= 10,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER
  },
  {
    id: 26,
    name: "Вы преодолели большое препятствие",
    description: "Получите Галактику Антиматерии.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 27,
    name: "Двойная галактика",
    get description() { return `Получите ${formatInt(2)} Галактики Антиматерии.`; },
    checkRequirement: () => player.galaxies >= 2,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 28,
    name: "В этом нет никакого смысла...",
    get description() {
      return `Купите одиночное 1-е Измерение Антиматерии, имея хотя бы ${format(DC.E150)}.`;
    },
    checkRequirement: () => AntimatterDimension(1).amount.exponent >= 150,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `1-е Измерение Антиматерии на ${formatPercents(0.1)} сильнее.`; },
    effect: 1.1
  },
  {
    id: 31,
    name: "Я забыл ослабить эту механику",
    get description() { return `Сделайте множитель любого Измерения Антиматерии больше ${formatX(DC.E31)}.`; },
    checkRequirement: () => AntimatterDimensions.all.some(x => x.multiplier.exponent >= 31),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `1-е Измерение Антиматерии на ${formatPercents(0.05)} сильнее.`; },
    effect: 1.05
  },
  {
    id: 32,
    name: "Боги довольны",
    get description() { return `Получите множитель больше ${formatX(600)} от Пожертвования Измерений вне 8-го Обычного Испытания.`; },
    checkRequirement: () => !NormalChallenge(8).isOnlyActiveChallenge && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    get reward() {
      return `Пожертвование Измерений сильнее.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": false, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })}`;
    },
    effect: 0.1,
  },
  {
    id: 33,
    name: "Посмотри, сколько бесконечностей!",
    get description() { return `Достигните ${formatInt(10)} бесконечностей.`; },
    checkRequirement: () => Currency.infinities.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 34,
    name: "Тебе оно всё равно не было нужно",
    description: "Совершите Большое Сжатие без 8-х Измерений Антиматерии.",
    checkRequirement: () => AntimatterDimension(8).totalAmount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `все Измерения Антиматерии, кроме 8-го, на ${formatPercents(0.02)} сильнее.`; },
    effect: 1.02
  },
  {
    id: 35,
    name: "Не смей спать",
    get description() {
      return PlayerProgress.realityUnlocked()
        ? `Проведите не менее ${formatInt(6)} часов подряд офлайн (по реальному времяисчислению).`
        : `Проведите не менее ${formatInt(6)} часов подряд офлайн.`;
    },
    checkRequirement: () => Date.now() - player.lastUpdate >= 21600000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE
  },
  {
    id: 36,
    name: "Клаустрофоб",
    get description() {
      return `Совершите Большое Сжатие, имея ровно одну Галактику Антиматерии.`;
    },
    checkRequirement: () => player.galaxies === 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `множитель ${formatX(1.02, 2, 2)} к скорости тика.`; },
    effect: 1 / 1.02
  },
  {
    id: 37,
    name: "БЫСТРО!",
    get description() { return `Совершите бесконечность за ${formatInt(2)} часа или быстрее.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalHours <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `начинать с ${formatInt(5000)} антиматерии.`; },
    effect: 5000
  },
  {
    id: 38,
    name: "Я не верю в богов",
    get description() {
      return `Получите Галактику Антиматерии, не совершив Пожертвование Измерений.`;
    },
    checkRequirement: () => player.requirementChecks.infinity.noSacrifice,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 41,
    name: "В дополнениях не нуждаюсь",
    get description() { return `Купите все ${formatInt(16)} Улучшений Бесконечности.`; },
    checkRequirement: () => player.infinityUpgrades.size >= 16,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `разблокировать два новых улучшения - удвоитель ОБ и офлайн-генерацию.`;
    },
  },
  {
    id: 42,
    name: "Супер-Саник",
    get description() {
      return `Сделайте так, чтобы ваш прирост антиматерии в секунду превысил её количество, когда у вас её не менее ${format(DC.E63)}.`;
    },
    checkRequirement: () =>
      Currency.antimatter.exponent >= 63 &&
      Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 43,
    name: "Вот это поворот...",
    description:
      "Сделайте так, чтобы самый высокий множитель среди Измерений Антиматерии имело 8-е, следующий по величине - 7-е, затем 6-е и так далее.",
    checkRequirement: () => {
      const multipliers = Array.range(1, 8).map(tier => AntimatterDimension(tier).multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `каждое Измерение Антиматерии сильнее на число процентов, равное его уровню.`;
    }
  },
  {
    id: 44,
    get name() { return `${formatInt(30)} секунд эйфории` },
    get description() {
      return `Сделайте так, чтобы ваш прирост антиматерии в секунду превышал её количество в течение ${formatInt(30)} секунд подряд.`;
    },
    checkRequirement: () => AchievementTimers.marathon1
      .check(Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value), 30),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 45,
    name: "Быстрее, чем картофелина",
    get description() { return `Сделайте скорость тика не менее ${format(DC.E29)}.`; },
    checkRequirement: () => Tickspeed.current.exponent <= -26,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `множитель ${formatX(1.02, 0, 2)} к скорости тика.`; },
    effect: 0.98
  },
  {
    id: 46,
    name: "Многомерный",
    get description() { return `Достигните ${format(DC.E12)} 7-х Измерений Антиматерии.`; },
    checkRequirement: () => AntimatterDimension(7).amount.exponent >= 12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 47,
    name: "Сорвиголова",
    get description() { return `Выполните ${formatInt(3)} Обычных Испытания.`; },
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 48,
    name: "Закалённый в анти-испытаниях",
    get description() { return `Выполните все ${formatInt(12)} Обычных Испытаний.`; },
    checkRequirement: () => NormalChallenges.all.countWhere(c => !c.isCompleted) === 0,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    get reward() { return `все Измерения Антиматерии на ${formatPercents(0.1)} сильнее.`; },
    effect: 1.1
  },
  {
    id: 51,
    name: "Бесконечность не предел!",
    description: "Преодолейте Бесконечность.",
    checkRequirement: () => player.break,
    checkEvent: [GAME_EVENT.BREAK_INFINITY, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 52,
    name: "Эра автоматизации",
    description: "Улучшите интервалы автоматики Измерений Антиматерии и ускорителей до предела.",
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.concat(Autobuyer.tickspeed)
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 53,
    name: "Определённо того не стоит",
    description: "Улучшите интервалы всей автоматики, разблокированной Обычными Испытаниями, до предела.",
    // The upgradeable autobuyers are dimensions, tickspeed, dimension boost,
    // galaxy, and big crunch (the ones you get from normal challenges).
    // We don't count autobuyers which can be upgraded via e.g. perks as upgradeable.
    checkRequirement: () => Autobuyers.upgradeable
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 54,
    name: "БЫСТРЕЕ!",
    get description() { return `Совершите бесконечность за ${formatInt(10)} минут или быстрее.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `начинать с ${format(5e5)} антиматерии.`; },
    effect: 5e5
  },
  {
    id: 55,
    name: "Навсегда - это не так уж долго",
    get description() { return `Совершите бесконечность за минуту или быстрее.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `начинать с ${format(5e10)} антиматерии.`; },
    effect: 5e10
  },
  {
    id: 56,
    name: "Много погибших",
    get description() {
      return `Выполните 2-е Обычное Испытание за ${formatInt(3)} минуты или быстрее.`;
    },
    checkRequirement: () => NormalChallenge(2).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `множитель ко всем Измерениям Антиматерии, который постепенно исчезает в течение ${formatInt(3)} минут, но восстанавливается на бесконечности.`;
    },
    effect: () => Math.max(6 / (Time.thisInfinity.totalMinutes + 3), 1),
    effectCondition: () => Time.thisInfinity.totalMinutes < 3,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 57,
    name: "Подарок богов",
    get description() {
      return `Выполните 8-е Обычное Испытание за ${formatInt(3)} минуты или быстрее.`;
    },
    checkRequirement: () => NormalChallenge(8).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Пожертвование Измерений сильнее.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })}`;
    },
    effect: 0.1
  },
  {
    id: 58,
    name: "Всё в порядке.",
    get description() {
      return `Выполните 9-е Обычное Испытание за ${formatInt(3)} минуты или быстрее.`;
    },
    checkRequirement: () => NormalChallenge(9).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `увеличить множитель за покупку ${formatInt(10)} измерений на ${formatPercents(0.01)}.`;
    },
    effect: 1.01
  },
  {
    id: 61,
    name: "Накачанный",
    get description() {
      return `Улучшите опт всей автоматики Измерений Антиматерии до предела
        (${formatInt(Autobuyer.antimatterDimension.bulkCap)}).`;
    },
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.every(x => x.hasMaxedBulk),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT,
      GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    reward: "опт автоматики Измерений Антиматерии неограничен."
  },
  {
    id: 62,
    name: "О, привет... Ты всё ещё здесь?",
    get description() { return `Сделайте прирост Очков Бесконечности за время от бесконечности не менее ${format(DC.E8)} в минуту.`; },
    checkRequirement: () => Player.bestRunIPPM.exponent >= 8,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 63,
    name: "Новое начало",
    get description() { return `Достигните ${formatInt(1)} Силы Бесконечности.`; },
    checkRequirement: () => Currency.infinityPower.gt(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 64,
    name: "Ни одного погибшего",
    description: "Выполните Обычное Испытание, не получив ни одной Галактики Антиматерии и ни одного Расширения Измерений.",
    checkRequirement: () => player.galaxies === 0 && DimBoost.purchasedBoosts === 0 && NormalChallenge.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `первые четыре Измерения Антиматерии на ${formatPercents(0.25)} сильнее.`; },
    effect: 1.25
  },
  {
    id: 65,
    name: "Тоже мне испытание",
    get description() { return `Сделайте сумму рекордов Обычных Испытаний меньше ${formatInt(3)} минут.`; },
    checkRequirement: () => Time.challengeSum.totalMinutes < 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() {
      return `множитель ко всем Измерениям Антиматерии, действующий только внутри испытаний, который постепенно исчезает в течение ${formatInt(3)} минут, но восстанавливается на бесконечности.`;
    },
    effect: () => (Player.isInAnyChallenge ? Math.max(4 / (Time.thisInfinity.totalMinutes + 1), 1) : 1),
    effectCondition: () => Player.isInAnyChallenge && Time.thisInfinity.totalMinutes < 3,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 66,
    name: "Быстрее, чем картофелина в квадрате",
    get description() { return `Сделайте скорость тика не менее ${format(DC.E58)}.`; },
    checkRequirement: () => Tickspeed.current.exponent <= -55,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `множитель ${formatX(1.02, 0, 2)} к скорости тика.`; },
    effect: 0.98
  },
  {
    id: 67,
    name: "Бесконечные сложности",
    description: "Выполните Испытание Бесконечности.",
    checkRequirement: () => InfinityChallenges.completed.length > 0,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 68,
    name: "Ты сделал это лишь ради достижения, да?",
    get description() {
      return `Выполните 3-е Обычное Испытание за ${formatInt(10)} секунд или быстрее.`;
    },
    checkRequirement: () => NormalChallenge(3).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalSeconds <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `множитель ${formatX(1.5, 1, 1)} к 1-му Измерению Антиматерии`; },
    effect: 1.5
  },
  {
    id: 71,
    name: "ОШИБКА 909: измерение не найдено",
    description: "Выполните 2-е Обычное Испытание лишь с одним 1-м Измерением Антиматерии, не получив ни одной Галактики Антиматерии и ни одного Расширения Измерений.",
    checkRequirement: () =>
      NormalChallenge(2).isOnlyActiveChallenge &&
      AntimatterDimension(1).amount.eq(1) &&
      DimBoost.purchasedBoosts === 0 &&
      player.galaxies === 0,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `множитель ${formatX(3)} к 1-му Измерению Антиматерии`; },
    effect: 3
  },
  {
    id: 72,
    name: "Не могу удержать все эти бесконечности",
    get description() {
      return `Сделайте множители всех Измерений Антиматерии не менее ${formatX(Decimal.NUMBER_MAX_VALUE, 1)}.`;
    },
    checkRequirement: () => AntimatterDimensions.all.every(x => x.multiplier.gte(Decimal.NUMBER_MAX_VALUE)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `все Измерения Антиматерии на ${formatPercents(0.1)} сильнее.`; },
    effect: 1.1
  },
  {
    id: 73,
    name: "ЭТОГО ДОСТИЖЕНИЯ НЕ СУЩЕСТВУЕТ",
    get description() { return `Достигните ${formatPostBreak(DC.D9_9999E9999, 4)} антиматерии.`; },
    checkRequirement: () => Currency.antimatter.gte(DC.D9_9999E9999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "множитель к Измерениям Антиматерии, зависящий от количества антиматерии.",
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 74,
    name: "Ни секунды даром",
    get description() { return `Сделайте сумму рекордов Обычных Испытаний меньше ${formatInt(5)} секунд.`; },
    checkRequirement: () => Time.challengeSum.totalSeconds < 5,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() { return `все Измерения Антиматерии на ${formatPercents(0.4)} сильнее в испытаниях.`; },
    effect: 1.4,
    effectCondition: () => Player.isInAnyChallenge
  },
  {
    id: 75,
    name: "НОВЫЕ ИЗМЕРЕНИЯ???",
    description: "Разблокируйте 4-е Измерение Бесконечности.",
    checkRequirement: () => InfinityDimension(4).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "множитель достижений влияет на Измерения Бесконечности.",
    effect: () => Achievements.power
  },
  {
    id: 76,
    name: "По одному на измерение",
    get description() { return `Проведите в игре ${formatInt(8)} дней.`; },
    checkRequirement: () => Time.totalTimePlayed.totalDays >= 8,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "маленький множитель к Измерениям Антиматерии, зависящий от времени игры.",
    effect: () => Math.max(Math.pow(Time.totalTimePlayed.totalDays / 2, 0.05), 1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 77,
    name: "Миллион - это много",
    get description() { return `Достигните ${format(1e6)} Силы Бесконечности.`; },
    checkRequirement: () => Currency.infinityPower.exponent >= 6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 78,
    name: "Мгновение ока",
    get description() { return `Совершите бесконечность за ${formatInt(250)}мс или быстрее.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMilliseconds <= 250,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `начинать с ${format(5e25)}.`; },
    effect: 5e25
  },
  {
    id: 81,
    name: "Геймдизайн - моя страсть",
    get description() { return `Выполните 5-е Испытание Бесконечности за ${formatInt(15)} секунд или быстрее.`; },
    checkRequirement: () => InfinityChallenge(5).isRunning && Time.thisInfinityRealTime.totalSeconds <= 15,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE
  },
  {
    id: 82,
    name: "Закалённый в анти-анти-испытаниях",
    get description() { return `Выполните все ${formatInt(8)} Испытаний Бесконечности.`; },
    checkRequirement: () => InfinityChallenges.completed.length === 8,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 83,
    name: "ТЫ МОЖЕШЬ ПОЛУЧИТЬ 50 ГАЛАКТИК?!?!",
    get description() { return `Получите ${formatInt(50)} Галактик Антиматерии.`; },
    checkRequirement: () => player.galaxies >= 50,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `множитель ${formatX(1 / 0.95, 4, 4)} к скорости тика за каждую Галактику Антиматерии.`; },
    effect: () => DC.D0_95.pow(player.galaxies),
    formatEffect: value => `${formatX(value.recip(), 2, 2)}`
  },
  {
    id: 84,
    name: "У меня есть, могу поделиться",
    get description() { return `Достигните ${formatPostBreak("1e35000")} антиматерии.`; },
    checkRequirement: () => Currency.antimatter.exponent >= 35000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "множитель к Измерениям Антиматерии, зависящий от количества антиматерии..",
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 85,
    name: "ВЕСЬ ВАШЕ ОБ ПРИНАДЛЕЖАТЬ НАМ",
    get description() { return `Получите не менее ${format(DC.E150)} Очков Бесконечности на Большом Сжатии.`; },
    checkRequirement: () => gainedInfinityPoints().exponent >= 150,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `множитель ${formatX(4)} к получению Очков Бесконечности.`; },
    effect: 4
  },
  {
    id: 86,
    name: "Ты что, изгибаешь время, братан?",
    get description() { return `Сделайте множитель за покупку ускорителя не менее ${formatX(1000)}.`; },
    checkRequirement: () => Tickspeed.multiplier.recip().gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `галактики на ${formatPercents(0.01)} сильнее.`; },
    effect: 1.01
  },
  {
    id: 87,
    get name() { return `${formatInt(2)} МИЛЛИОНА БЕСКОНЕЧНОСТЕЙ` },
    get description() { return `Достигните ${format(DC.D2E6)} бесконечностей.`; },
    checkRequirement: () => Currency.infinities.gt(DC.D2E6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `получать в ${format(250)} раз больше бесконечностей от бесконечностей, длящихся более ${formatInt(5)} секунд.`;
    },
    effect: 250,
    effectCondition: () => Time.thisInfinity.totalSeconds > 5
  },
  {
    id: 88,
    name: "Очередная отсылка к бесконечности",
    get description() {
      return `Получите множитель ${formatX(Decimal.NUMBER_MAX_VALUE, 1, 0)} от Пожертвования Измерений за раз.`;
    },
    checkRequirement: () => Sacrifice.nextBoost.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_BEFORE,
    get reward() {
      return `Пожертвование Измерений сильнее.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": true })}`;
    },
    effect: 0.1
  },
  {
    id: 91,
    name: "Нелепая скорость",
    get description() {
      return `Совершите бесконечность за ${formatInt(2)} секунды или быстрее, получив не менее ${format(DC.E200)} ОБ.`;
    },
    checkRequirement: () => gainedInfinityPoints().exponent >= 200 && Time.thisInfinityRealTime.totalSeconds <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `множитель ко всем Измерениям Антиматерии, который постепенно исчезает в течение ${formatInt(5)} секунд, но восстанавливается на бесконечности.`;
    },
    effect: () => Math.max((5 - Time.thisInfinity.totalSeconds) * 60, 1),
    effectCondition: () => Time.thisInfinity.totalSeconds < 5,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 92,
    name: "Я не торможу ради НИКОГО!",
    get description() {
      return `Совершите бесконечность за ${formatInt(20)} секунд или быстрее, получив не менее ${format(DC.E250)} ОБ.`;
    },
    checkRequirement: () => gainedInfinityPoints().exponent >= 250 && Time.thisInfinityRealTime.totalSeconds <= 20,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `множитель ко всем Измерениям Антиматерии, который постепенно исчезает в течение минуты, но восстанавливается на бесконечности.`;
    },
    effect: () => Math.max((1 - Time.thisInfinity.totalMinutes) * 100, 1),
    effectCondition: () => Time.thisInfinity.totalMinutes < 1,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 93,
    name: "МАКСИМАЛЬНАЯ ПЕРЕГРУЗКА",
    get description() { return `Получите не менее ${format(DC.E300)} Очков Бесконечности на Большом Сжатии.`; },
    checkRequirement: () => gainedInfinityPoints().exponent >= 300,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `множитель ${formatX(4)} к получению Очков Бесконечности.`; },
    effect: 4
  },
  {
    id: 94,
    name: "4.3333 минуты бесконечности",
    get description() { return `Достигните ${format(DC.E260)} Силы Бесконечности.`; },
    checkRequirement: () => Currency.infinityPower.exponent >= 260,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `множитель ${formatX(2)} к получению Силы Бесконечности.`; },
    effect: 2
  },
  {
    id: 95,
    name: "Это безопасно?",
    get description() { return `Достигните ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Репликанти в первый час бесконечности.`; },
    get reward() { return `вы сохраняете Репликанти и до одной Галактики Репликанти на Большом Сжатии.`; },
    checkRequirement: () =>
      (Replicanti.amount.eq(Decimal.NUMBER_MAX_VALUE) || player.replicanti.galaxies > 0) &&
      Time.thisInfinityRealTime.totalHours <= 1,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 96,
    name: "Время относительно",
    description: "Совершите вечность.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 97,
    name: "Как по Lego ходить",
    get description() { return `Сделайте сумму рекордов Испытаний Бесконечности меньше ${format(6.66, 2, 2)} секунды.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalSeconds < 6.66,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 98,
    get name() { return `${formatInt(0)} градусов до бесконечности` },
    description: "Разблокируйте 8-е Измерение Бесконечности.",
    checkRequirement: () => InfinityDimension(8).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 101,
    name: "А на это ни у кого не нашлось времени?",
    description: "Совершите вечность, не покупая Измерений Антиматерии, кроме 8-го.",
    checkRequirement: () => player.requirementChecks.eternity.onlyAD8,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 102,
    name: "Эта миля заняла вечность",
    description: "Получите все Этапы Вечности.",
    checkRequirement: () => EternityMilestone.all.every(m => m.isReached),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 103,
    name: "Tätä saavutusta ei ole olemassa II",
    get description() { return `Достигните ${formatPostBreak(DC.D9_99999E999, 5, 0)} Очков Бесконечности.`; },
    checkRequirement: () => Currency.infinityPoints.exponent >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `получение Очков Бесконечности по умолчанию возведено в степень ${formatFloat(308 / 307.8, 5)} (не накладывается на ИсслВ111).`;
    },
    effect: 307.8
  },
  {
    id: 104,
    name: "Тоже мне вечность",
    get description() { return `Совершите вечность за ${formatInt(30)} секунд или быстрее.`; },
    checkRequirement: () => Time.thisEternity.totalSeconds <= 30,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `начинать с ${format(5e25)} Очков Бесконечности.`; },
    effect: 5e25
  },
  {
    id: 105,
    name: "Бесконечное время",
    get description() { return `Получите ${formatInt(308)} ускорителей от Измерений Времени.`; },
    checkRequirement: () => player.totalTickGained >= 308,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "скорость тика также влияет на Измерения Времени с пониженным эффектом.",
    effect: () => Tickspeed.perSecond.pow(0.000005),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 106,
    name: "Рой",
    get description() { return `Достигните ${formatInt(10)} Галактик Репликанти в первые ${formatInt(15)} секунд бесконечности.`; },
    checkRequirement: () => Replicanti.galaxies.total >= 10 && Time.thisInfinity.totalSeconds <= 15,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 107,
    name: "Тебе серьёзно нужно для этого руководство?",
    get description() { return `Совершите вечность, имея менее ${formatInt(10)} бесконечностей.`; },
    checkRequirement: () => Currency.infinities.lt(10),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 108,
    name: "Мы МОГЛИ позволить себе девятку",
    get description() { return `Совершите вечность, имея ровно ${formatInt(9)} Репликанти.`; },
    checkRequirement: () => Replicanti.amount.round().eq(9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 111,
    name: "Эй, чувак, я слышал, тебе нравились бесконечности...",
    get description() {
      return `Получите на бесконечности хотя бы в ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} раз больше
        Очков Бесконечности, чем на предыдущей, ${formatInt(9)} раз подряд в течение одной вечности.`;
    },
    checkRequirement: () => {
      if (player.records.recentInfinities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const infinities = player.records.recentInfinities.map(run => run[2]);
      for (let i = 0; i < infinities.length - 1; i++) {
        if (infinities[i].lt(infinities[i + 1].times(Decimal.NUMBER_MAX_VALUE))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    reward: "ваше количество антиматерии не сбрасывается при получении Расширений Измерений и Галактик Антиматерии."
  },
  {
    id: 112,
    name: "Никогда впредь",
    get description() { return `Сделайте сумму рекордов Испытаний Бесконечности меньше ${formatInt(750)}мс.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalMilliseconds < 750,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 113,
    name: "Вечности - это новые бесконечности",
    get description() { return `Совершите вечность за ${formatInt(250)}мс или быстрее.`; },
    checkRequirement: () => Time.thisEternity.totalMilliseconds <= 250,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `множитель ${formatX(2)} к получению вечностей.`; },
    effect: 2,
  },
  {
    id: 114,
    name: "Ты ошибка",
    description: "Провалите Испытание Вечности.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CHALLENGE_FAILED,
    reward: "угасающее чувство успеха.",
    effect: () => "Sense of accomplishment (fading)"
  },
  {
    id: 115,
    get name() { return `Надо было совершить ${formatInt(7)} вечностей` },
    description: "Запустите Испытание Бесконечности внутри Испытания Вечности.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 116,
    name: "Разве мне необходима бесконечность?",
    get description() { return `Совершите вечность, имея не более одной бесконечности.`; },
    checkRequirement: () => Currency.infinities.lte(1),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: "множитель к получению Очков Бесконечности в зависимости от количества бесконечностей.",
    effect: () => Decimal.pow(Currency.infinitiesTotal.value.clampMin(1), LOG10_2 / 4).powEffectOf(TimeStudy(31)),
    cap: () => Effarig.eternityCap,
    formatEffect: value => {
      // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
      const mult = formatX(value, 2, 2);
      return TimeStudy(31).canBeApplied
        ? `${formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1)} (С учётом ИсслВ31: ${mult})`
        : mult;
    }
  },
  {
    id: 117,
    name: `В "Пятёрочке" теперь продаются Расширения!`,
    get description() { return `Получите ${formatInt(750)} Расширений Измерений оптом.`; },
    checkRequirement: ([bulk]) => bulk >= 750,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    get reward() {
      return `Расширения Измерений на ${formatPercents(0.01)} сильнее.`;
    },
    effect: 1.01
  },
  {
    id: 118,
    get name() { return `ОН БОЛЬШЕ ${formatInt(9000)}!` },
    get description() { return `Получите множитель больше ${formatX(DC.E9000)} от Пожертвования Измерений.`; },
    checkRequirement: () => Sacrifice.totalBoost.exponent >= 9000,
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward: `Пожертвование Измерений ничего не сбрасывает, а его автоматика срабатывает
      каждый тик вне зависимости от настройки, если она включена.`,
  },
  {
    id: 121,
    name: "Ты можешь получить бесконечно много ОБ?",
    get description() { return `Достигните ${formatPostBreak("1e30008")} Очков Бесконечности.`; },
    checkRequirement: () => Currency.infinityPoints.exponent >= 30008,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 122,
    name: "Ты уже мёртв.",
    description: "Совершите вечность, не покупая Измерений Антиматерии, кроме 1-го.",
    checkRequirement: () => player.requirementChecks.eternity.onlyAD1,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 123,
    get name() { return `Ещё ${formatInt(5)} вечностей до обновления` },
    get description() { return `Достигните ${formatInt(50)} выполнений Испытаний Вечности.`; },
    checkRequirement: () => EternityChallenges.completions >= 50,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER
  },
  {
    id: 124,
    name: "Долговечное отношение",
    get description() {
      return `Сделайте так, чтобы ваш прирост Силы Бесконечности в секунду превышал её количество ${formatInt(60)} секунд подряд в течение одной бесконечности.`;
    },
    checkRequirement: () => AchievementTimers.marathon2
      .check(
        !EternityChallenge(7).isRunning &&
        InfinityDimension(1).productionPerSecond.gt(Currency.infinityPower.value),
        60
      ),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 125,
    name: "Уплетая за обе щёчки",
    get description() {
      return `Достигните ${format(DC.E90)} Очков Бесконечности,
      не имея бесконечностей и не получив ни одного 1-го Измерения Антиматерии в текущей вечности.`;
    },
    checkRequirement: () => Currency.infinityPoints.exponent >= 90 &&
      player.requirementChecks.eternity.noAD1 && Currency.infinities.eq(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "множитель к получению Очков Бесконечности в зависимости от длительности текущей бесконечности.",
    effect() {
      const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
      return DC.D2.pow(Math.log(thisInfinity) * Math.min(Math.pow(thisInfinity, 0.11), 500));
    },
    cap: () => Effarig.eternityCap,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 126,
    name: "Популярная музыка",
    get description() { return `Получите в ${formatInt(180)} раз больше Галактик Репликанти, чем Галактик Антиматерии.`; },
    checkRequirement: () => Replicanti.galaxies.total >= 180 * player.galaxies && player.galaxies > 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `при получении Галактик Репликанти ваше количество Репликанти уменьшается в ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)}
        раз за каждую получаемую ГР, а не сбрасывается.`;
    },
  },
  {
    id: 127,
    name: "Но мне хотелось ещё одного слоя престижа...",
    get description() { return `Достигните ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Очков Вечности.`; },
    checkRequirement: () => Currency.eternityPoints.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 128,
    name: "Что мне нужно сделать, чтобы избавиться от тебя?",
    get description() { return `Достигните ${formatPostBreak("1e22000")} Очков Бесконечности, не имея Исследований Времени.`; },
    checkRequirement: () => Currency.infinityPoints.exponent >= 22000 && player.timestudy.studies.length === 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "множитель к Измерениям Времени в зависимости от вашего количества Исследований Времени.",
    effect: () => Math.max(player.timestudy.studies.length, 1),
    formatEffect: value => `${formatX(value)}`
  },
  {
    id: 131,
    name: "Никакой потребительской этики",
    get description() { return `Сохраните ${format(DC.D2E9)} бесконечностей.`; },
    checkRequirement: () => Currency.infinitiesBanked.gt(DC.D2E9),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    get reward() {
      return `множитель ${formatX(2)} к получению бесконечностей; на вечности вы навсегда сохраняете ${formatPercents(0.05)} 
        бесконечностей (складывается с ИсслВ191).`;
    },
    effects: {
      infinitiesGain: 2,
      bankedInfinitiesGain: () => Currency.infinities.value.times(0.05).floor()
    }

  },
  {
    id: 132,
    name: "Уникальные снежинки",
    get description() {
      return `Достигните ${formatInt(569)} Галактик Антиматерии,
        не получив ни одной Галактики Репликанти в текущей вечности.`;
    },
    checkRequirement: () => player.galaxies >= 569 && player.requirementChecks.eternity.noRG,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "множитель к получению Тахионов и производству Замедленного Времени в зависимости от количества Галактик Антиматерии.",
    effect: () => 1.22 * Math.max(Math.pow(player.galaxies, 0.04), 1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 133,
    name: "Мне всё равно никогда эти приколы с бесконечностью не нравились",
    get description() {
      return `Достигните ${formatPostBreak(DC.E200000)} Очков Бесконечности, не купив ни одного
        Измерения Бесконечности или удвоителя ОБ в текущей вечности.`;
    },
    checkRequirement: () =>
      Array.dimensionTiers.map(InfinityDimension).every(dim => dim.baseAmount === 0) &&
      player.IPMultPurchases === 0 &&
      Currency.infinityPoints.exponent >= 200000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "все Испытания Бесконечности всегда разблокированы и выполнены."
  },
  {
    id: 134,
    name: "Когда будет достаточно?",
    get description() { return `Достигните ${formatPostBreak(DC.E18000)} Репликанти.`; },
    checkRequirement: () => Replicanti.amount.exponent >= 18000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `множитель ${formatX(2)} к скорости репликации, когда ваше количество Репликанти меньше ограничения.`;
    }
  },
  {
    id: 135,
    get name() { return `Быстрее, чем картофелина в степени ${formatInt(286078)}` },
    get description() { return `Сделайте скорость тика не менее ${formatPostBreak("1e8296262")}.`; },
    checkRequirement: () => Tickspeed.current.exponent <= -8296259,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 136,
    name: "Я тебе уже говорил, время относительно",
    description: "Замедлите Время.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 137,
    name: "Теперь ты мыслишь замедленно!",
    get description() {
      return `Достигните ${formatPostBreak("1e260000")} антиматерии в первую минуту Замедления.`;
    },
    checkRequirement: () =>
      Currency.antimatter.exponent >= 260000 &&
      Time.thisEternity.totalMinutes <= 1 &&
      player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `множитель ${formatX(2)} к производству Замедленного Времени и Теорем Времени в Замедлении.`; },
    effect: () => (player.dilation.active ? 2 : 1),
  },
  {
    id: 138,
    name: "Вот что мне нужно сделать, чтобы избавиться от тебя.",
    get description() {
      return `Достигните ${formatPostBreak("1e26000")} Очков Бесконечности в Замедлении, не имея Исследований Времени.`;
    },
    checkRequirement: () =>
      player.timestudy.studies.length === 0 &&
      player.dilation.active &&
      Currency.infinityPoints.exponent >= 26000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Исследования Времени 131 и 133 избавляются от своих отрицательных эффектов."
  },
  {
    id: 141,
    name: "Возвращение к реальности",
    description: "Совершите реальность.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() {
      return `множитель ${formatX(4)} к получению Очков Бесконечности; множитель за покупку ${formatInt(10)}
        Измерений Антиматерии увеличен на ${format(0.1, 0, 1)}.`;
    },
    effects: {
      ipGain: 4,
      buyTenMult: 0.1
    }
  },
  {
    id: 142,
    name: "Как это работает?",
    description: "Разблокируйте Автоматизатор.",
    checkRequirement: () => Player.automatorUnlocked,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_BOUGHT, GAME_EVENT.PERK_BOUGHT,
      GAME_EVENT.BLACK_HOLE_UNLOCKED],
    get reward() { return `Расширения Измерений на ${formatPercents(0.5)} сильнее.`; },
    effect: 1.5,
  },
  {
    id: 143,
    name: "Эй, чувак, я слышал, тебе нравились переделки...",
    get description() {
      return `Получите на вечности хотя бы в ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} раз больше
        Очков Вечности, чем на предыдущей, ${formatInt(9)} раз подряд в течение одной реальности.`;
    },
    checkRequirement: () => {
      if (player.records.recentEternities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const eternities = player.records.recentEternities.map(run => run[2]);
      for (let i = 0; i < eternities.length - 1; i++) {
        if (eternities[i].lt(eternities[i + 1].times(Decimal.NUMBER_MAX_VALUE))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    reward: "Расширения Измерений не сбрасываются при получении Галактик Антиматерии."
  },
  {
    id: 144,
    name: `Это отсылка к "Интерстеллару"?`,
    description: "Разблокируйте Чёрную Дыру.",
    checkRequirement: () => BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.BLACK_HOLE_UNLOCKED,
  },
  {
    id: 145,
    name: "Ты уверен, что они в правильном порядке?",
    description: "Сделайте фазу бездействия одной из Чёрных Дыр короче фазы её действия.",
    checkRequirement: () => BlackHoles.list.some(bh => bh.interval < bh.duration),
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `фазы бездействия Чёрных Дыр на ${formatPercents(0.1)} короче.`; },
    effect: 0.9
  },
  {
    id: 146,
    name: "Жизненные навыки",
    description: "Купите все Навыки.",
    checkRequirement: () => player.reality.perks.size === Perks.all.length,
    checkEvent: GAME_EVENT.PERK_BOUGHT,
    get reward() { return `Увеличить редкость получаемых глифов на ${formatPercents(0.01)}.`; },
    effect: 1
  },
  {
    id: 147,
    name: "Мастер реальности",
    description: "Купите все Улучшения Реальности.",
    checkRequirement: () => RealityUpgrades.allBought,
    checkEvent: GAME_EVENT.REALITY_UPGRADE_BOUGHT,
    reward: "разблокировать Терезу, Небожителя Реальности."
  },
  {
    id: 148,
    name: "Флеш-рояль",
    description: "Совершите реальность, имея по одному действующему глифу каждого из основных типов.",
    checkRequirement: () => BASIC_GLYPH_TYPES
      .every(type => Glyphs.activeList.some(g => g.type === type)),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "увеличить уровень получаемых глифов на количество действующих типов глифов.",
    effect: () => (new Set(Glyphs.activeWithoutCompanion.map(g => g.type))).size,
    formatEffect: value => `+${formatInt(value)}`
  },
  {
    id: 151,
    name: "В самом деле, тебе оно всё равно не было нужно",
    get description() {
      return `Достигните ${formatInt(800)} Галактик Антиматерии, не купив ни одного
        8-го Измерения Антиматерии в текущей бесконечности.`;
    },
    checkRequirement: () => player.galaxies >= 800 && player.requirementChecks.infinity.noAD8,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "разблокировать Ви, Небожителя Достижений."
  },
  {
    id: 152,
    name: "У вас ещё есть глифы?",
    get description() { return `Поместите ${formatInt(100)} глифов в инвентарь.`; },
    checkRequirement: () => Glyphs.inventoryList.length >= 100,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 153,
    name: `Антиматерия не имеет значения`,
    description: "Совершите реальность, не производя антиматерии.",
    checkRequirement: () => player.requirementChecks.reality.noAM,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 154,
    name: "Я скорость",
    get description() { return `Совершите реальность за ${formatInt(5)} секунд или быстрее.`; },
    checkRequirement: () => Time.thisReality.totalSeconds <= 5,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `каждую реальность вы с вероятностью ${formatPercents(0.1)} получаете вдвое больше реальностей и Очков Умения.`; },
    effect: 0.1
  },
  {
    id: 155,
    name: "Достижение №15983",
    get description() { return `Проведите в игре ${formatFloat(13.7, 1)} миллиарда лет.`; },
    checkRequirement: () => Time.totalTimePlayed.totalYears > 13.7e9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `фазы действия Чёрных Дыр на ${formatPercents(0.1)} дольше.`; },
    effect: 1.1
  },
  {
    id: 156,
    name: "Отчисленный из колледжа",
    description: "Совершите реальность, не купив ни одной Теоремы Времени.",
    checkRequirement: () => player.requirementChecks.reality.noPurchasedTT,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `множитель ${formatX(2.5, 0, 1)} к производству Теорем Времени; подарочный купон во "Вкусно - и точка"™️.`; },
    effect: 2.5
  },
  {
    id: 157,
    name: "Запредельная эффективность!",
    get description() { return `Получите глиф с ${formatInt(4)} эффектами.`; },
    checkRequirement: () => Glyphs.activeList.concat(Glyphs.inventoryList).map(
      glyph => getGlyphEffectsFromBitmask(glyph.effects, 0, 0)
        .filter(effect => effect.isGenerated).length
    ).max() >= 4,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 158,
    name: "Ты чё, залез в эту дыру головой?",
    description: "Сделайте действие обеих Чёрных Дыр беспрервыным.",
    checkRequirement: () => BlackHole(1).isPermanent && BlackHole(2).isPermanent,
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `Чёрные Дыры на ${formatPercents(0.1)} сильнее.`; },
    effect: 1.1
  },
  {
    id: 161,
    name: "а вот тут ты не прав, детка",
    get description() { return `Достигните ${formatPostBreak(DC.E1E8)} антиматерии в Замедлении.`; },
    checkRequirement: () => Currency.antimatter.exponent >= 100000000 && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 162,
    name: "Вновь установил игру и присоединился к серверу",
    description: "Имейте все Исследования Времени одновременно.",
    checkRequirement: () => player.timestudy.studies.length >= 58,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 163,
    name: "В самом деле, это так просто! Неудобств практически нет!",
    get description() {
      return `Выполните все Испытания Вечности по ${formatInt(5)} раз в первую секунду реальности.`;
    },
    checkRequirement: () => EternityChallenges.all.map(ec => ec.completions).min() >= 5 &&
      Time.thisReality.totalSeconds <= 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 164,
    name: "Бесконечность дважды",
    get description() { return `Достигните ${format(Decimal.NUMBER_MAX_VALUE, 1)} бесконечностей.`; },
    checkRequirement: () => Currency.infinitiesTotal.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `множитель ×${formatInt(1024)} к получению бесконечностей.`; },
    effect: 1024
  },
  {
    id: 165,
    name: "Идеальный баланс",
    get description() { return `Получите глиф уровня хотя бы ${formatInt(5000)} при равенстве всех весов факторов уровня глифа.`; },
    checkRequirement: () => gainedGlyphLevel().actualLevel >= 5000 &&
      ["repl", "dt", "eternities"].every(
        i => player.celestials.effarig.glyphWeights[i] === player.celestials.effarig.glyphWeights.ep),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "разблокировать опцию автоматической корректировки весов факторов уровня глифа."
  },
  {
    id: 166,
    name: "Ещё красивее.",
    get description() { return `Получите глиф уровня ${formatInt(6969)}.`; },
    checkRequirement: () => gainedGlyphLevel().actualLevel === 6969,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `увеличить уровень получаемых глифов на ${formatInt(69)}.`; },
    effect: 69
  },
  {
    id: 167,
    name: "Г-н Слой? Извините, вас нет в списке",
    get description() { return `Достигните ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Машин Реальности.`; },
    checkRequirement: () => Currency.realityMachines.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "множитель к получению Машин Реальности в зависимости от их количества.",
    effect: () => Math.clampMin(1, Currency.realityMachines.value.log2()),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 168,
    name: "Ух ты, мы на полпути",
    get description() { return `Достигните ${formatInt(50)} Уровней в сумме по всем Небожителям.`; },
    checkRequirement: () => Ra.totalPetLevel >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `множитель ${formatX(1.1, 1, 1)} к производству Памяти.`; },
    effect: 1.1
  },
  {
    id: 171,
    name: "Бог восхищён",
    description: "Пожертвуйте хотя бы по одному глифу каждого типа глифов, которые можно жертвовать.",
    checkRequirement: () => Object.values(player.reality.glyphs.sac).every(s => s > 0),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    get reward() { return `множитель ${formatX(2)} к жертвенной ценности глифов.`; },
    effect: 2,
  },
  {
    id: 172,
    name: "Автостопом по реальности",
    get description() {
      return `Совершите реальность, получив не менее ${format(Decimal.NUMBER_MAX_VALUE, 1)} Машин Реальности,
      не имея на всём её протяжении ни Заряженных Улучшений Бесконечности, ни действующих глифов, ни Тройственных Исследований.`;
    },
    checkRequirement: () => MachineHandler.gainedRealityMachines.gte(Decimal.NUMBER_MAX_VALUE) &&
      player.celestials.ra.charged.size === 0 && Glyphs.activeWithoutCompanion.length === 0 &&
      player.requirementChecks.reality.noTriads,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 173,
    name: "Cet accomplissement n'existe pas III",
    get description() { return `Достигните ${formatPostBreak(DC.D9_99999E999, 5, 0)} Машин Реальности.`; },
    checkRequirement: () => player.reality.realityMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 174,
    name: "Разве у тебя не было пары этих штух?",
    description: "Получите Сингулярность.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE
  },
  {
    id: 175,
    name: "The First Antihistorian",
    get description() { return `Имейте по ${formatInt(Ra.alchemyResourceCap)} каждого алхимического ресурса одновременно.`; },
    checkRequirement: () => AlchemyResources.all.every(x => x.amount >= Ra.alchemyResourceCap),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    get reward() {
      return `ограничение на эффект Синергии отменено; эффект Импульса растёт в ${formatInt(10)} раз быстрее.`;
    },
    effect: 10,
  },
  {
    id: 176,
    name: "Мама сосчитала до трёх",
    description: "Совершите аннигиляцию.",
  },
  {
    id: 177,
    name: "Эта миля заняла Небожителя",
    description: "Получите хотя бы по одному выполнению каждого Этапа Сингулярности.",
    checkRequirement: () => SingularityMilestones.all.every(x => x.completions > 0),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_AFTER,
  },
  {
    id: 178,
    name: "Разрушитель миров",
    get description() { return `Достигните ${formatInt(100000)} Галактик Антиматерии.`; },
    checkRequirement: () => player.galaxies >= 100000,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `Галактики на ${formatPercents(0.01)} сильнее.`; },
    effect: 1.01
  },
  {
    id: 181,
    displayId: 666,
    name: "Antimatter Dimensions Eternal",
    description: "Обреките Реальность.",
    checkRequirement: () => Pelle.isDoomed,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
  },
  {
    id: 182,
    name: "Ещё один раз",
    description: "Разблокируйте автоматику всех Измерений Антиматерии в Обречении.",
    checkRequirement: () => PelleUpgrade.antimatterDimAutobuyers1.canBeApplied &&
      PelleUpgrade.antimatterDimAutobuyers2.canBeApplied,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 183,
    name: "Дежавю",
    description: "Выполните 5-е Испытание Бесконечности в Обречении.",
    checkRequirement: () => Pelle.isDoomed && InfinityChallenge(5).isCompleted,
    checkEvent: GAME_EVENT.INFINITY_CHALLENGE_COMPLETED,
    // Weirdly specific reward? Yes, its V's ST bonus because we forgot to disable it
    // when balancing Pelle and only realised too late.
    get reward() { return `множители Измерений Антиматерии возведены в степень ${format(1.0812403840463596, 3, 3)}.`; },
    effect: 1.0812403840463596
  },
  {
    id: 184,
    name: "Страйк-аут",
    description: "Получите Третий Удар.",
    checkRequirement: () => PelleStrikes.eternity.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 185,
    name: "Восемь десятков и семь лет назад",
    description: "Получите Четвёртый Удар.",
    checkRequirement: () => PelleStrikes.ECs.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 186,
    displayId: 181,
    name: "Нездоровая одержимость",
    description: `Купите Исследование Времени 181 в Обречении.`,
  },
  {
    id: 187,
    name: "Повелитель Замедленного Времени",
    description: "Замедлите Время в Обречении.",
    checkRequirement: () => PelleStrikes.dilation.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED,
    // We forgot to disable a singularity milestone while balancing Pelle; now it's disabled
    // and this upgrade has the same effect as it used to.
    get reward() {
      return `удвоитель Замедленного Времени даёт множитель ${formatX(2.7, 1, 1)}.`;
    },
    effect: 1.35
  },
  {
    id: 188,
    name: "Конец",
    description: "Полностью пройдите игру.",
    checkRequirement: () => GameEnd.endState > END_STATE_MARKERS.GAME_END && !GameEnd.removeAdditionalEnd,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
];
