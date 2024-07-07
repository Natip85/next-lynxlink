"use client";
import { createPaymentIntent } from "@/actions/createPaymentIntent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDiscountCode, formatPrice } from "@/lib/formatters";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { useCart } from "@/hooks/use-cart";

type CheckoutFormProps = {
  products: {
    id: string;
    images: any;
    name: string;
    priceInCents: number;
    description: string;
  }[];
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ products }: CheckoutFormProps) {
  const prodIds = products.map((prod) => {
    return prod.id;
  });

  const purchaseTotal = products.reduce(
    (total, product) => total + product.priceInCents,
    0
  );
  return (
    <MaxWidthWrapper className="p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 my-8">
        {products.map((prod) => (
          <div key={prod.id}>
            <div className="aspect-video flex-shrink-0 w-1/2 relative">
              <Image
                src={prod.images[0].url}
                fill
                alt={prod.images[0].name}
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-lg">{formatPrice(purchaseTotal / 100)}</div>
              <h1 className="text-2xl font-bold">{prod.name}</h1>
              <div className="line-clamp-3 text-muted-foreground">
                {prod.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Elements
        options={{ amount: purchaseTotal, mode: "payment", currency: "usd" }}
        stripe={stripePromise}
      >
        <Form priceInCents={purchaseTotal} productIds={prodIds} />
      </Elements>
    </MaxWidthWrapper>
  );
}

function Form({
  priceInCents,
  productIds,
  discountCode,
}: {
  priceInCents: number;
  productIds: string[];
  discountCode?: {
    id: string;
    discountAmount: number;
    discountType: string;
  };
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();
  const discountCodeRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const coupon = searchParams.get("coupon");
  const { handleClearCart } = useCart();
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const formSubmit = await elements.submit();
    if (formSubmit.error != null) {
      setErrorMessage(formSubmit.error.message);
      setIsLoading(false);
      return;
    }

    const paymentIntent = await createPaymentIntent(
      email,
      productIds
      //   discountCode?.id
    );
    if (paymentIntent.error != null) {
      setErrorMessage(paymentIntent.error);
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        clientSecret: paymentIntent.clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    handleClearCart();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive">
            {errorMessage && <div>{errorMessage}</div>}
            {coupon != null && discountCode == null && (
              <div>Invalid discount code</div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="discountCode">Coupon</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="discountCode"
                type="text"
                name="discountCode"
                className="max-w-xs w-full"
                defaultValue={coupon || ""}
                ref={discountCodeRef}
              />
              <Button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("coupon", discountCodeRef.current?.value || "");
                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                Apply
              </Button>
              {discountCode != null && (
                <div className="text-muted-foreground">
                  {formatDiscountCode(discountCode)} discount
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatPrice(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
