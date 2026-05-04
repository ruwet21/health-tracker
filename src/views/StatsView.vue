<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    <!-- FILTER -->
    <div class="flex flex-wrap gap-3 mb-6">
      <select v-model="chartFilter.user" class="bg-slate-100 px-3 py-2 rounded">
        <option v-for="u in users" :key="u">{{ u }}</option>
      </select>

      <select v-model="chartFilter.type" class="bg-slate-100 px-3 py-2 rounded">
        <option v-for="t in types" :key="t">{{ t }}</option>
      </select>

      <div class="flex gap-1 bg-slate-100 p-1 rounded">
        <button
          v-for="r in ranges"
          :key="r.val"
          @click="chartFilter.range = r.val"
          :class="chartFilter.range === r.val ? active : inactive"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <!-- CHART -->
    <div style="height: 300px">
      <canvas ref="canvas"></canvas>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-3 gap-4 mt-6 text-center">
      <div>
        <p class="text-xs text-gray-400">AVG</p>
        <p class="font-bold">{{ stats.avg }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-400">MAX</p>
        <p class="font-bold text-red-500">{{ stats.max }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-400">MIN</p>
        <p class="font-bold text-green-500">{{ stats.min }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";
import { useHealthStore } from "../composables/useHealthStore";

const { logs, users, types, chartFilter, stats } = useHealthStore();

const ranges = [
  { label: "1M", val: 7 },
  { label: "1B", val: 30 },
  { label: "1T", val: 365 },
];

const canvas = ref();
let chartInstance = null;

const active = "bg-white px-2 py-1 rounded text-indigo-600";
const inactive = "px-2 py-1 text-gray-500";

// 🔥 CORE: update chart
const updateChart = () => {
  if (!canvas.value) return;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - chartFilter.range);

  const filtered = logs.value
    .filter(
      (l) =>
        l.user === chartFilter.user &&
        l.type === chartFilter.type &&
        new Date(l.date) >= cutoff,
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = filtered.map((l) => {
    const d = new Date(l.date);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  });

  const data = filtered.map((l) => l.value);

  if (chartInstance) chartInstance.destroy();

  const color =
    chartFilter.type === "Gula Darah"
      ? "#ef4444"
      : chartFilter.type === "Asam Urat"
        ? "#3b82f6"
        : "#10b981";

  chartInstance = new Chart(canvas.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data,
          borderColor: color,
          backgroundColor: color + "20",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
    },
  });
};

// lifecycle
onMounted(updateChart);

// 🔥 reactive update
watch(
  () => [logs.value, chartFilter.user, chartFilter.type, chartFilter.range],
  () => nextTick(updateChart),
  { deep: true },
);
</script>
