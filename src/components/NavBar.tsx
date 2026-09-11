import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-beige/70 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-chocolate sm:text-2xl"
        >
          OUTFIT&amp;CO.
        </Link>
        <nav className="flex items-center gap-5 text-sm tracking-wide text-chocolate/80 sm:gap-8 sm:text-[0.95rem]">
          <Link href="/" className="transition-colors hover:text-burgundy">
            HOME
          </Link>
          <Link href="/#looks" className="transition-colors hover:text-burgundy">
            LOOKS
          </Link>
          <Link href="/about" className="transition-colors hover:text-burgundy">
            ABOUT
          </Link>
        </nav>
      </div>
    </header>
  );
}
