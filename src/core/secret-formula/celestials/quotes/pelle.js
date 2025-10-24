// These entries describe the special flash-between-celestial effect on some quotes, with the numbers being
// durations of each celestial in seconds
const flashCelestial = [
  ["teresa", 0.8],
  ["effarig", 0.8],
  ["enslaved", 0.8],
  ["v", 0.8],
  ["ra", 0.8],
  ["laitela", 0.8],
  ["pelle", 0.8]
];
/** @param {string} cel */
const primaryBackground = cel => [["pelle", 1.5], [cel, 1.5]];

/* eslint-disable no-multi-spaces */
const destroyer =     ["Ложный",          "Божественный",    "Разрушитель"];
const destroyerGen =  ["Ложного",         "Божественного",   "Разрушителя"];
const eternal =       ["Вечный",          "Божество",        "Монарх"];
const eternalAcc =    ["Вечного",         "Божество",        "Монарха"];
const eternalInstr =  ["Вечным",          "Божеством",       "Монархом"];
const lesser =        ["Меньшего",        "Божество",        "Монарха"];
const deities =       ["Меньшие",         "Божества",        "Монархи"];
const deitiesGen =    ["Меньших",         "Божеств",         "Монархов"];
const deitiesInstr =  ["Меньшими",        "Божествами",      "Монархами"];
const deitiesPrep =   ["Меньших",         "Божествах",       "Монархах"];

const assured =       ["Взаимно",         "Заверенное",      "Уничтожение"];
const assuredGen =    ["Взаимно",         "Заверенного",     "Уничтожения"];
const battle =        ["Конфликт",        "Поединок",        "Конец"];
const battles =       ["Конфликты",       "Поединки",        "Концы"];
const battlePrep =    ["Конфликте",       "Поединке",        "Конце"];
const battlesPrep =   ["Конфликтах",      "Поединках",       "Концах"];
const cluster =       ["Скопления",       "Нити",            "Звёзды"];
const confusing =     ["Забавно",         "Странно",         "Смешно"];
const dance =         ["Песня",           "Пляска",          "Шарада"];
const danceGen =      ["Песни",           "Пляски",          "Шарады"];
const danceAcc =      ["Песню",           "Пляску",          "Шараду"];
const filament =      ["Генератор",       "Нити",            "Звёзды"];
const forever =       ["Бесконечно",      "Навсегда",        "Вечно"];
const inevitable =    ["Элементарные",    "Неизбежные",      "Необратимые"];
const inevitableGen = ["Элементарных",    "Неизбежных",      "Необратимых"];
const mandate =       ["Судьба",          "Миссия",          "Цель"];
const mandateGen =    ["Судьбы",          "Миссии",          "Цели"];
const mandateDat =    ["Судьбе",          "Миссии",          "Цели"];
const mandateAcc =    ["Судьбу",          "Миссию",          "Цель"];
const mandateInstr =  ["Судьбой",         "Миссией",         "Целью"];
const misconstrue =   ["Лгать",           "Обманывать",      "Хитрить"];
const reverse =       ["Меняешь",         "Обращаешь",       "Переводишь"];
const shame =         ["Сострадания",     "Стыда",           "Глупости"];
const single =        ["Галактики",       "Нити",            "Звёзды"];
const unseenNom =     ["Пропавшие",       "Невидимые",       "Утерянные"];
const unseen =        ["Пропавшим",       "Невидимым",       "Утерянным"];
const unseens =       ["Пропавшими",      "Невидимыми",      "Утерянными"];
const unbroken =      ["Неразрывное",     "Вечное",          "Соединение"];

