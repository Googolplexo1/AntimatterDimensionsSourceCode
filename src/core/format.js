function isEND() {
  const threshold = GameEnd.endState > END_STATE_MARKERS.END_NUMBERS
    ? 1
    : (GameEnd.endState - END_STATE_MARKERS.FADE_AWAY) / 2;
  // Using the Pelle.isDoomed getter here causes this to not update properly after a game restart
  return player.celestials.pelle.doomed && Math.random() < threshold;
}

window.format = function format(value, places = 0, placesUnder1000 = 0) {
  if (isEND()) return "КОНЕЦ";
  return Notations.current.format(value, places, placesUnder1000, 3);
};

window.formatInt = function formatInt(value) {
  if (isEND()) return "КОНЕЦ";
  // Suppress painful formatting for Standard because it's the most commonly used and arguably "least painful"
  // of the painful notations. Prevents numbers like 5004 from appearing imprecisely as "5.00 K" for example
  if (Notations.current.isPainful && Notations.current.name !== "Стандартная") {
    return format(value, 2);
  }
  return formatWithCommas(typeof value === "number" ? value.toFixed(0) : value.toNumber().toFixed(0));
};

window.formatFloat = function formatFloat(value, digits) {
  if (isEND()) return "КОНЕЦ";
  if (Notations.current.isPainful) {
    return format(value, Math.max(2, digits), digits);
  }
  return formatWithCommas(value.toFixed(digits));
};

window.formatPostBreak = function formatPostBreak(value, places, placesUnder1000) {
  if (isEND()) return "КОНЕЦ";
  const notation = Notations.current;
  // This is basically just a copy of the format method from notations library,
  // with the pre-break case removed.
  if (typeof value === "number" && !Number.isFinite(value)) {
    return notation.infinite;
  }

  const decimal = Decimal.fromValue_noAlloc(value);

  if (decimal.exponent < -300) {
    return decimal.sign() < 0
      ? notation.formatVerySmallNegativeDecimal(decimal.abs(), placesUnder1000)
      : notation.formatVerySmallDecimal(decimal, placesUnder1000);
  }

  if (decimal.exponent < 3) {
    const number = decimal.toNumber();
    return number < 0
      ? notation.formatNegativeUnder1000(Math.abs(number), placesUnder1000)
      : notation.formatUnder1000(number, placesUnder1000);
  }

  return decimal.sign() < 0
    ? notation.formatNegativeDecimal(decimal.abs(), places)
    : notation.formatDecimal(decimal, places);
};

window.formatX = function formatX(value, places, placesUnder1000) {
  return `×${format(value, places, placesUnder1000)}`;
};

window.formatPow = function formatPow(value, places, placesUnder1000) {
  return `^${format(value, places, placesUnder1000)}`;
};

window.formatPercents = function formatPercents(value, places) {
  return `${format(value * 100, 2, places)}%`;
};

window.formatRarity = function formatRarity(value) {
  // We can, annoyingly, have rounding error here, so even though only rarities
  // are passed in, we can't trust our input to always be some integer divided by 10.
  const places = value.toFixed(1).endsWith(".0") ? 0 : 1;
  return `${format(value, 2, places)}%`;
};

// We assume 2/0, 2/2 decimal places to keep parameter count sensible; this is used very rarely
window.formatMachines = function formatMachines(realPart, imagPart) {
  if (isEND()) return "КОНЕЦ";
  const parts = [];
  if (Decimal.neq(realPart, 0)) parts.push(format(realPart, 2));
  if (Decimal.neq(imagPart, 0)) parts.push(`${format(imagPart, 2, 2)}i`);
  // This function is used for just RM and just iM in a few spots, so we have to push both parts conditionally
  // Nonetheless, we also need to special-case both zero so that it doesn't end up displaying as an empty string
  if (Decimal.eq(realPart, 0) && Decimal.eq(imagPart, 0)) return format(0);
  return parts.join(" + ");
};

window.timeDisplay = function timeDisplay(ms, Case) {
  return TimeSpan.fromMilliseconds(ms).toString(Case);
};

window.timeDisplayNoDecimals = function timeDisplayNoDecimals(ms, Case) {
  return TimeSpan.fromMilliseconds(ms).toStringNoDecimals(Case);
};

window.timeDisplayShort = function timeDisplayShort(ms) {
  return TimeSpan.fromMilliseconds(ms).toStringShort();
};

const commaRegexp = /\B(?=(\d{3})+(?!\d))/gu;
window.formatWithCommas = function formatWithCommas(value) {
  const decimalPointSplit = value.toString().split(".");
  if (decimalPointSplit[0].length > 4) decimalPointSplit[0] = decimalPointSplit[0].replace(commaRegexp, " ");
  return decimalPointSplit.join(".");
};

/**
 * A function that pluralizes a word based on a designated amount
 * @param  {string} word           - word to be pluralized
 * @param  {number|Decimal} amount - amount to be used to determine if the value is plural
 * @param  {string} [plural]       - if defined, a specific plural to override the generated plural
 * @return {string} - if the {amount} is anything other than one, return the {plural} provided or the
 *                    plural form of the input {word}. If the {amount} is singular, return {word}
 */
