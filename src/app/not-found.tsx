import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-md px-6 py-28 text-center">
        <h1 className="font-serif text-3xl text-chocolate">
          This look doesn&rsquo;t exist
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-chocolate/60">
          The page you&rsquo;re looking for may have been renamed, hidden, or
          removed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-burgundy px-6 py-3 text-sm tracking-wide text-ivory transition-colors hover:bg-burgundy-dark"
        >
          Back to the lookbook
        </Link>
      </main>
      <Footer />
    </>
  );
}