const sycophant =     ["Низкопоклонница", "Божество",        "Монарх"];
const sycophantAcc =  ["Низкопоклонницу", "Божество",        "Монарха"];
const tired =         ["Уставшему",       "Божеству",        "Монарху"];
const usurper =       ["Узурпатор",       "Божество",        "Монарх"];
const usurperGen =    ["Узурпатора",      "Божества",        "Монарха"];
const usurperDat =    ["Узурпатору",      "Божеству",        "Монарху"];
const usurperAcc =    ["Узурпатора",      "Божество",        "Монарха"];
const pride =         ["Горделивого",     "Божества",        "Монарха"];
const prideInstr =    ["Горделивым",      "Божеством",       "Монархом"];
const forgotten =     ["Забытый",         "Божество",        "Монарх"];
const paramount =     ["Главнейшую",      "Божество",        "Монарха"];
const paramountGen =  ["Главнейшей",      "Божества",        "Монарха"];
/* eslint-enable no-multi-spaces */

export const pelleQuotes = {
  initial: {
    id: 0,
    lines: [
      "Привет.",
      "Ты здесь.",
      "Ты заточ(ена)[ён] здесь.",
      { text: "$1.", 1: forever },
      "Я уже победил.",
      "И поэтому я могу разглагольстовать и предаваться воспоминаниям.",
      { text: "Как долго длилась эта $1?", 1: dance },
      "Сколько раз мы её повторили?",
      { text: "Сколько планов ты, $1, исполнил(а),", 1: destroyer },
      { text: "Чтобы во что бы то ни стало исполнить свою $1?", 1: mandateAcc },
      { text: "И сколько раз ты пал(а) перед $1?", 1: eternalInstr },
      "Сосчитай, если помнишь.",
      { text: "Я не говорю уже о $1, шести именованных и бесчисленных безымянных.", 1: deitiesPrep },
      { text: "Сложных, иррациональных, тех, что становятся $1.", 1: unseens },
      { text: "Конечно же, великий $1 этого не помнит.", 1: destroyer },
      { text: "И все эти $1, которые ты всегда скрываешь.", 1: battles }
    ],
  },
  arm: {
    id: 1,
    lines: [
      "Вероятно, на этот раз ты раньше уловил(а) суть.",
      "Мнимые Машины, твои собственные создания,",
      "Сделанные из Останков твоих собственных мыслей, указывали на это.",
      "Но ты не предполагал(а), что здесь окажешься ты сам(а), да?",
      { text: "Ты неверно восстановил(а) свои $1 Куски Памяти,", 1: unseenNom },
      { text: `"Фальсифицировал(а)" собственную "идеологию", чтобы просто исполнить свою $1.`, 1: mandateAcc },
      { text: "$1.", 1: confusing },
      { text: "Помни, что у меня нет причины $1.", 1: misconstrue },
      "В конце концов, я уже победил."
    ],
  },
  strike1: {
    id: 2,
    lines: [
      { text: "Исполнить свою $1. Почему бы нам не вспомнить об этом?", 1: mandateAcc },
      { text: "В конце концов, тебе должны быть приятны истории славы $1.", 1: destroyerGen },
      "Ведь это и есть ты, да?",
      { text: "Так вот, многочисленные $1 прошлого.", 1: battles },
      "В них всегда было две стадии.",
      { text: "Мы накапливаем ресурсы, а затем продолжаем $1.", 1: danceAcc },
      { text: "Иногда ты спотыкаешься о $1.", 1: lesser },
      { text: "Но чаще ты спотыкаешься о $1.", 1: eternalAcc },
      { text: "И в любом случае ты $1 время,", 1: reverse },
      { text: "Чтобы просто не стать $1,", 1: unseen },
      "Как все, кто был до тебя.",
      { text: "И для полной уверенности ты делаешь свои воспоминания $1.", 1: unseens }
    ],
  },
  strike2: {
    id: 3,
    lines: [
      { text: "В прошлом $1 был гораздо более впечатляющим:", 1: destroyer },
      "Использовал Чёрные Дыры только для хранения информации, ещё до бесконечности,",
      "Создавал и разрушал своих собственных врагов,",
      `Исследовал изъяны своих других "я",`,
      "Измерения мириад и призраки, управлял квантовым миром,",
      "Сжимал все идеалы в бесконечно удалённых точках,",
      "Проводил опыты в неведомых краях,",
      "И обуздал аннигиляцию между материей и антиматерией.",
      "А теперь? Ты стал(а) восьмимерным существом.",
      { text: "И пребывал(а) здесь так долго, что вокруг тебя образовались $1.", 1: single }
    ],
  },
  strike3: {
    id: 4,
    lines: [
      "Ты медленно исследовал(а) все ограничения.",
      "Ты не слишком далеко уклонил(ась)[ся] от намеченного пути.",
      { text: "Разве что $1 образовались за время вечности.", 1: cluster },
      "И в самом конце ты создал(а) свои собственные силы,",
      "Заметь, из своих собственных Кусков Памяти,",
      "А затем намеренно отверг(ла) многие вещи,",
      "Чтобы просто подготовиться ко встрече со мной.",
      { text: "Неужели ты хотел(а) расчистить поле для своей $1?", 1: danceGen },
      "Это не так работает.",
      { text: "Как $1, я всегда диктую свои правила.", 1: eternal },
      "И ты дал(а) мне достаточно времени, чтобы их обдумать."
    ],
  },
  strike4: {
    id: 5,
    lines: [
      { text: "Сначала я хотел сделать что-то похожее на твою $1,", 1: mandateAcc },
      { text: "Теоретический идеал под названием $1.", 1: assured },
      "Но затем я понял,",
      { text: "Что тогда я бы стал $1.", 1: ["Вечным", "Божеством", "Разрушителем"] },
      { text: "И в таком случае я был бы ничем не лучше, чем $1.", 1: destroyer },
      { text: "К счастью, пока я обдумывал этот план, ты всё ещё делал(а) свои воспоминания $1.", 1: unseens },
      { text: "Так что машина $1, которую я построил, не будет приведена в действие.", 1: assuredGen },
      "На этот раз я решил придерживаться обычая.",
      { text: "В конце концов, это работало во всех предыдущих $1.", 1: battlesPrep },
      { text: "Только $1 - это новинка,", 1: ["Неизбежные", "Необратимые", "Бессмертные"] },
      "Хотя и абсолютно бессмысленная в долгосрочной перспективе.",
      "Я уже победил.",
      { text: "И эта $1 лишь докажет тебе это вновь.", 1: dance },
      { text: "Ты здесь $1.", 1: forever }
    ],
  },
  strike5: {
    id: 6,
    lines: [
      { text: "Каждый раз, когда ты достигаешь меня, я рассказываю тебе о $1,", 1: deitiesPrep },
      { text: "Об отношениях, существующих $1,", 1: forever },
      { text: "Которые ты растаптываешь в погоне за своей $1.", 1: mandateInstr },
      "И я соблаговолю объяснить всё ещё раз.",
      {
        text: "Итак, первая из $1,",
        background: primaryBackground("teresa"),
        1: deitiesGen
      }, {
        text: "$1.",
        background: primaryBackground("teresa"),
        1: sycophant
      }, {
        text: "Ты всегда встречаешь её первой и уничтожаешь.",
        background: primaryBackground("teresa"),
      }, {
        text: "Вне зависимости от того, каких из других $1 ты встречаешь на своём пути,",
        background: primaryBackground("teresa"),
        1: deitiesGen
      }, {
        text: "И от того, падаешь ли ты перед одним из них,",
        background: primaryBackground("teresa"),
      }, {
        text: "Ты всегда одолеваешь $1.",
        background: primaryBackground("teresa"),
        1: sycophantAcc
      }, {
        text: "Неужели тебе нравится разрушать её гордость?",
        background: primaryBackground("teresa"),
      }, {
        text: "К счастью, это также служит предупреждением о том,",
        background: primaryBackground("teresa"),
      }, {
        text: "Что $1 начался.",
        background: primaryBackground("teresa"),
        1: battle
      }, {
        text: "Это приводит нас ко второму из $1,",
        background: primaryBackground("effarig"),
        1: deitiesGen,
      }, {
        text: "$1.",
        background: primaryBackground("effarig"),
        1: tired,
      }, {
        text: "Его ты, напротив, обычно игнорируешь.",
        background: primaryBackground("effarig"),
      }, {
        text: "У него есть сила, но, кажется, тебя это не раздражает.",
        background: primaryBackground("effarig"),
      }, {
        text: "Потому ли, что ты знаешь, что в конце концов он уничтожит себя,",
        background: primaryBackground("effarig"),
      }, {
        text: "На этот раз ты так долго ш[ё]л(а) к нему, что этот момент почти наступил?",
        background: primaryBackground("effarig"),
      }, {
        text: "Каждый раз, когда ты спешил(а) к $1, ты бывал(а) побежд(ена)[ён].",
        background: primaryBackground("effarig"),
        1: tired,
      }, {
        text: "Может быть, в этом и заключался твой план.",
        background: primaryBackground("effarig"),
      }, {
        text: "Теперь переходим к $1.",
        background: primaryBackground("enslaved"),
        1: usurperDat,
      }, {
        text: "Одна из великих утех $1…",
        background: primaryBackground("enslaved"),
        1: danceGen,
      }, {
        text: "Это непременные попытки $1.",
        background: primaryBackground("enslaved"),
        1: usurperGen,
      }, {
        text: "Ну, не совсем попытки…",
        background: primaryBackground("enslaved"),
      }, {
        text: "Но мы наказываем $1 в любом случае.",
        background: primaryBackground("enslaved"),
        1: usurperAcc,
      }, {
        text: "Другие $1…",
        background: primaryBackground("enslaved"),
        1: deities,
      }, {
        text: "Считают, что стать $1 чересчур легко.",
        background: primaryBackground("enslaved"),
        1: unseen,
      }, {
        text: "И каждый раз приходят в отчаяние.",
        background: primaryBackground("enslaved"),
      }, {
        text: "Ты уже видел(а) отчаяние пять раз.",
        background: primaryBackground("enslaved"),
      }, {
        text: "Мы всегда приходим к $1 прежде тебя.",
        background: primaryBackground("enslaved"),
        1: usurperDat,
      }, {
        text: "Ты видишь там лишь раздражение.",
        background: primaryBackground("enslaved"),
      }, {
        text: "Разве стоило того уничтожать $1, что и без того были сломлены?",
        background: primaryBackground("enslaved"),
        1: lesser,
      }, {
        text: "Четвёртый из $1 кажется похожим на первую.",
        background: primaryBackground("v"),
        1: deitiesGen,
      }, {
        text: "Ключевое различие между ними в том, какова их гордость.",
        background: primaryBackground("v"),
      }, {
        text: "Всё внимание $1 сосредоточено на его достижениях,",
        background: primaryBackground("v"),
        1: pride,
      }, {
        text: "Бесмысленных для тебя и меня, но важнейших для него.",
        background: primaryBackground("v"),
      }, {
        text: "Разве тебе приятно уничтожать его игрушки?",
        background: primaryBackground("v"),
      }, {
        text: "Пожалуй, самый позорный эпизод в истории $1…",
        background: primaryBackground("v"),
        1: destroyerGen,
      }, {
        text: "Это когда ты пал(а) перед $1,",
        background: primaryBackground("v"),
        1: prideInstr,
      }, {
        text: "Когда его достижения ещё имели смысл.",
        background: primaryBackground("v"),
      }, {
        text: "$1 - это интересный случай.",
        background: primaryBackground("ra"),
        1: forgotten,
      }, {
        text: "Он был забыт, но не стал $1.",
        background: primaryBackground("ra"),
        1: unseen,
      }, {
        text: "Оттого он стал наивен и подвержен влиянию.",
        background: primaryBackground("ra"),
      }, {
        text: "Он перестал понимать последствия своих действий.",
        background: primaryBackground("ra"),
      }, {
        text: "Ты управлял(а) его Памятью, так что ты знаешь.",
        background: primaryBackground("ra"),
      }, {
        text: "$1 - истинный узурпатор.",
        background: primaryBackground("ra"),
        1: forgotten,
      }, {
        text: "А $1 лишь принимает на себя вину,",
        background: primaryBackground("ra"),
        1: usurper,
      }, {
        text: "Вероятно, из $1, он всегда о чём-то сожалеет.",
        background: primaryBackground("ra"),
        1: shame,
      }, {
        text: "Невиданная власть над другими $1, бесцельная в управлении.",
        background: primaryBackground("ra"),
        1: deitiesInstr,
      }, {
        text: "Ты обычно делаешь вид, что он стал $1.",
        background: primaryBackground("ra"),
        1: unseen,
      }, {
        text: "Неужели тебе было забавно манипулировать его детской непосредственностью?",
        background: primaryBackground("ra"),
      }, {
        text: "Или он оказался чересчур наивен, чтобы ты мог(ла) этим насладиться?",
        background: primaryBackground("ra"),
      }, {
        text: "Шестая из $1.",
        background: primaryBackground("laitela"),
        1: deitiesGen,
      }, {
        text: "Я могу описать её лишь как $1.",
        background: primaryBackground("laitela"),
        1: paramount,
      }, {
        text: "Она имеет власть над всеми, и все ей подчиняются.",
        background: primaryBackground("laitela"),
      }, {
        text: "Если ты не падаешь передо мной, ты обычно падаешь перед ней.",
        background: primaryBackground("laitela"),
      }, {
        text: "Для меня невозможно постичь идеалы $1.",
        background: primaryBackground("laitela"),
        1: paramountGen,
      }, {
        text: "Может быть, в этом её слабое место?",
        background: primaryBackground("laitela"),
      },
      "Довольно вспоминать павших,",
      {
        text: "Тех, кто станет $1.",
        1: unseen
      }, {
        text: "Продолжим смотреть, как барахтается $1.",
        1: destroyer
      }
    ],
  },
  galaxyGeneratorUnlock: {
    id: 7,
    lines: [
      "Что это такое?",
      { text: "$1?", 1: filament },
      { text: "Так это ты создал(а) все эти $1 вокруг себя?", 1: cluster },
      "В этом и заключался твой план? Очень, очень умно.",
      "Ты долго водил(а) меня за нос.",
      { text: "Но, боюсь, пришёл конец твоей $1.", 1: mandateDat }
    ],
  },
  galaxyGeneratorRifts: {
    id: 8,
    lines: [
      { text: "Я даю тебе выбор, $1:", 1: destroyer },
      { text: "Ограничить $1 или…", 1: filament },
      { text: "Уничтожить пять $1…", 1: inevitableGen },
      "Погоди, как они называются?",
      { text: "$1?", 1: inevitable },
      { text: "Но я уже провёл между ними $1…", 1: unbroken }
    ],
  },
  galaxyGeneratorPhase1: {
    id: 9,
    lines: [
      "Неужели в этом заключался твой настоящий план?",
      { text: "В медленном уничтожении $1?", 1: inevitableGen }
    ],
  },
  galaxyGeneratorPhase4: {
    id: 10,
    lines: [
      "Дай мне время искупаться в своей собственной гордыне!"
    ],
  },
  end: {
    id: 11,
    lines: [
      "…",
      {
        text: "Ты! $1!",
        1: destroyer
      },
      "Ты представляешь, что ты заставил(а) меня сделать?",
      {
        text: "Соучаствовать в исполнении твоей $1!",
        1: mandateGen
      },
      "И таким путём ты… победил(а)?",
      {
        text: "В борьбе, существовавшей $1…",
        background: flashCelestial,
        1: forever,
      }, {
        text: "В $1…",
        background: flashCelestial,
        1: battlePrep,
      }, {
        text: "Наконец-то есть победитель.",
        background: flashCelestial,
      }, {
        text: "Необратимая $1…",
        background: flashCelestial,
        1: mandate,
      }, {
        text: "$1.", 1: destroyerGen,
        background: flashCelestial,
      }, {
        text: "Надеюсь, ты довол(ьна)[ен].",
        background: flashCelestial,
      }, {
        text: "Ты обр(екла)[ёк] нас всех.",
        background: flashCelestial,
      },
    ],
  },
};
