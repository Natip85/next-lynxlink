"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { cartProducts, handleRemoveProductFromCart, cartTotalAmount } =
    useCart();
  const [isLoading, seIsLoading] = useState<boolean>(false);
  if (!cartProducts) {
    //TODO: make this nocer
    return <div>no prods</div>;
  }
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const productIdsString = cartProducts.map((product) => product.id).join("+");

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-secondary p-12":
                isMounted && cartProducts && cartProducts.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && cartProducts && cartProducts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/empty-cart.png"
                    fill
                    loading="eager"
                    alt="empty shopping cart"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-secondary border-b border-t border-secondary":
                  isMounted && cartProducts && cartProducts.length > 0,
              })}
            >
              {isMounted &&
                cartProducts &&
                cartProducts.map((product) => {
                  //   const label = PRODUCT_CATEGORIES.find(
                  //     (c) => c.value === product.category
                  //   )?.label;

                  return (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          <Image
                            fill
                            loading="lazy"
                            src={product.image}
                            alt="product image"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/product/${product.id}`}
                                  className="font-medium text-primary hover:text-gray-950"
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">
                                Category: cat goes here
                              </p>
                            </div>

                            <p className="mt-1 text-sm font-medium text-primary">
                              {formatPrice(product.priceInCents / 100)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove product"
                                onClick={() =>
                                  handleRemoveProductFromCart(product)
                                }
                                variant="ghost"
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-primary">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />

                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-secondary px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-primary">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary">Subtotal</p>
                <p className="text-sm font-medium text-primary">
                  {isMounted ? (
                    formatPrice(cartTotalAmount / 100)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-secondary pt-4">
                <div className="flex items-center text-sm text-primary">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-primary">
                  {isMounted ? (
                    formatPrice(2)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-secondary pt-4">
                <div className="text-base font-medium text-primary">
                  Order Total
                </div>
                <div className="text-base font-medium text-primary">
                  {isMounted ? (
                    formatPrice(cartTotalAmount / 100 + 2)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                asChild
                disabled={
                  (cartProducts && cartProducts.length === 0) || isLoading
                }
                onClick={() => {}}
                className="w-full"
                size="lg"
              >
                <Link href={`/purchase/${productIdsString}`}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  ) : null}
                  Checkout
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
