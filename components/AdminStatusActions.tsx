
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminStatusActions({adId}:{adId:string}){
  const [msg,setMsg]=useState("");
  async function update(status:string){
    setMsg("Salvando...");
    const supabase=createClient();
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setMsg("Sessão expirada.");return;}
    const r=await fetch(`/api/admin/ads/${adId}`,{
      method:"PATCH",
      headers:{"content-type":"application/json","authorization":`Bearer ${session.access_token}`},
      body:JSON.stringify({status})
    });
    if(!r.ok){setMsg("Erro ao atualizar.");return;}
    location.reload();
  }
  return <div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
    <button className="btn" style={{background:"#1f7a45",color:"#fff"}} onClick={()=>update("published")}>Aprovar</button>
    <button className="btn" style={{background:"#8a5a00",color:"#fff"}} onClick={()=>update("correction_requested")}>Correção</button>
    <button className="btn" style={{background:"#8f1d1d",color:"#fff"}} onClick={()=>update("rejected")}>Reprovar</button>
  </div>{msg&&<small className="muted">{msg}</small>}</div>
}
