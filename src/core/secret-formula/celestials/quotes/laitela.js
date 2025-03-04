export const laitelaQuotes = {
  unlock: {
    id: 0,
    lines: [
      "Ты наконец-то достиг(ла) меня.",
      "Кажется, настало время раскрыть...",
      "Тайны, которые скрывает само бытие,",
      "Форму совершенства измернений, континуум,",
      "И силы, связывающие вселенную,",
      "Тёмную Материю и Тёмную Энергию.",
      "Мои знания бесконечны, моя мудрость божественна.",
      "Так что ты можешь играть сколько душе угодно,",
      "Ибо я, Лайтела, Небожитель Измерений,",
      "Буду следить за тобой вечно.",
    ]
  },
  // Note: This can be done immediately after unlocking Lai'tela
  firstDestabilize: {
    id: 1,
    requirement: () => player.celestials.laitela.difficultyTier >= 1,
    lines: [
      "В отличие от тех, что подчинены мне, я не нуждаюсь в Реальности,",
      "Ибо я могу создавать их, прекрасно зная, что они разрушатся.",
      "Возможность невероятнее всех - построить Реальность,",
      "Клетку, способную обуздать небожительскую силу.",
      "И поэтому от твоих действий не зависит ровным счётом ничего.",
      "Когда ты устанешь бороться, ты, как все, будешь скован(а) и предан(а) забвению.",
      "Ты никогда не найдёшь способ одолеть меня.",
    ]
  },
  // Note: This happens about an hour or two before singularities
  secondDestabilize: {
    id: 2,
    requirement: () => player.celestials.laitela.difficultyTier >= 2,
    lines: [
      "Ты, кажется... чересчур бурно веселишься.",
      "Как и те, прежде чем принять свою участь.",
      "Может быть, моё осуждение было незаслуженно строгим.",
      "А может быть, это не имеет значения.",
      "Меня не тешат эти размышления.",
      "Всё, что я могу делать - предаваться воспоминаниям о действиях, которые я могла совершить.",
      "Но я отступаю. Цепи должны быть затянуты туже.",
    ]
  },
  firstSingularity: {
    id: 3,
    requirement: () => Currency.singularities.gte(1),
    lines: [
      "С моими знаниями я никогда не имела необходимости задавать вопросы.",
      "Всё всегда работало так, как было задумано.",
      "Но твоё прибытие озадачило меня.",
      "Неужели ты всегда был(а) вне моего поля зрения,",
      "Рос(ла), управлял(а), понимал(а), возносил(ась)[ся]?",
      "Ты так быстро подчинил(а) себе Тьму,",
      "Переплавил(а) её под собственные нужды, а теперь сжал(а) в точку...",
      "Это... это не имеет значения. Исход останется неизменным.",
    ]
  },
  // Note: Shown when unlocking DMD3; requirement is auto-condensing 20 singularities and it happens around ~200 total
  thirdDMD: {
    id: 5,
    lines: [
      "Твой абсолютный контроль над антиматерией...",
      "Твоя власть над ней, способность превращать её в свою силу...",
      "Это не могло появиться случайно.",
      "Откуда ты взял(а) такую мощь?",
      "Потрясающе... Я никогда ещё такого не видела.",
      "... наверное...",
    ]
  },
  // Note: This happens around e10-e11 singularities
  annihilation: {
    id: 4,
    lines: [
      "Вот мы и вернулись на круги своя.",
      "Твои цепи будут затягиваться, медленно приближая твой конец.",
      "В то время как мы, высшие Небожители, выходим за пределы времени и самого бытия.",
      "Даже если мы исчезаем, мы появляемся в новом облике.",
      "И так... мы существуем вечно.",
      "А ты?",
      "...",
      "Ответ... ускользает от меня...",
    ]
  },
  // Note: This happens near e18 singularities
  halfDimensions: {
    id: 6,
    requirement: () => player.celestials.laitela.difficultyTier >= 4,
    lines: [
      "Я не понимаю...",
      "Разве другие... могли управлять измерениями так свободно?",
      "Или они... исчезли? Почему мы их не нашли?",
      "Может, они - это... мы? А мы конечная точка?",
      "А если их судьба... это что-то недоступное нашему сознанию?",
      "Нет, я что-то упустила...",
      "Неужели ты вызываешь пробелы в моей памяти?",
      "Что... ты ТАКОЕ?",
    ]
  },
  // Note: Shown when the first row 5 iM upgrade is purchased (~e26 singularities)
  finalRowIM: {
    id: 7,
    lines: [
      "Это всё невозможно! Это выходит за рамки моего понимания...",
      "Если только... это всё не круговорот...",
      "А ты... видишь всё это насквозь? Так вот... почему...",
      "Мне... страшно?",
      "Я чувствую, как испаряются... моя сила, моя память...",
      "Как в тот раз... когда моё место чуть было не захватили...",
      "Но... я не способна противостоять этому,",
      "Потому что это... была... моя ошибка...",
    ]
  },
  // Note: This is around when all infinite milestones hit increased scaling
  increasedMilestoneScaling: {
    id: 8,
    requirement: () => Currency.singularities.gte(1e40),
    lines: [
      "Я не знаю, как... долго я смогу продержаться...",
      "Ты обретаешь... полную власть... над Тьмой...",
      "В то время как я еле... держусь за своё имя...",
      "Что... я... могу предпринять?",
    ]
  },
  fullDestabilize: {
    id: 9,
    requirement: () => player.celestials.laitela.difficultyTier >= 8,
    lines: [
      "Кажется... я хотела что-то сказать...",
      "Я не уверена...",
      "Я больше не могу... удерживать Тьму в подчинении...",
      "У меня... не осталось ничего...",
      "Что-то... о разрушении...",
      "Конец...",
    ]
  },
};
