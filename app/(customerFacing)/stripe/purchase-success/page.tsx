import ConfettiEffect from "@/components/ConfettiEffect";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const user = await currentUser();
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (paymentIntent.metadata.productId == null) return notFound();

  const productIds = paymentIntent.metadata.productId.split(",");
  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length === 0) return notFound();
  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <MaxWidthWrapper className="flex flex-col gap-6 my-10">
      <h1 className="text-4xl text-center font-bold">
        {isSuccess
          ? "Thank you for your purchase!"
          : "Error: Something went wrong!"}
      </h1>
      <p className="text-sm text-center">
        Your purchase receipt has been sent to{" "}
        <span className="font-bold">{user?.email}</span>
      </p>
      <div className="text-center">
        <Button className="mt-4" size="lg" asChild>
          {isSuccess ? (
            <a href={"/orders"}>View order history</a>
          ) : (
            <Link href={"#"}>Try Again</Link>
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {products.map((prod: any) => (
          <div>
            <div
              key={prod.id}
              className="aspect-video flex-shrink-0 w-full relative"
            >
              <Image
                src={prod.images[0]?.url}
                fill
                alt={prod.name}
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{prod.name}</h1>
              <div className="text-lg">
                {formatPrice(prod.priceInCents / 100)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfettiEffect />
    </MaxWidthWrapper>
  );
}

// async function createDownloadVerification(productId: string) {
//   return (
//     await db.downloadVerification.create({
//       data: {
//         productId,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
//       },
//     })
//   ).id;
// }
