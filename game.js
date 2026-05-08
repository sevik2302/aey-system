let sb = null;

let id = localStorage.getItem("aey_id");
if (!id) {
  id = "u_" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("aey_id", id);
}

function initSupabase() {
  if (window.SUPABASE_URL && window.SUPABASE_KEY && window.supabase) {
    sb = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_KEY
    );
  }
}

async function init() {
  if (!sb) return;

  await sb.from("players").upsert({
    id,
    fragments: 0,
    phase: 0
  });
}

async function addFragment() {
  if (!sb) return 0;

  let { data } = await sb
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  let f = (data?.fragments || 0) + 1;

  await sb.from("players")
    .update({ fragments: f })
    .eq("id", id);

  return f;
}

async function getMe() {
  if (!sb) return { fragments: 0 };

  let { data } = await sb
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  return data || { fragments: 0 };
}

async function getWorld() {
  if (!sb) return [];

  let { data } = await sb
    .from("players")
    .select("*");

  return data || [];
}

// expose global API
window.AEY = {
  init,
  addFragment,
  getMe,
  getWorld
};

// init supabase safely
setTimeout(initSupabase, 500);
