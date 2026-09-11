"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import ImageUploadField from "./ImageUploadField";
import ColorPicker from "./ColorPicker";
import ProductsEditor, {
  makeEmptyProduct,
  type EditableProduct,
} from "./ProductsEditor";
import CopyLinkButton from "./CopyLinkButton";
import { saveOutfitAction, type SaveOutfitState } from "@/app/admin/actions";
import { slugify } from "@/lib/slugify";
import { DEFAULT_CARD_COLOR } from "@/lib/types";
import type { OutfitWithProducts } from "@/lib/types";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-burgundy py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-burgundy-dark disabled:opacity-60 sm:w-auto sm:px-10"
    >
      {pending ? "Saving…" : isEditing ? "Save Changes" : "Publish Look"}
    </button>
  );
}

export default function AdminOutfitForm({
  outfit,
  siteUrl,
}: {
  outfit?: OutfitWithProducts;
  siteUrl: string;
}) {
  const isEditing = Boolean(outfit);
  const initialState: SaveOutfitState = { error: null };
  const [state, formAction] = useActionState(saveOutfitAction, initialState);

  const [title, setTitle] = useState(outfit?.title ?? "");
  const [slug, setSlug] = useState(outfit?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [cardColor, setCardColor] = useState(
    outfit?.card_color ?? DEFAULT_CARD_COLOR
  );
  const [products, setProducts] = useState<EditableProduct[]>(
    outfit?.products.length
      ? outfit.products.map((p) => ({ key: p.id, name: p.name, url: p.url }))
      : [makeEmptyProduct()]
  );

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {outfit && <input type="hidden" name="outfitId" value={outfit.id} />}
      <input type="hidden" name="cardColor" value={cardColor} />
      <input
        type="hidden"
        name="productsJson"
        value={JSON.stringify(products.map(({ name, url }) => ({ name, url })))}
      />

      <section>
        <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
          Outfit image
        </label>
        <div className="mt-2 max-w-sm">
          <ImageUploadField
            name="image"
            existingImageUrl={outfit?.image_url}
          />
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
            Outfit heading / title
          </label>
          <input
            type="text"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="The Burgundy Edit"
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 font-serif text-lg text-chocolate outline-none focus:border-burgundy"
          />
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
            URL slug
          </label>
          <div className="mt-1 flex items-center rounded-lg border border-beige bg-white px-3 py-2.5 focus-within:border-burgundy">
            <span className="shrink-0 text-sm text-chocolate/35">/look/</span>
            <input
              type="text"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="the-burgundy-edit"
              className="w-full bg-transparent text-sm text-chocolate outline-none"
            />
          </div>
          {isEditing && outfit && (
            <div className="mt-2">
              <CopyLinkButton url={`${siteUrl}/look/${outfit.slug}`} />
              <span className="ml-2 align-middle text-xs text-chocolate/40">
                {siteUrl}/look/{outfit.slug}
              </span>
            </div>
          )}
        </div>
      </section>

      <section>
        <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
          Short description{" "}
          <span className="normal-case text-chocolate/30">(optional)</span>
        </label>
        <textarea
          name="description"
          defaultValue={outfit?.description ?? ""}
          rows={3}
          placeholder="A romantic Indo-Western look with a vintage touch."
          className="mt-1 w-full resize-none rounded-lg border border-beige bg-white px-3 py-2.5 text-sm text-chocolate outline-none focus:border-burgundy"
        />
      </section>

      <section>
        <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
          Card colour
        </label>
        <div className="mt-2">
          <ColorPicker value={cardColor} onChange={setCardColor} />
        </div>
      </section>

      <section>
        <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
          Products / shopping links
        </label>
        <div className="mt-2">
          <ProductsEditor products={products} onChangeProducts={setProducts} />
        </div>
      </section>

      {state.error && (
        <p className="rounded-lg bg-blush/50 px-4 py-3 text-sm text-burgundy">
          {state.error}
        </p>
      )}

      <div>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
