import { DC } from "../../constants";

export const PERK_FAMILY = {
  ANTIMATTER: "ANTIMATTER",
  INFINITY: "INFINITY",
  ETERNITY: "ETERNITY",
  DILATION: "DILATION",
  REALITY: "REALITY",
  AUTOMATION: "AUTOMATION",
  ACHIEVEMENT: "ACHIEVEMENT",
};

// This function isn't used in-game, see note below for its intended usage
// eslint-disable-next-line no-unused-vars
function vectorToNum(v) {
  return Math.floor(v.x / 5) + 400 * Math.floor(v.y / 5) + 80200;
}

/**
 * In order to reduce boilerplate code and excessive Vector object declarations, the node positions in fixed layouts
 * are specified as numbers which are decoded on-the-fly using positionNumToVector in PerksTab.vue. The function
 * vectorToNum above is the inverse of that function.
 *
 * To make a new preset layout, define vectorToNum in the console, move all the nodes around in-game and then run
 *    Object.values(PerkNetwork.network.body.nodes).filter(n => n.edges.length !== 0).map(v => vectorToNum(v))
 * in the console to get all the current node positions. Then, append the resulting numbers to each layoutPosList
 * array below and make the appripriate entry in PerkLayouts.
 *
 * Note: This encoding/decoding only works properly for coordinates with values between -1000 and 1000, and will
 * be slightly off for vectors whose coordinates aren't divisible by 5
 */
