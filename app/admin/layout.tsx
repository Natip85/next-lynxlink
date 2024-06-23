import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex flex-col flex-1">
        <AdminNavbar />
        <section className="flex min-h-screen flex-1 flex-col items-center px-1 pb-10 pt-28 max-md:pb-32 sm:px-10">
          <div className="w-full max-w-6xl">{children}</div>
        </section>
      </main>
    </div>
  );
}
