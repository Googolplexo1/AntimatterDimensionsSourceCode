<script>
import InformationModalButton from "@/components/modals/InformationModalButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "InformationModal",
  components: {
    ModalCloseButton,
    InformationModalButton
  },
};
</script>

<template>
  <div class="l-information-modal c-information-modal">
    <ModalCloseButton @click="emitClose" />
    <div class="l-h2p-header">
      <div class="c-h2p-title">
        Об игре
      </div>
    </div>
    <div class="c-info-body">
      "Измерения Антиматерии" (Antimatter Dimensions) - инкрементальная игра, созданная финским разработчиком под псевдонимом Hevipelle. Зародившись как сольный
      проект в 2016 году, она с тех пор была расширена крупной командой разработчиков и тестировщиков.
      <br>
      <br>
      Игра обладает развёртывающимся геймплеем и несколькими слоями престижа. Окно "Помощь по игре" содержит полезную
      информацию о ходе прогресса.
      <br>
      <br>
      В 2024 году переводчик под псевдонимом Googolplexo выпустил русскую локализацию "Измерений Антиматерии", в которую вы сейчас играете.
    </div>
    <div class="l-socials">
      <InformationModalButton
        name="Репозиторий на GitHub"
        icon="fa-brands fa-github"
        link="https://github.com/Googolplexo1/AntimatterDimensionsSourceCode"
      />
      <InformationModalButton
        name="r/AntimatterDimensions"
        icon="fa-brands fa-reddit-alien"
        link="https://www.reddit.com/r/AntimatterDimensions/"
      />
      <InformationModalButton
        name="Сервер Antimatter Dimensions в Discord"
        icon="fa-brands fa-discord"
        link="https://discord.gg/ST9NaXa"
      />
      <InformationModalButton
        name="Antimatter Dimensions в Google Play"
        icon="fa-brands fa-google-play"
        link="https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions"
      />
      <InformationModalButton
        name="Antimatter Dimensions в Steam"
        icon="fa-brands fa-steam"
        link="https://store.steampowered.com/app/1399720/Antimatter_Dimensions/"
      />
      <InformationModalButton
        name="Благодарности"
        icon="fa-solid fa-users"
        show-modal="credits"
      />
      <InformationModalButton
        name="История изменений"
        icon="fa-solid fa-file-lines"
        show-modal="changelog"
      />
    </div>
  </div>
</template>

<style scoped>
.l-information-modal {
  display: flex;
  flex-direction: column;
  /* stylelint-disable-next-line unit-allowed-list */
  width: calc(100vw - 50vh);
  justify-content: space-around;
}

.c-information-modal {
  margin: 0.5rem;
}

.c-info-body {
  text-align: left;
  font-size: 2rem;
  margin: 1rem;
  padding: 0.5rem;
}

.t-s12 .c-info-body {
  font-size: 1.3rem;
  margin: 0;
}

.l-socials {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 7.5rem;
}

.t-s12 .l-socials {
  width: 100%;
  align-self: center;
}
</style>
