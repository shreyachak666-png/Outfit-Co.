import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductList from "@/components/ProductList";
import { getPublishedOutfitBySlug } from "@/lib/data";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const outfit = await getPublishedOutfitBySlug(slug);
  if (!outfit) return { title: "Look not found" };

  const description =
    outfit.description || `${outfit.title} — curated by Outfit&Co.`;

  return {
    title: outfit.title,
    description,
    alternates: { canonical: `/look/${outfit.slug}` },
    openGraph: {
      title: `${outfit.title} — Outfit&Co.`,
      description,
      images: outfit.image_url ? [{ url: outfit.image_url }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${outfit.title} — Outfit&Co.`,
      description,
      images: outfit.image_url ? [outfit.image_url] : undefined,
    },
  };
}

export default async function LookPage({ params }: Props) {
  const { slug } = await params;
  const outfit = await getPublishedOutfitBySlug(slug);
  if (!outfit) notFound();

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        <div
          className="overflow-hidden rounded-xl2 shadow-card"
          style={{ backgroundColor: outfit.card_color || "#FBF7F0" }}
        >
          {outfit.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={outfit.image_url}
              alt={outfit.title}
              className="w-full object-cover"
            />
          )}
          <div className="px-6 py-7 text-center sm:px-10">
            <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
              {outfit.title}
            </h1>
            {outfit.description && (
              <p className="mx-auto mt-4 max-w-xl font-serif text-base italic leading-relaxed text-chocolate/75 sm:text-lg">
                &ldquo;{outfit.description}&rdquo;
              </p>
            )}
          </div>
        </div>

        <ProductList products={outfit.products} />
      </main>
      <Footer />
    </>
  );
}
