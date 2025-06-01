import { standardizeAutomatorValues, tokenMap as T } from "./lexer";

/**
 * Note: the $ shorthand for the parser object is required by Chevrotain. Don't mess with it.
 */

const presetSplitter = /name[ \t]+(.+$)/ui;
const idSplitter = /id[ \t]+(\d)/ui;

function prestigeNotify(flag) {
  if (!AutomatorBackend.isOn) return;
  const state = AutomatorBackend.stack.top.commandState;
  if (state && state.prestigeLevel !== undefined) {
    state.prestigeLevel = Math.max(state.prestigeLevel, flag);
  }
}

EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_AFTER, () => prestigeNotify(T.Infinity.$prestigeLevel));
EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_AFTER, () => prestigeNotify(T.Eternity.$prestigeLevel));
EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => prestigeNotify(T.Reality.$prestigeLevel));

// Used by while and until - in order to get the text corrext, we need to invert the boolean if it's an until
// eslint-disable-next-line max-params
function compileConditionLoop(evalComparison, commands, ctx, isUntil) {
  return {
    run: () => {
      const loopStr = isUntil ? "UNTIL" : "WHILE";
      if (!evalComparison()) {
        AutomatorData.logCommandEvent(`Проверено условие ${parseConditionalIntoText(ctx)} (${isUntil ? "ИСТИНА" : "ЛОЖЬ"}),
          выход из цикла на строке ${AutomatorBackend.translateLineNumber(ctx.RCurly[0].startLine + 1) - 1}
          (конец цикла ${loopStr})`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
      }
      AutomatorBackend.push(commands);
      AutomatorData.logCommandEvent(`Проверено условие ${parseConditionalIntoText(ctx)} (${isUntil ? "ЛОЖЬ" : "ИСТИНА"}),
        перемещение на строку ${AutomatorBackend.translateLineNumber(ctx.LCurly[0].startLine + 1) - 1}
        (начало цикла ${loopStr})`, ctx.startLine);
      return AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION;
    },
    blockCommands: commands,
  };
}

// Extracts the conditional out of a command and returns it as text
function parseConditionalIntoText(ctx) {
  const comp = ctx.comparison[0].children;
  const getters = comp.compareValue.map(cv => {
    if (cv.children.AutomatorCurrency) return () => [
      "АНТИМАТЕРИИ", "ОБ", "ОВ", "МР", "БЕСКОНЕЧНОСТЕЙ", "СОХРАНЁННЫХ БЕСКОНЕЧНОСТЕЙ", "ВЕЧНОСТЕЙ", "РЕАЛЬНОСТЕЙ",
      "ПОЛУЧАЕМЫХ ОБ", "ПОЛУЧАЕМЫХ ОВ", "ПОЛУЧАЕМЫХ ТАХИОНОВ", "ПОЛУЧАЕМЫХ МР", "УРОВЕНЬ ПОЛУЧАЕМОГО ГЛИФА",
      "ЗВ", "ТАХИОНОВ", "ГР", "РЕПЛИКАНТИ", "ТВ", "ТВ ВСЕГО", "ВЫПОЛНЕНИЙ ИСПВ ВСЕГО", "ПОЛУЧАЕМЫХ ВЫПОЛНЕНИЙ ИСПВ",
      "ВЫПОЛНЕНИЙ ИСПВ1", "ВЫПОЛНЕНИЙ ИСПВ2", "ВЫПОЛНЕНИЙ ИСПВ3", "ВЫПОЛНЕНИЙ ИСПВ4",
      "ВЫПОЛНЕНИЙ ИСПВ5", "ВЫПОЛНЕНИЙ ИСПВ6", "ВЫПОЛНЕНИЙ ИСПВ7", "ВЫПОЛНЕНИЙ ИСПВ8",
      "ВЫПОЛНЕНИЙ ИСПВ9", "ВЫПОЛНЕНИЙ ИСПВ10", "ВЫПОЛНЕНИЙ ИСПВ11", "ВЫПОЛНЕНИЙ ИСПВ12",
    ][[
      "AM", "IP", "EP", "RM", "INFINITIES", "BANKED INFINITIES", "ETERNITIES", "REALITIES",
      "PENDING IP", "PENDING EP", "PENDING TP", "PENDING RM", "PENDING GLYPH LEVEL",
      "DT", "TP", "RG", "REP", "TT", "TOTAL TT", "TOTAL COMPLETIONS", "PENDING COMPLETIONS",
      "EC1 COMPLETIONS", "EC2 COMPLETIONS", "EC3 COMPLETIONS", "EC4 COMPLETIONS",
      "EC5 COMPLETIONS", "EC6 COMPLETIONS", "EC7 COMPLETIONS", "EC8 COMPLETIONS",
      "EC9 COMPLETIONS", "EC10 COMPLETIONS", "EC11 COMPLETIONS", "EC12 COMPLETIONS",
    ].indexOf(cv.children.AutomatorCurrency[0].image)];
    const val = cv.children.$value;
    if (typeof val === "string") return () => val;
    return () => format(val, 2, 2);
  });
  const compareFn = comp.ComparisonOperator[0].image;
  return `${getters[0]()} ${compareFn} ${getters[1]()}`;
}

// Determines how much (prestige currency) the previous (layer) reset gave, for event logging
function findLastPrestigeRecord(layer) {
  let addedECs, gainedEP;
  switch (layer) {
    case "INFINITY":
      return `${format(player.records.recentInfinities[0][1], 2)} ОБ`;
    case "ETERNITY":
      addedECs = AutomatorData.lastECCompletionCount;
      gainedEP = `${format(player.records.recentEternities[0][1], 2)} ОВ`;
      return addedECs === 0
        ? `${gainedEP}`
        : `${gainedEP}, ${addedECs} выполнений`;
    case "REALITY":
      return `${format(player.records.recentRealities[0][1], 2)} МР`;
    default:
      throw Error(`Unrecognized prestige ${layer} in Automator event log`);
  }
}

export const AutomatorCommands = [
  {
    id: "auto",
    rule: $ => () => {
      $.CONSUME(T.Auto);
      $.CONSUME(T.PrestigeEvent);
      $.OR([
        { ALT: () => $.CONSUME(T.On) },
        { ALT: () => $.CONSUME(T.Off) },
        { ALT: () => $.OR1([
          { ALT: () => $.SUBRULE($.duration) },
          { ALT: () => $.SUBRULE($.xHighest) },
          { ALT: () => $.SUBRULE($.currencyAmount) },
        ]) },
      ]);
    },
    // eslint-disable-next-line complexity
    validate: (ctx, V) => {
      ctx.startLine = ctx.Auto[0].startLine;
      if (ctx.PrestigeEvent && ctx.currencyAmount) {
        const desired$ = ctx.PrestigeEvent[0].tokenType.$prestigeCurrency;
        const specified$ = ctx.currencyAmount[0].children.AutomatorCurrency[0].tokenType.name;
        if (desired$ !== specified$) {
          V.addError(ctx.currencyAmount, `Валюта не соответсвует престижу`,
            `замените ${specified$} на ${desired$}`);
          return false;
        }
      }

      if (!ctx.PrestigeEvent) return true;
      const advSetting = ctx.duration || ctx.xHighest;
      // Do not change to switch statement; T.XXX are Objects, not primitive values
      if (ctx.PrestigeEvent[0].tokenType === T.Infinity) {
        if (!Autobuyer.bigCrunch.isUnlocked) {
          V.addError(ctx.PrestigeEvent, "Автоматика Большого Сжатия недоступна",
            "выполните 12-е Обычное Испытание, чтобы использовать эту команду");
          return false;
        }
        if (advSetting && !EternityMilestone.bigCrunchModes.isReached) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Расширенные настройки для автоматики Большого Сжатия недоступны",
            `достигните ${formatInt(5)} вечностей, чтобы использовать эту команду`);
          return false;
        }
      }
      if (ctx.PrestigeEvent[0].tokenType === T.Eternity) {
        if (!EternityMilestone.autobuyerEternity.isReached) {
          V.addError(ctx.PrestigeEvent, "Автоматика вечности недоступна",
            `достигните ${formatInt(100)} вечностей, чтобы использовать эту команду`);
          return false;
        }
        if (advSetting && !RealityUpgrade(13).isBought) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Расширенные настройки для автоматики вечности недоступны",
            `купите Улучшение Реальности "Телемеханический Процесс", чтобы использовать эту команду`);
          return false;
        }
      }
      if (ctx.PrestigeEvent[0].tokenType === T.Reality) {
        if (!RealityUpgrade(25).isBought) {
          V.addError(ctx.PrestigeEvent, "Автоматика реальности недоступна",
            `купите Улучшение Реальности "Непринуждённое Существование", чтобы использовать эту команду`);
          return false;
        }
        if (advSetting) {
          V.addError((ctx.duration || ctx.xHighest)[0],
            "Автоматизатор может выставить автоматику реальности только на реальность при фиксированном количестве МР",
            "замените второй параметр команды на <число>RM");
          return false;
        }
      }

      return true;
    },
    compile: ctx => {
      const isReality = ctx.PrestigeEvent[0].tokenType === T.Reality;
      const on = Boolean(ctx.On || ctx.duration || ctx.xHighest || ctx.currencyAmount);
      const duration = ctx.duration ? ctx.duration[0].children.$value : undefined;
      const xHighest = ctx.xHighest ? ctx.xHighest[0].children.$value : undefined;
      const fixedAmount = ctx.currencyAmount ? ctx.currencyAmount[0].children.$value : undefined;
      const durationMode = ctx.PrestigeEvent[0].tokenType.$autobuyerDurationMode;
      const xHighestMode = ctx.PrestigeEvent[0].tokenType.$autobuyerXHighestMode;
      const fixedMode = ctx.PrestigeEvent[0].tokenType.$autobuyerCurrencyMode;
      const autobuyer = ctx.PrestigeEvent[0].tokenType.$autobuyer();
      return () => {
        autobuyer.isActive = on;
        let currSetting = "";
        if (duration !== undefined) {
          autobuyer.mode = durationMode;
          autobuyer.time = duration / 1000;
          // Can't do the units provided in the script because it's been parsed away like 4 layers up the call stack
          currSetting = `каждые ${quantify("секунд", autobuyer.time)}`;
        } else if (xHighest !== undefined) {
          autobuyer.mode = xHighestMode;
          autobuyer.xHighest = new Decimal(xHighest);
          currSetting = `при ${ctx.PrestigeEvent[0].image === "infinity" ? "ОБ" : "ОВ"}, в ${format(xHighest, 2, 2)} раз превышающих максимальные`;
        } else if (fixedAmount !== undefined) {
          autobuyer.mode = fixedMode;
          if (isReality) {
            autobuyer.rm = new Decimal(fixedAmount);
            currSetting = `при ${format(autobuyer.rm, 2)} МР`;
          } else {
            autobuyer.amount = new Decimal(fixedAmount);
            currSetting = `при ${fixedAmount} ${ctx.PrestigeEvent[0].image === "infinity" ? "ОБ" : "ОВ"}`;
          }
        }
        // Settings are drawn from the actual automator text; it's not feasible to parse out all the settings
        // for every combination of autobuyers when they get turned off
        const settingString = (autobuyer.isActive && currSetting !== "") ? ` (Setting: ${currSetting})` : "";
        AutomatorData.logCommandEvent(`Автоматика ${isReality ? "реальности" : (ctx.PrestigeEvent[0].image === "infinity" ? "Большого Сжатия" : "вечности")}
          ${autobuyer.isActive ? "включена" : "выключена"}${settingString}`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => {
      const duration = ctx.duration
        ? `${ctx.duration[0].children.NumberLiteral[0].image} ${ctx.duration[0].children.TimeUnit[0].image}`
        : undefined;
      const xHighest = ctx.xHighest ? ctx.xHighest[0].children.$value : undefined;
      const fixedAmount = ctx.currencyAmount
        ? `${ctx.currencyAmount[0].children.NumberLiteral[0].image}` +
          ` ${ctx.currencyAmount[0].children.AutomatorCurrency[0].image.toUpperCase()}`
        : undefined;
      const on = Boolean(ctx.On);
      let input = "";

      if (duration) input = duration;
      else if (xHighest) input = `${xHighest} x highest`;
      else if (fixedAmount) input = `${fixedAmount}`;
      else input = (on ? "ON" : "OFF");

      return {
        singleSelectionInput: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
        singleTextInput: input,
        ...automatorBlocksMap.AUTO
      };
    }
  },
  {
    id: "blackHole",
    rule: $ => () => {
      $.CONSUME(T.BlackHole);
      $.OR([
        { ALT: () => $.CONSUME(T.On) },
        { ALT: () => $.CONSUME(T.Off) },
      ]);
    },
    validate: ctx => {
      ctx.startLine = ctx.BlackHole[0].startLine;
      return true;
    },
    compile: ctx => {
      const on = Boolean(ctx.On);
      return () => {
        if (on === BlackHoles.arePaused) BlackHoles.togglePause();
        let blackHoleEvent;
        if (BlackHole(1).isUnlocked) {
          blackHoleEvent = `${ctx.On ? "Цикл Чёрных Дыр возобновлён" : "Чёрные Дыры приостановлены"}`;
        } else if (Enslaved.isRunning || Pelle.isDisabled("blackhole")) {
          blackHoleEvent = "Команда переключения цикла Чёрных Дыр игнорирована, так как они отключены в Реальности этого Небожителя";
        } else {
          blackHoleEvent = "Команда переключения цикла Чёрных Дыр игнорирована, так как вы ещё не разблокировали их";
        }
        AutomatorData.logCommandEvent(blackHoleEvent, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: ctx.On ? "ON" : "OFF",
      ...automatorBlocksMap["BLACK HOLE"]
    })
  },
  {
    id: "blob",
    rule: $ => () => {
      $.CONSUME(T.Blob);
    },
    validate: ctx => {
      ctx.startLine = ctx.Blob[0].startLine;
      return true;
    },
    // This is an easter egg, it shouldn't do anything
    compile: () => () => AUTOMATOR_COMMAND_STATUS.SKIP_INSTRUCTION,
    blockify: () => ({
      ...automatorBlocksMap.BLOB,
    })
  },
  {
    id: "comment",
    rule: $ => () => {
      $.CONSUME(T.Comment);
    },
    validate: ctx => {
      ctx.startLine = ctx.Comment[0].startLine;
      return true;
    },
    // Comments should be no-ops
    compile: () => () => AUTOMATOR_COMMAND_STATUS.SKIP_INSTRUCTION,
    blockify: ctx => ({
      ...automatorBlocksMap.COMMENT,
      singleTextInput: ctx.Comment[0].image.replace(/(#|\/\/)\s?/u, ""),
    })
  },
  {
    id: "ifBlock",
    rule: $ => () => {
      $.CONSUME(T.If);
      $.SUBRULE($.comparison);
      $.CONSUME(T.LCurly);
      $.CONSUME(T.EOL);
      $.SUBRULE($.block);
      $.CONSUME(T.RCurly);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.If[0].startLine;
      return V.checkBlock(ctx, ctx.If);
    },
    compile: (ctx, C) => {
      const evalComparison = C.visit(ctx.comparison);
      const commands = C.visit(ctx.block);
      return {
        run: S => {
          // If the commandState is empty, it means we haven't evaluated the if yet
          if (S.commandState !== null) return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          // We use this flag to make "single step" advance to the next command after the if when the block ends
          S.commandState = {
            advanceOnPop: true,
            ifEndLine: ctx.RCurly[0].startLine
          };
          if (!evalComparison()) {
            AutomatorData.logCommandEvent(`Проверено условие ${parseConditionalIntoText(ctx)} (ЛОЖЬ),
              перемещение на строку ${AutomatorBackend.translateLineNumber(ctx.RCurly[0].startLine + 1)}`, ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          AutomatorBackend.push(commands);
          AutomatorData.logCommandEvent(`Проверено условие ${parseConditionalIntoText(ctx)} (ИСТИНА),
            вход в условный оператор IF`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION;
        },
        blockCommands: commands,
      };
    },
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      return {
        nest: commands,
        ...automatorBlocksMap.IF,
        ...comparison,
        genericInput1: standardizeAutomatorValues(comparison.genericInput1),
        genericInput2: standardizeAutomatorValues(comparison.genericInput2)
      };
    }
  },
  {
    id: "notify",
    rule: $ => () => {
      $.CONSUME(T.Notify);
      $.OR([
        { ALT: () => $.CONSUME(T.StringLiteral) },
        { ALT: () => $.CONSUME(T.StringLiteralSingleQuote) },
      ]);
    },
    validate: ctx => {
      ctx.startLine = ctx.Notify[0].startLine;
      return true;
    },
    compile: ctx => {
      const notifyText = ctx.StringLiteral || ctx.StringLiteralSingleQuote;
      return () => {
        GameUI.notify.automator(`Автоматизатор: ${notifyText[0].image}`);
        AutomatorData.logCommandEvent(`Игровое уведомление: ${notifyText[0].image}`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      ...automatorBlocksMap.NOTIFY,
      singleTextInput: (ctx.StringLiteral || ctx.StringLiteralSingleQuote)[0].image,
    })
  },
  {
    // Note: this has to appear before pause
    id: "pauseTime",
    rule: $ => () => {
      $.CONSUME(T.Pause);
      $.OR([
        { ALT: () => $.SUBRULE($.duration) },
        { ALT: () => $.CONSUME(T.Identifier) },
      ]);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.Pause[0].startLine;
      let duration;
      if (ctx.Identifier) {
        if (!V.isValidVarFormat(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.DURATION)) {
          V.addError(ctx, `Постоянная ${ctx.Identifier[0].image} не может быть использована как временной параметр`,
            `выставьте ${ctx.Identifier[0].image} на значение, меньшее
            ${format(Number.MAX_VALUE / 1000, 2)}`);
          return false;
        }
        const lookup = V.lookupVar(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.DURATION);
        duration = lookup ? lookup.value : lookup;
      } else {
        duration = V.visit(ctx.duration);
      }
      ctx.$duration = duration;
      return ctx.$duration !== undefined;
    },
    compile: ctx => {
      const duration = ctx.$duration;
      return S => {
        if (S.commandState === null) {
          S.commandState = { timeMs: 0 };
          AutomatorData.logCommandEvent(`Автоматизатор приостановлен на ${TimeSpan.fromMilliseconds(duration, "accusative")}`, ctx.startLine);
        } else {
          S.commandState.timeMs += Math.max(Time.unscaledDeltaTime.totalMilliseconds, AutomatorBackend.currentInterval);
        }
        const finishPause = S.commandState.timeMs >= duration;
        if (finishPause) {
          AutomatorData.logCommandEvent(`${TimeSpan.fromMilliseconds(duration)} прошло, Автоматизатор продолжает работу`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => {
      let blockArg;
      if (ctx.duration) {
        const c = ctx.duration[0].children;
        blockArg = `${c.NumberLiteral[0].image} ${c.TimeUnit[0].image}`;
      } else {
        blockArg = `${ctx.Identifier[0].image}`;
      }
      return {
        ...automatorBlocksMap.PAUSE,
        singleTextInput: blockArg
      };
    }
  },
  {
    id: "prestige",
    rule: $ => () => {
      $.CONSUME(T.PrestigeEvent);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.OPTION1(() => $.CONSUME(T.Respec));
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.PrestigeEvent[0].startLine;

      if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Reality && !RealityUpgrade(25).isBought) {
        V.addError(ctx.PrestigeEvent, "Эта команда недоступна",
          `купите Улучшение Реальности "Непринуждённое Существование", чтобы использовать эту команду`);
        return false;
      }

      if (ctx.PrestigeEvent && ctx.PrestigeEvent[0].tokenType === T.Infinity && ctx.Respec) {
        V.addError(ctx.Respec, "Команда INFINITY не имеет параметров",
          "удалите RESPEC");
      }
      return true;
    },
    compile: ctx => {
      const nowait = ctx.Nowait !== undefined;
      const respec = ctx.Respec !== undefined;
      const prestigeToken = ctx.PrestigeEvent[0].tokenType;
      return () => {
        const available = prestigeToken.$prestigeAvailable();
        const prestigeName = ctx.PrestigeEvent[0].image === "reality" ? "Реальность" : (ctx.PrestigeEvent[0].image === "infinity" ? "Бесконечность" : "Вечность");
        if (!available) {
          if (!nowait) return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
          AutomatorData.logCommandEvent(`${prestigeName} было невозможно совершить, команда пропущена`,
            ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (respec) prestigeToken.$respec();
        prestigeToken.$prestige();
        AutomatorData.logCommandEvent(`${prestigeName} совершена (${findLastPrestigeRecord(ctx.PrestigeEvent[0].image.toUpperCase())})`,
          ctx.startLine);
        // In the prestigeToken.$prestige() line above, performing a reality reset has code internal to the call
        // which makes the automator restart. However, in that case we also need to update the execution state here,
        // or else the restarted automator will immediately advance lines and always skip the first command
        return (prestigeName === "reality" && AutomatorBackend.state.forceRestart)
          ? AUTOMATOR_COMMAND_STATUS.RESTART
          : AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      ...automatorBlocksMap[
        ctx.PrestigeEvent[0].tokenType.name.toUpperCase()
      ],
      nowait: ctx.Nowait !== undefined,
      respec: ctx.Respec !== undefined
    })
  },
  {
    id: "startDilation",
    rule: $ => () => {
      $.CONSUME(T.Start);
      $.CONSUME(T.Dilation);
    },
    validate: ctx => {
      ctx.startLine = ctx.Start[0].startLine;
      return true;
    },
    compile: ctx => () => {
      if (player.dilation.active) {
        AutomatorData.logCommandEvent(`Замедление уже было запущено, команда пропущена`,
          ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      }
      if (startDilatedEternity(true)) {
        AutomatorData.logCommandEvent(`Замедление Времени запущено`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
      }
      return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
    },
    blockify: () => ({ singleSelectionInput: "DILATION", ...automatorBlocksMap.START })
  },
  {
    id: "startEC",
    rule: $ => () => {
      $.CONSUME(T.Start);
      $.SUBRULE($.eternityChallenge);
    },
    validate: ctx => {
      ctx.startLine = ctx.Start[0].startLine;
      return true;
    },
    compile: ctx => {
      const ecNumber = ctx.eternityChallenge[0].children.$ecNumber;
      return () => {
        const ec = EternityChallenge(ecNumber);
        if (ec.isRunning) {
          AutomatorData.logCommandEvent(`Указанное ИспВ уже было запущено, команда пропущена`,
            ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (!EternityChallenge(ecNumber).isUnlocked) {
          if (!TimeStudy.eternityChallenge(ecNumber).purchase(true)) {
            return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
          }
        }
        if (ec.start(true)) {
          AutomatorData.logCommandEvent(`${ecNumber}-е Испытание Вечности запущено`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: "EC",
      singleTextInput: ctx.eternityChallenge[0].children.$ecNumber,
      ...automatorBlocksMap.START
    })
  },
  {
    id: "storeGameTime",
    rule: $ => () => {
      $.CONSUME(T.StoreGameTime);
      $.OR([
        { ALT: () => $.CONSUME(T.On) },
        { ALT: () => $.CONSUME(T.Off) },
        { ALT: () => $.CONSUME(T.Use) },
      ]);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.StoreGameTime[0].startLine;
      if (!Enslaved.isUnlocked) {
        V.addError(ctx.StoreGameTime[0], "Эта команда недоступна",
          "разблокируйте сохранение игрового времени");
        return false;
      }
      return true;
    },
    compile: ctx => {
      if (ctx.Use) return () => {
        Enslaved.useStoredTime(false);
        AutomatorData.logCommandEvent(`Чёрная Дыра разряжена`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
      const on = Boolean(ctx.On);
      return () => {
        if (on !== player.celestials.enslaved.isStoring) Enslaved.toggleStoreBlackHole();
        if (Enslaved.isRunning || Pelle.isDoomed) AutomatorData.logCommandEvent(`Команда переключения зарядки Чёрных Дыр игнорирована, так как они отключены в Реальности этого Небожителя`, ctx.startLine);
        else AutomatorData.logCommandEvent(`Хранение игрового времени ${ctx.On ? "включено" : "выключено"}`, ctx.startLine);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      // eslint-disable-next-line no-nested-ternary
      singleSelectionInput: ctx.Use ? "USE" : (ctx.On ? "ON" : "OFF"),
      ...automatorBlocksMap["STORE GAME TIME"]
    })
  },
  {
    id: "studiesBuy",
    rule: $ => () => {
      $.CONSUME(T.Studies);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.CONSUME(T.Purchase);
      $.OR([
        { ALT: () => $.SUBRULE($.studyList) },
        { ALT: () => $.CONSUME1(T.Identifier) },
      ]);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.Studies[0].startLine;
      if (ctx.Identifier) {
        if (!V.isValidVarFormat(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.STUDIES)) {
          V.addError(ctx, `Постоянная ${ctx.Identifier[0].image} не является допустимым Древом Исследований`,
            `сохраните в ${ctx.Identifier[0].image} допустимое Древо Исследований`);
          return false;
        }
        const varInfo = V.lookupVar(ctx.Identifier[0], AUTOMATOR_VAR_TYPES.STUDIES);
        ctx.$studies = varInfo.value;
        ctx.$studies.image = ctx.Identifier[0].image;
      } else if (ctx.studyList) {
        ctx.$studies = V.visit(ctx.studyList);
      }
      return true;
    },
    compile: ctx => {
      const studies = ctx.$studies;
      if (ctx.Nowait === undefined) return () => {
        let prePurchasedStudies = 0;
        let purchasedStudies = 0;
        let finalPurchasedTS;
        for (const tsNumber of studies.normal) {
          if (TimeStudy(tsNumber).isBought) prePurchasedStudies++;
          else if (TimeStudy(tsNumber).purchase(true)) purchasedStudies++;
          else finalPurchasedTS = finalPurchasedTS ?? tsNumber;
        }
        if (prePurchasedStudies + purchasedStudies < studies.normal.length) {
          if (prePurchasedStudies + purchasedStudies === 0) {
            AutomatorData.logCommandEvent(`Не удалось купить ни одного из указанных Исследований Времени`, ctx.startLine);
          }
          if (purchasedStudies > 0 && finalPurchasedTS) {
            AutomatorData.logCommandEvent(`Куплено ${quantifyInt("Исследование", purchasedStudies)} Времени (до
            ИсслВ${finalPurchasedTS}), Автоматизатор ожидает возможности купить остальные`, ctx.startLine);
          }
          return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
        }
        const hasEC = studies.ec ? TimeStudy.eternityChallenge(studies.ec).isBought : false;
        if (!studies.ec || (hasEC && !studies.startEC)) {
          AutomatorData.logCommandEvent(`Все указанные Исследования Времени куплены`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        const unlockedEC = TimeStudy.eternityChallenge(studies.ec).purchase(true);
        if (hasEC || unlockedEC) {
          if (studies.startEC) {
            EternityChallenge(studies.ec).start(true);
            if (EternityChallenge(studies.ec).isRunning) {
              AutomatorData.logCommandEvent(`Все указанные Исследования Времени куплены,
                ${studies.ec}-е Испытание Вечности разблокировано и запущено`, ctx.startLine);
            } else {
              AutomatorData.logCommandEvent(`Все указанные Исследования Времени куплены,
                ${studies.ec}-е Испытание Вечности разблокировано, но не может быть запущено`, ctx.startLine);
            }
          } else {
            AutomatorData.logCommandEvent(`Все указанные Исследования Времени куплены,
              ${studies.ec}-е Испытание Вечности разблокировано`, ctx.startLine);
          }
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
      return () => {
        for (const tsNumber of studies.normal) TimeStudy(tsNumber).purchase(true);
        if (!studies.ec || TimeStudy.eternityChallenge(studies.ec).isBought) {
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        TimeStudy.eternityChallenge(studies.ec).purchase(true);
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleTextInput: ctx.$studies.image,
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap["STUDIES PURCHASE"]
    })
  },
  {
    id: "studiesLoad",
    rule: $ => () => {
      $.CONSUME(T.Studies);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.CONSUME(T.Load);
      $.OR([
        { ALT: () => $.CONSUME1(T.Id) },
        { ALT: () => $.CONSUME1(T.Name) },
      ]);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.Studies[0].startLine;

      if (ctx.Id) {
        const split = idSplitter.exec(ctx.Id[0].image);

        if (!split || ctx.Id[0].isInsertedInRecovery) {
          V.addError(ctx, "Пропущен номер сохранённого Древа",
            `укажите номер Древа Исследований, сохранённого во вкладке "Исследования Времени"`);
          return false;
        }

        const id = parseInt(split[1], 10);
        if (id < 1 || id > 6) {
          V.addError(ctx.Id[0], `Недопустимый номер сохранённого Древа (${id})`,
            "введите допустимый номер Древа Исследований (от 1 до 6)");
          return false;
        }
        ctx.$presetIndex = id;
        return true;
      }

      if (ctx.Name) {
        const split = presetSplitter.exec(ctx.Name[0].image);

        if (!split || ctx.Name[0].isInsertedInRecovery) {
          V.addError(ctx, "Пропущено название сохранённого Древа",
            `укажите название Древа Исследований, сохранённого во вкладке "Исследования Времени"`);
          return false;
        }

        // If it's a name, we check to make sure it exists:
        const presetIndex = player.timestudy.presets.findIndex(e => e.name === split[1]) + 1;
        if (presetIndex === 0) {
          V.addError(ctx.Name[0], `Древо Исследований "${split[1]}" не найдено (обратите внимание, что в названиях Древ регистр важен)`,
            "введите правильное название сохранённого Древа");
          return false;
        }
        ctx.$presetIndex = presetIndex;
        return true;
      }
      return false;
    },
    compile: ctx => {
      const presetIndex = ctx.$presetIndex;
      return () => {
        const imported = new TimeStudyTree(player.timestudy.presets[presetIndex - 1].studies);
        const beforeCount = GameCache.currentStudyTree.value.purchasedStudies.length;
        TimeStudyTree.commitToGameState(imported.purchasedStudies, true, imported.startEC);
        const afterCount = GameCache.currentStudyTree.value.purchasedStudies.length;
        // Check if there are still any unbought studies from the preset after attempting to commit it all;
        // if there are then we keep trying on this line until there aren't, unless we are given nowait
        const missingStudyCount = imported.purchasedStudies
          .filter(s => !GameCache.currentStudyTree.value.purchasedStudies.includes(s)).length;

        const presetRepresentation = ctx.Name ? `"${ctx.Name[0].image}"` : `№${ctx.Id[0].image}`;

        if (missingStudyCount === 0) {
          AutomatorData.logCommandEvent(`Древо ${presetRepresentation} загружено целиком`, ctx.startLine);
        } else if (afterCount > beforeCount) {
          AutomatorData.logCommandEvent(`Древо ${presetRepresentation} загружено частично
            (не удалось купить ${quantifyInt("Исследование", missingStudyCount)} Времени)`, ctx.startLine);
        }
        return ctx.Nowait !== undefined || missingStudyCount === 0
          ? AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION
          : AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: ctx.Name ? "NAME" : "ID",
      singleTextInput: ctx.Name ? player.timestudy.presets[ctx.$presetIndex - 1].name : ctx.$presetIndex,
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap["STUDIES LOAD"]
    })
  },
  {
    id: "studiesRespec",
    rule: $ => () => {
      $.CONSUME(T.Studies);
      $.CONSUME(T.Respec);
    },
    validate: ctx => {
      ctx.startLine = ctx.Studies[0].startLine;
      return true;
    },
    compile: ctx => () => {
      player.respec = true;
      AutomatorData.logCommandEvent(`Сброс Исследований Времени включён`, ctx.startLine);
      return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
    },
    blockify: () => automatorBlocksMap["STUDIES RESPEC"]
  },
  {
    id: "unlockDilation",
    rule: $ => () => {
      $.CONSUME(T.Unlock);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.CONSUME(T.Dilation);
    },
    validate: ctx => {
      ctx.startLine = ctx.Unlock[0].startLine;
      return true;
    },
    compile: ctx => {
      const nowait = ctx.Nowait !== undefined;
      return () => {
        if (PlayerProgress.dilationUnlocked()) {
          AutomatorData.logCommandEvent(`Замедление уже было разблокировано, команда пропущена`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        const unlockedThisTick = TimeStudy.dilation.purchase(true);
        if (unlockedThisTick) {
          AutomatorData.logCommandEvent(`Замедление Времени разблокировано`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (nowait) {
          AutomatorData.logCommandEvent(`Разблокировать Замедление было невозможно, команда пропущена`,
            ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: "DILATION",
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap.UNLOCK
    })
  },
  {
    id: "unlockEC",
    rule: $ => () => {
      $.CONSUME(T.Unlock);
      $.OPTION(() => $.CONSUME(T.Nowait));
      $.SUBRULE($.eternityChallenge);
    },
    validate: ctx => {
      ctx.startLine = ctx.Unlock[0].startLine;
      return true;
    },
    compile: ctx => {
      const nowait = ctx.Nowait !== undefined;
      const ecNumber = ctx.eternityChallenge[0].children.$ecNumber;
      return () => {
        if (EternityChallenge(ecNumber).isUnlocked) {
          AutomatorData.logCommandEvent(`ИспВ${ecNumber} уже было разблокировано, команда пропущена`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (nowait) {
          AutomatorData.logCommandEvent(`Разблокировать ИспВ${ecNumber} было невозможно, команда пропущена`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        const purchased = TimeStudy.eternityChallenge(ecNumber).purchase(true);
        if (purchased) {
          AutomatorData.logCommandEvent(`${ecNumber}-е Испытание Вечности разблокировано`, ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      singleSelectionInput: "EC",
      singleTextInput: ctx.eternityChallenge[0].children.$ecNumber,
      nowait: ctx.Nowait !== undefined,
      ...automatorBlocksMap.UNLOCK
    })
  },
  {
    id: "untilLoop",
    rule: $ => () => {
      $.CONSUME(T.Until);
      $.OR([
        { ALT: () => $.SUBRULE($.comparison) },
        { ALT: () => $.CONSUME(T.PrestigeEvent) },
      ]);
      $.CONSUME(T.LCurly);
      $.CONSUME(T.EOL);
      $.SUBRULE($.block);
      $.CONSUME(T.RCurly);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.Until[0].startLine;
      return V.checkBlock(ctx, ctx.Until);
    },
    compile: (ctx, C) => {
      const commands = C.visit(ctx.block);
      if (ctx.comparison) {
        const evalComparison = C.visit(ctx.comparison);
        return compileConditionLoop(() => !evalComparison(), commands, ctx, true);
      }
      const prestigeLevel = ctx.PrestigeEvent[0].tokenType.$prestigeLevel;
      let prestigeName;
      switch (ctx.PrestigeEvent[0].tokenType) {
        case T.Infinity:
          prestigeName = "Бесконечность";
          break;
        case T.Eternity:
          prestigeName = "Вечность";
          break;
        case T.Reality:
          prestigeName = "Реальность";
          break;
        default:
          throw Error("Unrecognized prestige layer in until loop");
      }
      return {
        run: S => {
          if (S.commandState === null) {
            S.commandState = { prestigeLevel: 0 };
          }
          if (S.commandState.prestigeLevel >= prestigeLevel) {
            AutomatorData.logCommandEvent(`${prestigeName} совершена, выход из цикла UNTIL`,
              ctx.startLine);
            return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
          }
          AutomatorBackend.push(commands);
          AutomatorData.logCommandEvent(`${prestigeName} пока не совершена, перемещение на строку
            ${AutomatorBackend.translateLineNumber(ctx.LCurly[0].startLine + 1)} (начало цикла UNTIL)`,
          ctx.startLine);
          return AUTOMATOR_COMMAND_STATUS.SAME_INSTRUCTION;
        },
        blockCommands: commands
      };
    },
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      if (ctx.comparison) {
        return {
          nest: commands,
          ...automatorBlocksMap.UNTIL,
          ...comparison,
          genericInput1: standardizeAutomatorValues(comparison.genericInput1),
          genericInput2: standardizeAutomatorValues(comparison.genericInput2)
        };
      }
      return {
        genericInput1: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
        nest: commands,
        ...automatorBlocksMap.UNTIL
      };
    }
  },
  {
    id: "waitCondition",
    rule: $ => () => {
      $.CONSUME(T.Wait);
      $.SUBRULE($.comparison);
    },
    validate: ctx => {
      ctx.startLine = ctx.Wait[0].startLine;
      return true;
    },
    compile: (ctx, C) => () => {
      const evalComparison = C.visit(ctx.comparison);
      const doneWaiting = evalComparison();
      if (doneWaiting) {
        const timeWaited = TimeSpan.fromMilliseconds(Date.now() - AutomatorData.waitStart).toStringShort();
        if (AutomatorData.isWaiting) {
          AutomatorData.logCommandEvent(`Ожидание завершено
            (${parseConditionalIntoText(ctx)} = ИСТИНА спустя ${timeWaited})`, ctx.startLine);
        } else {
          AutomatorData.logCommandEvent(`Ожидание пропущено (${parseConditionalIntoText(ctx)} = ИСТИНА)`,
            ctx.startLine);
        }
        AutomatorData.isWaiting = false;
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      }
      if (!AutomatorData.isWaiting) {
        AutomatorData.logCommandEvent(`Автоматизатор ожидает условие: ${parseConditionalIntoText(ctx)}`, ctx.startLine);
        AutomatorData.waitStart = Date.now();
      }
      AutomatorData.isWaiting = true;
      return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
    },
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      return {
        nest: commands,
        ...automatorBlocksMap.WAIT,
        ...comparison,
        genericInput1: standardizeAutomatorValues(comparison.genericInput1),
        genericInput2: standardizeAutomatorValues(comparison.genericInput2)
      };
    }
  },
  {
    id: "waitEvent",
    rule: $ => () => {
      $.CONSUME(T.Wait);
      $.CONSUME(T.PrestigeEvent);
    },
    validate: ctx => {
      ctx.startLine = ctx.Wait[0].startLine;
      return true;
    },
    compile: ctx => {
      const prestigeLevel = ctx.PrestigeEvent[0].tokenType.$prestigeLevel;
      return S => {
        if (S.commandState === null) {
          S.commandState = { prestigeLevel: 0 };
        }
        const prestigeOccurred = S.commandState.prestigeLevel >= prestigeLevel;
        const prestigeName = ctx.PrestigeEvent[0].image === "reality" ? "реальность" : (ctx.PrestigeEvent[0].image === "infinity" ? "бесконечность" : "вечность");
        if (prestigeOccurred) {
          const timeWaited = TimeSpan.fromMilliseconds(Date.now() - AutomatorData.waitStart).toStringShort();
          AutomatorData.logCommandEvent(`Ожидание завершено (${prestigeName} совершена
            ${findLastPrestigeRecord(prestigeName)} спустя ${timeWaited})`, ctx.startLine);
          AutomatorData.isWaiting = false;
          return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
        }
        if (!AutomatorData.isWaiting) {
          AutomatorData.logCommandEvent(`Автоматизатор ожидает ${prestigeName}`, ctx.startLine);
          AutomatorData.waitStart = Date.now();
        }
        AutomatorData.isWaiting = true;
        return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
      };
    },
    blockify: ctx => ({
      genericInput1: ctx.PrestigeEvent[0].tokenType.name.toUpperCase(),
      ...automatorBlocksMap.WAIT
    })
  },
  {
    id: "waitBlackHole",
    rule: $ => () => {
      $.CONSUME(T.Wait);
      $.CONSUME(T.BlackHole);
      $.OR([
        { ALT: () => $.CONSUME(T.Off) },
        { ALT: () => $.CONSUME(T.BlackHoleStr) },
      ]);
    },
    validate: ctx => {
      ctx.startLine = ctx.Wait[0].startLine;
      return true;
    },
    compile: ctx => () => {
      const off = Boolean(ctx.Off);
      // This input has the format "bh#"
      const holeID = ctx.BlackHoleStr ? Number(ctx.BlackHoleStr[0].image.charAt(2)) : 0;
      const bhCond = off ? !BlackHole(1).isActive : BlackHole(holeID).isActive;
      const bhStr = off ? "Чёрные Дыры вступили в фазу бездействия" : `${holeID}-я Чёрная Дыра вступила в фазу действия`;
      if (bhCond) {
        const timeWaited = TimeSpan.fromMilliseconds(Date.now() - AutomatorData.waitStart).toStringShort();
        AutomatorData.logCommandEvent(`Ожидание завершено (${bhStr} спустя ${timeWaited})`,
          ctx.startLine);
        AutomatorData.isWaiting = false;
        return AUTOMATOR_COMMAND_STATUS.NEXT_INSTRUCTION;
      }
      if (!AutomatorData.isWaiting) {
        AutomatorData.logCommandEvent(`Автоматизатор ожидает, чтобы ${bhStr}`, ctx.startLine);
        AutomatorData.waitStart = Date.now();
      }
      AutomatorData.isWaiting = true;
      return AUTOMATOR_COMMAND_STATUS.NEXT_TICK_SAME_INSTRUCTION;
    },
    blockify: ctx => ({
      genericInput1: "BLACK HOLE",
      // Note: In this particular case we aren't actually storing a comparison operator. This is still okay
      // because internally this is just the variable for the second slot and has no special treatment beyond that
      compOperator: ctx.BlackHoleStr ? ctx.BlackHoleStr[0].image.toUpperCase() : "OFF",
      ...automatorBlocksMap.WAIT
    })
  },
  {
    id: "whileLoop",
    rule: $ => () => {
      $.CONSUME(T.While);
      $.SUBRULE($.comparison);
      $.CONSUME(T.LCurly);
      $.CONSUME(T.EOL);
      $.SUBRULE($.block);
      $.CONSUME(T.RCurly);
    },
    validate: (ctx, V) => {
      ctx.startLine = ctx.While[0].startLine;
      return V.checkBlock(ctx, ctx.While);
    },
    compile: (ctx, C) => compileConditionLoop(C.visit(ctx.comparison), C.visit(ctx.block), ctx, false),
    blockify: (ctx, B) => {
      const commands = [];
      B.visit(ctx.block, commands);
      const comparison = B.visit(ctx.comparison);
      return {
        nest: commands,
        ...automatorBlocksMap.WHILE,
        ...comparison,
        genericInput1: standardizeAutomatorValues(comparison.genericInput1),
        genericInput2: standardizeAutomatorValues(comparison.genericInput2)
      };
    }
  },
  {
    id: "stop",
    rule: $ => () => {
      $.CONSUME(T.Stop);
    },
    validate: ctx => {
      ctx.startLine = ctx.Stop[0].startLine;
      return true;
    },
    compile: ctx => () => {
      AutomatorData.logCommandEvent(`Автоматизатор остановлен`, ctx.startLine);
      return AUTOMATOR_COMMAND_STATUS.HALT;
    },
    blockify: () => ({
      ...automatorBlocksMap.STOP,
    })
  }
];
