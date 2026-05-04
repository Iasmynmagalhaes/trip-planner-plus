import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PaymentMethod = "Prime Gourmet" | "Dinheiro/Cartão" | "Laçador de Ofertas" | "Voucher";
export type Location = "Gramado" | "Canela";
export type DayKey = "01" | "02" | "03" | "04" | "05";

export const PAYMENT_METHODS: PaymentMethod[] = ["Prime Gourmet", "Dinheiro/Cartão", "Laçador de Ofertas", "Voucher"];
export const LOCATIONS: Location[] = ["Gramado", "Canela"];
export const DAYS: DayKey[] = ["01", "02", "03", "04", "05"];

export type SimpleExpense = { id: string; description: string; value: number };
export type ScheduledItem = {
  id: string;
  name: string;
  location: Location;
  payment: PaymentMethod;
  day: DayKey;
  value: number;
};

export type GeneralInfo = {
  accommodationName: string;
  accommodationAddress: string;
  checkinDate: string;
  checkinTime: string;
  checkoutDate: string;
  checkoutTime: string;
  outboundFlight: string;
  returnFlight: string;
};

export type TripState = {
  general: GeneralInfo;
  flights: SimpleExpense[];
  transport: SimpleExpense[];
  lodging: SimpleExpense[];
  food: ScheduledItem[];
  tours: ScheduledItem[];
};

const STORAGE_KEY = "trip-planner-v1";

const initial: TripState = {
  general: {
    accommodationName: "",
    accommodationAddress: "",
    checkinDate: "",
    checkinTime: "",
    checkoutDate: "",
    checkoutTime: "",
    outboundFlight: "",
    returnFlight: "",
  },
  flights: [],
  transport: [],
  lodging: [],
  food: [],
  tours: [],
};

type Listener = (s: TripState) => void;
let state: TripState = initial;
const listeners = new Set<Listener>();
let loaded = false;
let currentUserId: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

async function loadFromCloud(userId: string) {
  const { data } = await supabase.from("trip_data").select("data").eq("user_id", userId).maybeSingle();
  if (data?.data) {
    state = { ...initial, ...(data.data as Partial<TripState>) };
  } else {
    state = initial;
  }
  listeners.forEach((l) => l(state));
}

function scheduleCloudSave() {
  if (!currentUserId) return;
  if (saveTimer) clearTimeout(saveTimer);
  const uid = currentUserId;
  saveTimer = setTimeout(async () => {
    await supabase.from("trip_data").upsert({ user_id: uid, data: state as unknown as Record<string, unknown>, updated_at: new Date().toISOString() });
  }, 600);
}

export async function setTripUser(userId: string | null) {
  currentUserId = userId;
  if (userId) {
    await loadFromCloud(userId);
  } else {
    state = initial;
    listeners.forEach((l) => l(state));
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
}

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function setState(updater: (s: TripState) => TripState) {
  state = updater(state);
  persist();
  scheduleCloudSave();
  listeners.forEach((l) => l(state));
}

export function useTrip() {
  load();
  const [s, setS] = useState<TripState>(state);
  useEffect(() => {
    const l: Listener = (ns) => setS(ns);
    listeners.add(l);
    setS(state);
    return () => { listeners.delete(l); };
  }, []);
  return s;
}

export const tripActions = {
  updateGeneral(patch: Partial<GeneralInfo>) {
    setState((s) => ({ ...s, general: { ...s.general, ...patch } }));
  },
  addExpense(key: "flights" | "transport" | "lodging", item: Omit<SimpleExpense, "id">) {
    setState((s) => ({ ...s, [key]: [...s[key], { ...item, id: crypto.randomUUID() }] }));
  },
  removeExpense(key: "flights" | "transport" | "lodging", id: string) {
    setState((s) => ({ ...s, [key]: s[key].filter((e) => e.id !== id) }));
  },
  addScheduled(key: "food" | "tours", item: Omit<ScheduledItem, "id">) {
    setState((s) => ({ ...s, [key]: [...s[key], { ...item, id: crypto.randomUUID() }] }));
  },
  removeScheduled(key: "food" | "tours", id: string) {
    setState((s) => ({ ...s, [key]: s[key].filter((e) => e.id !== id) }));
  },
};

export function sumSimple(arr: SimpleExpense[]) {
  return arr.reduce((a, b) => a + (Number(b.value) || 0), 0);
}
export function sumScheduled(arr: ScheduledItem[]) {
  return arr.reduce((a, b) => a + (Number(b.value) || 0), 0);
}
export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}