<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SpeedrunModeModal",
  components: {
    PrimaryButton,
    ModalWrapperChoice,
  },
  data() {
    return {
      onInfoPage: true,
      name: "",
      confirmPhrase: "",
    };
  },
  computed: {
    willStartRun() {
      return this.confirmPhrase === "Gotta Go Fast!";
    },
  },
  methods: {
    nextPage() {
      this.onInfoPage = false;
    },
    startRun() {
      if (!this.willStartRun) return;
      this.emitClose();
      Speedrun.prepareSave(Speedrun.generateName(this.name));
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!onInfoPage && !willStartRun"
    :show-confirm="!onInfoPage && willStartRun"
    confirm-class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
    @confirm="startRun"
  >
    <template #header>
      Активация режима спидрана
    </template>
    <div
      v-if="onInfoPage"
      class="c-modal-message__text"
    >
      Будет создано новое сохранение с дополнительным отслеживанием статистики времени достижения определённых этапов
      игры. Она будет видна в правом нижнем углу экрана и в специальном отделе вкладки "Статистика".
      <br>
      <br>
      Почти все анимации и подтверждения по умолчанию будут отключены, но вы сможете менять любые настройки даже
      до достижения требуемого уровня прогресса. Когда вы начнёте забег, игра будет приостановлена, до тех пор пока не
      изменится количество вашей антиматерии, позволяя вам изменить все настройки по вашему желанию до начала игры. Чтобы избежать необходимости
      ждать долгое время, прежде чем начать оптимальный забег, несколько достижений будут даны даром.
      <br>
      <br>
      <i>
        Режим спидрана не содержит дополнительного контента.
      </i>
      <br>
      <br>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
        @click="nextPage"
      >
        Продолжить
      </PrimaryButton>
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      Вы можете ввести имя своего спидрана ниже. Это не влияет на геймплей, а лишь идентифицирует
      это сохранение как ваше. При отсутствии введённого имени будет сгенерировано случайное. Имя может быть
      изменено путём нажатия на него в информационном окошке спидрана, пока игра не началась.
      <input
        ref="name"
        v-model="name"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
      <br>
      <br>
      Сохранения в режиме спидрана могут быть экспортированы и импортированы подобно обычным сохранениям. Импорт сохранения в режиме спидрана пометит его как
      сегментированный забег, так как импорт и экспорт позволяет оптимизировать отдельные отрезки игры.
      Иначе сохранение будет оставаться помеченным как непрерывный забег.
      <br>
      <br>
      Вы сможете изменить зерно для генерации глифов во вкладке "Настройки" перед началом забега при желании.
      <br>
      <br>
      <div class="c-modal-hard-reset-danger">
        Запуск спидрана сбросит ваше сохранение в начало игры. Останутся такие параметры, как
        статистика количества прохождений игры, графические настройки, программы для Автоматизатора и косметические наборы глифов, но во всём остальном
        сохранение будет таким же, как если бы вы закончили игру и перезапустили её из экрана с благодарностями. Введите
        "Gotta Go Fast!" ниже, чтобы подтвердить своё намерение (пере)запустить забег.
      </div>
      <input
        ref="confirmPhrase"
        v-model="confirmPhrase"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
    </div>
    <template #confirm>
      Начать забег!
    </template>
    <template #cancel>
      Отменить
    </template>
  </ModalWrapperChoice>
</template>
