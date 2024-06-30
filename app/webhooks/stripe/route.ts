import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { EmailTemplate } from "@/email/PurchaseReceipt";

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

    const productIdsString = charge.metadata.productId;

    if (!productIdsString) {
      return new NextResponse("Bad Request: No productIds in metadata", {
        status: 400,
      });
    }

    const productIds = productIdsString.split(",");

    const email = charge.billing_details.email;

    // const pricePaidInCents = charge.amount;

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

    if (!products.length) {
      return new NextResponse("Bad Request: Products not found", {
        status: 400,
      });
    }
    const totalPricePaidInCents = products.reduce(
      (total, product) => total + product.priceInCents,
      0
    );

    const user = await db.user.upsert({
      where: { email },
      create: {
        email,
        orders: {
          create: {
            pricePaidInCents: totalPricePaidInCents,
            products: {
              connect: products.map((product) => ({ id: product.id })),
            },
          },
        },
      },
      update: {
        email,
        orders: {
          create: {
            pricePaidInCents: totalPricePaidInCents,
            products: {
              connect: products.map((product) => ({ id: product.id })),
            },
          },
        },
      },
      select: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { user: true },
        },
      },
    });

    try {
      const { data, error } = await resend.emails.send({
        text: "",
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: `${user.orders[0].user.name}, Thank you for your purchase`,
        react: EmailTemplate({
          orderProducts: products,
          currentOrder: user.orders[0],
        }),
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  return new NextResponse("Unhandled event type", { status: 400 });
}
