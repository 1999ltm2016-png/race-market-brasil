
"use client";
import { FormEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

const prices:Record<string,number>={basic:19.90,destaque:39.90,premium:69.90};

function AnunciarContent(){
  const q=useSearchParams();
  const initial=(q.get("plano")||"destaque").toLowerCase();
  const [plan,setPlan]=useState(prices[initial]?initial:"destaque");
  const [story,setStory]=useState(false);
  const [msg,setMsg]=useState("");
  const price=prices[plan];

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setMsg("Salvando...");
    const fd=new FormData(e.currentTarget);
    const files=fd.getAll("images").filter(x=>x instanceof File && x.size>0) as File[];
    const supabase=createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){location.href="/login";return;}

    const {data:ad,error}=await supabase.from("ads").insert({
      user_id:user.id,title:String(fd.get("title")||""),description:String(fd.get("description")||""),
      price:Number(fd.get("price")||0),category:String(fd.get("category")||""),city:String(fd.get("city")||""),
      state:String(fd.get("state")||"RS"),whatsapp:String(fd.get("whatsapp")||""),plan,plan_price:price,status:"awaiting_payment"
    }).select("id").single();

    if(error){setMsg(error.message);return;}

    for(let i=0;i<Math.min(files.length,10);i++){
      const file=files[i]; const ext=file.name.split(".").pop()||"jpg";
      const path=`${user.id}/${ad.id}/${crypto.randomUUID()}.${ext}`;
      const {error:upErr}=await supabase.storage.from("ad-images").upload(path,file);
      if(!upErr) await supabase.from("ad_images").insert({ad_id:ad.id,storage_path:path,sort_order:i});
    }

    if(story) await supabase.from("story_requests").insert({user_id:user.id,ad_id:ad.id,amount:29.90,instagram:"LucasTorres_77_",status:"awaiting_payment"});
    location.href=`/minha-race?novo=${ad.id}`;
  }

  return <section><div className="container" style={{maxWidth:900}}><div className="panel">
    <div className="eyebrow">NOVO ANÚNCIO</div><h2>Crie seu anúncio</h2>
    <form onSubmit={submit} className="form-grid">
      <div className="field full"><label>Título</label><input name="title" required/></div>
      <div className="field"><label>Categoria</label><select name="category"><option>Moto</option><option>Capacete</option><option>Macacão</option><option>Bota</option><option>Luva</option><option>Peça & Performance</option><option>Pneus & Rodas</option><option>Paddock & Box</option></select></div>
      <div className="field"><label>Preço do produto</label><input name="price" type="number" min="0" step="0.01" required/></div>
      <div className="field"><label>Cidade</label><input name="city" required/></div>
      <div className="field"><label>Estado</label><input name="state" defaultValue="RS" required/></div>
      <div className="field"><label>WhatsApp</label><input name="whatsapp" required/></div>
      <div className="field full"><label>Descrição</label><textarea name="description" rows={6} required/></div>
      <div className="field full"><label>Fotos (até 10)</label><input name="images" type="file" accept="image/*" multiple/></div>

      <div className="full"><h3>Escolha seu plano</h3><div className="grid-3">
        {Object.entries(prices).map(([k,v])=><label className="card" key={k} style={{cursor:"pointer",borderColor:plan===k?"#e10600":undefined}}>
          <input type="radio" name="plan" checked={plan===k} onChange={()=>setPlan(k)}/>
          <strong style={{textTransform:"capitalize"}}>{k}</strong><div className="price">R$ {v.toFixed(2).replace(".",",")}</div>
        </label>)}
      </div></div>

      <label className="panel full" style={{cursor:"pointer"}}>
        <input type="checkbox" checked={story} onChange={e=>setStory(e.target.checked)}/>
        <strong style={{marginLeft:8}}>Adicionar Story opcional no @LucasTorres_77_ — R$ 29,90</strong>
        <p className="muted">Você pode publicar o anúncio sem contratar o Story.</p>
      </label>

      <div className="notice full"><strong>Pagamento via PIX:</strong> 51980103004<br/>
      Valor do anúncio: <strong>R$ {price.toFixed(2).replace(".",",")}</strong>{story?" + R$ 29,90 do Story opcional":""}.<br/>
      Após o pagamento, envie o comprovante pelo WhatsApp 51 98010-3004.</div>

      <button className="btn btn-red full">Salvar anúncio e seguir — R$ {(price+(story?29.90:0)).toFixed(2).replace(".",",")}</button>
    </form>{msg&&<p className="notice">{msg}</p>}
  </div></div></section>
}


export default function Anunciar(){
  return (
    <Suspense fallback={
      <section>
        <div className="container" style={{maxWidth:900}}>
          <div className="panel">
            <div className="eyebrow">RACE MARKET BRASIL</div>
            <h2>Carregando anúncio...</h2>
          </div>
        </div>
      </section>
    }>
      <AnunciarContent />
    </Suspense>
  );
}
