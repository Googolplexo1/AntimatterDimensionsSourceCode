import { DC } from "@/core/constants";

export const MatterScale = {
  proton: new Decimal("2.82e-45"),

  estimate(matter) {
    if (!matter) return ["У вас нет антиматерии."];
    if (matter.gt(DC.C2P1024)) {
      return [
        `Если писать три цифры в секунду, понадобится ` +
        TimeSpan.fromSeconds(matter.log10() / 3).toString() +
        ", чтобы записать количество вашей антиматерии с точностью до целых."
      ];
    }
    const planck = new Decimal("4.22419e-105");
    const planckedMatter = matter.times(planck);
    if (planckedMatter.gt(this.proton)) {
      const scale = this.macroScale(planckedMatter);
      const amount = format(planckedMatter.dividedBy(scale.amount), 2, 1);
      return [`Если бы каждая единица антиматерии занимала планковский объём,
        вы бы могли заполнить около ${amount} объёма ${scale.name}`];
    }
    const scale = this.microScale(matter);
    return [`Если бы каждая единица антиматерии занимала объём, равный ${format(this.proton.div(scale.amount).div(matter), 2, 1)} ${scale.name},
      вы бы могли заполнить объём одного протона.`];
  },

  microScale(matter) {
    const micro = this.microObjects;
    for (let i = 0; i < micro.length; i++) {
      const scale = micro[i];
      if (matter.times(scale.amount).lt(this.proton)) {
        return scale;
      }
    }
    throw "Cannot determine smallest antimatter scale";
  },

  macroScale(matter) {
    const macro = this.macroObjects;
    const last = macro.last();
    if (matter.gte(last.amount)) return last;
    let low = 0;
    let high = macro.length;
    while (low !== high) {
      const mid = Math.floor((low + high) / 2);
      if (macro[mid].amount.lte(matter)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return macro[high - 1];
  },

  microObjects: [
    { amount: new Decimal("1e-54"), name: "кубического аттометра" },
    { amount: new Decimal("1e-63"), name: "кубического зептометра" },
    { amount: new Decimal("1e-72"), name: "кубического иоктометра" },
    { amount: new Decimal("4.22419e-105"), name: "планковского объёма" }
  ],

  macroObjects: [
    { amount: new Decimal("2.5e-45"), name: "протона"},
    { amount: new Decimal("1.72e-42"), name: "ядра урана-238"},
    { amount: new Decimal("6.6e-31"), name: "атома водорода"},
    { amount: new Decimal("5e-21"), name: "вируса"},
    { amount: new Decimal("9e-17"), name: "эритроцита"},
    { amount: new Decimal("6.2e-11"), name: "песчинки"},
    { amount: new Decimal("5e-8"), name: "зерна риса"},
    { amount: new Decimal("5e-6"), name: "чайной ложки"},
    { amount: new Decimal("7.5e-4"), name: "винной бутылки"},
    { amount: DC.D1, name: "морозильной камеры"},
    { amount: new Decimal("2.5e3"), name: "олимпийского бассейна"},
    { amount: new Decimal("2.44e6"), name: "пирамиды Хеопса"},
    { amount: new Decimal("3.3e8"), name: "Великой Китайской стены"},
    { amount: new Decimal("5e12"), name: "крупного астероида"},
    { amount: new Decimal("4.5e17"), name: "карликовой планеты"},
    { amount: new Decimal("1.08e21"), name: "Земли"},
    { amount: new Decimal("1.53e24"), name: "Юпитера"},
    { amount: new Decimal("1.41e27"), name: "Солнца"},
    { amount: new Decimal("5e32"), name: "красного гиганта"},
    { amount: new Decimal("8e36"), name: "гипергиганта"},
    { amount: new Decimal("1.7e45"), name: "туманности"},
    { amount: new Decimal("1.7e48"), name: "облака Оорта"},
    { amount: new Decimal("3.3e55"), name: "Местного пузыря"},
    { amount: new Decimal("3.3e61"), name: "галактики"},
    { amount: new Decimal("5e68"), name: "Местной группы галактик"},
    { amount: new Decimal("1e73"), name: "Пустоты Скульптора"},
    { amount: new Decimal("3.4e80"), name: "наблюдаемой Вселенной"},
  ]
};
