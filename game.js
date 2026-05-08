import { supabase } from "./supabase.js";

let id = localStorage.getItem("aey_id");

if(!id){
  id = "u_" + Math.random().toString(36).slice(2,10);
  localStorage.setItem("aey_id", id);
}

// создать игрока
export async function init(){
  await supabase.from("players").upsert({
    id,
    fragments: 0,
    phase: 0
  });
}

// добавить фрагмент
export async function addFragment(){
  let { data } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  let f = (data?.fragments || 0) + 1;

  await supabase.from("players")
    .update({ fragments: f })
    .eq("id", id);

  return f;
}

// получить игрока
export async function getMe(){
  let { data } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

// мир
export async function getWorld(){
  let { data } = await supabase.from("players").select("*");
  return data || [];
}
