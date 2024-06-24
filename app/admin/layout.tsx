import Header from "@/components/nav/Header";
import HeaderMobile from "@/components/nav/HeaderMobile";
import MarginWidthWrapper from "@/components/MarginWidthWrapper";
import PageWrapper from "@/components/PageWrapper";
import SideNav from "@/components/nav/SideNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          <MarginWidthWrapper>
            <Header />
            <HeaderMobile />
            <PageWrapper>{children}</PageWrapper>
          </MarginWidthWrapper>
        </main>
      </div>
    </div>
  );
}
