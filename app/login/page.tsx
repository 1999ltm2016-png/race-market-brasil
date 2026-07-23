
"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login(){
  const [msg,setMsg]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const email=String(fd.get("email")||"");
    const password=String(fd.get("password")||"");
    const supabase=createClient();
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setMsg(error.message);return;}
    location.href="/minha-race";
  }
  return <section><div className="container" style={{maxWidth:520}}>
    <div className="panel">
      <div className="eyebrow">ACESSO À CONTA</div><h2>Entrar</h2>
      <form onSubmit={submit}>
        <div className="field"><label>E-mail</label><input name="email" type="email" required/></div>
        <div className="field" style={{marginTop:12}}><label>Senha</label><input name="password" type="password" required/></div>
        <button className="btn btn-red" style={{width:"100%",marginTop:16}}>Entrar</button>
      </form>
      {msg && <p className="notice">{msg}</p>}
      <a className="btn btn-dark" style={{width:"100%",marginTop:10}} href="/cadastro">Criar conta</a>
    </div>
  </div></section>
}
