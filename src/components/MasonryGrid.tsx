import type { Outfit } from "@/lib/types";
import OutfitCard from "./OutfitCard";

export default function MasonryGrid({ outfits }: { outfits: Outfit[] }) {
  if (outfits.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-serif text-2xl text-chocolate">
          No looks yet
        </p>
        <p className="mt-3 text-sm leading-relaxed text-chocolate/60">
          Once you publish your first look from the admin dashboard, it will
          appear here in your lookbook.
        </p>
      </div>
    );
  }

  return (
    <div className="masonry">
      {outfits.map((outfit) => (
        <OutfitCard key={outfit.id} outfit={outfit} />
      ))}
    </div>
  );
}
