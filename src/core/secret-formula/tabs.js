export const tabs = [
  {
    key: "dimensions",
    name: "Измерения",
    hideAt: 2.9,
    id: 0,
    hidable: true,
    subtabs: [
      {
        key: "antimatter",
        name: "Измерения Антиматерии",
        symbol: "Ω",
        component: "AntimatterDimensionsTab",
        id: 0,
        hidable: true,
      },
      {
        key: "infinity",
        name: "Измерения Бесконечности",
        hideAt: 2.7,
        symbol: "∞",
        component: "InfinityDimensionsTab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          InfinityDimension(1).isUnlocked,
        id: 1,
        hidable: true,
      },
      {
        key: "time",
        name: "Измерения Времени",
        hideAt: 2.6,
        symbol: "Δ",
        component: "TimeDimensionsTab",
        condition: () => PlayerProgress.eternityUnlocked(),
        id: 2,
        hidable: true,
      },
    ]
  },
  {
    key: "options",
    name: "Настройки",
    hideAt: 1.6,
    id: 1,
    hidable: false,
    subtabs: [
      {
        key: "saving",
        name: "Сохранение",
        symbol: "<i class='fas fa-save'></i>",
        component: "OptionsSavingTab",
        id: 0,
        hidable: false,
      },
      {
        key: "visual",
        name: "Внешний вид",
        symbol: "<i class='fas fa-palette'></i>",
        component: "OptionsVisualTab",
        id: 1,
        hidable: false,
      },
      {
        key: "gameplay",
        name: "Геймплей",
        symbol: "<i class='fas fa-wrench'></i>",
        component: "OptionsGameplayTab",
        id: 2,
        hidable: false,
      }
    ]
  },
  {
    key: "statistics",
    name: "Статистика",
    hideAt: 1.7,
    id: 2,
    hidable: true,
    subtabs: [
      {
        key: "statistics",
        name: "Статистика",
        symbol: "<i class='fas fa-clipboard-list'></i>",
        component: "StatisticsTab",
        id: 0,
        hidable: true,
      },
      {
        key: "challenges",
        name: "Рекорды испытаний",
        symbol: "<i class='fas fa-stopwatch'></i>",
        component: "ChallengeRecordsTab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.challengeCompleted(),
        id: 1,
        hidable: true,
      },
      {
        key: "prestige runs",
        name: "Последние престижи",
        symbol: "<i class='fas fa-list-ol'></i>",
        component: "PastPrestigeRunsTab",
        condition: () => PlayerProgress.infinityUnlocked(),
        id: 2,
        hidable: true,
      },
      {
        key: "multipliers",
        name: "Анализатор эффектов",
        symbol: "<i class='fas fa-calculator'></i>",
        component: "MultiplierBreakdownTab",
        condition: () => PlayerProgress.infinityUnlocked(),
        id: 3,
        hidable: true,
      },
      {
        key: "glyph sets",
        name: "Лучшие наборы глифов",
        symbol: "<i class='fas fa-ellipsis-h'></i>",
        component: "GlyphSetRecordsTab",
        condition: () => PlayerProgress.realityUnlocked(),
        id: 4,
        hidable: true,
      },
      {
        key: "speedrun milestones",
        name: "Стадии спидрана",
        symbol: "<i class='fas fa-flag-checkered'></i>",
        component: "SpeedrunMilestonesTab",
        condition: () => player.speedrun.isActive,
        id: 5,
        hidable: true,
      },
      {
        key: "speedrun records",
        name: "Прошлые забеги",
        symbol: "<i class='fas fa-ranking-star'></i>",
        component: "PreviousSpeedrunTab",
        condition: () => Object.keys(player.speedrun.previousRuns).length > 0,
        id: 6,
        hidable: true,
      },
    ]
  },
  {
    key: "achievements",
    name: "Достижения",
    hideAt: 1.9,
    id: 3,
    hidable: true,
    subtabs: [
      {
        key: "normal",
        name: "Достижения",
        symbol: "<i class='fas fa-trophy'></i>",
        component: "NormalAchievementsTab",
        id: 0,
        hidable: true,
      },
      {
        key: "secret",
        name: "Секретные достижения",
        symbol: "<i class='fas fa-question'></i>",
        component: "SecretAchievementTab",
        id: 1,
        hidable: true,
      }
    ]
  },
  {
    key: "automation",
    name: "Автоматизация",
    id: 4,
    hideAt: 2.1,
    condition: () => player.records.totalAntimatter.gte(1e40),
    hidable: true,
    subtabs: [
      {
        key: "autobuyers",
        name: "Автоматика",
        symbol: "<i class='fas fa-cog'></i>",
        component: "AutobuyersTab",
        id: 0,
        hidable: true,
      },
      {
        key: "automator",
        name: "Автоматизатор",
        symbol: "<i class='fas fa-code'></i>",
        component: "AutomatorTab",
        condition: () => PlayerProgress.realityUnlocked(),
        id: 1,
        hidable: true,
      },
    ]
  },
  {
    key: "challenges",
    name: "Испытания",
    hideAt: 2,
    condition: () =>
      PlayerProgress.realityUnlocked() ||
      PlayerProgress.eternityUnlocked() ||
      PlayerProgress.infinityUnlocked(),
    id: 5,
    hidable: true,
    subtabs: [
      {
        key: "normal",
        name: "Обычные Испытания",
        symbol: "Ω",
        component: "NormalChallengesTab",
        id: 0,
        hidable: true
      },
      {
        key: "infinity",
        name: "Испытания Бесконечности",
        symbol: "∞",
        component: "infinity-challenges-tab",
        condition: () => PlayerProgress.realityUnlocked() || PlayerProgress.hasBroken() || Pelle.isDoomed,
        id: 1,
        hidable: true
      },
      {
        key: "eternity",
        name: "Испытания Вечности",
        symbol: "Δ",
        component: "eternity-challenges-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          player.challenge.eternity.unlocked !== 0 ||
          EternityChallenges.all.some(ec => ec.completions > 0),
        id: 2,
        hidable: true
      }
    ],
  },
  {
    key: "infinity",
    name: "Бесконечность",
    hideAt: 2.2,
    UIClass: "o-tab-btn--infinity",
    before: "InfinityPointsHeader",
    id: 6,
    condition: () => PlayerProgress.infinityUnlocked(),
    hidable: true,
    subtabs: [
      {
        key: "upgrades",
        name: "Улучшения Бесконечности",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "InfinityUpgradesTab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked(),
        id: 0,
        hidable: true,
      },
      {
        key: "break",
        name: "Преодоление Бесконечности",
        symbol: "∝",
        component: "BreakInfinityTab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked(),
        id: 1,
        hidable: true,
      },
      {
        key: "replicanti",
        name: "Репликанти",
        symbol: "Ξ",
        component: "ReplicantiTab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked(),
        id: 2,
        hidable: true,
      }
    ],
  },
  {
    key: "eternity",
    name: "Вечность",
    hideAt: 1.8,
    UIClass: "o-tab-btn--eternity",
    condition: () =>
      PlayerProgress.realityUnlocked() ||
      PlayerProgress.eternityUnlocked(),
    before: "EternityPointsHeader",
    id: 7,
    hidable: true,
    subtabs: [
      {
        key: "studies",
        name: "Исследования Времени",
        symbol: "<i class='fas fa-book'></i>",
        component: "TimeStudiesTab",
        id: 0,
        hidable: true,
      },
      {
        key: "upgrades",
        name: "Улучшения Вечности",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "EternityUpgradesTab",
        id: 1,
        hidable: true,
      },
      {
        key: "milestones",
        name: "Этапы Вечности",
        symbol: "<i class='fas fa-star'></i>",
        component: "EternityMilestonesTab",
        id: 2,
        hidable: true,
      },
      {
        key: "dilation",
        name: "Замедление Времени",
        symbol: "Ψ",
        component: "TimeDilationTab",
        condition: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
        id: 3,
        hidable: true,
      }
    ],
  },
  {
    key: "reality",
    name: "Реальность",
    hideAt: 2.3,
    UIClass: "o-tab-btn--reality",
    condition: () => PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought,
    id: 8,
    hidable: true,
    subtabs: [
      {
        key: "glyphs",
        name: "Глифы",
        symbol: "<i class='fas fa-clone'></i>",
        component: "GlyphsTab",
        id: 0,
        hidable: true,
      },
      {
        key: "upgrades",
        name: "Улучшения Реальности",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "RealityUpgradesTab",
        id: 1,
        hidable: true,
      },
      {
        key: "imag_upgrades",
        name: "Мнимые Улучшения",
        symbol: "<i class='fas fa-level-up-alt'></i>",
        component: "ImaginaryUpgradesTab",
        condition: () => MachineHandler.isIMUnlocked,
        id: 2,
        hidable: true,
      },
      {
        key: "perks",
        name: "Навыки",
        symbol: "<i class='fas fa-project-diagram'></i>",
        component: "PerksTab",
        id: 3,
        hidable: true,
      },
      {
        key: "hole",
        name: "Чёрная Дыра",
        symbol: "<i class='fas fa-circle'></i>",
        component: "BlackHoleTab",
        condition: () => PlayerProgress.realityUnlocked(),
        id: 4,
        hidable: true,
      },
      {
        key: "alchemy",
        name: "Алхимия",
        symbol: "<i class='fas fa-vial'></i>",
        component: "AlchemyTab",
        condition: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
        id: 5,
        hidable: true,
      },
    ],
  },
  {
    key: "celestials",
    name: "Небожители",
    hideAt: 2.4,
    UIClass: "o-tab-btn--celestial",
    condition: () => Teresa.isUnlocked,
    id: 9,
    hidable: true,
    subtabs: [
      {
        key: "celestial-navigation",
        name: "Карта неба",
        symbol: "<i class='fas fa-map-marked-alt'></i>",
        component: "CelestialNavigationTab",
        id: 0,
        hidable: true,
      },
      {
        key: "teresa",
        name: "Тереза",
        symbol: "Ϟ",
        component: "TeresaTab",
        id: 1,
        hidable: true,
      },
      {
        key: "effarig",
        name: "Эффариг",
        symbol: "Ϙ",
        component: "EffarigTab",
        condition: () => TeresaUnlocks.effarig.isUnlocked,
        id: 2,
        hidable: true,
      },
      {
        key: "enslaved",
        name: "Безымянные",
        symbol: "<div class='o-tab-btn--cel3'>\uf0c1</div>",
        component: "EnslavedTab",
        condition: () => EffarigUnlock.eternity.isUnlocked,
        id: 3,
        hidable: true,
      },
      {
        key: "v",
        name: "Ви",
        symbol: "⌬",
        component: "VTab",
        condition: () => Achievement(151).isUnlocked,
        id: 4,
        hidable: true,
      },
      {
        key: "ra",
        name: "Ра",
        symbol: "<i class='fas fa-sun'></i>",
        component: "RaTab",
        condition: () => VUnlocks.raUnlock.isUnlocked,
        id: 5,
        hidable: true,
      },
      {
        key: "laitela",
        name: "Лайтела",
        symbol: "ᛝ",
        component: "LaitelaTab",
        condition: () => Laitela.isUnlocked,
        id: 6,
        hidable: true,
      },
      {
        key: "pelle",
        name: "Пелль",
        symbol: "♅",
        component: "PelleTab",
        condition: () => Pelle.isUnlocked,
        id: 7,
        hidable: true,
      }
    ]
  },
  {
    key: "shop",
    name: "Shop",
    newUIClass: "shop",
    hideAt: 1.5,
    condition: () => Cloud.isAvailable,
    id: 10,
    hidable: true,
    subtabs: [
      {
        key: "shop",
        name: "Shop",
        symbol: "$",
        component: "ShopTab",
        id: 0,
        hidable: true
      }
    ]
  }
];
