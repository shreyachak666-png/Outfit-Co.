export default function Footer() {
  return (
    <footer className="mt-20 border-t border-beige/70 bg-ivory">
      <div className="mx-auto max-w-6xl px-5 py-10 text-center sm:px-8">
        <p className="font-serif text-lg text-chocolate">OUTFIT&amp;CO.</p>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-chocolate/60">
          Some links on this site may be affiliate links, which means I may
          earn a small commission if you shop through them — at no extra cost
          to you.
        </p>
        <p className="mt-4 text-xs text-chocolate/40">
          &copy; {new Date().getFullYear()} Outfit&amp;Co.
        </p>
      </div>
    </footer>
  );
}
