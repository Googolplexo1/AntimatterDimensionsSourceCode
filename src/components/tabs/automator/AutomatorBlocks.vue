<script>
import draggable from "vuedraggable";

export default {
  name: "AutomatorBlocks",
  components: {
    draggable
  },
  data() {
    return {
      allBlocks: automatorBlocks.filter(b => !AUTOMATOR_BLOCKS_BLACKLIST.includes(b.cmd)),
      blocks: []
    };
  },
  methods: {
    update() {
      this.blocks = this.allBlocks.filter(b => (b.isUnlocked?.() ?? true));
    },
    clone(block) {
      const b = {
        ...block,
        id: UIID.next()
      };

      if (block.nested && !block.nest) b.nest = [];
      AutomatorData.recalculateErrors();
      return b;
    },
  }
};

const AUTOMATOR_BLOCKS_COMPARISON_OPERATORS = ["<", ">", ">=", "<="];
const AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES = [
  "AM", "IP", "EP", "RM", "INFINITIES", "BANKED INFINITIES", "ETERNITIES", "REALITIES",
  "PENDING IP", "PENDING EP", "PENDING TP", "PENDING RM", "PENDING GLYPH LEVEL",
  "DT", "TP", "RG", "REP", "TT", "TOTAL TT", "TOTAL COMPLETIONS", "PENDING COMPLETIONS",
  "EC1 COMPLETIONS", "EC2 COMPLETIONS", "EC3 COMPLETIONS", "EC4 COMPLETIONS",
  "EC5 COMPLETIONS", "EC6 COMPLETIONS", "EC7 COMPLETIONS", "EC8 COMPLETIONS",
  "EC9 COMPLETIONS", "EC10 COMPLETIONS", "EC11 COMPLETIONS", "EC12 COMPLETIONS",
];

const AUTOMATOR_BLOCKS_RESETS = ["INFINITY", "ETERNITY", "REALITY"];

/**
 *  @property {String} cmd          Name of automator command
 *  @property {String} alias        Displayed name of automator command, acting as a more natural-sounding variant. Uses
 *    cmd if undefined.
 *  @property {Array: String} allowedPatterns   Allowed patterns for input types, specified single-capital-letter props
 *  @property {Array: String} [A-Z]             Classes of allowed inputs, to be used in allowedPatterns. Note that
 *    elements which begin with an asterisk are replaced with text inputs upon selection, and single-entry classes will
 *    be automatically replaced with a text input or unmodifiable text as appropriate
 *  @property {Array: String} targets           List of keys to be used for assigning inputs to props of automator
 *    commands. Each entry is associated with the index of the character in allowedPatterns
 *  @property {Boolean} nested      Whether or not the command is the header of a loop in the automator
 *  @property {Boolean} canWait     Whether or not the command can be run in a non-blocking way
 *  @property {Boolean} canRespec   Whether or not the command has an associated respec option
 *  @property {Function @return Boolean} isUnlocked    Function returning the unlock state of the command; if false,
 *    the command will not appear. Assumed to be true if prop is not present
 */
