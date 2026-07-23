import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const map:Record<string,string>={motos:"Moto",capacetes:"Capacete",macacoes:"Macac\u00e3o","pecas-performance":"Pe\u00e7a & Performance"};

export default async function CategoriaPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const categoria=map[slug]||slug;
  const supabase=await createClient();
  const {data:ads}=await supabase.from("ads")
  .select("id,title,price,city,state,plan,created_at,ad_images(storage_path,sort_order)")
  .eq("status","published").eq("category",categoria).order("created_at",{ascending:false});

return <section><div className="container">
<div className="eyebrow">CATEGORIA</div>
<h2>{categoria}</h2>
<div className="grid-4">
  {(ads||[]).map((ad:any)=>{
  const img=(ad.ad_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order)[0];
  const url=img?`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ad-images/${img.storage_path}`:null;
  return <Link href={`/anuncios/${ad.id}`} className="card" key={ad.id}>
    <div style={{height:180,borderRadius:14,background:"#1e1e24",overflow:"hidden",display:"grid",placeItems:"center",marginBottom:14}}>
      {url?<img src={url} alt={ad.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:56}}>{"\u{1F3C1}"}</span>}
    </div>
    <div className="eyebrow">{String(ad.plan).toUpperCase()}</div>
  <h3>{ad.title}</h3><div className="price">R$ {Number(ad.price).toFixed(2).replace(".",",")}</div>
                 <p className="muted">{ad.city} {"\u2014"} {ad.state}</p></Link>
  })}</div>
  {!ads?.length&&<div className="panel"><p className="muted">{"Ainda n\u00e3o h\u00e1 an\u00fancios nesta categoria."}</p></div>}
<p style={{marginTop:24}}><Link className="btn btn-dark" href="/">{"\u2190 Voltar"}</Link></p>
</div></section>;
}
