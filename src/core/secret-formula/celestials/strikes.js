import { DC } from "../../constants";
import wordShift from "../../word-shift";

export const pelleStrikes = {
  infinity: {
    id: 1,
    requirementDescription: "Бесконечность",
    penaltyDescription: () => `множители Измерений Антиматерии возведены в степень ${format(0.5, 1, 1)}`,
    rewardDescription: () => `разблокировать ${wordShift.wordCycle(PelleRifts.vacuum.config.nameObjective)}
      и автоматику Большого Сжатия`,
    rift: () => PelleRifts.vacuum
  },
  powerGalaxies: {
    id: 2,
    requirementDescription: "Усиление галактик",
    penaltyDescription: () => `множители Измерений Бесконечности возведены в степень ${format(0.5, 1, 1)}`,
    rewardDescription: () => `разблокировать ${wordShift.wordCycle(PelleRifts.decay.config.nameObjective)}`,
    rift: () => PelleRifts.decay
  },
  eternity: {
    id: 3,
    requirementDescription: "Вечность",
    penaltyDescription: () => `после ${format(DC.E2000)} Репликанти их рост замедляется ещё сильнее`,
    rewardDescription: () => `разблокировать ${wordShift.wordCycle(PelleRifts.chaos.config.nameObjective)}`,
    rift: () => PelleRifts.chaos
  },
  ECs: {
    id: 4,
    requirementDescription: () => `${formatInt(115)} Теорем Времени`,
    penaltyDescription: () => `внутри Испытаний Вечности эффект ${wordShift.wordCycle(["Вакуума", "Полости", "Пустоты"])}
      возведён в степень ${format(0.3, 1, 1)} и ограничен целью, возведённой в степень ${format(0.15, 2, 2)}`,
    rewardDescription: () => `разблокировать ${wordShift.wordCycle(PelleRifts.recursion.config.nameObjective)}`,
    rift: () => PelleRifts.recursion
  },
  dilation: {
    id: 5,
    requirementDescription: "Замедление Времени",
    penaltyDescription: () => `Замедление Времени необратимо. Ваши Очки Вечности конфискуются, а рекордные количества ресурсов,
      которые используются для подсчёта получения Останков, выставляются на ${format(Decimal.pow(10, 180000))} антиматерии,
      ${format(Decimal.pow(10, 60000))} ОБ и ${format(Decimal.pow(10, 1050))} ОВ`,
    rewardDescription: () => `разблокировать ${wordShift.wordCycle(PelleRifts.paradox.config.nameObjective)}. Формула получения
      Останков улучшена`,
    rift: () => PelleRifts.paradox
  }
};
