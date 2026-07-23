import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const plans=[
{name:"Basic",slug:"basic",price:"19,90",text:"30 dias • até 10 fotos"},
{name:"Destaque",slug:"destaque",price:"39,90",text:"Prioridade nas buscas + selo"},
{name:"Premium",slug:"premium",price:"69,90",text:"60 dias + destaque na Home"},
];
const categorias=[
{name:"Motos",slug:"motos",img:"https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80"},
{name:"Capacetes",slug:"capacetes",img:"https://images.unsplash.com/photo-1611004061856-ccc3cbe944b2?auto=format&fit=crop&w=600&q=80"},
{name:"Macacões",slug:"macacoes",img:"https://images.unsplash.com/photo-1651575474911-8e08e1f51503?auto=format&fit=crop&w=600&q=80"},
{name:"Peças & Performance",slug:"pecas-performance",img:"https://images.unsplash.com/photo-1534755563369-ad37931ac77b?auto=format&fit=crop&w=600&q=80"},
];

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

export default async function Home(){
const supabase=await createClient();
const {data:raw}=await supabase.from("ads")
.select("id,title,price,city,state,plan,created_at,ad_images(storage_path,sort_order)")
.eq("status","published").order("created_at",{ascending:false}).limit(50);

const ads=(raw||[]).filter(ativo).sort(ordenar);
const destaques=ads.filter((ad:any)=>ad.plan==="premium").slice(0,4);
const lista=ads.slice(0,8);

return <>
<section className="hero"><div className="container hero-grid">
<div><div className="eyebrow">MOTOVELOCIDADE • TRACK DAY • RACING</div>
<h1>O marketplace da velocidade.</h1>
<p className="muted">Compre e venda motos de pista, equipamentos, peças de performance e tudo do universo racing.</p>
<div style={{display:"flex",gap:10,marginTop:24,flexWrap:"wrap"}}>
<Link className="btn btn-red" href="/anunciar">+ Criar anúncio</Link>
<Link className="btn btn-dark" href="#comprar">Ver anúncios</Link>
</div></div>
<div className="hero-card" role="img" aria-label="Kawasaki H2R"></div>
</div></section>

<section id="categorias"><div className="container">
<h2>Explore por categoria</h2>
<div className="grid-4">{categorias.map(c=><a href={`/categorias/${c.slug}`} className="card" key={c.name}><div style={{height:140,borderRadius:14,overflow:"hidden",marginBottom:14}}><img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><h3>{c.name}</h3><p className="muted">Anúncios especializados para pista e competição.</p></a>)}</div>
</div></section>

{destaques.length>0 && <section id="destaques"><div className="container">
<h2>🏆 Anúncios em Destaque</h2>
<div className="grid-4">
{destaques.map((ad:any)=>{
const img=(ad.ad_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order)[0];
const url=img?`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ad-images/${img.storage_path}`:null;
return <Link href={`/anuncios/${ad.id}`} className="card" key={ad.id} style={{borderColor:"#e10600",borderWidth:2}}>
<div style={{height:180,borderRadius:14,background:"#1e1e24",overflow:"hidden",display:"grid",placeItems:"center",marginBottom:14}}>
{url?<img src={url} alt={ad.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:56}}>🏁</span>}
</div>
<div className="eyebrow" style={{color:"#e10600"}}>{selo(ad.plan)}</div>
<h3>{ad.title}</h3><div className="price">R$ {Number(ad.price).toFixed(2).replace(".",",")}</div>
<p className="muted">{ad.city} — {ad.state}</p>
</Link>
})}
</div>
</div></section>}

<section id="comprar"><div className="container">
<h2>Anúncios publicados</h2>
<div className="grid-4">
{lista.map((ad:any)=>{
const img=(ad.ad_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order)[0];
const url=img?`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ad-images/${img.storage_path}`:null;
return <Link href={`/anuncios/${ad.id}`} className="card" key={ad.id}>
<div style={{height:180,borderRadius:14,background:"#1e1e24",overflow:"hidden",display:"grid",placeItems:"center",marginBottom:14}}>
{url?<img src={url} alt={ad.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:56}}>🏁</span>}
</div>
<div className="eyebrow">{selo(ad.plan)}</div>
<h3>{ad.title}</h3><div className="price">R$ {Number(ad.price).toFixed(2).replace(".",",")}</div>
<p className="muted">{ad.city} — {ad.state}</p>
</Link>
})}
</div>
{!lista.length&&<div className="panel"><p className="muted">Ainda não há anúncios publicados.</p></div>}
</div></section>

