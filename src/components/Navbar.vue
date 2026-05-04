<template>
  <nav class="bg-white border-b sticky top-0 z-50">
    <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <h1 class="font-bold text-xl">HealthLog</h1>

      <div class="flex gap-2">
        <button
          @click="$emit('changeView', 'input')"
          :class="view === 'input' ? active : inactive"
        >
          Input
        </button>

        <button
          @click="$emit('changeView', 'stats')"
          :class="view === 'stats' ? active : inactive"
        >
          Statistik
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps(["view"]);

const active = "text-indigo-600 font-semibold px-3 py-2";
const inactive = "text-slate-500 px-3 py-2";
</script>
