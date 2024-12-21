import { automatorTemplates } from "../script-templates";

export const automator = {
  categoryNames: [
    "Управление Исследованиями Времени",
    "Совершение действий",
    "Изменение настроек",
    "Информация",
    "Контроль потока команд",
  ],
  commands: [
    {
      id: 0,
      isUnlocked: () => true,
      keyword: "STUDIES RESPEC (сброс ИсслВ)",
      category: 0,
      syntax: `<b>studies respec</b>`,
      description: `Переключает опцию "Сбросить Исследования Времени на вечности".
        Обратите внимание, что эта команда не совершает вечность, и если вы хотите сбросить Исследования Времени,
        то вы должны совершить вечность отдельно, например, с помощью команды ETERNITY (хотя она может сбрасывать ИсслВ сама).`,
      examples: [
        `studies respec`,
      ]
    },
    {
      id: 1,
      isUnlocked: () => true,
      keyword: "STUDIES LOAD (загрузка Древа ИсслВ)",
      category: 0,
      syntax: `<b>studies</b> [nowait] <b>load id</b> <u>номер</u><br>
        <b>studies</b> [nowait] <b>load name</b> <u>название</u>`,
      description: `Загружает Древо Исследований, сохранённое в один из слотов на панели в нижней части экрана во вкладке "Исследования Времени".`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                При наличии этого параметра Автоматизатор купит лишь те Исследования Времени, которые возможно купить в данный момент, и перейдёт к следующей команде.
                Иначе Автоматизатор будет пытаться купить все Исследования из загружаемого Древа снова и снова, пока
                Древо не будет выкуплено полностью, что может привести к застреванию программы на этой строке.
              `
            },
            {
              header: "<i>номер</i>",
              description: `
                Номер слота, из которого необходимо загрузить Древо Исследований. Слоты нумеруются числами от одного до шести
                по порядку слева направо.`
            },
            {
              header: "<i>название</i>",
              description: "Название Древа Исследований, которое необходимо загрузить. Обратите внимание, что регистр важен."
            },
          ]
        }
      ],
      examples: [
        `studies load id 2`,
        `studies load name ANTI`,
        `studies nowait load name dil`,
      ]
    },
    {
      id: 2,
      isUnlocked: () => true,
      keyword: "STUDIES PURCHASE (покупка ИсслВ)",
      category: 0,
      syntax: `<b>studies</b> [nowait] <b>purchase</b> <u>список ИсслВ</u>`,
      description: "Покупает Исследования Времени из указанного списка.",
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                При наличии этого параметра Автоматизатор купит лишь те Исследования Времени, которые возможно купить в данный момент, и перейдёт к следующей команде.
                Иначе Автоматизатор будет пытаться купить все Исследования из указанного списка снова и снова, пока
                список не будет выкуплен полностью, что может привести к застреванию программы на этой строке.
              `
            },
            {
              header: "<i>список ИсслВ</i>",
              description: `
                Записывается в формате Древа Исследований, то есть путём перечисления всех Исследований Времени
                через запятую. Также разрешается обозначать несколько последовательных Исследований Времени
                через дефис (например, <u>11-62</u>) и использовать следующие сокращения для обозначения определённых групп Исследований Времени:<br>
                <blockquote>
                <b>antimatter</b> - путь Измерений Антиматерии;<br>
                <b>infinity</b> - путь Измерений Бесконечности;<br>
                <b>time</b> - путь Измерений Времени;<br>
                <b>active</b> - Активный путь;<br>
                <b>passive</b> - Средний путь;<br>
                <b>idle</b> - Пассивный путь;<br>
                <b>light</b> - Светлые;<br>
                <b>dark</b> - Тёмные.</blockquote>
                Вы также можете использовать постоянную вместо этого параметра.`
            },
          ]
        }
      ],
      examples: [
        "studies nowait purchase 11,21,31",
        "studies purchase 11-62, antimatter, 111, idle",
        "studies nowait purchase ec6Studies",
      ]
    },
    {
      id: 3,
      isUnlocked: () => true,
      keyword: "Сбросы престижа",
      category: 1,
      syntax: `
        <b>infinity</b> [nowait]<br>
        <b>eternity</b> [nowait] [respec]<br>
        <b>reality</b> [nowait] [respec]`,
      description: `Эти три команды пытаются совершить бесконечность, вечность или реальность соответственно.
        Если программа застревает на такой команде, то, вероятно, причина в том, что соответствующее действие совершает автоматика,
        вследствие чего Автоматизатор оказывается неспособен совершить его вновь. Используйте параметр <i>nowait</i> или
        команду AUTO.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                При наличии этого параметра Автоматизатор перейдёт к следующей команде, если совершить сброс престижа в данный момент невозможно, а не будет продолжать попытки.
              `
            },
            {
              header: "<i>respec</i>",
              description: `
                С командой ETERNITY сбрасывает Исследования Времени, а с командой REALITY - деактивирует глифы.
              `
            },
          ]
        }
      ],
      examples: [
        "infinity",
        "eternity respec",
        "reality nowait",
      ]
    },
    {
      id: 4,
      isUnlocked: () => true,
      keyword: "UNLOCK (разблокировка испытаний)",
      category: 1,
      syntax: `
        <b>unlock</b> [nowait] <b>ec</b><u>номер</u><br>
        <b>unlock</b> [nowait] <b>dilation</b>`,
      description: "Эти две команды разблокируют Испытание Вечности с указанным номером и Замедление Времени соответственно.",
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                При наличии этого параметра Автоматизатор перейдёт к следующей команде, если разблокировать испытание в данный момент невозможно, а не будет продолжать попытки.
              `
            },
            {
              header: "<i>номер</i>",
              description: `
                Номер Испытания Вечности, которое необходимо разблокировать.
              `
            },
          ]
        }
      ],
      examples: [
        "unlock dilation",
        "unlock ec7"
      ]
    },
    {
      id: 5,
      isUnlocked: () => true,
      keyword: "START (запуск испытаний)",
      category: 1,
      syntax: `
        <b>start</b> ec<u>номер</u><br>
        <b>start</b> dilation`,
      description: "Эти две команды запускают Испытание Вечности с указанным номером и Замедление Времени соответственно. Если соответствующее Испытание Вечности не разблокировано, Автоматизатор разблокирует его.",
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>номер</i>",
              description: `
                Номер Испытания Вечности, которое необходимо запустить.
              `
            },
          ]
        }
      ],
      examples: [
        "start ec12",
        "start dilation"
      ]
    },
    {
      id: 6,
      isUnlocked: () => true,
      keyword: "AUTO (изменение настроек автоматики)",
      category: 2,
      syntax: `<b>auto infinity</b> [параметр]<br>
        <b>auto eternity</b> [параметр]<br>
        <b>auto reality</b> [параметр]`,
      description: `Эти три команды изменяют настройки автоматики бесконечности, вечности или реальности соответственно в соответствии с параметром.
        При его отсутствии Автоматизатор переключает соответствующую автоматику.
        Обращение к неразблокированной автоматике приведёт к ошибке.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<b>on</b> или <b>off</b>",
              description: "Эти два параметра включают и выключают соответствующую автоматику соответственно.",
            },
            {
              header: "<u><i>число</i></u> <u><i>единица измерения времени</i></u>",
              description: `Выставляет соответствующую автоматику на режим совершения сброса через указанное время.`
            },
            {
              header: "<u><i>число</i></u><b>x highest</b>",
              description: `Выставляет соответствующую автоматику на режим совершения сброса при получении валюты престижа, в указанное число раз превышающем максимальное количество.`
            },
            {
              header: "<i><u>число</u> <u>валюта</u></i>",
              description: `Выставляет соответствующую автоматику на режим совершения сброса при указанном получении валюты престижа.`,
            },
          ]
        },
        {
          name: "ЕДИНИЦЫ ИЗМЕРЕНИЯ ВРЕМЕНИ",
          items: [
            {
              header: "",
              description: `<blockquote>
                <b>h</b> - час<br>
                <b>m</b> - минута<br>
                <b>s</b> - секунда<br>
                <b>ms</b> - миллисекунда<br>
                </blockquote>`,
            },
          ]
        },
        {
          name: "ВАЛЮТЫ ПРЕСТИЖА",
          items: [
            {
              header: "",
              description: `<blockquote>
                <b>ip</b> - Очки Бесконечности<br>
                <b>ep</b> - Очки Вечности<br>
                <b>rm</b> - Машины Реальности<br>
                </blockquote>`,
            },
          ]
        }
      ],
      examples: [
        "auto infinity on",
        "auto eternity off",
        "auto infinity 30 s",
        "auto eternity 1e100x highest"
      ]
    },
    {
      id: 7,
      isUnlocked: () => BlackHole(1).isUnlocked,
      keyword: "BLACK HOLE (переключение цикла активности Чёрной Дыры)",
      category: 2,
      syntax: `<b>black hole on</b><br>
        <b>black hole off</b>`,
      description: `Эти две команды возобновляет и приостанавливает соответственно цикл активности Чёрной Дыры.`,
      examples: [
        "black hole on",
        "black hole off",
      ]
    },
    {
      id: 8,
      isUnlocked: () => Enslaved.isUnlocked,
      keyword: "STORE GAME TIME (управление сохранением игрового времени)",
      category: 2,
      syntax: `<b>store game time on</b><br>
        <b>store game time off</b><br>
        <b>store game time use</b>`,
      description: `Эти три команды запускает и прекращает зарядку Чёрной Дыры и разряжает её соответственно.`,
      examples: [
        "store game time on",
        "store game time off",
        "store game time use",
      ]
    },
    {
      id: 9,
      isUnlocked: () => true,
      keyword: "NOTIFY (уведомление)",
      category: 3,
      syntax: "<b>notify</b> \"<u>текст</u>\"",
      description: `Посылает уведомление в правый верхний угол экрана с указанным текстом, подобное уведомлению о выполнении достижения.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>текст</i>",
              description: `
                Текст, который необходимо показать.
              `
            },
          ]
        }
      ],
      examples: [
        "notify \"Замедление разблокировано\"",
        "notify \"ИспВ выполнены\""
      ]
    },
    {
      id: 10,
      isUnlocked: () => true,
      keyword: "Комментарии",
      category: 3,
      syntax: "<b>#</b> комментарий<br><b>//</b> комментарий",
      description: `Одним из двух приведённых выше способов вы можете оформить комментарий внутри программы.
        Они не влияют на работу программы и служат лишь как заметки для её оформления. Комментарий должен занимать отдельную строку.
        Автоматизатор при выполнении программы пропускает комментарии, не тратя на это времени.`,
      examples: [
        "# накопим 1e20 прежде чем начать испв1",
        "// этот цикл чередует замедления с обычными вечностями"
      ]
    },
    {
      id: 11,
      isUnlocked: () => true,
      keyword: "WAIT (ожидание выполнения условия)",
      category: 4,
      syntax: "<b>wait</b> <u>условие</u>",
      description: `Приостанавливает выполнение программы, до тех пор пока не будет выполнено указанное условие.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>условие</i>",
              description: `
                Условие, выполнения которого необходимо дождаться.
              `
            },
          ]
        },
        {
          name: "УСЛОВИЯ",
          items: [
            {
              header: "<i>сравнение</i>",
              description: `
                Заставляет Автоматизатор ждать, пока не будет выполнено некоторое неравенство на игровые параметры.
                Подробности о форматировании сравнений см. в соответствующей статье.
              `
            },
            {
              header: "<i>престиж</i>",
              description: `
                Заставляет Автоматизатор ждать, пока не произойдёт соответствующий сброс престижа.
              `
            },
            {
              header: "<i><b>black hole</b> фаза Чёрных Дыр</i>",
              description: `
                Заставляет Автоматизатор ждать, пока Чёрные Дыры не придут в соответствующую фазу.
              `
            }
          ]
        },
        {
          name: "ФАЗЫ ЧЁРНЫХ ДЫР",
          items: [
            {
              header: "",
              description: `<blockquote>
                <b>bh1</b> - только 1-я Чёрная Дыра действует<br>
                <b>bh2</b> - обе Чёрные Дыры действуют<br>
                <b>off</b> - ни одна из Чёрных Дыр не действует<br>
                </blockquote>`,
            },
          ]
        },
        {
          name: "ПРЕСТИЖИ",
          items: [
            {
              header: "",
              description: `<blockquote>
                <b>infinity</b> - бесконечность<br>
                <b>eternity</b> - вечность<br>
                <b>reality</b> - реальность<br>
                </blockquote>`,
            },
          ]
        }
      ],
      examples: [
        "wait am >= 1e308",
        "wait pending completions >= 5",
        "wait ec9 completions >= 4",
        "wait infinity",
        "wait black hole bh1",
      ]
    },
    {
      id: 12,
      isUnlocked: () => true,
      keyword: "PAUSE (приостановка выполнения программы)",
      category: 4,
      syntax: "<b>pause</b> <u>число</u> <u>единица измерения времени</u>",
      description: `Приостанавливает выполнение программы на указанное время.`,
      examples: [
        "pause 10 s",
        "pause 1 m",
      ],
      sections: [
        {
          name: "ЕДИНИЦЫ ИЗМЕРЕНИЯ ВРЕМЕНИ",
          items: [
            {
              header: "",
              description: `<blockquote>
                <b>h</b> - час<br>
                <b>m</b> - минута<br>
                <b>s</b> - секунда<br>
                <b>ms</b> - миллисекунда<br>
                </blockquote>`,
            },
          ]
        }
      ]
    },
    {
      id: 13,
      isUnlocked: () => true,
      keyword: "IF (условный оператор)",
      category: 4,
      syntax: `<b>if</b> <u>сравнение</u> {<br>
        <blockquote><u>тело условного оператора</u></blockquote>
        }`,
      description: `Проверяет указанное неравенство на игровые параметры. Если оно верно, то выполняется указанный блок команд,
        иначе Автоматизатор пропускает его.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>сравнение</i>",
              description: `
                Неравенство на игровые параметры, которое необходимо проверить.
                Подробности о форматировании сравнений см. в соответствующей статье.
              `
            },
            {
              header: "<i>тело условного оператора</i>",
              description: `
                Блок команд, который выполняется при истинности сравнения.
              `
            },
          ]
        }
      ],
      examples: [
        "if ec10 completions < 5",
        "if ep > 1e6000"
      ]
    },
    {
      id: 14,
      isUnlocked: () => true,
      keyword: "UNTIL (цикл \"до тех пор пока\")",
      category: 4,
      syntax: `<b>until</b> <u>сравнение</u> {<br>
        <blockquote><u>тело цикла</u></blockquote>
        }<br><b>until</b> <u>престиж</u> {<br>
          <blockquote><u>тело цикла</u></blockquote>
        }`,
      description: `Проверяет указанное условие. Если оно неверно, то выполняется указанный блок команд, после чего
        условие проверяется вновь. В случае ложности условия вновь выполняется блок команд, и так далее. Когда условие
        впервые становится верным, блок команд пропускается.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>сравнение</i>",
              description: `
                Неравенство на игровые параметры, которое необходимо проверить.
                Подробности о форматировании сравнений см. в соответствующей статье.
              `
            },
            {
              header: "<i>престиж</i>",
              description: `
                Престиж, сброса которого необходимо дождаться. При использовании этого параметра условием выполнения
                цикла будет наличие хотя бы одного происшествия сброса указанного престижа, с тех пор как Автоматиазтор
                впервые вошёл в тело цикла. Обратите внимание, что Автоматизатор не выйдет из цикла немедленно по совершении
                сброса указанного престижа, а завершит выполнение команд внутри него и только затем проверит условие и покинет цикл.
              `
            },
            {
              header: "<i>тело цикла</i>",
              description: `
                Блок команд, который выполняется при ложности условия.
              `
            },
          ]
        },
        {
          name: "ПРЕСТИЖИ",
          items: [
            {
              header: "",
              description: `<blockquote>
                <b>infinity</b> - бесконечность<br>
                <b>eternity</b> - вечность<br>
                <b>reality</b> - реальность<br>
                </blockquote>`,
            },
          ]
        }
      ],
      examples: [
        "until ep > 1e500",
        "until reality",
      ]
    },
    {
      id: 15,
      isUnlocked: () => true,
      keyword: "WHILE (цикл \"пока\")",
      category: 4,
      syntax: `<b>while</b> <u>сравнение</u> {<br>
        <blockquote><u>тело цикла</u></blockquote>
      }`,
      description: `Проверяет указанное неравенство на игровые параметры. Если оно верно, то выполняется указанный блок команд,
        после чего условие проверяется вновь. В случае истинности условия вновь выполняется блок команд, и так далее. Когда условие
        впервые становится неверным, блок команд пропускается.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>сравнение</i>",
              description: `
                Неравенство на игровые параметры, которое необходимо проверить.
                Подробности о форматировании сравнений см. в соответствующей статье.
              `
            },
            {
              header: "<i>тело цикла</i>",
              description: `
                Блок команд, который выполняется при истинности условия.
              `
            },
          ]
        }
      ],
      examples: [
        `while ep < 1e500`,
        `while myThreshold > am`,
      ]
    },
    {
      id: 16,
      isUnlocked: () => true,
      keyword: "STOP (полная остановка выполнения программы)",
      category: 4,
      syntax: `<b>stop</b>`,
      description: `Полностью останавливает выполнение программы. Обратите внимание, что эту команду не нужно писать
        в конец каждой программы, так как они останавливаются сами по достижении последней строки. Но эта команда может быть полезна,
        если вы хотите остановить выполнение программы только при определённом условии.`,
      examples: [
        `stop`,
      ]
    },
    {
      id: 17,
      isUnlocked: () => true,
      keyword: "Список игровых параметров",
      category: 4,
      syntax: "<i>Используются в сравнениях</i>",
      description: () => {
        const filterText = EffarigUnlock.glyphFilter.isUnlocked
          ? `<b>filter score</b> - лучшая из оценок выбираемых глифов от Фильтра Глифов<br>`
          : "";
        const stText = V.spaceTheorems > 0
          ? `<b>space theorems</b> - количество Теорем Пространства<br>
            <b>total space theorems</b> - общее количество Теорем Пространтсва (в том числе потраченных)<br>`
          : "";
        return `
          <b>am</b> - количество антиматерии<br>
          <b>ip</b> - количество Очков Бесконечности<br>
          <b>ep</b> - количество Очков Вечности<br>
          <b>rm</b> - количество Машин Реальности<br>
          <b>infinities</b> - количество бесконечностей<br>
          <b>banked infinities</b> - количество сохранённых бесконечностей<br>
          <b>eternities</b> - количество вечностей<br>
          <b>realities</b> - количество реальностей<br>
          <b>pending ip</b> - количество ОБ, которое вы могли бы получить на бесконечности (при невозможности совершить бесконечность приравнивается к нулю)<br>
          <b>pending ep</b> - количество ОВ, которое вы могли бы получить на вечности (при невозможности совершить вечность приравнивается к нулю)<br>
          <b>pending tp</b> - количество Тахионов, которое вы могли бы получить на вечности<br>
          <b>pending rm</b> - количество МР, которое вы могли бы получить на реальности (при невозможности совершить реальность приравнивается к нулю)<br>
          <b>pending glyph level</b> - уровень глифа, который вы могли бы получить на реальности (при невозможности совершить реальность приравнивается к нулю)<br>
          <b>dt</b> - количество Замедленного Времени<br>
          <b>tp</b> - количество Тахионов<br>
          <b>rg</b> - количество Галактик Репликанти<br>
          <b>rep</b> - количество Репликанти<br>
          <b>tt</b> - количество Теорем Времени<br>
          <b>total tt</b> - общее количество Теорем Пространтсва (в том числе потраченных)<br>
          <b>total completions</b> - общее количество выполнений Испытаний Вечности<br>
          <b>pending completions</b> - количество выполнений текущего Испытания Вечности, которое вы могли бы получить на вечности<br>
          <b>ec<u>X</u> completions</b> - количество выполнений <b>X</b>-го Испытания Вечности (<b>X</b> - целое число от 1 до 12)<br>
          ${filterText}
          ${stText}
        `;
      }
    },
    {
      id: 18,
      isUnlocked: () => true,
      keyword: "Форматирование сравнений",
      category: 4,
      syntax: "<u>параметр</u> <u>знак</u> <u>параметр</u>",
      description: `Возвращает истинность указанного неравенства на игровые параметры для использования в условном операторе IF, цикле или команде WAIT.`,
      sections: [
        {
          name: "ПАРАМЕТРЫ",
          items: [
            {
              header: "<i>параметр</i>",
              description: `
                Это либо неотрицательное число, записанное арабскими цифрами или в Научной нотации, либо игровой параметр, то есть некоторая
                характеристика текущего состояния игры. Список разрешённых игровых параметров приведён в соответствующей статье.
              `
            },
            {
              header: "<i>знак</i>",
              description: `
                Знак неравенства (<, <=, > или >=), несущий свой обычный математический смысл.
                Обратите внимание, что Автоматизатор не позволяет проверять игровые параметры на равенство.
              `
            },
          ]
        }
      ],
      examples: [
        "ep < 1e20",
        "total tt > 14000",
      ]
    }
  ],
  otherAutomatorPoints: [
    {
      name: "Реальности",
      automatorPoints: () => 2 * Math.clampMax(Currency.realities.value, 50),
      shortDescription: () => `Вы получаете ${formatInt(2)} ОА каждую реальность`,
      symbol: "Ϟ",
    },
    {
      name: "Чёрная Дыра",
      automatorPoints: () => (BlackHole(1).isUnlocked ? 10 : 0),
      shortDescription: () => `Разблокировка Чёрной Дыры даёт ${formatInt(10)} ОА`,
      symbol: "<i class='fas fa-circle'></i>",
    },
  ],
  templates: automatorTemplates
};
