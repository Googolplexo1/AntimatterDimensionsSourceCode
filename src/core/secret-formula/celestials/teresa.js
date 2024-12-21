export const teresa = {
  unlocks: {
    run: {
      id: 0,
      price: 1e14,
      description: "Разблокировать Реальность Терезы.",
      onUnlock: () => Teresa.quotes.unlockReality.show(),
    },
    epGen: {
      id: 1,
      price: 1e18,
      description: () => `Вы получаете ${formatPercents(0.6)} от максимального прироста Очков Вечности за время, который вам могла бы дать текущая вечность.`,
      isDisabledInDoomed: true
    },
    effarig: {
      id: 3,
      price: 1e24,
      description: "Разблокировать Эффарига, Небожителя Древних Реликвий.",
      onUnlock: () => Teresa.quotes.effarig.show(),
    },
    shop: {
      id: 2,
      price: 1e21,
      description: "Разблокировать магазин Терезы.",
    },
    undo: {
      id: 4,
      price: 1e10,
      description: "Разблокировать возможность деактивировать глифы.",
      isDisabledInDoomed: true
    },
    startEU: {
      id: 5,
      price: 1e6,
      description: "Вы начинаете со всеми Улучшениями Вечности.",
      isDisabledInDoomed: true,
      onUnlock: () => {
        for (const id of [1, 2, 3, 4, 5, 6]) player.eternityUpgrades.add(id);
      },
    }
  }
};
