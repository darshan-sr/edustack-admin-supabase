import NestedSidebar from "@/components/nested-sidebar";

export default function NestedDashboardLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="flex flex-row min-w-full max-w-full">
        <NestedSidebar params={params} />
        <section className="w-full">{children}</section>
      </nav>
    </>
  );
}
