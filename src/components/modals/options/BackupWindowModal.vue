<script>
import BackupEntry from "@/components/modals/options/BackupEntry";
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

import { AutoBackupSlots } from "@/core/storage";
import { STEAM } from "@/env";

export default {
  name: "BackupWindowModal",
  components: {
    ModalWrapper,
    BackupEntry,
    PrimaryButton
  },
  data() {
    return {
      // Used to force a key-swap whenever a save happens, to make unused slots immediately update
      nextSave: 0,
      ignoreOffline: false,
    };
  },
  computed: {
    backupSlots: () => AutoBackupSlots,
    deleteText: () => (STEAM ? "fully uninstalling the game" : "clearing your browser cookies"),
  },
  watch: {
    ignoreOffline(newValue) {
      player.options.loadBackupWithoutOffline = newValue;
    },
  },
  methods: {
    update() {
      this.nextSave = Object.values(GameStorage.lastBackupTimes).map(t => t && t.backupTimer).sum();
      this.ignoreOffline = player.options.loadBackupWithoutOffline;
    },
    offlineOptionClass() {
      return {
        "c-modal__confirmation-toggle__checkbox": true,
        "c-modal__confirmation-toggle__checkbox--active": this.ignoreOffline
      };
    },
    toggleOffline() {
      this.ignoreOffline = !this.ignoreOffline;
    },
  }
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Автоматические резервные сохранения
    </template>
    <div class="c-info c-modal--short">
      Игра автоматически делает резервные сохранения в зависимости от времени, проведённого онлайн или офлайн.
      Таймеры онлайн-сохранений идут только при открытой игре, а офлайн-сохранения помещаются в слот
      для самых редких подходящих сохранений.
      Кроме того, ваше текущее сохранене помещается в последний слот каждый раз, когда вы загружаете резервное сохранение.
      <div
        class="c-modal__confirmation-toggle"
        @click="toggleOffline"
      >
        <div :class="offlineOptionClass()">
          <span
            v-if="ignoreOffline"
            class="fas fa-check"
          />
        </div>
        <span class="c-modal__confirmation-toggle__text">
          Загрузить без офлайн-прогресса
        </span>
      </div>
      <div class="c-entry-container">
        <BackupEntry
          v-for="slot in backupSlots"
          :key="nextSave + slot.id"
          class="l-backup-entry"
          :slot-data="slot"
        />
      </div>
      Эти резервы хранятся в том же месте, где и текущее сохранение, и могут быть утрачены, если вы совершите
      любое внешнее действие, которое удалит ваше сохранение, например, очистите файлы cookie в вашем браузере. Вы можете экспортировать
      резервные сохранения в файлы.
      <div class="c-backup-file-ops">
        <PrimaryButton
          class="o-btn-file-ops"
          onclick="GameStorage.exportBackupsAsFile()"
        >
          Экспорт в файл
        </PrimaryButton>
      </div>
      Все три ваши текущие сохранения имеют свои наборы резервов.
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-info {
  width: 60rem;
  overflow-x: hidden;
  padding-right: 1rem;
}

.c-info::-webkit-scrollbar {
  width: 1rem;
}

.c-info::-webkit-scrollbar-thumb {
  border: none;
}

.s-base--metro .c-info::-webkit-scrollbar-thumb {
  border-radius: 0;
}

.c-backup-file-ops {
  margin: 0.5rem;
}

.o-btn-file-ops {
  margin: 0 0.5rem;
}

.c-entry-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.l-backup-entry {
  width: calc(50% - 0.6rem);
  height: calc(25% - 0.6rem);
}
</style>
