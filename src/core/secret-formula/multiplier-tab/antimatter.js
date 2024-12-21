import { MultiplierTabIcons } from "./icons";
import { MultiplierTabHelper } from "./helper-functions";

// See index.js for documentation
export const AM = {
  total: {
    name: "Производство антиматерии",
    displayOverride: () => `${format(Currency.antimatter.productionPerSecond, 2, 2)}/с`,
    multValue: () => new Decimal(Currency.antimatter.productionPerSecond).clampMin(1),
    isActive: true,
    dilationEffect: () => getAdjustedGlyphEffect("effarigantimatter"),
    overlay: ["<i class='fas fa-atom' />"],
  }
};
