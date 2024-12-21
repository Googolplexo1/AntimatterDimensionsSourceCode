import { DC } from "../../constants";

export const effarigUnlocks = {
  adjuster: {
    id: 0,
    description: "Разблокировать корректировку весов факторов уровня глифа",
    cost: 1e7,
    onPurchased: () => {
      Effarig.quotes.unlockWeights.show();
      ui.view.tabs.reality.openGlyphWeights = true;
      Tab.reality.glyphs.show();
    }
  },
  glyphFilter: {
    id: 1,
    description: "Разблокировать Фильтр Глифов",
    cost: 2e8,
    onPurchased: () => {
      Effarig.quotes.unlockGlyphFilter.show();
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.FILTER_SETTINGS;
    }
  },
  setSaves: {
    id: 2,
    description: "Разблокировать возможность сохранять наборы глифов",
    cost: 3e9,
    onPurchased: () => {
      Effarig.quotes.unlockSetSaves.show();
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.SAVED_SETS;
    }
  },
  run: {
    id: 3,
    description: "Разблокировать Реальность Эффарига",
    cost: 5e11,
    onPurchased: () => {
      Effarig.quotes.unlockRun.show();
    }
  },
  infinity: {
    id: 4,
    label: "Бесконечность",
    get description() {
      return ` Ограничение на количество Репликанти увеличено в зависимости от количества бесконечностей
        Получать дополнительные Галактики Репликанти в зависимости от количества бесконечностей`;
    },
  },
  eternity: {
    id: 5,
    label: "Вечность",
    get description() {
      return ` Вечности производят по столько бесконечностей в секунду, сколько вы получили бы при Большом Сжатии
        Разблокировать Безымянных, Небожителя Времени`;
    },
  },
  reality: {
    id: 6,
    label: "Реальность",
    get description() {
      return " Разблокировать глифы нового типа - Глифы Эффарига (см. одноимённую статью помощи по игре)";
    },
  }
};
