
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const auth=req.headers.get("authorization");
  if(!auth) return NextResponse.json({error:"Unauthorized"},{status:401});

  const supabase=createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token=auth.replace("Bearer ","");
  const {data:{user}}=await supabase.auth.getUser(token);
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});

  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
  if(profile?.role!=="admin") return NextResponse.json({error:"Forbidden"},{status:403});

  const body=await req.json();
  const allowed=["awaiting_payment","payment_review","pending_review","published","correction_requested","rejected","suspended"];
  if(!allowed.includes(body.status)) return NextResponse.json({error:"Invalid status"},{status:400});

  const {data,error}=await supabase.from("ads").update({status:body.status}).eq("id",id).select().single();
  if(error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json(data);
}
