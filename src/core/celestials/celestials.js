import { Effarig } from "./effarig";
import { Enslaved } from "./enslaved";
import { Laitela } from "./laitela/laitela";
import { Pelle } from "./pelle/pelle";
import { Ra } from "./ra/ra";
import { Teresa } from "./teresa";
import { V } from "./V";
import { DC } from "../constants";

export const Celestials = {
  teresa: Teresa,
  effarig: Effarig,
  enslaved: Enslaved,
  v: V,
  ra: Ra,
  laitela: Laitela,
  pelle: Pelle
};

GameDatabase.celestials.descriptions = [
  {
    name: "Teresa",
    effects() {
      return `Производство Теорем Времени Глифами Замедления отключено.
      Получение Очков Бесконечности и Очков Вечности возведено в степень ${format(0.55, 2, 2)}.`;
    },
  },
  {
    name: "Effarig",
    effects() {
      return `Множители всех измерений, скорость игры и скорость тика сильно замедлены.\
      Оба ослабления становятся мягче с каждым слоем Реальности.\
      Первые два ослабления смягчаются в зависимости от вашего количества Силы Бесконечности, а третье - Осколков Времени.
      Фактические уровни глифов имеют ограничение в ${formatInt(Effarig.glyphLevelCap)}.` + (Effarig.currentStage === 2 ? `
      (только на слое вечности) Получение Очков Бесконечности по умолчанию имеет ограничение в ${format(DC.E200)}.
      (только на слое вечности) У каждого вида множителей к получению Очков Бесконечности совокупный эффект имеет ограничение в ${format(DC.E50)}.` : "");
    },
    description() {
      return `Вы принудительно покинете Реальность Эффарига, выполнив её текущий слой.`;
    }
  },
  {
    name: "The Nameless Ones",
    effects() {
      return `Фактические уровни глифов увеличены до ${formatInt(5000)}.
      Измерения Бесконечности, Измерения Времени и 8-е Измерение Антиматерии можно покупать не более чем по одному разу.
      Множители Измерений Антиматерии всегда замедлены (соответствующий эффект глифов по-прежнему действует только в Замедлении).
      Исследование Времени 192 недоступно.
      Чёрная Дыра отключена.
      Получение Тахионов и производство Замедленного Времени сильно уменьшены.
      Производство Теорем Времени Глифами Замедления отключено.
      Цели некоторых испытаний увеличены.
      Время в секундах, которое даёт разрядка Чёрной Дыры, замедлено со степенью ${format(0.55, 2, 2)}.`;
    }
  },
  {
    name: "V",
    effects() {
      const vEffect = `Множители всех измерений, получение Очков Бесконечности, получение Очков Вечности и производство Замедленного Времени\
      в секунду возведено в степень ${format(0.5, 1, 1)}. 
      Интервал репликации в миллисекундах возведён в квадрат.`;
      const vEffectAdditional = `
      Эффект Экспоненты отключён.`;

      return Ra.unlocks.unlockGlyphAlchemy.canBeApplied
        ? vEffect + vEffectAdditional
        : vEffect;
    }
  },
  {
    name: "Ra",
    effects() {
      return `Вы начинаете с ${formatInt(4)} Расширениями Измерений и не можете получить больше.
      Множитель ускорителя всегда равен ${formatX(1.1245, 0, 3)}.`;
    },
  },
  {
    name: "Lai'tela",
    effects() {
      let disabledDims;
      const highestActive = 8 - Laitela.difficultyTier;
      switch (highestActive) {
        case 0:
          disabledDims = "всех измерений";
          break;
        case 7:
          disabledDims = "8-х Измерений всех видов";
          break;
        default:
          disabledDims = `${highestActive + 1}-х и более высоких по уровню Измерений всех видов`;
          break;
      }
      const disabledText = highestActive === 8
        ? ""
        : `Производство ${disabledDims} отключено.`;

      return `Получение Очков Бесконечности и Очков Вечности замедлено.
      Скорость игры понижена до ${formatInt(1)} и экспоненциально восстанавливается в течение ${formatInt(10)} минут.
      Вы не можете заряжать, разряжать или инвертировать Чёрную Дыру.
      ${disabledText}`;
    },
    description() {
      return `В Реальности Лайтелы производится энтропия в зависимости от вашего количества антиматерии.\
      Чтобы выполнить Реальность, нужно достигнуть ${formatPercents(1)} энтропии, при этом вы принудительно покинете Реальность\
      и получите награду в зависимости от того, насколько быстро вы выполнили её.
      Если вы дестабилизировали Реальность (выполнили быстрее, чем за ${formatInt(30)} секунд), её условие становится значительно жёстче,\
      а награда - значительно больше.\
      За ${formatInt(8)} дестабилизаций вы получите множитель ${formatX(8)} к производству Тёмной Энергии.`;
    }
  },

];
