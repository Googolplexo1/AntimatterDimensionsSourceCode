import { DC } from "../../constants";

// I tried to make it relatively simple to add more locks; the idea is that you give it a value here
// and then it's all handled in the backend
// If you need to lock a challenge, set lockedAt to a new Decimal variable reflective of a desired number of Infinities
// They will always be unlocked post-eternity

export const normalChallenges = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description() {
      return PlayerProgress.eternityUnlocked()
        ? "достигните бесконечности вне всех испытаний."
        : "достигните бесконечности.";
    },
    name: "1st Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 1-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    description:
      () => "при покупке Измерений Антиматерии или ускорителей производство останавливается и " +
      `постепенно восстанавливается в течение ${formatInt(3)} минут.`,
    name: "2nd Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 2-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description:
      `1-е Измерение Антиматерии получает множитель, который изначально мал, зато неограниченно экспоненциально возрастает,
        но сбрасывается при получении Расширений Измерений и Галактик Антиматерии.`,
    name: "3rd Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 3-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    description: "при покупке Измерения Антиматерии количества измерений более низких уровней сбрасываются.",
    name: "4th Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 4-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description:
      () => `ускорители слабее.`,
    name: "5th Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 5-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    description: () => "каждое Измерение Антиматерии, начиная с 3-го, покупается за измерение двумя уровнями ниже " +
      "по другим ценам.",
    name: "6th Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 6-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () =>
      `множитель за покупку ${formatInt(10)} Измерений Антиматерии снижен до ${formatX(1)}, но возрастает на
        ${format(0.2, 1, 1)} за каждое Расширение Измерений, вплоть до ${formatX(2)}, и никак иначе не меняется.`,
    name: "7th Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 7-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    description: `Галактики Антиматерии недоступны. Вы можете купить не более пяти Расширений Измерений, и они не дают
      множителей. Пожертвование Измерений сбрасывает количество антиматерии и Измерения Антиматерии, но становится гораздо сильнее.`,
    name: "8th Antimatter Dimension Autobuyer",
    reward: "возможность улучшать автоматику 8-х Измерений Антиматерии",
    lockedAt: DC.D0,
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: () => `при покупке ускорителя или десятки Измерений Антиматерии возрастает не только соответствующая цена, ` +
      "но и все равные ей цены.",
    name: "Tickspeed Autobuyer",
    reward: "возможность улучшать автоматику ускорителей",
    lockedAt: DC.D0,
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    description: () => `вам доступны только первые ${formatInt(6)} Измерений Антиматерии. Расширения Измерений ` +
      "и Галактики Антиматерии покупаются за 6-е Измерения Антиматерии по другим ценам.",
    name: "Automated Dimension Boosts",
    reward: "автоматику Расширений Измерений",
    lockedAt: DC.D16,
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: () => "существует материя, количество которой растёт экспоненциально, как только у вас появляется " +
      "2-е Измерение Антиматерии, причём тем быстрее, чем у вас больше Расширений Измерений и Галактик Антиматерии. " +
      "Если оно превысит количество антиматерии, всё сбросится, как при Расширении Измерений.",
    name: "Automated Antimatter Galaxies",
    reward: "автоматику Галактик Антиматерии",
    lockedAt: DC.D16,
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: () => `каждое Измерение Антиматерии, начиная с 3-го, производит измерение двумя уровнями ниже
      вместо предыдущего, а 2-е Измерение Антиматерии производит антиматерию вместо 1-го Измерения,
      зато 2-е, 4-е и 6-е Измерения сильнее.`,
    name: "Automated Big Crunches",
    reward: "автоматику Большого Сжатия",
    lockedAt: DC.D16,
  }
];
