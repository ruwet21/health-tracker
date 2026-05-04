<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <Navbar :view="view" @changeView="view = $event" />

    <main class="max-w-4xl mx-auto p-4 md:p-6">
      <InputView v-if="view === 'input'" />
      <StatsView v-else />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "./components/Navbar.vue";
import InputView from "./views/InputView.vue";
import StatsView from "./views/StatsView.vue";

const view = ref("input");
</script>
