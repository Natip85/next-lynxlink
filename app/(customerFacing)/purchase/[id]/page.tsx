import { CheckoutForm } from "@/components/forms/CheckoutForm";
import db from "@/db/db";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
// import { usableDiscountCodeWhere } from "@/lib/discountCodeHelper";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: // searchParams: { coupon },
{
  params: { id: string };
  // searchParams: { coupon?: string };
}) {
  if (!id) {
    // If no id is present, redirect to the desired page
    return redirect("/cart");
  }
  const decodedId = decodeURIComponent(id);

  const productIds = decodedId.split("+");

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
  //TODO: chnage the below notfound() into a nicer ui or other logic
  if (productIds == null) return redirect("/cart");

  // const discountCode =
  //   coupon == null ? undefined : await getDiscountCode(coupon, product.id);

  return <CheckoutForm products={products} />;
}

// function getDiscountCode(coupon: string, productId: string) {
//   return db.discountCode.findUnique({
//     select: { id: true, discountAmount: true, discountType: true },
//     where: { ...usableDiscountCodeWhere, code: coupon },
//   });
// }