export const perks = {
  firstPerk: {
    id: 0,
    label: "СТАРТ",
    family: PERK_FAMILY.REALITY,
    get description() {
      return `Снять требование на достижения с разблокировки реальности.
      На реальности вы можете выбрать глиф из четырёх вариантов.`;
    },
    effect: 4,
    layoutPosList: [76596, 80200, 80600, 80200, 80188, 67769],
  },
  startAM: {
    id: 10,
    label: "НАНТ",
    family: PERK_FAMILY.ANTIMATTER,
    get description() {
      return `Начинать с ${format(5e130)} антиматерии.`;
    },
    bumpCurrency: () => Currency.antimatter.bumpTo(5e130),
    effect: 5e130,
    layoutPosList: [76559, 80600, 80199, 80600, 82191, 75745],
  },
  startIP1: {
    id: 12,
    label: "НОБ1",
    family: PERK_FAMILY.INFINITY,
    get description() {
      return `Начинать с ${format(5e15)} Очков Бесконечности.`;
    },
    bumpCurrency: () => Currency.infinityPoints.bumpTo(5e15),
    effect: 5e15,
    layoutPosList: [74523, 80599, 79798, 80599, 82594, 91322],
  },
  startIP2: {
    id: 13,
    label: "НОБ2",
    family: PERK_FAMILY.INFINITY,
    get description() {
      return `Начинать с ${format(5e130)} Очков Бесконечности.`;
    },
    bumpCurrency: () => Currency.infinityPoints.bumpTo(5e130),
    effect: 5e130,
    layoutPosList: [62111, 80598, 79797, 80998, 82597, 91690],
  },
  startEP1: {
    id: 14,
    label: "НОВ1",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Начинать с ${formatInt(10)} Очков Вечности.`;
    },
    bumpCurrency: () => Currency.eternityPoints.bumpTo(10),
    effect: 10,
    automatorPoints: 5,
    shortDescription: () => `Начинать с ${formatInt(10)} ОВ`,
    layoutPosList: [88915, 80999, 79398, 80598, 82197, 103734],
  },
  startEP2: {
    id: 15,
    label: "НОВ2",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Начинать с ${formatInt(5000)} Очков Вечности.`;
    },
    bumpCurrency: () => Currency.eternityPoints.bumpTo(5000),
    effect: 5000,
    layoutPosList: [92484, 81398, 78998, 80597, 82200, 102193],
  },
  startEP3: {
    id: 16,
    label: "НОВ3",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Начинать с ${format(5e9)} Очков Вечности.`;
    },
    bumpCurrency: () => Currency.eternityPoints.bumpTo(5e9),
    effect: 5e9,
    automatorPoints: 10,
    shortDescription: () => `Начинать с ${format(5e9)} ОВ`,
    layoutPosList: [96459, 81798, 78997, 80596, 82203, 106224],
  },
  startTP: {
    id: 17,
    label: "НТАХ",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `Получать ${formatInt(10)} Тахионов при разблокировке Замедления Времени.`;
    },
    effect: () => (Enslaved.isRunning ? 1 : 10),
    automatorPoints: 5,
    shortDescription: () => `Начинать с ${formatInt(10)} Тахионами`,
    layoutPosList: [102120, 81399, 79399, 80197, 81800, 109376],
  },
  antimatterNoReset: {
    id: 30,
    label: "АНТНС",
    family: PERK_FAMILY.ANTIMATTER,
    description: "При получении Расширений Измерений и Галактик Антиматерии ничего не сбрасывается, кроме, может быть, Расширений Измерений.",
    layoutPosList: [85343, 81000, 79799, 80199, 82194, 92553],
  },
  studyPassive: {
    id: 31,
    label: "СРЕДН",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Улучшить эффекты Исследований Времени 122, 132 (только к скорости репликации) и 142 до ${formatX(50)},
        ${formatX(3)} и ${formatX(DC.E50)} соответственно.`;
    },
    layoutPosList: [67054, 79400, 80999, 80202, 78594, 52589],
  },
  autounlockEU1: {
    id: 40,
    label: "УВ1",
    family: PERK_FAMILY.ETERNITY,
    description: "Улучшения Вечности из первого ряда выдаются вам автоматически, как только у вас появляются вечности.",
    layoutPosList: [89407, 80601, 80201, 79800, 80591, 73007],
  },
  autounlockEU2: {
    id: 41,
    label: "УВ2",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Цены Улучшений Вечности из второго ряда
        в ${format(1e10)} раз ниже. Вы получаете их автоматически, как только наберёте достаточное количество Очков Вечности.`;
    },
    layoutPosList: [103008, 81001, 80202, 79400, 80594, 81867],
  },
  autounlockDilation1: {
    id: 42,
    label: "УЗ1",
    family: PERK_FAMILY.DILATION,
    description: "Улучшения Замедления из второго ряда выдаются вам автоматически при разблокировке Замедления Времени.",
    layoutPosList: [119833, 81801, 79403, 79398, 80200, 97510],
  },
  autounlockDilation2: {
    id: 43,
    label: "УЗ2",
    family: PERK_FAMILY.DILATION,
    description: "Улучшения Замедления из третьего ряда выдаются вам автоматически при разблокировке Замедления Времени.",
    layoutPosList: [124260, 82201, 79003, 79397, 80203, 85513],
  },
  autounlockDilation3: {
    id: 44,
    label: "УЗТВ",
    family: PERK_FAMILY.DILATION,
    description: "Вы автоматически покупаете Улучшение Замедления, производящее Теоремы Времени.",
    automatorPoints: 5,
    shortDescription: () => "Автоматика производителя ТВ",
    layoutPosList: [124289, 82601, 79002, 79396, 80206, 72282],
  },
  autounlockTD: {
    id: 45,
    label: "АРИВ",
    family: PERK_FAMILY.DILATION,
    description: "Вы автоматически разблокируете Измерения Времени с 5-го по 8-е.",
    automatorPoints: 5,
    shortDescription: () => "Автоматика разблокировки ИВ",
    layoutPosList: [127117, 82600, 79001, 79796, 80209, 61869],
  },
  autounlockReality: {
    id: 46,
    label: "РЕАЛ",
    family: PERK_FAMILY.REALITY,
    description: "Вы автоматически разблокируете реальность.",
    automatorPoints: 10,
    shortDescription: () => "Автоматика разблокировки реальности",
    layoutPosList: [124343, 83000, 79000, 79795, 80212, 71046],
  },
  bypassIDAntimatter: {
    id: 51,
    label: "ТИБ",
    family: PERK_FAMILY.INFINITY,
    description: "Измерения Бесконечности всегда разблокированы.",
    layoutPosList: [51317, 80998, 79397, 80997, 82600, 104489],
  },
  bypassTGReset: {
    id: 52,
    label: "ЗВНС",
    family: PERK_FAMILY.DILATION,
    description: "При покупке Улучшений Замедлений не сбрасывается Замедленное Время.",
    layoutPosList: [116568, 81800, 79801, 79798, 81400, 112677],
  },
  bypassECDilation: {
    id: 53,
    label: "ТЗВ",
    family: PERK_FAMILY.DILATION,
    description: "Снять все требования с разблокировки Замедления Времени.",
    automatorPoints: 5,
    shortDescription: () => `Снять требования Замедления`,
    layoutPosList: [129011, 81802, 80203, 80198, 80600, 109116],
  },
  bypassEC1Lock: {
    id: 54,
    label: "ТИСПВ1",
    family: PERK_FAMILY.ETERNITY,
    description: "Для покупки Исследования Времени 181 не требуется выполнение 1-го Испытания Вечности.",
    layoutPosList: [64284, 79000, 81399, 80603, 78597, 44167],
  },
  bypassEC2Lock: {
    id: 55,
    label: "ТИСПВ2",
    family: PERK_FAMILY.ETERNITY,
    description: "Для покупки Исследования Времени 181 не требуется выполнение 2-го Испытания Вечности.",
    layoutPosList: [55463, 78999, 80998, 80602, 78197, 48944],
  },
  bypassEC3Lock: {
    id: 56,
    label: "ТИСПВ3",
    family: PERK_FAMILY.ETERNITY,
    description: "Для покупки Исследования Времени 181 не требуется выполнение 3-го Испытания Вечности.",
    layoutPosList: [75475, 79001, 81400, 80203, 78997, 47822],
  },
  bypassEC5Lock: {
    id: 57,
    label: "ТИСПВ5",
    family: PERK_FAMILY.ETERNITY,
    description: "Для покупки Исследования Времени 62 не требуется выполнение 5-го Испытания Вечности.",
    layoutPosList: [70626, 79800, 81000, 80201, 78591, 62607],
  },
  autocompleteEC1: {
    id: 60,
    label: "АИСПВ1",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Каждые ${formatInt(60)} минут по реальному времяисчислению вы автоматически получаете одно выполнение Испытания Вечности с наименьшим номером, которое ещё не полностью выполнено.`;
    },
    effect: 60,
    automatorPoints: 5,
    shortDescription: () => "Автоматическое выполнение ИспВ",
    layoutPosList: [90660, 79402, 81002, 79803, 79397, 46664],
  },
  autocompleteEC2: {
    id: 61,
    label: "АИСПВ2",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Улучшить интервал автоматического выполнения Испытаний Вечности до ${formatInt(40)} минут.`;
    },
    effect: 40,
    layoutPosList: [95485, 79002, 81402, 79804, 79400, 53486],
  },
  autocompleteEC3: {
    id: 62,
    label: "АИСПВ3",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Улучшить интервал автоматического выполнения Испытаний Вечности до ${formatInt(20)} минут.`;
    },
    effect: 20,
    automatorPoints: 10,
    shortDescription: () => `Автоматическое выполнение ИспВ быстрее`,
    layoutPosList: [96311, 78602, 81401, 80204, 79403, 61903],
  },
  studyActiveEP: {
    id: 70,
    label: "АКТ",
    family: PERK_FAMILY.ETERNITY,
    description: "Эффекты Исследований Времени из активного пути всегда принимают максимальные значения.",
    layoutPosList: [56633, 79399, 80599, 80601, 78194, 58565],
  },
  studyIdleEP: {
    id: 71,
    label: "ПАСС",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Эффекты Исследований Времени из пассивного пути таковы, как будто последний сброс престижа был на ${formatInt(15)} минут раньше.`;
    },
    effect: 15,
    layoutPosList: [80248, 79401, 81001, 79802, 78994, 56239],
  },
  studyECRequirement: {
    id: 72,
    label: "ТИСПВ",
    family: PERK_FAMILY.ETERNITY,
    description: "Снять все требования на разблокировку Испытаний Вечности.",
    automatorPoints: 10,
    shortDescription: () => "Снять требования ИспВ",
    layoutPosList: [62714, 78600, 81398, 80604, 78600, 40599],
  },
  studyECBulk: {
    id: 73,
    label: "ОИСПВ",
    family: PERK_FAMILY.ETERNITY,
    description: "Разблокировать оптовое выполнение Испытаний Вечности.",
    automatorPoints: 15,
    shortDescription: () => "Опт ИспВ",
    layoutPosList: [62741, 78200, 81397, 81004, 78603, 41435],
  },
  retroactiveTP1: {
    id: 80,
    label: "ТАХ1",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `При покупке утроителя Тахионов ваше количество Тахионов
        увеличивается в ${formatFloat(1.5, 1)} раза.`;
    },
    effect: 1.5,
    layoutPosList: [111739, 81799, 79800, 79797, 81403, 115434],
  },
  retroactiveTP2: {
    id: 81,
    label: "ТАХ2",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `При покупке утроителя Тахионов ваше количество Тахионов
        увеличивается в ${formatInt(2)} раза.`;
    },
    effect: 2,
    layoutPosList: [103757, 82199, 79401, 80196, 81406, 117382],
  },
  retroactiveTP3: {
    id: 82,
    label: "ТАХ3",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `При покупке утроителя Тахионов ваше количество Тахионов
        увеличивается в ${formatFloat(2.5, 1)} раза.`;
    },
    effect: 2.5,
    layoutPosList: [96175, 82599, 79400, 80195, 81409, 116540],
  },
  retroactiveTP4: {
    id: 83,
    label: "ТАХ4",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `При покупке утроителя Тахионов ваше количество Тахионов
        увеличивается в ${formatInt(3)} раза.`;
    },
    effect: 3,
    automatorPoints: 10,
    shortDescription: () => "Утроитель Тахионов имеет обратную силу",
    layoutPosList: [86984, 82598, 78999, 80595, 81412, 114103],
  },
  autobuyerDilation: {
    id: 100,
    label: "АУЗ",
    family: PERK_FAMILY.AUTOMATION,
    description: "Разблокировать автоматику повторяемых Улучшений Замедления.",
    automatorPoints: 5,
    shortDescription: () => "Автоматика Улучшений Замедления",
    layoutPosList: [117401, 81401, 79802, 79799, 80597, 96672],
  },
  autobuyerFasterID: {
    id: 101,
    label: "САИБ",
    family: PERK_FAMILY.AUTOMATION,
    description: "Понизить интервал автоматики Измерений Бесконечности втрое.",
    effect: 1 / 3,
    automatorPoints: 5,
    shortDescription: () => "Ускорение автоматики ИБ",
    layoutPosList: [74095, 80199, 80198, 81000, 82997, 77720],
  },
  autobuyerFasterReplicanti: {
    id: 102,
    label: "САУР",
    family: PERK_FAMILY.AUTOMATION,
    description: "Понизить интервал автоматики Улучшений Репликанти втрое.",
    effect: 1 / 3,
    automatorPoints: 5,
    shortDescription: () => "Ускорение автоматики Улучшений Репликанти",
    layoutPosList: [57685, 80198, 80197, 80999, 83000, 79297],
  },
  autobuyerFasterDilation: {
    id: 103,
    label: "САУЗ",
    family: PERK_FAMILY.AUTOMATION,
    description: "Понизить интервал автоматики Улучшений Замедления втрое.",
    effect: 1 / 3,
    automatorPoints: 5,
    shortDescription: () => "Ускорение автоматики Улучшений Замедления",
    layoutPosList: [113895, 82602, 79402, 79395, 80609, 72715],
  },
  ttBuySingle: {
    id: 104,
    label: "АТВ",
    family: PERK_FAMILY.AUTOMATION,
    description: "Разблокировать автоматику Теорем Времени в режиме одиночных покупок.",
    automatorPoints: 5,
    shortDescription: () => "Автоматика одиночных ТВ",
    layoutPosList: [44631, 79398, 80598, 81001, 77797, 57325],
  },
  ttFree: {
    id: 105,
    label: "ТВНТ",
    family: PERK_FAMILY.AUTOMATION,
    description: "При покупке Теорем Времени вы ничего не тратите.",
    layoutPosList: [33840, 78998, 80597, 81002, 77800, 67309],
  },
  ttBuyMax: {
    id: 106,
    label: "АТВМ",
    family: PERK_FAMILY.AUTOMATION,
    description: "Автоматика Теорем Времени покупает максимум.",
    automatorPoints: 10,
    shortDescription: () => "Полноценная автоматика ТВ",
    layoutPosList: [25055, 78598, 80997, 81003, 77803, 65739],
  },
  dilationAutobuyerBulk: {
    id: 107,
    label: "ОУЗ",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Улучшить опт Улучшений Замедления до ${formatInt(3)}.`;
    },
    effect: 3,
    automatorPoints: 5,
    shortDescription: () => "Опт Улучшений Замедления",
    layoutPosList: [127384, 81400, 79803, 79399, 81000, 103048],
  },
  achievementGroup1: {
    id: 201,
    label: "ДОСТ1",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Улучшить интервал автоматического восстановления достижений до ${formatInt(20)} минут.`;
    },
    effect: 10,
    automatorPoints: 5,
    shortDescription: () => `Достижения восстанавливаются быстрее`,
    layoutPosList: [65386, 80201, 80601, 79801, 79791, 81371],
  },
  achievementGroup2: {
    id: 202,
    label: "ДОСТ2",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Улучшить интервал автоматического восстановления достижений до ${formatInt(12)} минут.`;
    },
    effect: 8,
    layoutPosList: [54976, 80202, 80602, 79401, 79794, 93780],
  },
  achievementGroup3: {
    id: 203,
    label: "ДОСТ3",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Улучшить интервал автоматического восстановления достижений до ${formatInt(6)} минут.`;
    },
    effect: 6,
    layoutPosList: [44168, 80602, 80603, 79402, 79797, 83005],
  },
  achievementGroup4: {
    id: 204,
    label: "ДОСТ4",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Улучшить интервал автоматического восстановления достижений до ${formatInt(2)} минут.`;
    },
    effect: 4,
    layoutPosList: [33760, 81002, 81003, 79403, 79800, 95422],
  },
  achievementGroup5: {
    id: 205,
    label: "ДОСТНС",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Все достижения из первых ${formatInt(13)} рядов всегда выполнены.`;
    },
    automatorPoints: 10,
    shortDescription: () => "Достижения не сбрасываются",
    layoutPosList: [23353, 81402, 81403, 79404, 79803, 84639],
  }
};

export const perkConnections = (function() {
  const p = perks;
  // First item is the start, other items are the ends
  const groups = [
    [p.firstPerk, p.achievementGroup1, p.startAM, p.autounlockEU1, p.bypassEC5Lock],
    [p.startAM, p.antimatterNoReset, p.startIP1],
    [p.antimatterNoReset, p.startEP1],
    [p.startIP1, p.startIP2, p.startEP1, p.autobuyerFasterID],
    [p.startIP2, p.bypassIDAntimatter, p.autobuyerFasterReplicanti],
    [p.startEP1, p.startEP2, p.startTP],
    [p.startEP2, p.startEP3],
    [p.startTP, p.startEP1, p.retroactiveTP1],
    [p.autounlockEU1, p.autounlockEU2],
    [p.autounlockEU2, p.autounlockEU1, p.autobuyerDilation],
    [p.autounlockDilation1, p.autounlockDilation2],
    [p.autounlockDilation2, p.autounlockDilation3],
    [p.autounlockDilation3, p.autobuyerFasterDilation, p.autounlockTD],
    [p.autounlockTD, p.autounlockReality],
    [p.bypassTGReset, p.autobuyerDilation, p.retroactiveTP1],
    [p.bypassEC1Lock, p.bypassEC2Lock, p.bypassEC3Lock, p.studyECRequirement],
    [p.bypassEC2Lock, p.studyActiveEP, p.bypassEC1Lock],
    [p.bypassEC3Lock, p.studyIdleEP, p.bypassEC1Lock],
    [p.bypassEC5Lock, p.studyActiveEP, p.studyIdleEP, p.studyPassive],
    [p.studyPassive, p.bypassEC1Lock],
    [p.autocompleteEC1, p.autocompleteEC2],
    [p.autocompleteEC2, p.autocompleteEC3],
    [p.studyActiveEP, p.bypassEC2Lock, p.ttBuySingle],
    [p.studyIdleEP, p.bypassEC3Lock, p.autocompleteEC1],
    [p.studyECRequirement, p.studyECBulk],
    [p.retroactiveTP1, p.bypassTGReset, p.startTP, p.retroactiveTP2],
    [p.retroactiveTP2, p.retroactiveTP3],
    [p.retroactiveTP3, p.retroactiveTP4],
    [p.autobuyerDilation, p.autounlockEU2, p.autounlockDilation1,
      p.bypassECDilation, p.bypassTGReset, p.dilationAutobuyerBulk],
    [p.autobuyerFasterID],
    [p.ttBuySingle, p.ttFree],
    [p.ttFree, p.ttBuyMax],
    [p.achievementGroup1, p.achievementGroup2],
    [p.achievementGroup2, p.achievementGroup3],
    [p.achievementGroup3, p.achievementGroup4],
    [p.achievementGroup4, p.achievementGroup5],
  ];
  const connections = {};
  for (const perk of Object.values(perks)) {
    const connectedPerks = [];
    const directConnections = groups.find(g => g[0] === perk);
    if (directConnections !== undefined) {
      connectedPerks.push(...directConnections.slice(1));
    }
    const indirectConnections = groups
      .filter(g => g.slice(1).some(groupPerk => groupPerk === perk))
      .map(g => g[0]);
    connectedPerks.push(...indirectConnections);
    connections[perk.id] = [...new Set(connectedPerks.map(connectedPerk => connectedPerk.id))];
  }
  return connections;
}());
