export const confirmationTypes = [
  {
    name: "Расширение Измерений",
    option: "dimensionBoost",
    isUnlocked: () => true,
  }, {
    name: "Галактика Антиматерии",
    option: "antimatterGalaxy",
    isUnlocked: () => true,
  }, {
    name: "Пожертвование Измерений",
    option: "sacrifice",
    isUnlocked: () => Sacrifice.isVisible,
  }, {
    name: "Большое Сжатие",
    option: "bigCrunch",
    isUnlocked: () => player.break || PlayerProgress.eternityUnlocked(),
  }, {
    name: "Вход в испытание",
    option: "challenges",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "Выход из испытания",
    option: "exitChallenge",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "Галактика Репликанти",
    option: "replicantiGalaxy",
    isUnlocked: () => PlayerProgress.eternityUnlocked() || player.replicanti.unl,
  }, {
    name: "Вечность",
    option: "eternity",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "Вход в Замедление",
    option: "dilation",
    isUnlocked: () => PlayerProgress.realityUnlocked() || PlayerProgress.dilationUnlocked(),
  }, {
    name: "Сброс реальности",
    option: "resetReality",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "Замещение глифа",
    option: "glyphReplace",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "Пожертвование глифа",
    option: "glyphSacrifice",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Прочистка инвентаря",
    option: "autoClean",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Пожертвование всех глифов",
    option: "sacrificeAll",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Выбор глифа",
    option: "glyphSelection",
    isUnlocked: () => Autobuyer.reality.isUnlocked,
  }, {
    name: "Деактивация глифа",
    option: "glyphUndo",
    isUnlocked: () => TeresaUnlocks.undo.canBeApplied,
  }, {
    name: "Переключение на другой режим редактирования",
    option: "switchAutomatorMode",
    isUnlocked: () => Player.automatorUnlocked,
  }, {
    name: "Удаление сохранённого набора глифов",
    option: "deleteGlyphSetSave",
    isUnlocked: () => EffarigUnlock.setSaves.isUnlocked,
  }, {
    name: "Облагораживание глифов",
    option: "glyphRefine",
    isUnlocked: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
  }, {
    name: "Армагеддон",
    option: "armageddon",
    isUnlocked: () => Pelle.isDoomed,
  }, {
    name: "Respec Shop Purchases",
    option: "respecIAP",
    isUnlocked: () => Cloud.isAvailable
  }
];
