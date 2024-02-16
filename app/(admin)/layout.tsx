import AdminSidebar from "@/components/sidebar";

export default function AdminDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="flex flex-row min-w-[100vw] w-full h-full">
        <AdminSidebar />
        <section className="w-full h-full ">{children}</section>
      </nav>
    </>
  );
}
