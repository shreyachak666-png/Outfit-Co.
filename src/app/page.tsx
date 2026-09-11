import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MasonryGrid from "@/components/MasonryGrid";
import { getPublishedOutfits } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const outfits = await getPublishedOutfits();

  return (
    <>
      <NavBar />
      <main>
        <section className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center sm:pt-24">
          <h1 className="font-serif text-4xl leading-tight text-chocolate sm:text-5xl">
            OUTFIT&amp;CO.
          </h1>
          <p className="mt-5 font-serif text-lg italic text-burgundy sm:text-xl">
            Curating outfits you&rsquo;ll want to wear ✨
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-chocolate/50 sm:text-sm">
            Clothes &bull; Accessories &bull; Hair &bull; Styling
          </p>
        </section>

        <section id="looks" className="mx-auto max-w-6xl px-5 pb-24 pt-6 sm:px-8">
          <MasonryGrid outfits={outfits} />
        </section>
      </main>
      <Footer />
    </>
  );
}
