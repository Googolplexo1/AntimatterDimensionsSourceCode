export const eternityMilestones = {
  autobuyerIPMult: {
    eternities: 1,
    reward: "Разблокировать автоматику удвоителей Очков Бесконечности",
    pelleUseless: true
  },
  keepAutobuyers: {
    eternities: 2,
    reward: "Начинать с выполненными Обычными Испытаниями, разблокированной автоматикой Измерений Антиматерии и ускорителей и преодолённой Бесконечностью и сохранять улучшения автоматики"
  },
  autobuyerReplicantiGalaxy: {
    eternities: 3,
    reward: "Разблокировать автоматику Галактик Репликанти"
  },
  keepInfinityUpgrades: {
    eternities: 4,
    reward: "Начинать со всеми Улучшениями Бесконечности",
    givenByPelle: () => PelleUpgrade.keepInfinityUpgrades.isBought,
    pelleUseless: true
  },
  bigCrunchModes: {
    eternities: 5,
    reward: "Разблокировать два новых режима автоматики Большого Сжатия"
  },
  autoEP: {
    eternities: 6,
    reward: () => {
      const EPmin = getOfflineEPGain(TimeSpan.fromMinutes(1).totalMilliseconds);
      const em200 = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        EternityMilestone.autoEternities.isReached).gt(0);
      const em1000 = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        EternityMilestone.autoInfinities.isReached).gt(0);
      if (!player.options.offlineProgress) return "Этот Этап производил бы ОВ, но офлайн-прогресс отключён";
      const effectText = (em200 || em1000) ? "Не действует" : `Сейчас: ${format(EPmin, 2, 2)} в минуту`;
      const realityText = PlayerProgress.realityUnlocked() ? "в текущей реальности " : "";
      const realTime = PlayerProgress.seenAlteredSpeed() ? "(по реальному времяисчислению) " : "";
      return `Производить ${formatPercents(0.25)} от рекордного прироста Очков Вечности за время
        ${realTime}${realityText}офлайн (${effectText})`;
    },
    activeCondition: () => (player.options.offlineProgress
      ? "Действует, только если оба других Этапа, производящих ресурсы офлайн, не действуют."
      : ""),
  },
  autoIC: {
    eternities: 7,
    reward: `Каждое Испытание Бесконечности автоматически считается выполненнным,
      как только вы его разблокируете. Автоматика Пожертования Измерений разблокирована всегда`,
    pelleUseless: true
  },
  keepBreakUpgrades: {
    eternities: 8,
    reward: "Начинать со всеми Улучшениями Преодоления",
    givenByPelle: () => PelleUpgrade.keepBreakInfinityUpgrades.isBought,
    pelleUseless: true
  },
  autobuyMaxGalaxies: {
    eternities: 9,
    reward: "Вы можете получать Галактики Антиматерии оптом"
  },
  unlockReplicanti: {
    eternities: 10,
    reward: "Начинать с разблокированными Репликанти",
    givenByPelle: () => PelleUpgrade.replicantiStayUnlocked.isBought,
    pelleUseless: true
  },
  autobuyerID1: {
    eternities: 11,
    reward: "Разблокировать автоматику 1-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID2: {
    eternities: 12,
    reward: "Разблокировать автоматику 2-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID3: {
    eternities: 13,
    reward: "Разблокировать автоматику 3-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID4: {
    eternities: 14,
    reward: "Разблокировать автоматику 4-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID5: {
    eternities: 15,
    reward: "Разблокировать автоматику 5-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID6: {
    eternities: 16,
    reward: "Разблокировать автоматику 6-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID7: {
    eternities: 17,
    reward: "Разблокировать автоматику 7-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID8: {
    eternities: 18,
    reward: "Разблокировать автоматику 8-х Измерений Бесконечности",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autoUnlockID: {
    eternities: 25,
    reward: "Измерения Бесконечности разблокируются автоматически"
  },
  unlockAllND: {
    eternities: 30,
    reward: "Начинать со всеми Измерениями Антиматерии доступными к покупке"
  },
  replicantiNoReset: {
    eternities: 40,
    reward: "При получении Галактик Репликанти ничего не сбрасывается, кроме Репликанти",
    pelleUseless: true
  },
  autobuyerReplicantiChance: {
    eternities: 50,
    reward: "Разблокировать автоматику Улучшения Репликанти, увеличивающего вероятность репликации",
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerReplicantiInterval: {
    eternities: 60,
    reward: "Разблокировать автоматику Улучшения Репликанти, уменьшающего интервал репликации",
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerReplicantiMaxGalaxies: {
    eternities: 80,
    reward: "Разблокировать автоматику Улучшения Репликанти, увеличивающего максимальное количество Галактик Репликанти",
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerEternity: {
    eternities: 100,
    reward: "Разблокировать автоматику вечностей"
  },
  autoEternities: {
    eternities: 200,
    reward: () => {
      if (!player.options.offlineProgress) return "Этот Этап производил бы вечности, но офлайн-прогресс отключён";
      const eternities = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        player.eternities.gte(200));
      // As far as I can tell, using templates here as Codefactor wants would lead to nested templates,
      // which seems messy to say the least.
      const realTime = PlayerProgress.seenAlteredSpeed() ? " (по реальному времяисчислению)" : "";
      const realityText = PlayerProgress.realityUnlocked() ? " в текущей реальности" : "";
      // eslint-disable-next-line prefer-template
      return `Производить ${formatPercents(0.5)} от рекордного прироста вечностей за время${realTime}${realityText} ` +
        (eternities.gt(0) ? `(Сейчас: ${format(eternities, 2, 2)} в час)` : "(Не действует)");
    },
    activeCondition: () => (player.options.offlineProgress
      ? `Действует, только если вы вне всех испытаний, и автоматика вечности включена и выставлена на ${formatInt(0)} ОВ.
        Все совершённые вечности в вычислениях для этого Этапа считаются длящимися хотя бы ${formatInt(33)}мс.`
      : ""),
      pelleUseless: true
  },
  autoInfinities: {
    eternities: 1000,
    reward: () => {
      if (!player.options.offlineProgress) return "Этот Этап производил бы бесконечности, но офлайн-прогресс отключён";
      const infinities = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        player.eternities.gte(1000));
      const realTime = PlayerProgress.seenAlteredSpeed() ? " (по реальному времяисчислению)" : "";
      // eslint-disable-next-line prefer-template
      return `Производить ${formatPercents(0.5)} от рекордного прироста бесконечностей за время${realTime} в текущей вечности ` +
        (infinities.gt(0) ? `(Сейчас: ${format(infinities, 2, 2)} в час)` : "(Не действует)");
    },
    activeCondition: () => (player.options.offlineProgress
      ? `Действует, только если вы вне всех Обычных Испытаний, всех Испытаний Бесконечности, ИспВ4 и ИспВ12,
        автоматика Большого Сжатия включена, действует в режиме времени и выставлена на ${formatInt(5)} секунд или меньше,
        и автоматика вечности отключена.`
      : ""),
      pelleUseless: true
  }
};
