export const dilationTimeStudies = [
  {
    id: 1,
    description: "Разблокировать Замедление Времени",
    cost: 5000,
    requirement: () => {
      const ttRequirement = Currency.timeTheorems.max.gte(TimeStudy.dilation.totalTimeTheoremRequirement);
      if (Ra.unlocks.autoUnlockDilation.canBeApplied &&
          ttRequirement &&
          !isInCelestialReality() && !Pelle.isDoomed
      ) {
        return true;
      }
      const tsRequirement = [231, 232, 233, 234].some(id => TimeStudy(id).isBought);
      if (Perk.bypassECDilation.canBeApplied) return tsRequirement;
      const ecRequirement = EternityChallenge(11).isFullyCompleted && EternityChallenge(12).isFullyCompleted;
      return tsRequirement && ecRequirement && ttRequirement;
    }
  },
  {
    id: 2,
    description: "Разблокировать 5-е Измерение Времени",
    cost: 1e6,
    requirement: () => PlayerProgress.dilationUnlocked()
  },
  {
    id: 3,
    description: "Разблокировать 6-е Измерение Времени",
    cost: 1e7,
    requirement: () => TimeStudy.timeDimension(5).isBought
  },
  {
    id: 4,
    description: "Разблокировать 7-е Измерение Времени",
    cost: 1e8,
    requirement: () => TimeStudy.timeDimension(6).isBought
  },
  {
    id: 5,
    description: "Разблокировать 8-е Измерение Времени",
    cost: 1e9,
    requirement: () => TimeStudy.timeDimension(7).isBought
  },
  {
    id: 6,
    description: () => (Pelle.isDoomed
      ? "Нельзя выйти из Обречённой Реальности!"
      : "Разблокировать реальность"),
    cost: 1,
    requirement: () => TimeStudy.timeDimension(8).isBought &&
      player.records.thisReality.maxEP.exponent >= 4000 &&
      (Perk.firstPerk.isBought || Achievements.preReality.every(a => a.isUnlocked)) &&
      !Pelle.isDoomed
  }
];
