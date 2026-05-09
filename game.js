let sb = null;

let id = localStorage.getItem("aey_id");
if (!id) {
  id = "u_" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("aey_id", id);
}

/* 🟢 SUPABASE INIT */
function initSupabase() {
  if (window.SUPABASE_URL && window.SUPABASE_KEY && window.supabase) {
    sb = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_KEY
    );
  }
}

/* 🧠 COOLDOWN SYSTEM (АНТИ-НАКРУТКА) */
let lastClick = 0;
const COOLDOWN = 1200; // 1.2 сек

function canClick() {
  const now = Date.now();
  if (now - lastClick < COOLDOWN) return false;
  lastClick = now;
  return true;
}

/* 🟢 INIT PLAYER */
async function init() {
  if (!sb) return;

  await sb.from("players").upsert({
    id,
    fragments: 0,
    phase: 0
  });
}

/* 🔥 MAIN ACTION */
async function addFragment() {
  if (!sb) return 0;
  if (!canClick()) return "cooldown";

  let { data } = await sb
    .from("players")
    .select("fragments")
    .eq("id", id)
    .single();

  let f = (data?.fragments || 0) + 1;

  await sb.from("players")
    .update({ fragments: f })
    .eq("id", id);

  return f;
}

/* 🟢 GET PLAYER */
async function getMe() {
  if (!sb) return { fragments: 0 };

  let { data } = await sb
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  return data || { fragments: 0 };
}

/* 🟢 WORLD */
async function getWorld() {
  if (!sb) return [];

  let { data } = await sb.from("players").select("*");
  return data || [];
}

/* 🔥 REALTIME SUBSCRIPTION */
function enableRealtime(callback) {
  if (!sb) return;

  sb.channel("players")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "players"
      },
      () => {
        callback(); // обновляем UI
      }
    )
    .subscribe();
}

/* 🌍 GLOBAL API */
window.AEY = {
  init,
  addFragment,
  getMe,
  getWorld,
  enableRealtime
};

/* 🚀 BOOT */
setTimeout(() => {
  initSupabase();
  init();
}, 500);
