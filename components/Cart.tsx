"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { formatPrice } from "@/lib/formatters";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import CartItem from "./CartItem";

export default function Cart() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { cartTotalQty, cartTotalAmount, cartProducts } = useCart();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="size-6 flex-shrink-0 group-hover:text-primary/60"
        />
        <span className="ml-2 text-sm font-medium group-hover:text-primary/60">
          {isMounted ? cartTotalQty : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({cartTotalQty})</SheetTitle>
        </SheetHeader>
        {cartTotalQty > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {cartProducts &&
                  cartProducts.map((product) => (
                    <CartItem product={product} key={product.id} />
                  ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(2)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(2 + cartTotalAmount / 100)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/empty-side-cart.png"
                fill
                alt="empty shopping cart"
              />
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
