import { AutobuyerInputFunctions } from "@/components/tabs/autobuyers/AutobuyerInput";

export const automatorTemplates = {
  /**
    * List of possible data types to dynamically generate in script templates, assumed to be only string or boolean
    * {
    *  @property {String} name              String to be used as a key for entries in this object
    *  @property {String[]} boolDisplay     Strings to be displayed for true/false states for boolean inputs. If
    *   undefined, assumed to be a non-boolean input
    *  @property {Function} isValidString   A function used to test if an input string is formatted properly or not
    *  @property {Function} map             A function to be used to map the inputs to their actual values
    *   which are stored in the param object. If undefined, assumed to be no mapping
    * }
    */
  paramTypes: [
    {
      name: "tree",
      isValidString: str => {
        const validImport = TimeStudyTree.isValidImportString(str);
        const preset = str.match(/^(NAME (.{1,4})|ID (\d))$/u);
        const validPreset = preset ? (
          player.timestudy.presets.some(p => p.name === preset[2]) ||
          (Number(preset[3]) > 0 && Number(preset[3]) < 7)
        ) : false;
        return validImport || validPreset;
      },
    },
    {
      name: "integer",
      isValidString: str => AutobuyerInputFunctions.int.tryParse(str),
      map: x => Math.round(parseInt(x, 10)),
    },
    {
      name: "decimal",
      isValidString: str => AutobuyerInputFunctions.decimal.tryParse(str),
      map: x => AutobuyerInputFunctions.decimal.tryParse(x),
    },
    {
      name: "boolean",
      boolDisplay: ["Да", "Нет"],
    },
    {
      name: "nowait",
      boolDisplay: ["Пропустить недоступные Исследования", "Продолжить попытки купить Исследования"],
    },
    {
      name: "modeEter",
      boolDisplay: ["При ОВ, в X раз превышающих максимальные", "Вечность каждые X секунд"],
      map: x => (x ? "mult" : "time"),
    },
    {
      name: "modeInf",
      boolDisplay: ["При ОБ, в X раз превышающих максимальные", "Сжатие каждые X секунд"],
      map: x => (x ? "mult" : "time"),
    },
  ],
  /**
    * List automator script templates, primarily used here for formatting the player UI prompts appropriately
    * so that all of the required fields show up in the proper input formats. Actual script formatting requires
    * additionally writing a method to be called in the constructor of the ScriptTemplate class
    * {
    *  @property {String} name          Name of script template, also used as a key within the constructor for
    *   ScriptTemplate objects
    *  @property {String} description   Text description of what the template does when used in the automator
    *  @property {Object[]} inputs      Fields of the param object which need to be filled for the template to
    *   have all the information it needs. Contains the name of the field, the type (drawn from paramTypes above),
    *   and a prompt to be shown in the UI end
    *  @property {Function} warnings    Function which checks the current game state and potentially provides
    *   warnings based on some possibly common cases which may lead to undesired behavior
    * }
    */
  scripts: [
    {
      name: "Увеличение количества ОВ",
      description: `Этот шаблон совершает вечности одну за другой, каждую вечность пытаясь заново купить Древо
        Исследований. Вы должны выбрать настройки для автоматики Большого Сжатия и вечности. Шаблон завершит
        работу, достигнув целевого количества Очков Вечности.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Вместо сохранённого Древа вы можете ввести любое другое" },
        { name: "treeNowait", type: "nowait", prompt: "Поведение программы при невозможности купить Исследования Времени" },
        { name: "finalEP", type: "decimal", prompt: "Целевое количество ОВ" },
        { name: "autoInfMode", type: "modeInf", prompt: "Режим автоматики Большого Сжатия" },
        { name: "autoInfValue", type: "decimal", prompt: "Настройка автоматики Большого Сжатия" },
        { name: "autoEterMode", type: "modeEter", prompt: "Режим автоматики вечности" },
        { name: "autoEterValue", type: "decimal", prompt: "Настройка автоматики вечности" },
      ],
      warnings: () => {
        const list = [];
        if (!RealityUpgrade(10).isBought) {
          list.push(`Автоматизатор не сможет настроить автоматику Большого Сжатия до ${formatInt(5)} вечностей и автоматику вечности до ${formatInt(100)}
            вечностей. Рекомендуется купить Улучшение Реальности "${RealityUpgrade(10).name}", прежде чем использовать
            этот шаблон в начале реальности.`);
        }
        // Telemechanical Process (TD/5xEP autobuyers)
        if (!RealityUpgrade(13).isBought) {
          list.push(`Автоматизатор не сможет настроить автоматику вечности без Улучшения Реальности "${RealityUpgrade(13).name}"`);
        }
        if (!Perk.ttBuySingle.isBought) {
          list.push(`Этот шаблон может плохо работать без Навыка ${Perk.ttBuySingle.label}, если вы не можете получать
            Теоремы Времени, не покупая их`);
        }
        return list;
      },
    },
    {
      name: "Накопление вечностей",
      description: `Этот шаблон покупает указанное Древо Исследований и начинает совершать быстрые вечности одну за другой.
        Автоматика Большого Сжатия будет выставлена на режим Сжатия при ОБ, в X раз превышающих максимальные, так, чтобы успевать за вечность сработать указанное количество раз,
        а автоматика вечности будет срабатывать как можно скорее. Шаблон завершит работу, достигнув целевого количества вечностей.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Вместо сохранённого Древа вы можете ввести любое другое" },
        { name: "treeNowait", type: "nowait", prompt: "Поведение программы при невозможности купить Исследования Времени" },
        { name: "crunchesPerEternity", type: "integer", prompt: "Больших Сжатий за вечность" },
        { name: "eternities", type: "decimal", prompt: "Целевое количество вечностей" },
      ],
      warnings: () => {
        const list = [];
        // Eternal flow (eternity generation)
        if (RealityUpgrade(14).isBought) {
          list.push(`Поскольку у вас есть Улучшение Реальности "${RealityUpgrade(14).name}", этот шаблон, скорее всего, бесполезен для вас`);
        }
        return list;
      },
    },
    {
      name: "Накопление бесконечностей",
      description: `Этот шаблон покупает указанное Древо Исследований и настраивает вашу автоматику для накопления
        бесконечностей. Шаблон завершит работу, достигнув целевого количества бесконечностей, которое также может быть выражено в сохранённых бесконечностях,
        в случае чего он сначала накопит необходимое количество бесконечностей, а затем совершит одну вечность.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Вместо сохранённого Древа вы можете ввести любое другое" },
        { name: "treeNowait", type: "nowait", prompt: "Поведение программы при невозможности купить Исследования Времени" },
        { name: "infinities", type: "decimal", prompt: "Целевое количество бесконечностей" },
        { name: "isBanked", type: "boolean", prompt: "Цель выражена в сохранённых бесконечностях" },
      ],
      warnings: () => {
        const list = [];
        if (!Perk.achievementGroup5.isBought) {
          list.push(`У вас не будет достижения "${Achievement(131).name}" в начале реальности, так что учтите,
            что накопленные бесконечности не сохранятся без ИссЛВ191`);
        }
        // Boundless flow (infinity generation)
        if (RealityUpgrade(11).isBought) {
          list.push(`Поскольку у вас есть Улучшение Реальности "${RealityUpgrade(11).name}", этот шаблон, скорее всего, бесполезен для вас`);
        }
        return list;
      },
    },
    {
      name: "Выполнение Испытания Вечности",
      description: `Этот шаблон покупает указанное Древо Исследований и разблокирует указанное Испытание Вечности.
        Затем он настраивает автоматику Большого Сжатия согласно введённым данным и начинает Испытание Вечности.
        Наконец, он дожидается целевого количества выполнений и совершает вечность, чтобы
        выполнить Испытание.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Вместо сохранённого Древа вы можете ввести любое другое" },
        { name: "treeNowait", type: "nowait", prompt: "Поведение программы при невозможности купить Исследования Времени" },
        { name: "ec", type: "integer", prompt: "Номер Испытания Вечности" },
        { name: "completions", type: "integer", prompt: "Целевое количество выполнений" },
        { name: "autoInfMode", type: "modeInf", prompt: "Режим автоматики Большого Сжатия" },
        { name: "autoInfValue", type: "decimal", prompt: "Настройка автоматики Большого Сжатия" },
      ],
      warnings: () => {
        const list = [];
        if (!Perk.studyECRequirement.isBought) {
          list.push(`Ввиду наличия вторичного требования разблокировка Испытания Вечности может оказаться невозможной.
            Рекомендуется купить Навык ${Perk.studyECRequirement.label}, прежде чем использовать этот шаблон`);
        }
        if (!Perk.studyECBulk.isBought) {
          list.push(`При использовании этого шаблона без опта Испытаний Вечности может получиться длинная
            медленная программа низкой гибкости. Если вы всё же используете шаблон, рекомендуется возвратиться к Автоматизатору и упростить вашу программу
            по покупке Навыка ${Perk.studyECBulk.label}`);
        }
        return list;
      },
    },
    {
      name: "Разблокировка Замедления",
      description: `Этот шаблон совершает вечности одну за другой, каждую вечность пытаясь заново купить Древо
        Исследований. Вы должны выбрать настройки для автоматики вечности; автоматика Большого Сжатия будет
        выключена. Шаблон работает, пока не достигнет необходимого количества Теорем Времени, а затем
        разблокирует Замедление.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Вместо сохранённого Древа вы можете ввести любое другое" },
        { name: "treeNowait", type: "nowait", prompt: "Поведение программы при невозможности купить Исследования Времени" },
        { name: "finalEP", type: "decimal", prompt: "Целевое количество ОВ" },
        { name: "autoEterMode", type: "modeEter", prompt: "Режим автоматики вечности" },
        { name: "autoEterValue", type: "decimal", prompt: "Настройка автоматики вечности" },
      ],
      warnings: () => {
        const list = [];
        // Telemechanical Process (TD/5xEP autobuyers)
        if (!RealityUpgrade(13).isBought) {
          list.push(`Автоматизатор не сможет настроить автоматику вечности без Улучшения Реальности "${RealityUpgrade(13).name}"`);
        }
        if (!Perk.ttBuySingle.isBought) {
          list.push(`Этот шаблон может плохо работать без Навыка ${Perk.ttBuySingle.label}, если вы не можете получать
            Теоремы Времени, не покупая их`);
        }
        return list;
      },
    },
  ]
};
