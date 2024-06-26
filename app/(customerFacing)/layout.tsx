import Navbar from "@/components/nav/Navbar";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col flex-1">
      <Navbar />
      <section className="flex min-h-screen ">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </section>
    </main>
  );
}
