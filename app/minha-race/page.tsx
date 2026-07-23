
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MinhaRace(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");

  const {data:ads}=await supabase.from("ads").select("*").eq("user_id",user.id).order("created_at",{ascending:false});

  return <section><div className="container">
    <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center"}}>
      <div><div className="eyebrow">MINHA RACE MARKET</div><h2>Seus anúncios</h2></div>
      <Link className="btn btn-red" href="/anunciar">+ Novo anúncio</Link>
    </div>
    <div className="panel">
      <table>
        <thead><tr><th>Anúncio</th><th>Plano</th><th>Valor plano</th><th>Status</th></tr></thead>
        <tbody>
          {(ads||[]).map((ad:any)=><tr key={ad.id}>
            <td>{ad.title}</td><td>{ad.plan}</td><td>R$ {Number(ad.plan_price).toFixed(2).replace(".",",")}</td>
            <td><span className={`status ${ad.status==="published"?"approved":ad.status==="rejected"?"rejected":"pending"}`}>{ad.status}</span></td>
          </tr>)}
        </tbody>
      </table>
      {!ads?.length && <p className="muted">Você ainda não publicou anúncios.</p>}
    </div>
    <div className="notice" style={{marginTop:18}}>
      PIX: <strong>{process.env.NEXT_PUBLIC_PIX_KEY}</strong>. Envie o comprovante para o WhatsApp 51 98010-3004.
    </div>
  </div></section>
}
