import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About",
  description: "About Outfit&Co. — a fashion curation lookbook.",
};

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
        <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
          About Outfit&amp;Co.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-chocolate/75">
          Outfit&amp;Co. is a curated fashion lookbook — a place to gather the
          looks worth remembering. Every outfit here is chosen and styled by
          hand, from the clothes down to the accessories, hair and finishing
          touches.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-chocolate/75">
          Each look links out to the individual pieces so you can shop the
          exact edit, wherever it takes you.
        </p>
      </main>
      <Footer />
    </>
  );
}
