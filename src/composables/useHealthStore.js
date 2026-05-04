import { ref, reactive, computed } from "vue";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export function useHealthStore() {
  const users = ["Abdulatip", "Retno Wati"];
  const types = ["Gula Darah", "Asam Urat", "Kolesterol"];

  const logs = ref([]);

  const form = reactive({
    user: users[0],
    date: new Date().toISOString().split("T")[0],
    type: types[0],
    value: null,
  });

  const filter = reactive({ user: "Semua" });

  const chartFilter = reactive({
    user: users[0],
    type: types[0],
    range: 7,
  });

  // 🔥 REALTIME LISTENER (ganti localStorage)
  const colRef = collection(db, "health_logs");

  onSnapshot(colRef, (snapshot) => {
    logs.value = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  });

  // computed tetap sama
  const filteredLogs = computed(() => {
    let result = [...logs.value];
    if (filter.user !== "Semua") {
      result = result.filter((l) => l.user === filter.user);
    }
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  const stats = computed(() => {
    const data = logs.value
      .filter((l) => l.user === chartFilter.user && l.type === chartFilter.type)
      .map((l) => l.value);

    if (!data.length) return { avg: 0, max: 0, min: 0 };

    const sum = data.reduce((a, b) => a + b, 0);

    return {
      avg: Math.round(sum / data.length),
      max: Math.max(...data),
      min: Math.min(...data),
    };
  });

  // 🔥 SAVE KE FIREBASE
  const saveEntry = async () => {
    if (!form.value || form.value <= 0) return;

    await addDoc(colRef, {
      user: form.user,
      date: form.date,
      type: form.type,
      value: form.value,
      createdAt: serverTimestamp(),
    });

    form.value = null;
  };

  // 🔥 DELETE DARI FIREBASE
  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, "health_logs", id));
  };

  return {
    users,
    types,
    logs,
    form,
    filter,
    chartFilter,
    filteredLogs,
    stats,
    saveEntry,
    deleteEntry,
  };
}
