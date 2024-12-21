export const awayProgressTypes = [
  {
    name: "antimatter",
    forcedName: "антиматерии",
    isUnlocked: () => true,
  }, {
    name: "dimensionBoosts",
    forcedName: "Расширений Измерений",
    isUnlocked: () => true,
  }, {
    name: "antimatterGalaxies",
    forcedName: "Галактик Антиматерии",
    reference: ["galaxies"],
    isUnlocked: () => true,
  }, {
    name: "infinities",
    forcedName: "бесконечностей",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "infinityPoints",
    forcedName: "Очков Бесконечности",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "replicanti",
    forcedName: "Репликанти",
    reference: ["replicanti", "amount"],
    isUnlocked: () => PlayerProgress.replicantiUnlocked(),
  }, {
    name: "replicantiGalaxies",
    forcedName: "Галактик Репликанти",
    reference: ["replicanti", "galaxies"],
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "eternities",
    forcedName: "вечностей",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "eternityPoints",
    forcedName: "Очков Вечности",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "tachyonParticles",
    forcedName: "Тахионов",
    reference: ["dilation", "tachyonParticles"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "dilatedTime",
    forcedName: "Замедленного Времени",
    reference: ["dilation", "dilatedTime"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "timeTheorems",
    forcedName: "Теорем Времени",
    reference: ["timestudy", "theorem"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "tachyonGalaxies",
    forcedName: "Тахионных Галактик",
    reference: ["dilation", "totalTachyonGalaxies"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "achievementAmount",
    forcedName: "достижений",
    reference: ["achievementBits"],
    applyFn: x => x.map(b => countValuesFromBitmask(b)).sum(),
    isUnlocked: () => true,
  }, {
    name: "realities",
    forcedName: "реальностей",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "realityMachines",
    forcedName: "Машин Реальности",
    reference: ["reality", "realityMachines"],
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "blackHole",
    forcedName: "Чёрная Дыра",
    isUnlocked: () => BlackHole(1).isUnlocked,
    // Functions as the visible option for both first & second BHs, never appears due to having no reference.
    appearsInAwayModal: false,
  }, {
    name: "firstBlackHole",
    forcedName: "1-я Чёрная Дыра",
    awayOption: "blackHole",
    reference: ["blackHole", "0", "activations"],
    isUnlocked: () => BlackHole(1).isUnlocked,
    classObjectReference: "black-hole",
    showOption: false,
  }, {
    name: "secondBlackHole",
    forcedName: "2-я Чёрная Дыра",
    awayOption: "blackHole",
    reference: ["blackHole", "1", "activations"],
    isUnlocked: () => BlackHole(2).isUnlocked,
    classObjectReference: "black-hole",
    showOption: false,
  }, {
    name: "relicShards",
    forcedName: "Реликтовых Осколков",
    reference: ["celestials", "effarig", "relicShards"],
    isUnlocked: () => TeresaUnlocks.effarig.canBeApplied,
  }, {
    name: "celestialMemories",
    forcedName: "Памяти Небожителей",
    isUnlocked: () => VUnlocks.raUnlock.isUnlocked,
    // Functions as the visible option for all Memories, never appears due to having no reference.
    appearsInAwayModal: false,
  }, {
    name: "teresaMemories",
    forcedName: "Памяти Терезы",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "teresa", "memories"],
    isUnlocked: () => Ra.pets.teresa.isUnlocked && !Ra.pets.teresa.isCapped,
    showOption: false,
  }, {
    name: "effarigMemories",
    forcedName: "Памяти Эффарига",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "effarig", "memories"],
    isUnlocked: () => Ra.pets.effarig.isUnlocked && !Ra.pets.effarig.isCapped,
    showOption: false,
  }, {
    name: "enslavedMemories",
    forcedName: "Памяти Безымянных",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "enslaved", "memories"],
    isUnlocked: () => Ra.pets.enslaved.isUnlocked && !Ra.pets.enslaved.isCapped,
    showOption: false,
  }, {
    name: "vMemories",
    forcedName: "Памяти Ви",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "v", "memories"],
    isUnlocked: () => Ra.pets.v.isUnlocked && !Ra.pets.v.isCapped,
    showOption: false,
  }, {
    name: "imaginaryMachines",
    forcedName: "Мнимых Машин",
    reference: ["reality", "imaginaryMachines"],
    isUnlocked: () => MachineHandler.isIMUnlocked,
  }, {
    name: "darkMatter",
    forcedName: "Тёмной Материи",
    reference: ["celestials", "laitela", "darkMatter"],
    isUnlocked: () => Laitela.isUnlocked,
  }, {
    name: "darkEnergy",
    forcedName: "Тёмной Энергии",
    reference: ["celestials", "laitela", "darkEnergy"],
    isUnlocked: () => Laitela.isUnlocked,
  }, {
    name: "singularities",
    forcedName: "Сингулярностей",
    reference: ["celestials", "laitela", "singularities"],
    isUnlocked: () => player.celestials.laitela.singularities,
  }, {
    name: "realityShards",
    forcedName: "Осколков Реальности",
    reference: ["celestials", "pelle", "realityShards"],
    isUnlocked: () => Pelle.isDoomed,
  },
];
