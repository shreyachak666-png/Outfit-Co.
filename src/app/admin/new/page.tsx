import AdminHeader from "@/components/AdminHeader";
import AdminOutfitForm from "@/components/AdminOutfitForm";

export default function NewLookPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <AdminHeader title="Add New Look" backHref="/admin/dashboard" />
      <main className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
        <AdminOutfitForm siteUrl={siteUrl} />
      </main>
    </>
  );
}
