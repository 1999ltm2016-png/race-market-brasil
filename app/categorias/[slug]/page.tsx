import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const map:Record<string,string>={motos:"Moto",capacetes:"Capacete",macacoes:"Macacão","pecas-performance":"Peça & Performance"};
const planDays:Record<string,number>={basic:30,destaque:30,premium:60};
const planWeight:Record<string,number>={premium:2,destaque:1,basic:0};

function ativo(ad:any){
const dias=planDays[ad.plan]||30;
const criado=new Date(ad.created_at).getTime();
return Date.now()-criado<dias*24*60*60*1000;
}
function ordenar(a:any,b:any){
const w=(planWeight[b.plan]||0)-(planWeight[a.plan]||0);
if(w!==0) return w;
return new Date(b.created_at).getTime()-new Date(a.created_at).getTime();
}
function selo(plan:string){
if(plan==="premium") return "🏆 PREMIUM";
if(plan==="destaque") return "⭐ DESTAQUE";
return String(plan).toUpperCase();
}

export default async function CategoriaPage({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;
const categoria=map[slug]||slug;
const supabase=await createClient();
const {data:raw}=await supabase.from("ads")
.select("id,title,price,city,state,plan,created_at,ad_images(storage_path,sort_order)")
.eq("status","published").eq("category",categoria).order("created_at",{ascending:false});

const ads=(raw||[]).filter(ativo).sort(ordenar);

return <section><div className="container">
<div className="eyebrow">CATEGORIA</div>
<h2>{categoria}</h2>
<div className="grid-4">
{ads.map((ad:any)=>{
const img=(ad.ad_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order)[0];
const url=img?`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ad-images/${img.storage_path}`:null;
return <Link href={`/anuncios/${ad.id}`} className="card" key={ad.id}>
<div style={{height:180,borderRadius:14,background:"#1e1e24",overflow:"hidden",display:"grid",placeItems:"center",marginBottom:14}}>
{url?<img src={url} alt={ad.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:56}}>🏁</span>}
</div>
<div className="eyebrow">{selo(ad.plan)}</div>
<h3>{ad.title}</h3><div className="price">R$ {Number(ad.price).toFixed(2).replace(".",",")}</div>
<p className="muted">{ad.city} — {ad.state}</p></Link>
})}</div>
{!ads.length&&<div className="panel"><p className="muted">Ainda não há anúncios nesta categoria.</p></div>}
<p style={{marginTop:24}}><Link className="btn btn-dark" href="/">← Voltar</Link></p>
</div></section>;
}
