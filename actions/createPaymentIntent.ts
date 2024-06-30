"use server";

import db from "@/db/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createPaymentIntent(
  email: string,
  productIds: string[]
  //   discountCodeId?: string
) {
  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
  if (products == null) return { error: "Unexpected Error" };

  //   const discountCode =
  //     discountCodeId == null
  //       ? null
  //       : await db.discountCode.findUnique({
  //           where: { id: discountCodeId, ...usableDiscountCodeWhere(product.id) },
  //         });

  //   if (discountCode == null && discountCodeId != null) {
  //     return { error: "Coupon has expired" };
  //   }

  //   const existingOrder = await db.order.findFirst({
  //     where: { user: { email }, productId },
  //     select: { id: true },
  //   });

  //   if (existingOrder != null) {
  //     return {
  //       error:
  //         "You have already purchased this product. Try downloading it from the My Orders page",
  //     };
  //   }

  //   const amount =
  //     discountCode == null
  //       ? product.priceInCents
  //       : getDiscountedAmount(discountCode, product.priceInCents);
  const purchaseTotal = products.reduce(
    (total, product) => total + product.priceInCents,
    0
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: purchaseTotal,
    currency: "USD",
    metadata: {
      productId: productIds.join(","),
      //   discountCodeId: discountCode?.id || null,
    },
  });

  if (paymentIntent.client_secret == null) {
    return { error: "Unknown error" };
  }

  return { clientSecret: paymentIntent.client_secret };
}