export const automatorBlocks = [
  {
    cmd: "STUDIES RESPEC",
    alias: "СБРОСИТЬ ИССЛЕДОВАНИЯ ВРЕМЕНИ"
  }, {
    cmd: "STUDIES LOAD",
    alias: "ЗАГРУЗИТЬ СОХРАНЁННОЕ ДРЕВО",
    allowedPatterns: ["AB"],
    A: ["ID", "NAME"],
    B: ["*"],
    targets: ["singleSelectionInput", "singleTextInput"],
    canWait: true
  }, {
    cmd: "STUDIES PURCHASE",
    alias: "КУПИТЬ ИССЛЕДОВАНИЯ",
    allowedPatterns: ["A"],
    A: ["*"],
    targets: ["singleTextInput"],
    canWait: true
  }, {
    cmd: "INFINITY",
    alias: "БЕСКОНЕЧНОСТЬ",
    canWait: true
  }, {
    cmd: "ETERNITY",
    alias: "ВЕЧНОСТЬ",
    canRespec: true,
    canWait: true
  }, {
    cmd: "REALITY",
    alias: "РЕАЛЬНОСТЬ",
    canRespec: true,
    canWait: true,
    isUnlocked: () => RealityUpgrade(25).isBought
  }, {
    cmd: "UNLOCK",
    alias: "РАЗБЛОКИРОВАТЬ",
    allowedPatterns: ["AB", "C"],
    A: ["EC"],
    B: ["*"],
    C: ["DILATION"],
    targets: ["singleSelectionInput", "singleTextInput"],
    canWait: true
  }, {
    cmd: "START",
    alias: "ЗАПУСТИТЬ",
    allowedPatterns: ["AB", "C"],
    A: ["EC"],
    B: ["*"],
    C: ["DILATION"],
    targets: ["singleSelectionInput", "singleTextInput"],
  }, {
    cmd: "AUTO",
    alias: "АВТОМАТИКА",
    allowedPatterns: ["AB"],
    A: AUTOMATOR_BLOCKS_RESETS,
    B: ["ON", "OFF", "* AUTOBUYER SETTING"],
    targets: ["singleSelectionInput", "singleTextInput"],
  }, {
    cmd: "BLACK HOLE",
    alias: "ЧЁРНАЯ ДЫРА",
    allowedPatterns: ["A"],
    A: ["ON", "OFF"],
    targets: ["singleSelectionInput"],
    isUnlocked: () => BlackHole(1).isUnlocked
  }, {
    cmd: "STORE GAME TIME",
    alias: "ХРАНЕНИЕ ИГРОВОГО ВРЕМЕНИ",
    allowedPatterns: ["A"],
    A: ["ON", "OFF", "USE"],
    targets: ["singleSelectionInput"],
    isUnlocked: () => Enslaved.isUnlocked
  }, {
    cmd: "NOTIFY",
    alias: "ИГРОВОЕ УВЕДОМЛЕНИЕ:",
    allowedPatterns: ["A"],
    A: ["*"],
    targets: ["singleTextInput"],
  }, {
    cmd: "COMMENT",
    alias: "КОММЕНТАРИЙ:",
    allowedPatterns: ["A"],
    A: ["*"],
    targets: ["singleTextInput"],
  }, {
    cmd: "WAIT",
    alias: "ПРИОСТАНОВИТЬ АВТОМАТИЗАТОР, ДО ТЕХ ПОР КАК",
    allowedPatterns: ["A", "DE", "BCB"],
    A: AUTOMATOR_BLOCKS_RESETS,
    B: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "* SPECIFIED CONSTANT"],
    C: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    D: ["BLACK HOLE"],
    E: ["OFF", "BH1", "BH2"],
    targets: ["genericInput1", "compOperator", "genericInput2"]
  }, {
    cmd: "PAUSE",
    alias: "ПРИОСТАНОВИТЬ АВТОМАТИЗАТОР НА",
    allowedPatterns: ["A"],
    A: ["*"],
    targets: ["singleTextInput"],
  }, {
    cmd: "IF",
    alias: "ВЫПОЛНИТЬ БЛОК, ЕСЛИ",
    allowedPatterns: ["ABA"],
    A: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "* SPECIFIED CONSTANT"],
    B: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targets: ["genericInput1", "compOperator", "genericInput2"],
    nested: true
  }, {
    cmd: "UNTIL",
    alias: "ПОВТОРЯТЬ БЛОК, ДО ТЕХ ПОР КАК",
    allowedPatterns: ["A", "BCB"],
    A: AUTOMATOR_BLOCKS_RESETS,
    B: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "* SPECIFIED CONSTANT"],
    C: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targets: ["genericInput1", "compOperator", "genericInput2"],
    nested: true
  }, {
    cmd: "WHILE",
    alias: "ПОВТОРЯТЬ БЛОК, ПОКА",
    allowedPatterns: ["ABA"],
    A: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "* SPECIFIED CONSTANT"],
    B: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targets: ["genericInput1", "compOperator", "genericInput2"],
    nested: true
  }, {
    cmd: "BLOB",
    alias: "КЛЯКСА"
  }, {
    cmd: "STOP",
    alias: "ОСТАНОВИТЬ ВЫПОЛНЕНИЕ"
  }
];
const AUTOMATOR_BLOCKS_BLACKLIST = ["BLOB"];

export const automatorBlocksMap = automatorBlocks.mapToObject(b => b.cmd, b => b);
</script>

<template>
  <draggable
    class="o-drag-cancel-region"
    group="code-blocks"
    ghost-class="null-block"
    draggable=".draggable-blocks"
  >
    <p>
      Перетягивайте эти блоки в поле слева! Названия блоков соответствуют ключевым словам команд,
      но после размещения их в коде на них будет отображён текст на русском языке, описывающий их функции.
      Это описание также будет отображено при наведении курсора мыши на блок во всплывающей подсказке.
    </p>
    <br>
    <p>
      Поля ввода <span class="c-automator-input-optional">коричневого</span> цвета не требуют заполнения, в то время как поля
      <span class="c-automator-input-required">бирюзового</span> цвета обязательны к заполнению.
      Данные, выделенные <span class="c-automator-block-row-error">красным</span> цветом, порождают ошибки и должны быть изменены, прежде чем
      программа может быть выполнена. Подробности приведены в панели "Информация о программировании".
    </p>
    <p>
      Опции в раскрывающихся списках, начинающиеся на *, будут замещены полем ввода. Оно может быть вновь замещено раскрывающимся
      списком путём нажатия на <i class="fa-solid fa-circle-xmark" /> справа в поле ввода.
    </p>
    <draggable
      class="block-container"
      :list="blocks"
      :group="{ name: 'code-blocks', pull: 'clone', put: false }"
      :sort="false"
      :clone="clone"
    >
      <div
        v-for="block in blocks"
        :key="block.id"
        v-tooltip="block.alias"
        class="o-automator-command o-automator-block-list draggable-blocks"
      >
        {{ block.cmd }}
      </div>
    </draggable>
    <p>
      Примечание: блоки занимают столько символов из доступного количества, сколько заняли бы эквивалентные им текстовые команды.
    </p>
  </draggable>
</template>

<style scoped>
.block-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 1rem 0;
}

.o-automator-block-list {
  display: flex;
  width: 8.7rem;
  text-align: center;
  height: 5.5rem;
  font-size: 1.2rem;
  justify-content: center;
  align-items: center;
}

.o-drag-cancel-region {
  width: 100%;
  height: 100%;
}

.null-block {
  display: none;
  visibility: hidden;
}
</style>