window.pluralize = function pluralize(word, amount) {
  if (word === undefined || amount === undefined) throw "Arguments must be defined";

  words = word.split(" ")
  if (words.length > 1) return words.map(x => pluralize(x, amount)).join(" ");

  let n = amount instanceof Decimal ? amount.clampMax(10 ** 9).toNumber() : Math.clampMax(amount, 10 ** 9);
  let number;
  if (n !== Math.floor(n)) {
    number = "dual";
  } else if (n % 100 < 21 && n % 100 > 4) {
    number = "plural";
  } else if (n % 10 === 1) {
    return word;
  } else if (n % 10 < 5 && n % 10 > 1) {
    number = "dual";
  } else {
    number = "plural";
  }

  if (word === "") return "";
  if (["Машина", "Теорема"].includes(word)) return word.slice(0, -1) + (number === "dual" ? "ы" : "");
  if (word === "раз") return (number === "dual" ? "раза" : "раз");
  if (word === "Древо") return (number === "dual" ? "Древа" : "Древ");
  if (word === "год") return (number === "dual" ? "года" : "лет");
  if (word === "удалён") return "удалено";
  if (word === "постоянной") return "постоянных";
  if (word === "осталась") return "осталось";
  if (word === "Расширением") return "Расширениями";
  if (word === "галактики") return "галактик";
  if (word === "действующим") return "действующими";
  if (word === "года") return "лет";
  if (word === "дня") return "дней";
  if (word === "строки") return "строк";
  if (word === "е") return "х";
  if (word === "Очка") return "Очков";
  if (word === "нового") word = "новая";
  if (word.endsWith("ок") || word === "Очко") word = word.slice(0, -2) + "к";
  if (word.endsWith("на")) return word.slice(0, -1) + "о";
  if (word.endsWith("ия")) return word.slice(0, -1) + "й";
  if (word.endsWith("ен") || word.endsWith("ван")) return word + "о";
  if (word.endsWith("ень")) word = word.slice(0, -3) + "нь";
  if (["Машиной", "глифом"].includes(word)) return word.slice(0, -2) + "ами";
  if (["ая", "ое", "ый", "ий", "ую"].some(ending => word.endsWith(ending))) return word.slice(0, -2) + "ых";

  if (number === "dual") { 
    if (word.endsWith("ть")) return word.slice(0, -1) + "и";
    if (word.endsWith("ие")) return word.slice(0, -1) + "я";
    if (word.endsWith("ь") || word === "поле") return word.slice(0, -1) + "я";
    if (word.includes("алактик")) return word.slice(0, -1) + "и";
    if (word.endsWith("ка") || word === "ошибку") return word.slice(0, -2) + "ки";
    if (word.includes("минут") || word.includes("секунд")) return word.slice(0, -1) + (word.endsWith("ы") ? "" : "ы");
    if (word.endsWith("а")) return word.slice(0, -1) + "ов";
    return word + "а";
  } else {
    if (word.endsWith("ть")) return word.slice(0, -1) + "ей";
    if (word.endsWith("ие")) return word.slice(0, -1) + "й";
    if (word.endsWith("ь") || word === "поле") return word.slice(0, -1) + "ей";
    if (word.includes("алактик")) return word.slice(0, -1);
    if (word.endsWith("ка") || word === "ошибку") return word.slice(0, -2) + "ок";
    if (word.includes("минут") || word.includes("секунд")) return word.slice(0, -1);
    if (word.endsWith("а")) return word.slice(0, -1) + "ов";
    return word + "ов";
  }
};

/**
 * Returns the formatted value followed by a name, pluralized based on the value input.
 * @param  {string} name                  - name to pluralize and display after {value}
 * @param  {number|Decimal} value         - number to {format}
 * @param  {number} [places]              - number of places to display for the mantissa
 * @param  {number} [placesUnder1000]     - number of decimal places to display
 * @param  {function} [formatType=format] - how to format the {value}. defaults to format
 * @return {string} - the formatted {value} followed by the {name} after having been pluralized based on the {value}
 */
// eslint-disable-next-line max-params
window.quantify = function quantify(name, value, places, placesUnder1000, formatType = format) {
  if (name === undefined || value === undefined) throw "Arguments must be defined";

  const number = formatType(value, places, placesUnder1000);
  const plural = pluralize(name, value);
  return `${number} ${plural}`;
};

/**
 * Returns the value formatted to formatInt followed by a name, pluralized based on the value input.
 * @param  {string} name                  - name to pluralize and display after {value}
 * @param  {number|Decimal} value         - number to format
 * @return {string} - the formatted {value} followed by the {name} after having been pluralized based on the {value}
 */
window.quantifyInt = function quantifyInt(name, value) {
  if (name === undefined || value === undefined) throw "Arguments must be defined";

  const number = formatInt(value);
  const plural = pluralize(name, value);
  return `${number} ${plural}`;
};

/**
 * Creates an enumated string, using the oxford comma, such that "a"; "a and b"; "a, b, and c"
 * @param  {string[]} items - an array of items to enumerate
 * @return {string} - a string of {items}, separated by commas and/or and as needed.
 */
window.makeEnumeration = function makeEnumeration(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  const commaSeparated = items.slice(0, items.length - 1).join(", ");
  const last = items[items.length - 1];
  return `${commaSeparated} и ${last}`;
};
