
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const supabase = await createClient();
  const { data: ads } = await supabase
    .from("ads")
    .select("id,updated_at")
    .eq("status", "published");

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/login`, lastModified: new Date() },
    { url: `${base}/cadastro`, lastModified: new Date() },
    ...(ads || []).map((ad: any) => ({
      url: `${base}/anuncios/${ad.id}`,
      lastModified: ad.updated_at ? new Date(ad.updated_at) : new Date(),
    })),
  ];
}
