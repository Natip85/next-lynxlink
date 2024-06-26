import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ZoomParallax from "@/components/ZoomParallax";
import Navbar from "@/components/nav/Navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import db from "@/db/db";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Link from "next/link";
const perks = [
  {
    name: "Instand delivery",
    Icon: ArrowDownToLine,
    description:
      "Get your assests delivered to your email in seconds and dowlonad them right away",
  },
  {
    name: "Guaranteed quality",
    Icon: CheckCircle,
    description:
      "Every asset on our platform is verified by aour tema to insyurace high qualuity statsndrd. Not happy? We offer a 30 day guarantee",
  },
  {
    name: "For the planet",
    Icon: Leaf,
    description:
      "Every asset on our platform is verified by aour tema to insyurace high qualuity statsndrd. Not happy? We offer a 30 day guarantee",
  },
];
async function getParallaxImages() {
  const products = await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 7,
    select: {
      images: true, // Assuming images is an array of objects
    },
  });

  const images = products
    .map((product: any) => product.images[0]?.url)
    .filter(Boolean); // Get the first image of each product

  return images;
}

export default async function Home() {
  const parImgs = await getParallaxImages();

  return (
    <>
      <Navbar />
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Your marketplace for high-quality{" "}
            <span className="text-blue-600">artwork</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to lynxlink. Every asset on our platform is verified by our
            team to ensure our highest quality standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              Browse Catalog
            </Link>
            <Link
              href={"/products"}
              className={buttonVariants({ variant: "ghost" })}
            >
              Our quality promise &rarr;
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="mt-[10vh] mb-[10vh]">
        <ZoomParallax imgs={parImgs} />
      </div>
      <section className="border-t border-secondary bg-secondary">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="size-16 flex items-center justify-center rounded-full bg-primary text-secondary">
                    {<perk.Icon className="size-1/3" />}
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-primary">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
