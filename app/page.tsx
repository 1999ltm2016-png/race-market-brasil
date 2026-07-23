
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const plans=[
{name:"Basic",slug:"basic",price:"19,90",text:"30 dias • até 10 fotos"},
{name:"Destaque",slug:"destaque",price:"39,90",text:"Prioridade nas buscas + selo"},
{name:"Premium",slug:"premium",price:"69,90",text:"60 dias + destaque na Home"},
];
const categorias=[
  {name:"Motos",img:"https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80"},
  {name:"Capacetes",img:"https://images.unsplash.com/photo-1611004061856-ccc3cbe944b2?auto=format&fit=crop&w=600&q=80"},
  {name:"Macac\u00f5es",img:"https://images.unsplash.com/photo-1651575474911-8e08e1f51503?auto=format&fit=crop&w=600&q=80"},
  {name:"Pe\u00e7as & Performance",img:"https://images.unsplash.com/photo-1534755563369-ad37931ac77b?auto=format&fit=crop&w=600&q=80"},
  ];

export default async function Home(){
  const supabase=await createClient();
  const {data:ads}=await supabase.from("ads")
    .select("id,title,price,city,state,plan,created_at,ad_images(storage_path,sort_order)")
    .eq("status","published").order("created_at",{ascending:false}).limit(8);

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
      <div className="grid-4">{categorias.map(c=><div className="card" key={c.name}><div style={{height:140,borderRadius:14,overflow:"hidden",marginBottom:14}}><img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><h3>{c.name}</h3><p className="muted">{"An\u00fancios especializados para pista e competi\u00e7\u00e3o."}</p></div>)}</div>
    </div></section>

    <section id="comprar"><div className="container">
      <h2>Anúncios publicados</h2>
      <div className="grid-4">
        {(ads||[]).map((ad:any)=>{
          const img=(ad.ad_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order)[0];
          const url=img?`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ad-images/${img.storage_path}`:null;
          return <Link href={`/anuncios/${ad.id}`} className="card" key={ad.id}>
            <div style={{height:180,borderRadius:14,background:"#1e1e24",overflow:"hidden",display:"grid",placeItems:"center",marginBottom:14}}>
              {url?<img src={url} alt={ad.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:56}}>🏁</span>}
            </div>
            <div className="eyebrow">{String(ad.plan).toUpperCase()}</div>
            <h3>{ad.title}</h3><div className="price">R$ {Number(ad.price).toFixed(2).replace(".",",")}</div>
            <p className="muted">{ad.city} — {ad.state}</p>
          </Link>
        })}
      </div>
      {!ads?.length&&<div className="panel"><p className="muted">Ainda não há anúncios publicados.</p></div>}
    </div></section>

    <section id="planos"><div className="container"><h2>Quanto custa anunciar?</h2>
      <p className="muted">Pagamento único por anúncio. Sem comissão sobre a venda.</p>
      <div className="grid-3">{plans.map(p=><div className="card" key={p.name}>
        <div className="eyebrow">{p.name.toUpperCase()}</div><div className="price" style={{marginTop:10}}>R$ {p.price}</div>
        <p className="muted">{p.text}</p><Link className="btn btn-red" href={`/anunciar?plano=${p.slug}`}>Escolher {p.name}</Link>
      </div>)}</div>
    </div></section>

    <section><div className="container panel"><h2>Divulgação opcional no Instagram</h2>
    <p className="muted">Story no @LucasTorres_77_ por R$ 29,90. Serviço opcional e separado do valor do anúncio.</p></div></section>
  </>;
}
