
"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Cadastro(){
  const [msg,setMsg]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const name=String(fd.get("name")||"");
    const email=String(fd.get("email")||"");
    const whatsapp=String(fd.get("whatsapp")||"");
    const password=String(fd.get("password")||"");
    const supabase=createClient();
    const {error}=await supabase.auth.signUp({
      email,password,
      options:{data:{name,whatsapp}}
    });
    if(error){setMsg(error.message);return;}
    setMsg("Cadastro criado. Verifique seu e-mail se a confirmação estiver ativada.");
  }
  return <section><div className="container" style={{maxWidth:680}}>
    <div className="panel"><div className="eyebrow">CRIAR CONTA</div><h2>Cadastre-se</h2>
      <form onSubmit={submit} className="form-grid">
        <div className="field"><label>Nome</label><input name="name" required/></div>
        <div className="field"><label>WhatsApp</label><input name="whatsapp" required/></div>
        <div className="field"><label>E-mail</label><input name="email" type="email" required/></div>
        <div className="field"><label>Senha</label><input name="password" type="password" minLength={6} required/></div>
        <button className="btn btn-red full">Criar conta</button>
      </form>
      {msg && <p className="notice">{msg}</p>}
    </div>
  </div></section>
}
