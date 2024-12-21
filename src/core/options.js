import { sha512_256 } from "js-sha512";

import { ElectronRuntime } from "@/steam";

import { DEV } from "@/env";

import FullScreenAnimationHandler from "./full-screen-animation-handler";

export class GameOptions {

  static toggleNews() {
    player.options.news.enabled = !player.options.news.enabled;
    ui.view.news = player.options.news.enabled;
    GameStorage.save();
  }

  static toggleUI() {
    player.options.newUI = !player.options.newUI;
    ui.view.newUI = player.options.newUI;
    // This is needed because .s-base--dark is on newUI/normal but not on oldUI/normal
    // So the classes on body need to be updated
    Themes.find(Theme.currentName()).set();
    ElectronRuntime.updateZoom();
    GameStorage.save();
  }

  static toggleGender() {
    player.options.genderMale = !player.options.genderMale;
  }

  static cloudSave() {
    Cloud.saveCheck(true);
  }

  static cloudLoad() {
    Cloud.loadCheck();
  }

  static login() {
    Cloud.login();
  }

  static logout() {
    Cloud.logout();
  }

  static refreshUpdateRate() {
    if (player.options.updateRate === 200) {
      SecretAchievement(31).unlock();
    }
    GameIntervals.gameLoop.restart();
  }

  static refreshAutosaveInterval() {
    GameIntervals.save.restart();
  }
}

const secretImports = [
  "3915e64b0b8f4ff898f3a31670b9734cd49d670d584fc28546b58a0daf9d3a7f",
  "857876556a230da15fe1bb6f410ca8dbc9274de47c1a847c2281a7103dd2c274",
  "2190c29d4ef3169895fd9e179d976d0ddf05882ef234abbbb7e4cae858360444",
  "1f270cad586bdf792a5b0059fd0c3f166cc588e47ff211e3059ab5f4aebd6f37",
];

function secretImportIndex(data) {
  const sha = sha512_256(data.replace(/\s/gu, "").toUpperCase());
  return secretImports.indexOf(sha);
}

export function isSecretImport(data) {
  return secretImportIndex(data) !== -1;
}

export function tryImportSecret(data) {
  const index = secretImportIndex(data);

  switch (index) {
    case 0:
      FullScreenAnimationHandler.display("a-barrel-roll", 5);
      SecretAchievement(15).unlock();
      return true;
    case 1:
      SecretAchievement(14).unlock();
      return true;
    case 2:
      SecretAchievement(37).unlock();
      return true;
    case 3:
      if (player.records.fullGameCompletions > 0 || DEV) Speedrun.unlock();
      else GameUI.notify.error("Сначала завершите игру!", 15000);
      return true;
    default:
      return false;
  }
}
