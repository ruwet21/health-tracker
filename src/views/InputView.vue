<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
    <!-- FORM -->
    <div class="lg:col-span-2">
      <div class="bg-white p-6 rounded-xl">
        <select v-model="form.user">
          <option v-for="u in users" :key="u">{{ u }}</option>
        </select>

        <input v-model="form.date" type="date" />
        <select v-model="form.type">
          <option v-for="t in types" :key="t">{{ t }}</option>
        </select>

        <input v-model.number="form.value" type="number" />

        <button @click="saveEntry">Simpan</button>
      </div>
    </div>

    <!-- LIST -->
    <div class="lg:col-span-3">
      <div v-for="log in filteredLogs" :key="log.id">
        {{ log.user }} - {{ log.value }}
        <button @click="deleteEntry(log.id)">X</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHealthStore } from "../composables/useHealthStore";

const { users, types, form, filteredLogs, saveEntry, deleteEntry } =
  useHealthStore();
</script>
