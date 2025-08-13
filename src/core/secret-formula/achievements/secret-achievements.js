export const secretAchievements = [
  {
    id: 11,
    name: "Первое всегда бесплатное",
    description: "Нажмите на это достижение."
  },
  {
    id: 12,
    name: "На всякий случай",
    get description() { return `Сохраните игру ${formatInt(100)} раз на протяжении одного сеанса.`; }
  },
  {
    id: 13,
    name: "Почтение необходимо",
    description: "Почтите память."
  },
  {
    id: 14,
    name: "Я тоже",
    description: "Скажите что-нибудь пошлое."
  },
  {
    id: 15,
    name: "Сделай бочку!",
    description: "Сделайте бочку.",
  },
  {
    id: 16,
    name: "Тебе нравится боль?",
    get description() {
      return `Играйте на болезненной нотации в течение ${formatInt(10)} минут реального времени всего после первой вечности.`;
    },
    checkRequirement: () => AchievementTimers.pain
      .check(PlayerProgress.eternityUnlocked() && Notations.current.isPainful, 600),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 17,
    get name() { return `${formatInt(30)} жизней` },
    description: "Введите код Konami."
  },
  {
    id: 18,
    name: "Чувствуешь себя везунчиком? Да, сопляк?",
    get description() {
      return `Каждую секунду вы с вероятностью ${formatInt(1)}/${formatInt(1e5)} выполняете это достижение.`;
    }
  },
  {
    id: 21,
    name: "Лучше иди исследуй реальную жизнь",
    description: "Купите секретное Исследование Времени."
  },
  {
    id: 22,
    name: "Глубоко прожаренный",
    get description() { return `Купите ${formatInt(1e5)} Галактик Антиматерии на нотации "Эмодзи" всего.`; },
    checkRequirement: () => player.requirementChecks.permanent.emojiGalaxies >= 1e5,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 23,
    name: "Стой на месте, преступный элемент!",
    description: "Откройте консоль."
  },
  {
    id: 24,
    name: "Настоящие новости",
    description: "Нажмите на новость, которая как-нибудь реагирует на нажатие."
  },
  {
    id: 25,
    name: "Шшшш… Это секрет",
    description: "Найдите секретную тему."
  },
  {
    id: 26,
    name: "Ты неудачник",
    get description() {
      return `Провалите Испытание Вечности ${formatInt(10)} раз на протяжении одного сеанса.
      Что вы делаете со своей жизнью…`;
    },
    checkRequirement: (function() {
      let count = 0;
      return () => ++count >= 10;
    }()),
    checkEvent: GAME_EVENT.CHALLENGE_FAILED
  },
  {
    id: 27,
    name: `Разве эта игра называется "Измерения Материи"?`,
    get description() { return `Достигните ${formatPostBreak(Decimal.NUMBER_MAX_VALUE, 1, 1)} материи.`; },
    checkRequirement: () => Currency.matter.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 28,
    name: "Красиво.",
    description: "Не делайте вид, словно не знаете, что сделали."
  },
  {
    id: 31,
    name: "Тебе стоит загрузить побольше оперативной памяти",
    get description() { return `Выставите интервал обновления на ${formatInt(200)}мс.`; }
  },
  {
    id: 32,
    get name() { return `Меньше или равно ${format(0.001, 3, 3)}` },
    get description() {
      return `Совершите бесконечность или вечность за ${format(0.001, 3, 3)} секунды или быстрее.`;
    },
    checkRequirement: () =>
      Time.bestInfinity.totalMilliseconds <= 1 ||
      Time.bestEternity.totalMilliseconds <= 1,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.ETERNITY_RESET_AFTER]
  },
  {
    id: 33,
    name: "Алхимик высшей категории",
    description: "Попытайтесь облагородить Глиф Реальности."
  },
  {
    id: 34,
    name: "Ты знаешь, как это работает, да?",
    description: "Сбросьте пустое Древо Исследований."
  },
  {
    id: 35,
    name: `Может, скажем им про кнопку "Купить все"…`,
    get description() { return `Купите ${formatInt(1e5)} одиночных ускорителей.`; },
    checkRequirement: () => player.requirementChecks.permanent.singleTickspeed >= 1e5,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 36,
    name: "Пока тебя не было… Ничего не произошло.",
    description: "Сделайте так, чтобы игра сообщила вам, что пока вас не было, ничего не произошло."
  },
  {
    id: 37,
    name: "Ты следовал инструкции",
    description: "Следуйте инструкции."
  },
  {
    id: 38,
    name: "Лезвие ножа",
    description: "Закройте окно подтверждения полного сброса сохранения, введя подтвердительную фразу."
  },
  {
    id: 41,
    name: "Этого измерения не существует",
    description: "Попытайтесь купить девятое измерение."
  },
  {
    id: 42,
    name: "КАКОЙ ПОЗОР",
    description: "Попытайтесь использовать ИспВ12 для ускорения времени."
  },
  {
    id: 43,
    name: "Несогласованный хор",
    description: "Имейте пять действующих музыкальных глифов.",
    checkRequirement: () => Glyphs.active.length && Glyphs.active.every(x => Glyphs.isMusicGlyph(x)),
    checkEvent: GAME_EVENT.GLYPHS_EQUIPPED_CHANGED
  },
  {
    id: 44,
    name: "Ну что, доволен?",
    get description() { return `Сосредоточенно созерцайте вкладку "Статистика" в течение ${formatInt(15)} минут реального времени подряд.`; },
    checkRequirement: () => AchievementTimers.stats.check(Tab.statistics.isOpen, 900),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 45,
    name: "Что-то подёргивание затянулось",
    description: "Дёргайте Навык в течение минуты реального времени подряд.",
    checkRequirement: () => player.requirementChecks.permanent.perkTreeDragging++ / 100 >= 60
  },
  {
    id: 46,
    name: "На чёрный день",
    description: "Сохраните день реального времени."
  },
  {
    id: 47,
    name: "ALT+",
    description: "Скройте как можно больше вкладок."
  },
  {
    id: 48,
    name: "Stack Overflow",
    description: "Сделайте так, чтобы в текущей программе для Автоматизатора было больше ошибок, чем строк."
  },
];
