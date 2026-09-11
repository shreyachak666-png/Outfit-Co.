import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default function AdminHeader({
  title,
  backHref,
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-beige/70 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <div>
          {backHref && (
            <Link
              href={backHref}
              className="text-xs tracking-wide text-chocolate/50 hover:text-burgundy"
            >
              ← Back
            </Link>
          )}
          <h1 className="font-serif text-xl text-chocolate sm:text-2xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs tracking-wide text-chocolate/50 hover:text-burgundy"
          >
            View site ↗
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs tracking-wide text-chocolate/50 hover:text-burgundy"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
