
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminStatusActions from "@/components/AdminStatusActions";

export default async function Admin(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
  if(profile?.role!=="admin") redirect("/minha-race");
  const {data:ads}=await supabase.from("ads").select("*,profiles(name,email,whatsapp)").order("created_at",{ascending:false});

  return <section><div className="container"><div className="eyebrow">ÁREA PRIVADA</div><h2>Painel Administrativo</h2>
    <div className="panel"><table><thead><tr><th>Anúncio</th><th>Usuário</th><th>Plano</th><th>Status</th><th>Ação</th></tr></thead>
    <tbody>{(ads||[]).map((ad:any)=><tr key={ad.id}>
      <td>{ad.title}<br/><small className="muted">{ad.city} — {ad.state}</small></td>
      <td>{ad.profiles?.name||ad.user_id}<br/><small className="muted">{ad.profiles?.email}</small></td>
      <td>{ad.plan}<br/><small className="muted">R$ {Number(ad.plan_price).toFixed(2).replace(".",",")}</small></td>
      <td>{ad.status}</td><td><AdminStatusActions adId={ad.id}/></td>
    </tr>)}</tbody></table></div>
  </div></section>
}
