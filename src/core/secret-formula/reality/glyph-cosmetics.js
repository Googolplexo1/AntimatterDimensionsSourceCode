// Color prop is a combination of a B/W background and a border hex code
export const glyphCosmeticSets = {
  cards: {
    id: "cards",
    name: "Масти игральных карт",
    symbol: ["♠", "♥", "♦", "♣", "♤", "♧", "♡", "♢"],
    color: ["W#000000", "B#FF2222"],
  },
  lower: {
    id: "lower",
    name: "Строчные буквы",
    symbol: ["ω", "ξ", "δ", "ψ"],
  },
  sus: {
    id: "sus",
    name: "Подозрительные",
    symbol: ["ඔ", "ඕ", "ඞ", "ඩ"],
    color: ["B#FCA40A"]
  },
  currency: {
    id: "currency",
    name: "Знаки современных валют",
    symbol: ["$", "₽", "¥", "€", "¢", "£", "₩"],
    preventBlur: true,
    color: ["W#00DD00"],
  },
  oldCurrency: {
    id: "oldCurrency",
    name: "Знаки старых валют",
    symbol: ["₷", "₰", "₳", "₯", "₻"],
    preventBlur: true,
    color: ["B#00DD00"],
  },
  pipe: {
    id: "pipe",
    name: "Одиночные провода",
    symbol: ["┌", "┐", "└", "┘", "─", "│"],
    color: ["B#33FF33"],
  },
  pipe2: {
    id: "pipe2",
    name: "Двойные провода",
    symbol: ["╔", "╗", "╚", "╝", "═", "║"],
    color: ["W#33FF33"],
  },
  trigram: {
    id: "trigram",
    name: "Триграммы",
    symbol: ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"],
    preventBlur: true,
    color: ["B#FFFFFF"],
  },
  arrow: {
    id: "arrow",
    name: "Одиночные стрелки",
    symbol: ["←", "↓", "↑", "→", "↖", "↗", "↘", "↙"],
    color: ["W#CC0000"],
  },
  arrow2: {
    id: "arrow2",
    name: "Двойные стрелки",
    symbol: ["⇄", "⇅", "⇔", "⇕"],
    color: ["W#0000CC"],
  },
  arrow3: {
    id: "arrow3",
    name: "Особые стрелки",
    symbol: ["↺", "↯", "↬", "⇱", "⇲", "⇮", "↭"],
    preventBlur: true,
    color: ["W#CCCC00"],
  },
  integral: {
    id: "integral",
    name: "Знаки интеграла",
    symbol: ["∬", "∭", "∮", "∯", "∰", "∱", "∲", "∳"],
    preventBlur: true,
    color: ["B#123456"]
  },
  numbers: {
    id: "numbers",
    name: "Цифры в кружочках",
    symbol: ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"],
    preventBlur: true,
    color: ["B#607D8B"]
  },
  blocks: {
    id: "blocks",
    name: "Блоки 2x2",
    symbol: ["▘", "▚", "▞", "▙", "▛", "▜", "▟"],
  },
  shapes: {
    id: "shapes",
    name: "Дополнительные формы",
    symbol: ["▰", "▲", "◆", "◎", "◍"],
    preventBlur: true,
  },
  chess: {
    id: "chess",
    name: "Шахматные фигуры",
    symbol: ["♟", "♞", "♝", "♜", "♛", "♚"],
    preventBlur: true,
    color: ["B#AAAAAA"],
  },
  planet: {
    id: "planet",
    name: "Астрономические символы",
    symbol: ["☿", "♀", "♁", "♂", "♃", "♄", "♆", "♇"],
    preventBlur: true,
    color: ["B#964B00"],
  },
  musical: {
    id: "musical",
    name: "Музыкальные символы",
    symbol: ["♩", "♪", "♬", "♭", "♮", "♯"],
    preventBlur: true,
    color: ["W#E621E6"]
  },
  recycle: {
    id: "recycle",
    name: "Знаки переработки",
    symbol: ["♻", "♳", "♴", "♵", "♶", "♷", "♸", "♹"],
    preventBlur: true,
  },
  dice: {
    id: "dice",
    name: "Грани игральной кости",
    symbol: ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"],
    preventBlur: true,
  },
  hazard: {
    id: "hazard",
    name: "Символы опасности",
    symbol: ["☠", "☢", "☣", "⚠"],
    preventBlur: true,
    color: ["W#FCA40A"]
  },
  celestial: {
    id: "celestial",
    name: "Символы Небожителей",
    symbol: ["\uF0C1", "⌬", "\uF185", "ᛝ", "♅"],
    color: ["B#00BCD4"],
  },
  alchemy: {
    id: "alchemy",
    name: "Алхимические символы",
    symbol: ["🜁", "🜂", "🜃", "🜄", "🜔", "🜍", "🜞", "🜚"],
    color: ["B#FFD700"],
  },
  blob: {
    id: "blob",
    name: "Кляксы",
    symbol: ["\uE011", "\uE012", "\uE013", "\uE014", "\uE016", "\uE01A", "\uE01C"],
    preventBlur: true,
    color: ["B#E4B51A"],
  },
  blob2: {
    id: "blob2",
    name: "Ещё кляксы",
    symbol: ["\uE01D", "\uE01E", "\uE021", "\uE024", "\uE025", "\uE026", "\uE027"],
    preventBlur: true,
  },
  star: {
    id: "star",
    name: "Геометрические звёзды",
    symbol: ["★", "☆", "✪", "✯", "✭", "✫", "🜞"],
  },
  star2: {
    id: "star2",
    name: "Реалистичные звёзды",
    symbol: ["✶", "✦", "✧", "✺", "✹", "✷"],
    color: ["W#D4FFFF", "W#FDFFCC"],
  },
  gem: {
    id: "gem",
    name: "Алмаз",
    symbol: ["💎"],
    color: ["B#035E3B", "B#943B47", "B#032C54"],
  },
  heiroglyph: {
    id: "heiroglyph",
    name: "Распространённые иероглифы",
    symbol: ["𓂀", "𓀶", "𓅊", "𓇌", "𓊝", "☥"],
    preventBlur: true,
  },
  paperclip: {
    id: "paperclip",
    name: "Бесполезные скрепки",
    symbol: ["𓄲", "𓄳", "𓄴", "𓄵", "𓄶", "𓄷", "𓄸"],
    preventBlur: true,
    color: ["B#222222"],
  },
  snake: {
    id: "snake",
    name: "Разнообразные змеи",
    symbol: ["𓆓", "𓆔", "𓆕", "𓆖", "𓆗", "𓆘"],
    preventBlur: true,
  },
  egyptNumber: {
    id: "egyptNumber",
    name: "Египетские цифры",
    symbol: ["𓆄", "𓅔", "𓆾", "𓂰", "𓍦", "𓎋", "𓐀", "𓃐"],
    preventBlur: true,
    color: ["W#123456"]
  },
  egyptWeather: {
    id: "egyptWeather",
    name: "Египетские флюгеры",
    symbol: ["𓈹", "𓈧", "𓈷", "𓉈", "𓈩", "𓈻", "𓈽"],
    preventBlur: true,
    color: ["W#607D8B"]
  },
  limbs: {
    id: "limbs",
    name: "Неуклюжие конечности",
    symbol: ["𓈝", "𓄒", "𓃂", "𓃁", "𓂩", "𓂙", "𓂓", "𓂼"],
    preventBlur: true,
    color: ["B#E621E6"]
  },
  animal: {
    id: "animal",
    name: "Ковчег Завета",
    symbol: ["𓆏", "𓆉", "𓅬", "𓅃", "𓃲", "𓆣", "𓆊", "𓃰"],
    preventBlur: true,
    color: ["W#0000AA"],
  },
};
