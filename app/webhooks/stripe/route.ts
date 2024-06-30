import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
// import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    console.log("CHARGE>>>", charge);

    const productIdsString = charge.metadata.productId;
    console.log("productIdString>>>>", productIdsString);

    if (!productIdsString) {
      return new NextResponse("Bad Request: No productIds in metadata", {
        status: 400,
      });
    }

    const productIds = productIdsString.split(",");
    console.log("productIds>>>>", productIds);

    const email = charge.billing_details.email;
    console.log("EMAIL>>>>>", email);

    const pricePaidInCents = charge.amount;

    if (!productIds.length || !email) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    console.log("PRODUCTS>>>>", products);

    if (!products.length) {
      return new NextResponse("Bad Request: Products not found", {
        status: 400,
      });
    }
    const userFields = {
      email,
      orders: {
        createMany: {
          data: products.map((product) => ({
            productId: product.id,
            pricePaidInCents: product.priceInCents,
          })),
        },
      },
    };

    const user = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: {
        orders: { orderBy: { createdAt: "desc" }, take: products.length },
      },
    });

    // const downloadVerification = await db.downloadVerification.create({
    //   data: {
    //     productId,
    //     expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    //   },
    // });

    // await resend.emails.send({
    //   from: `Support <${process.env.SENDER_EMAIL}>`,
    //   to: email,
    //   subject: "Order Confirmation",
    //   react: (
    //     <PurchaseReceiptEmail
    //       order={order}
    //       product={product}
    //       downloadVerificationId={downloadVerification.id}
    //     />
    //   ),
    // });
    return new NextResponse(JSON.stringify(user), { status: 200 });
  }

  return new NextResponse("Unhandled event type", { status: 400 });
}