<section id="planos"><div className="container"><h2>Quanto custa anunciar?</h2>
<p className="muted">Pagamento único por anúncio. Sem comissão sobre a venda.</p>
<div className="grid-3">{plans.map(p=><div className="card" key={p.name}>
<div className="eyebrow">{p.name.toUpperCase()}</div><div className="price" style={{marginTop:10}}>R$ {p.price}</div>
<p className="muted">{p.text}</p><Link className="btn btn-red" href={`/anunciar?plano=${p.slug}`}>Escolher {p.name}</Link>
</div>)}</div>
</div></section>

<section><div className="container">
<div className="panel" style={{maxWidth:640,margin:"0 auto"}}>
<div className="eyebrow">DIVULGAÇÃO EM STORY</div>
<div style={{display:"flex",gap:20,alignItems:"center",marginTop:16,flexWrap:"wrap"}}>
<div style={{position:"relative",width:100,height:100,flexShrink:0}}>
<div style={{width:100,height:100,borderRadius:"50%",background:"linear-gradient(135deg,#e10600,#7b2ff7,#00c3ff)",display:"grid",placeItems:"center"}}>
<div style={{width:88,height:88,borderRadius:"50%",background:"#0d0d10",display:"grid",placeItems:"center"}}>
<span style={{fontSize:30,fontWeight:900,color:"#fff"}}>L<span style={{color:"#e10600"}}>T</span></span>
</div>
</div>
<div style={{position:"absolute",bottom:0,right:0,width:26,height:26,borderRadius:"50%",background:"#1d9bf0",display:"grid",placeItems:"center",border:"3px solid #0d0d10"}}>
<span style={{color:"#fff",fontSize:13}}>✓</span>
</div>
</div>
<div>
<h3 style={{margin:0}}>Story no Instagram</h3>
<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
<strong style={{color:"#e10600"}}>@LucasTorres_77_</strong>
<span style={{color:"#e10600"}}>✔</span>
</div>
</div>
</div>

<div style={{marginTop:24,display:"grid",gap:18}}>
<div style={{display:"flex",gap:14,alignItems:"flex-start"}}><span style={{fontSize:20}}>📷</span><p className="muted" style={{margin:0}}>Divulgação em story no perfil @LucasTorres_77_</p></div>
<div style={{display:"flex",gap:14,alignItems:"flex-start"}}><span style={{fontSize:20}}>👥</span><p className="muted" style={{margin:0}}>Alcance qualificado para o público automotivo</p></div>
<div style={{display:"flex",gap:14,alignItems:"flex-start"}}><span style={{fontSize:20}}>🕐</span><p className="muted" style={{margin:0}}>Publicação por 1 semana nos stories</p></div>
<div style={{display:"flex",gap:14,alignItems:"flex-start"}}><span style={{fontSize:20}}>📅</span><p className="muted" style={{margin:0}}>Postagem realizada em até 5 dias após a solicitação</p></div>
<div style={{display:"flex",gap:14,alignItems:"flex-start"}}><span style={{fontSize:20}}>🛡️</span><p className="muted" style={{margin:0}}>Conteúdo profissional e direcionado</p></div>
</div>

<hr style={{border:"none",borderTop:"1px solid #2a2a30",margin:"24px 0"}}/>

<div className="price" style={{fontSize:32}}>R$ 29,90</div>
<p className="muted" style={{marginTop:2}}>por divulgação</p>
<Link className="btn btn-red full" href="/anunciar" style={{marginTop:16,display:"block",textAlign:"center"}}>Solicitar divulgação no story</Link>
</div>
</div></section>
</>;
}
