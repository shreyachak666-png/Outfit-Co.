import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import OutfitDashboardList from "@/components/OutfitDashboardList";
import { getAllOutfitsForAdmin } from "@/lib/data";

export const revalidate = 0;

export default async function DashboardPage() {
  const outfits = await getAllOutfitsForAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <AdminHeader title="Your Looks" />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-chocolate/55">
            Drag the handle to reorder. Changes go live on the site
            immediately.
          </p>
          <Link
            href="/admin/new"
            className="inline-block shrink-0 rounded-full bg-burgundy px-6 py-3 text-center text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-burgundy-dark"
          >
            + ADD NEW LOOK
          </Link>
        </div>

        <OutfitDashboardList initialOutfits={outfits} siteUrl={siteUrl} />
      </main>
    </>
  );
}
