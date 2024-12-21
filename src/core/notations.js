import { AllNotation, BarNotation, BlindNotation, BlobsNotation, BracketsNotation, ClockNotation, CustomNotation, DotsNotation, EmojiNotation, EngineeringNotation, HexNotation, ImperialNotation, InfinityNotation, LettersNotation, LogarithmNotation, MixedEngineeringNotation, MixedScientificNotation,  PrimeNotation, RomanNotation, ScientificNotation, Settings, ShiNotation, StandardNotation, ZalgoNotation, abbreviateStandard, formatMantissa, formatMantissaBaseTen, formatMantissaWithExponent } from "../ad-notations.esm";

export const Notation = (function() {
  const notation = type => {
    const n = new type();
    n.setAsCurrent = () => {
      player.options.notation = n.name;
      ui.notationName = n.name;
    };
    return n;
  };
  const painful = n => {
    n.isPainful = true;
    return n;
  };
  return {
    scientific: notation(ScientificNotation),
    engineering: notation(EngineeringNotation),
    letters: notation(LettersNotation),
    standard: painful(notation(StandardNotation)),
    emoji: painful(notation(EmojiNotation)),
    mixedScientific: notation(MixedScientificNotation),
    mixedEngineering: notation(MixedEngineeringNotation),
    logarithm: notation(LogarithmNotation),
    brackets: painful(notation(BracketsNotation)),
    infinity: notation(InfinityNotation),
    roman: painful(notation(RomanNotation)),
    dots: painful(notation(DotsNotation)),
    zalgo: painful(notation(ZalgoNotation)),
    hex: painful(notation(HexNotation)),
    imperial: painful(notation(ImperialNotation)),
    clock: painful(notation(ClockNotation)),
    prime: painful(notation(PrimeNotation)),
    bar: painful(notation(BarNotation)),
    shi: painful(notation(ShiNotation)),
    blind: painful(notation(BlindNotation)),
    blobs: painful(notation(BlobsNotation)),
    all: painful(notation(AllNotation))
  };
}());

Notation.emoji.setAsCurrent = (silent = false) => {
  player.options.notation = Notation.emoji.name;
  ui.notationName = Notation.emoji.name;
  if (!silent) GameUI.notify.success("😂😂😂");
};

export const Notations = {
  // Defined as a list here for exact order in options tab.
  all: [
    Notation.scientific,
    Notation.engineering,
    Notation.letters,
    Notation.standard,
    Notation.emoji,
    Notation.mixedScientific,
    Notation.mixedEngineering,
    Notation.logarithm,
    Notation.brackets,
    Notation.infinity,
    Notation.roman,
    Notation.dots,
    Notation.zalgo,
    Notation.hex,
    Notation.imperial,
    Notation.clock,
    Notation.prime,
    Notation.bar,
    Notation.shi,
    Notation.blind,
    Notation.blobs,
    Notation.all,
  ],
  find: name => {
    const notation = Notations.all.find(n => n.name === name);
    return notation === undefined ? Notation.mixedScientific : notation;
  },
  get current() {
    return GameUI.initialized ? ui.notation : Notation.mixedScientific;
  }
};

Settings.isInfinite = decimal => ui.formatPreBreak && decimal.gte(Decimal.NUMBER_MAX_VALUE);

EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  ui.formatPreBreak = !PlayerProgress.hasBroken() || (NormalChallenge.isRunning && !Enslaved.isRunning);
});
