
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function AdPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const supabase=await createClient();
  const {data:ad}=await supabase
    .from("ads")
    .select("*,profiles(name,verified),ad_images(storage_path,sort_order)")
    .eq("id",id)
    .eq("status","published")
    .single();

  if(!ad) notFound();

  const images=(ad.ad_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order);
  const phone=String(ad.whatsapp).replace(/\D/g,"");
  const wa=`https://wa.me/55${phone}?text=${encodeURIComponent(`Olá! Vi seu anúncio "${ad.title}" no Race Market Brasil.`)}`;

  return <section><div className="container">
    <div className="hero-grid">
      <div>
        <div className="grid-3">
          {images.length ? images.map((img:any)=><img key={img.storage_path}
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ad-images/${img.storage_path}`}
            alt={ad.title} style={{width:"100%",borderRadius:16,aspectRatio:"4/3",objectFit:"cover"}}/>) :
            <div className="panel" style={{minHeight:360,display:"grid",placeItems:"center",fontSize:80}}>🏁</div>}
        </div>
        <div className="panel" style={{marginTop:18}}>
          <h3>Descrição</h3><p className="muted" style={{whiteSpace:"pre-wrap"}}>{ad.description}</p>
        </div>
      </div>
      <div className="panel" style={{height:"max-content"}}>
        <div className="eyebrow">ANÚNCIO {String(ad.plan).toUpperCase()}</div>
        <h1 style={{fontSize:38}}>{ad.title}</h1>
        <div className="price">R$ {Number(ad.price).toFixed(2).replace(".",",")}</div>
        <p className="muted">{ad.city} — {ad.state}</p>
        <a className="btn btn-green" style={{width:"100%",marginTop:12}} href={wa}>Falar com vendedor no WhatsApp</a>
        <div className="panel" style={{marginTop:16,background:"#101014"}}>
          <strong>{ad.profiles?.name||"Vendedor"}</strong>
          <p className="muted">{ad.profiles?.verified ? "✓ Perfil verificado" : "Perfil não verificado"}</p>
        </div>
      </div>
    </div>
  </div></section>
}
