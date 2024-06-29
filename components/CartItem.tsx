"use client";

import { CartProductType, useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatters";
import { Product } from "@prisma/client";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

export default function CartItem({ product }: { product: CartProductType }) {
  const { handleRemoveProductFromCart } = useCart();

  //   const label = PRODUCT_CATEGORIES.find(
  //     ({ value }) => value === product.category
  //   )?.label;

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {typeof product.image === "string" ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {product.size}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => handleRemoveProductFromCart(product)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.priceInCents / 100)}
          </span>
        </div>
      </div>
    </div>
  );
}
