import Link from "next/link";
import type { Outfit } from "@/lib/types";
import { textClassForColor } from "@/lib/slugify";

export default function OutfitCard({ outfit }: { outfit: Outfit }) {
  const textClass = textClassForColor(outfit.card_color || "#FBF7F0");

  return (
    <Link
      href={`/look/${outfit.slug}`}
      className="group block animate-fadeIn overflow-hidden rounded-xl2 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      style={{ backgroundColor: outfit.card_color || "#FBF7F0" }}
    >
      <div className="overflow-hidden">
        {outfit.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={outfit.image_url}
            alt={outfit.title}
            loading="lazy"
            className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center bg-beige/60">
            <span className="font-serif text-sm text-chocolate/40">
              Outfit&amp;Co.
            </span>
          </div>
        )}
      </div>
      <div className="px-5 py-4">
        <h3 className={`font-serif text-lg leading-snug ${textClass}`}>
          {outfit.title}
        </h3>
        {outfit.description && (
          <p
            className={`mt-1.5 text-sm leading-relaxed ${textClass} opacity-75`}
          >
            {outfit.description}
          </p>
        )}
      </div>
    </Link>
  );
}
