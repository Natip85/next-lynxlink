import { CheckoutForm } from "@/components/forms/CheckoutForm";
import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
// import { CheckoutForm } from "./_components/CheckoutForm";
// import { usableDiscountCodeWhere } from "@/lib/discountCodeHelper";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: // searchParams: { coupon },
{
  params: { id: string };
  // searchParams: { coupon?: string };
}) {
  console.log("PRODIDs>>>>>", id);
  const decodedId = decodeURIComponent(id);
  console.log("DECODEDID>>>", decodedId);

  // Split the decoded id parameter to get the product IDs
  const productIds = decodedId.split("+");
  console.log("GOTTEN IDS>>>", productIds);

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
  if (productIds == null) return notFound();
  console.log("DISPROD>>>", products);

  // const discountCode =
  //   coupon == null ? undefined : await getDiscountCode(coupon, product.id);

  return (
    // <div>check out form here</div>
    <CheckoutForm products={products} />
  );
}

// function getDiscountCode(coupon: string, productId: string) {
//   return db.discountCode.findUnique({
//     select: { id: true, discountAmount: true, discountType: true },
//     where: { ...usableDiscountCodeWhere, code: coupon },
//   });
// }
