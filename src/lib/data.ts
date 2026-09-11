import { createClient } from "@/lib/supabase/server";
import type { Outfit, OutfitWithProducts } from "@/lib/types";

/** Published outfits for the public homepage grid, in curator-chosen order. */
export async function getPublishedOutfits(): Promise<Outfit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to load outfits:", error.message);
    return [];
  }
  return data ?? [];
}

/** A single published outfit (with its products) by slug, for the public look page. */
export async function getPublishedOutfitBySlug(
  slug: string
): Promise<OutfitWithProducts | null> {
  const supabase = await createClient();
  const { data: outfit, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !outfit) return null;

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("outfit_id", outfit.id)
    .order("position", { ascending: true });

  return { ...outfit, products: products ?? [] };
}

/** Every outfit (published or hidden), for the admin dashboard. */
export async function getAllOutfitsForAdmin(): Promise<Outfit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to load outfits:", error.message);
    return [];
  }
  return data ?? [];
}

/** A single outfit (with its products) by id, for the admin edit form. */
export async function getOutfitByIdForAdmin(
  id: string
): Promise<OutfitWithProducts | null> {
  const supabase = await createClient();
  const { data: outfit, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !outfit) return null;

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("outfit_id", outfit.id)
    .order("position", { ascending: true });

  return { ...outfit, products: products ?? [] };
}
