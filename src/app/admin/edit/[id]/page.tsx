import { notFound } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminOutfitForm from "@/components/AdminOutfitForm";
import { getOutfitByIdForAdmin } from "@/lib/data";

export const revalidate = 0;

export default async function EditLookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const outfit = await getOutfitByIdForAdmin(id);
  if (!outfit) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <AdminHeader title="Edit Look" backHref="/admin/dashboard" />
      <main className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
        <AdminOutfitForm outfit={outfit} siteUrl={siteUrl} />
      </main>
    </>
  );
}
