let sb = null;

let id = localStorage.getItem("aey_id");
if (!id) {
  id = "u_" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("aey_id", id);
}

/* 🟢 SAFE INIT SUPABASE */
function initSupabase() {
  if (window.SUPABASE_URL && window.SUPABASE_KEY && window.supabase) {
    sb = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_KEY
    );
  }
}

/* 🟢 INIT PLAYER (без изменений логики, только защита) */
async function init() {
  if (!sb) return;

  try {
    await sb.from("players").upsert({
      id,
      fragments: 0,
      phase: 0
    });
  } catch (e) {
    console.log("init error:", e);
  }
}

/* 🟡 MAIN ACTION (добавление фрагмента) */
async function addFragment() {
  if (!sb) return 0;

  try {
    let { data, error } = await sb
      .from("players")
      .select("fragments")
      .eq("id", id)
      .single();

    if (error) console.log(error);

    let f = (data?.fragments || 0) + 1;

    await sb.from("players")
      .update({ fragments: f })
      .eq("id", id);

    return f;

  } catch (e) {
    console.log("addFragment error:", e);
    return 0;
  }
}

/* 🟢 SAFE GET PLAYER */
async function getMe() {
  if (!sb) return { fragments: 0 };

  try {
    let { data } = await sb
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    return data || { fragments: 0 };

  } catch (e) {
    console.log("getMe error:", e);
    return { fragments: 0 };
  }
}

/* 🟢 WORLD STATE */
async function getWorld() {
  if (!sb) return [];

  try {
    let { data } = await sb.from("players").select("*");
    return data || [];
  } catch (e) {
    console.log("getWorld error:", e);
    return [];
  }
}

/* 🔥 PUBLIC API (НЕ МЕНЯЛАСЬ — ВАЖНО ДЛЯ ТВОЕГО HTML) */
window.AEY = {
  init,
  addFragment,
  getMe,
  getWorld
};

/* 🟢 SAFE BOOT */
setTimeout(() => {
  initSupabase();
  init();
}, 500);
