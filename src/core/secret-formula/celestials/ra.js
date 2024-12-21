export const ra = {
  pets: {
    teresa: {
      id: "teresa",
      name: "Терезы",
      nameNormal: "Тереза",
      color: "#8596ea",
      chunkGain: "количества Очков Вечности",
      memoryGain: "количества Машин Реальности",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.eternityPoints.value.pLog10() / 1e4, 3),
      memoryProductionMultiplier: () => Ra.unlocks.teresaXP.effectOrDefault(1)
    },
    effarig: {
      id: "effarig",
      name: "Эффарига",
      nameNormal: "Эффариг",
      color: "#ea8585",
      chunkGain: "количества Реликтовых Осколков, которое вы получили бы при реальности",
      memoryGain: "рекордного уровня глифа",
      requiredUnlock: () => Ra.unlocks.effarigUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Effarig.shardsGained, 0.1),
      memoryProductionMultiplier: () => Ra.unlocks.effarigXP.effectOrDefault(1)
    },
    enslaved: {
      id: "enslaved",
      name: "Безымянных",
      nameNormal: "Безымянные",
      color: "#f1aa7f",
      chunkGain: "количества Осколков Времени",
      memoryGain: "времени игры",
      requiredUnlock: () => Ra.unlocks.enslavedUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.timeShards.value.pLog10() / 3e5, 2),
      memoryProductionMultiplier: () => Ra.unlocks.enslavedXP.effectOrDefault(1)
    },
    v: {
      id: "v",
      name: "Ви",
      nameNormal: "Ви",
      color: "#ead584",
      chunkGain: "количества Силы Бесконечности",
      memoryGain: "суммы уровней Небожителей",
      requiredUnlock: () => Ra.unlocks.vUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.infinityPower.value.pLog10() / 1e7, 1.5),
      memoryProductionMultiplier: () => Ra.unlocks.vXP.effectOrDefault(1)
    }
  },
  unlocks: {
    autoTP: {
      id: 0,
      reward: "Ваше количество Тахионов автоматически увеличивается до того, которое вы имели бы при выходе из Замедления",
      pet: "teresa",
      level: 1,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: true
    },
    chargedInfinityUpgrades: {
      id: 1,
      reward: "",
      effect: () => Math.min(12, Math.floor(Ra.pets.teresa.level / 2)),
      pet: "teresa",
      level: 2,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: true
    },
    teresaXP: {
      id: 2,
      reward: "Множитель к производству всей Памяти, зависящий от количества Машин Реальности",
      effect: () => 1 + Math.pow(Currency.realityMachines.value.pLog10() / 100, 0.5),
      pet: "teresa",
      level: 5,
      displayIcon: `Ϟ`
    },
    alteredGlyphs: {
      id: 3,
      reward: "Разблокировать Расширение Глифов",
      pet: "teresa",
      level: 10,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: true
    },
    effarigUnlock: {
      id: 4,
      reward: "Разблокировать Память Эффарига",
      pet: "teresa",
      level: 8,
      displayIcon: `Ϙ`
    },
    perkShopIncrease: {
      id: 5,
      reward: "Увеличить ограничения на покупку Улучшений Терезы",
      pet: "teresa",
      level: 15,
      displayIcon: `<span class="fas fa-project-diagram"></span>`
    },
    unlockDilationStartingTP: {
      id: 6,
      reward: `Вне Реальностей Небожителей вы получаете Тахионы даже вне Замедления так, чтобы у вас всегда было не меньше Тахионов,
        чем если бы вы достигли в Замедлении количества антиматерии, равного квадратному корню из рекордного количества антиматерии в текущей вечности`,
      effect: () => player.records.totalAntimatter.pow(0.5),
      pet: "teresa",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`
    },
    extraGlyphChoicesAndRelicShardRarityAlwaysMax: {
      id: 7,
      reward: () => `Вы можете выбирать из ${formatInt(8)} глифов на реальности. Бонус от Реликтовых Осколков всегда максимально возможный`,
      effect: 2,
      pet: "effarig",
      level: 1,
      displayIcon: `<i class="fas fa-grip-horizontal"></i>`
    },
    unlockGlyphAlchemy: {
      id: 8,
      reward: "",
      pet: "effarig",
      level: 2,
      displayIcon: `<span class="fas fa-vial"></span>`
    },
    effarigXP: {
      id: 9,
      reward: "Множитель к производству всей Памяти, зависящий от рекордного уровня глифа",
      effect: () => 1 + player.records.bestReality.glyphLevel / 7000,
      pet: "effarig",
      level: 5,
      displayIcon: `<span class="fas fa-clone"></span>`
    },
    glyphEffectCount: {
      id: 10,
      reward: () => `Получаемые глифы всегда имеют не менее ${formatInt(4)} эффектов. Ограничение на количество эффектов у Глифа Эффарига снято
        (Глифам Эффарига с ${formatInt(7)} эффектами не запрещено иметь оба взаимоисключающих эффекта)`,
      pet: "effarig",
      level: 10,
      displayIcon: `<span class="fas fa-braille"></span>`
    },
    enslavedUnlock: {
      id: 11,
      reward: "Разблокировать Память Безымянных",
      pet: "effarig",
      level: 8,
      displayIcon: `<span class="c-ra-pet-milestones-effarig-link">\uf0c1</span>`
    },
    relicShardGlyphLevelBoost: {
      id: 12,
      reward: "Уровень получаемых глифов увеличивается на значение, зависящее от количества Реликтовых Осколков, которое вы получили бы при реальности",
      effect: () => 100 * Math.pow(Math.log10(Math.max(Effarig.shardsGained, 1)), 2),
      pet: "effarig",
      level: 15,
      displayIcon: `<span class="fas fa-fire"></span>`
    },
    maxGlyphRarityAndShardSacrificeBoost: {
      id: 13,
      reward: () => `Получаемые глифы всегда имеют редкость ${formatPercents(1)}.
        Жертвенная ценность глифов возведена в степень в зависимости от количества Реликтовых Осколков`,
      effect: () => 1 + Effarig.maxRarityBoost / 100,
      pet: "effarig",
      level: 25,
      displayIcon: `<i class="fas fa-ankh"></i>`
    },
    blackHolePowerAutobuyers: {
      id: 14,
      reward: "Разблокировать автоматику Улучшений Чёрных Дыр, усиливающих их",
      pet: "enslaved",
      level: 1,
      displayIcon: `<span class="fas fa-circle"></span>`,
      disabledByPelle: true
    },
    improvedStoredTime: {
      id: 15,
      reward: "",
      effects: {
        gameTimeAmplification: () => Math.pow(20, Math.clampMax(Ra.pets.enslaved.level, Ra.levelCap)),
        realTimeCap: () => 1000 * 3600 * Ra.pets.enslaved.level,
      },
      pet: "enslaved",
      level: 2,
      displayIcon: `<span class="fas fa-history"></span>`,
      disabledByPelle: true
    },
    enslavedXP: {
      id: 16,
      reward: "Множитель к производству всей Памяти, зависящий от времени игры",
      effect: () => 1 + Math.log10(player.records.totalTimePlayed) / 200,
      pet: "enslaved",
      level: 5,
      displayIcon: `<span class="fas fa-stopwatch"></span>`
    },
    autoPulseTime: {
      id: 17,
      reward: () => `При зарядке Чёрной Дыры скорость игры уменьшается только на ${formatPercents(0.99)}, а не до ${formatInt(1)}.
        Разблокировать опцию пульсирования Чёрной Дыры, при которой вы автоматически используете ${formatPercents(0.01)} сохранённого игрового времени,
        как при разрядке Чёрной Дыры, каждые ${formatInt(5)} тиков`,
      pet: "enslaved",
      level: 10,
      displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`,
      disabledByPelle: true
    },
    vUnlock: {
      id: 18,
      reward: "Разблокировать Память Ви",
      pet: "enslaved",
      level: 8,
      displayIcon: `⌬`
    },
    peakGamespeedDT: {
      id: 19,
      reward: "Множитель к получению Замедленного Времени, зависящий от рекордной скорости игры в текущей реальности",
      effect: () => Math.max(Math.pow(Math.log10(player.celestials.ra.peakGamespeed) - 90, 3), 1),
      pet: "enslaved",
      level: 15,
      displayIcon: `<span class="fas fa-tachometer-alt"></span>`,
      disabledByPelle: true
    },
    allGamespeedGlyphs: {
      id: 20,
      reward: `У глифов Времени появляется дополнительный эффект.
        У всех остальных глифов основных типов появляется эффект Глифов Времени, дающий множитель к скорости игры`,
      pet: "enslaved",
      level: 25,
      displayIcon: `<span class="fas fa-clock"></span>`,
      onUnlock: () => {
        const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
        for (const glyph of allGlyphs) {
          Glyphs.applyGamespeed(glyph);
        }
      }
    },
    instantECAndRealityUpgradeAutobuyers: {
      id: 21,
      reward: "Разблокировать автоматику Улучшений Реальности. Автоматическое выполнение Испытаний Вечности работает мгновенно",
      pet: "v",
      level: 1,
      displayIcon: `<span class="fas fa-sync-alt"></span>`,
      disabledByPelle: true
    },
    autoUnlockDilation: {
      id: 22,
      reward: () => `Вне Реальностей Небожителей автоматически разблокировать Замедление Времени
        бесплатно, как только вы наберёте ${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)} Теорем Времени`,
      pet: "v",
      level: 2,
      displayIcon: `<span class="fas fa-fast-forward"></span>`
    },
    vXP: {
      id: 23,
      reward: "Множитель к производству всей Памяти, зависящий от суммы уровней Небожителей",
      effect: () => 1 + Ra.totalPetLevel / 50,
      pet: "v",
      level: 5,
      displayIcon: `<span class="fas fa-book"></span>`
    },
    unlockHardV: {
      id: 24,
      reward: () => `Разблокировать супер-достижения Ви`,
      effect: () => Math.floor(Ra.pets.v.level / 6),
      pet: "v",
      level: 6,
      displayIcon: `<span class="fas fa-trophy"></span>`,
      disabledByPelle: true
    },
    continuousTTBoost: {
      id: 25,
      reward: "Множители ко всем видам непрерывного производства, кроме производства измерений, зависящие от количества Теорем Времени.",
      effects: {
        ttGen: () => Math.pow(10, 5 * Ra.theoremBoostFactor()),
        eternity: () => Math.pow(10, 2 * Ra.theoremBoostFactor()),
        infinity: () => Math.pow(10, 15 * Ra.theoremBoostFactor()),
        replicanti: () => Math.pow(10, 20 * Ra.theoremBoostFactor()),
        dilatedTime: () => Math.pow(10, 3 * Ra.theoremBoostFactor()),
        memories: () => 1 + Ra.theoremBoostFactor() / 50,
        memoryChunks: () => 1 + Ra.theoremBoostFactor() / 50,
        autoPrestige: () => 1 + 2.4 * Ra.theoremBoostFactor()
      },
      pet: "v",
      level: 10,
      displayIcon: `<span class="fas fa-university"></span>`,
      disabledByPelle: true
    },
    achievementTTMult: {
      id: 26,
      reward: "Множитель достижений влияет на производство Теорем Времени",
      effect: () => Achievements.power,
      pet: "v",
      level: 15,
      displayIcon: `<span class="fas fa-graduation-cap"></span>`,
      disabledByPelle: true
    },
    achievementPower: {
      id: 27,
      reward: () => `Множитель достижений возведён в степень ${format(1.5, 1, 1)}`,
      effect: 1.5,
      pet: "v",
      level: 25,
      displayIcon: `<i class="fab fa-buffer"></i>`,
      disabledByPelle: true
    }
  }
};
