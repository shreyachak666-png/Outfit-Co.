"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { DEFAULT_CARD_COLOR } from "@/lib/types";

const IMAGE_BUCKET = "outfit-images";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin");
}

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

async function findAvailableSlug(
  desiredSlug: string,
  excludeId?: string
): Promise<string> {
  const supabase = await createClient();
  const base = slugify(desiredSlug) || "look";
  let candidate = base;
  let suffix = 2;

  // Small personal-scale site — a handful of round trips is plenty fast.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from("outfits").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();

    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

// ---------------------------------------------------------------------------
// Create / update outfit
// ---------------------------------------------------------------------------

export type SaveOutfitState = {
  error: string | null;
};

export async function saveOutfitAction(
  _prevState: SaveOutfitState,
  formData: FormData
): Promise<SaveOutfitState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You've been signed out — please log in again." };

  const outfitId = String(formData.get("outfitId") || "").trim() || null;
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const cardColor =
    String(formData.get("cardColor") || "").trim() || DEFAULT_CARD_COLOR;
  const requestedSlug = String(formData.get("slug") || "").trim() || title;
  const productsJson = String(formData.get("productsJson") || "[]");
  const imageFile = formData.get("image") as File | null;

  if (!title) return { error: "Give this look a title." };

  let products: { name: string; url: string }[] = [];
  try {
    const parsed = JSON.parse(productsJson);
    products = Array.isArray(parsed)
      ? parsed
          .map((p: { name?: string; url?: string }) => ({
            name: String(p.name || "").trim(),
            url: String(p.url || "").trim(),
          }))
          .filter((p) => p.name && p.url)
      : [];
  } catch {
    products = [];
  }

  // Upload a new image if one was provided.
  let imageUrl: string | null = null;
  let imagePath: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, arrayBuffer, {
        contentType: imageFile.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(path);

    imageUrl = publicUrlData.publicUrl;
    imagePath = path;
  } else if (!outfitId) {
    return { error: "Please upload an image for this look." };
  }

  const slug = await findAvailableSlug(requestedSlug, outfitId || undefined);

  if (outfitId) {
    // --- Update existing outfit ---
    const updatePayload: Record<string, unknown> = {
      title,
      description: description || null,
      card_color: cardColor,
      slug,
      updated_at: new Date().toISOString(),
    };
    if (imageUrl) {
      updatePayload.image_url = imageUrl;
      updatePayload.image_path = imagePath;
    }

    const { error: updateError } = await supabase
      .from("outfits")
      .update(updatePayload)
      .eq("id", outfitId);

    if (updateError) return { error: updateError.message };

    // Replace the product list wholesale — simplest way to support
    // free add/remove/reorder without diffing.
    const { error: deleteProductsError } = await supabase
      .from("products")
      .delete()
      .eq("outfit_id", outfitId);
    if (deleteProductsError) return { error: deleteProductsError.message };

    if (products.length > 0) {
      const { error: insertError } = await supabase.from("products").insert(
        products.map((p, index) => ({
          outfit_id: outfitId,
          name: p.name,
          url: p.url,
          position: index,
        }))
      );
      if (insertError) return { error: insertError.message };
    }

    revalidatePath("/");
    revalidatePath(`/look/${slug}`);
    revalidatePath("/admin/dashboard");
    redirect("/admin/dashboard");
  } else {
    // --- Create new outfit — append to the end of the current order ---
    const { data: maxPositionRow } = await supabase
      .from("outfits")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = (maxPositionRow?.position ?? -1) + 1;

    const { data: inserted, error: insertError } = await supabase
      .from("outfits")
      .insert({
        title,
        description: description || null,
        card_color: cardColor,
        slug,
        image_url: imageUrl,
        image_path: imagePath,
        published: true,
        position: nextPosition,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      return { error: insertError?.message || "Couldn't save this look." };
    }

    if (products.length > 0) {
      const { error: productsError } = await supabase.from("products").insert(
        products.map((p, index) => ({
          outfit_id: inserted.id,
          name: p.name,
          url: p.url,
          position: index,
        }))
      );
      if (productsError) return { error: productsError.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    redirect("/admin/dashboard");
  }
}

// ---------------------------------------------------------------------------
// Delete / hide / reorder
// ---------------------------------------------------------------------------

export async function deleteOutfitAction(id: string, slug: string) {
  const supabase = await createClient();

  const { data: outfit } = await supabase
    .from("outfits")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("outfits").delete().eq("id", id);

  if (outfit?.image_path) {
    await supabase.storage.from(IMAGE_BUCKET).remove([outfit.image_path]);
  }

  revalidatePath("/");
  revalidatePath(`/look/${slug}`);
  revalidatePath("/admin/dashboard");
}

export async function togglePublishedAction(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from("outfits").update({ published }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function reorderOutfitsAction(orderedIds: string[]) {
  const supabase = await createClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("outfits").update({ position: index }).eq("id", id)
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}
