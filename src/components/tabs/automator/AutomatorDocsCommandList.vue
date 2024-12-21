<script>
import AutomatorDocsManPage from "./AutomatorDocsManPage";

export default {
  name: "AutomatorDocsCommandList",
  components: {
    AutomatorDocsManPage
  },
  data() {
    return {
      selectedCommand: -1,
    };
  },
  computed: {
    categoryNames: () => GameDatabase.reality.automator.categoryNames,
    commands: () => GameDatabase.reality.automator.commands,
  },
  methods: {
    commandsInCategory(category) {
      return this.commands.filter(c => c.category === category && c.isUnlocked());
    }
  }
};
</script>

<template>
  <div>
    <div v-if="selectedCommand !== -1">
      <button
        class="c-automator-docs--button l-return-button fas fa-arrow-left"
        @click="selectedCommand = -1"
      />
      Назад к списку команд
    </div>
    <AutomatorDocsManPage
      v-if="selectedCommand !== -1"
      :command="commands[selectedCommand]"
    />
    <div
      v-else
      class="c-automator-docs-page"
    >
      Нажмите на подчёркнутую команду, чтобы просмотреть подробности по её синтаксису, использованию и функциональности.
      <br>
      <br>
      <span>Список команд:</span>
      <br>
      <div
        v-for="(category, i) in categoryNames"
        :key="i"
      >
        {{ category }}
        <div
          v-for="command in commandsInCategory(i)"
          :key="command.id"
          class="c-automator-docs-page__link l-command-group"
          @click="selectedCommand = command.id"
        >
          <span v-if="command.isUnlocked()">
            {{ command.keyword }}
          </span>
        </div>
      </div>
      <br>
      <span>
        Примечание: в описании синтаксиса каждой команды <u>подчёркнутые</u> параметры должны <i>обязательно</i> быть
        даны, в то время как параметры в [квадратных скобках] необязательны (при их наличии скобки вводить <i>не нужно</i>).
        Все остальные части команды должны быть введены в той форме, в которой они показаны. Если не сказано иное,
        регистр не важен. У некоторых команд есть несколько допустимых форматов, в таком случае они отображаются в разных строках.
      </span>
    </div>
  </div>
</template>

<style scoped>
.l-command-group {
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
}

.l-return-button {
  width: 4rem;
  height: 2.6rem;
  font-size: 1.8rem;
  margin-left: 2rem;
}
</style>
