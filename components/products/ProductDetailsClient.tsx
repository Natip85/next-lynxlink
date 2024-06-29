"use client";
import { Product } from "@prisma/client";
import MasonryImageGrid from "../MasonryImageGrid";
import ImageSlider from "../ImageSlider";
import { formatPrice } from "@/lib/formatters";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { CartProductType, useCart } from "@/hooks/use-cart";
import { useState } from "react";
type ProductDetailsClientType = {
  product: Product;
};
export default function ProductDetailsClient({
  product,
}: ProductDetailsClientType) {
  const validUrls = product.images
    .map(({ url }: any) => (typeof url === "string" ? url : url))
    .filter(Boolean) as string[];
  const { cartProducts, handleAddProductToCart } = useCart();
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    description: product.description,
    image: validUrls[0],
    quantity: 1,
    priceInCents: product.priceInCents,
    name: product.name,
    color: product.color,
    size: product.size,
  });
  console.log("CARTPRODUCT>>>>", cartProduct);
  console.log("CARTPRODUCTSSS>>>>>", cartProducts);

  return (
    <div className="p-5">
      <div className="flex flex-col-reverse gap-5 md:flex-col my-10">
        <div className="flex items-center justify-between gap-3 w-fit">
          <h2 className="text-xl md:text-3xl font-semibold px-3">
            {product.name}
          </h2>
          <Separator orientation="vertical" className="h-8 bg-primary/70" />
          <span className="text-2xl">
            {formatPrice(product.priceInCents / 100)}
          </span>
        </div>
        <MasonryImageGrid product={product} />
        <div className="block md:hidden">
          <ImageSlider urls={validUrls} />
        </div>
      </div>

      <div className="flex flex-col gap-5 md:flex-row p-3">
        <div className="flex-1">
          <h2 className="text-xl md:text-3xl mb-3">About the artwork:</h2>
          <span className="text-sm md:text-base">{product.description}</span>
        </div>
        <div className="w-full md:w-1/3 border shadow-md p-3 rounded-lg flex flex-col  gap-5">
          <h3 className="text-3xl font-semibold">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span>Product dimensions:</span> <span>{product.size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Price:</span>
            <span> {formatPrice(product.priceInCents / 100)}</span>
          </div>

          <div className="w-full">
            <Button
              onClick={() => handleAddProductToCart(cartProduct)}
              className="w-full"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
