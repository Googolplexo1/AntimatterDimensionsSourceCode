import { sha512_256 } from "js-sha512";

export const Theme = function Theme(name, config) {
  this.name = name;

  this.isDark = function() {
    return (this.isDefault() || name === "S12")
      ? player.options.newUI
      : config.isDark;
  };

  this.isMetro = config.isMetro;

  this.isAnimated = config.isAnimated;

  this.isSecret = config.isSecret;

  this.isDefault = function() {
    return name === "Normal";
  };

  this.isAvailable = function() {
    if (!this.isSecret) return true;
    // Note: match[0] gets the full string of a match, here the initial S and number in a theme name.
    return player.secretUnlocks.themes.some(theme => theme.match(/^S[0-9]*/u)[0] === name);
  };

  this.displayName = function() {
    if (name === "Normal") return "Обычная";
    if (name === "Metro") return "Metro";
    if (this.isSecret) return player.secretUnlocks.themes.find(theme => theme.match(/^S[0-9]*/u)[0] === name).replace(/^S[0-9]*/u, "");
    let prefix = "AMOLED";
    if (name.includes("Dark")) prefix = "Тёмная";
    if (name.includes("Inverted")) prefix = "Инвертированная";
    return prefix + (this.isMetro ? " Metro" : "");
  };

  this.set = function() {
    // Remove all entries in the class list from the class list
    document.body.classList.remove(...document.body.classList);

    document.body.classList.add(this.cssClass());
    if (this.isMetro) document.body.classList.add("s-base--metro");
    if (this.isDark()) document.body.classList.add("s-base--dark");

    if (this.isAnimated && player.options.animations.background) {
      document.getElementById("background-animations").style.display = "block";
    } else {
      document.getElementById("background-animations").style.display = "none";
    }
    if (player.options.newUI) {
      player.options.themeModern = name;
    } else {
      player.options.themeClassic = name;
    }
    ui.view.theme = name;
    window.getSelection().removeAllRanges();
    PerkNetwork.forceNetworkRemake();
  };

  this.cssClass = function() {
    return `t-${this.name.replace(/\s+/gu, "-").toLowerCase()}`;
  };
};

Theme.currentName = function() {
  return player.options.newUI
    ? player.options.themeModern
    : player.options.themeClassic;
};

Theme.current = function() {
  return Themes.find(Theme.currentName());
};

Theme.set = function(name) {
  const theme = Themes.find(name);
  theme.set();
  return theme;
};

Theme.secretThemeIndex = function(name) {
  const secretThemes = [
    "4f066c1cb27b28de75a481b8ff3f98a598dc51fc11c6c126ef653015b534c18c",
    "579c69037ca17bae3e1f5ca3aafdea6145d88bd5383706ab5dc698d2d34720fe",
    "0c20adbb7a6a19b0fd8e16e9acd5245e530091ae783cacda39989bb49a7dc77d",
    "c61c7de996b91890ccbd3f67faa249552b1ac9ca521776012601399581945d69",
    "bf9a8c2cf8370c921f956f344a16c5f344f80c996f3d76c1d5541f5cbefe9df3",
    "e05d479cac006d29519df025787f3e4ff3e1033d2ced1d86a50406a4f9ef1e5d",
    "41a8a050ae49d0ff25fc972c09fa3fb08457c38c507f7ed29733128cafc3dcb3",
    "b0721af6a16b363d8b20587946271d30322a860c59ec31bf1d0b15cdc89765f1",
    "3b157f2041433d2b6f18cc4c39da9c95f57f66dcfc62fa98bfcd7a723ed53c7d",
    "fdc68ae204e64efd5dd84df25bfa877e3a8b540a906e74dfbee3500085eacbc4",
    "570439b58f4c4415c859b80f215016f01c8349413c65e007c115f64f85d2de59",
    "1248689171faaa0abb68279199a8d2eb232dba10d2dacb79a705f680b6862c0e",
  ];
  const sha = sha512_256(name.toUpperCase());
  return secretThemes.indexOf(sha);
};

Theme.isSecretTheme = function(name) {
  return Theme.secretThemeIndex(name) !== -1;
};

Theme.animatedThemeUnlocked = function() {
  return Themes.all.some(theme => theme.isAvailable && theme.isAnimated);
};

Theme.tryUnlock = function(name) {
  const index = Theme.secretThemeIndex(name);
  if (index === -1) {
    return false;
  }
  const prefix = `S${index + 1}`;
  const capital = name[0].toUpperCase() + name.slice(1).toLowerCase()
  const fullName = prefix + capital;
  const isAlreadyUnlocked = player.secretUnlocks.themes.has(fullName);
  player.secretUnlocks.themes.add(fullName);
  Theme.set(prefix);
  SecretAchievement(25).unlock();
  if (!isAlreadyUnlocked) {
    GameUI.notify.success(`Вы разблокировали тему "${capital}"!`, 5000);
    if (Theme.current().isAnimated) {
      setTimeout(Modal.message.show(`На этой секретной теме есть анимации.
        Вы можете отключить их в отделе "Внешний вид" этой вкладки.`), 100);
    }
  }
  return true;
};

Theme.create = function(name, settings) {
  const config = {
    isDark: false || settings.dark,
    isMetro: false || settings.metro,
    isAnimated: false || settings.animated,
    isSecret: false || settings.secret,
  };
  return new Theme(name, config);
};

export const Themes = {
  all: [
    /* eslint-disable no-multi-spaces */
    // Note that "Normal" is a special case where dark is overridden elsewhere with whether or not the UI is Modern
    Theme.create("Normal",          {                                                         }),
    Theme.create("Metro",           {              metro: true,                               }),
    Theme.create("Dark",            { dark: true,                                             }),
    Theme.create("Dark Metro",      { dark: true,  metro: true,                               }),
    Theme.create("Inverted",        {                                                         }),
    Theme.create("Inverted Metro",  {              metro: true,                               }),
    Theme.create("AMOLED",          { dark: true,                                             }),
    Theme.create("AMOLED Metro",    { dark: true,  metro: true,                               }),
    Theme.create("S1",              {                           animated: true, secret: true, }),
    Theme.create("S2",              {                                           secret: true, }),
    Theme.create("S3",              {                                           secret: true, }),
    Theme.create("S4",              {                                           secret: true, }),
    Theme.create("S5",              {                                           secret: true, }),
    Theme.create("S6",              { dark: true,               animated: true, secret: true, }),
    Theme.create("S7",              {              metro: true,                 secret: true, }),
    Theme.create("S8",              {              metro: true,                 secret: true, }),
    Theme.create("S9",              {                                           secret: true, }),
    Theme.create("S10",             { dark: true,  metro: true, animated: true, secret: true, }),
    Theme.create("S11",             { dark: true,               animated: true, secret: true, }),
    Theme.create("S12",             {                                           secret: true, }),
    /* eslint-enable no-multi-spaces */
  ],

  available() {
    return Themes.all
      .filter(theme => theme.isAvailable());
  },

  find(name) {
    return Themes.all
      .find(theme => theme.name === name);
  }
};
