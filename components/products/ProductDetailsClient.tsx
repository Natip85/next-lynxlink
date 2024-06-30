"use client";
import { Product } from "@prisma/client";
import MasonryImageGrid from "../MasonryImageGrid";
import ImageSlider from "../ImageSlider";
import { formatPrice } from "@/lib/formatters";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { CartProductType, useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { CheckCircle, Plus, PlusCircle, ShoppingBasket } from "lucide-react";
import Link from "next/link";
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
  const [isProductInCart, setIsProductInCart] = useState(false);
  const BREADCRUMBS = [
    {
      id: 1,
      name: "Home",
      href: "/",
    },
    {
      id: 2,
      name: "Products",
      href: "/products",
    },
    {
      id: 3,
      name: "Product details",
      href: `/products/${product.id}`,
    },
  ];
  useEffect(() => {
    setIsProductInCart(false);
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );
      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts]);
  return (
    <div className="p-5">
      <div className="flex flex-col-reverse gap-5 md:flex-col my-10">
        <ol className="flex items-center space-x-2">
          {BREADCRUMBS.map((breadcrumb, i) => (
            <li key={breadcrumb.href}>
              <div className="flex items-center text-sm">
                <Link
                  href={breadcrumb.href}
                  className="font-medium text-sm text-muted-foreground hover:text-primary"
                >
                  {breadcrumb.name}
                </Link>
                {i !== BREADCRUMBS.length - 1 ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 flex-shrink-0 text-muted-foreground"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
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
              disabled={isProductInCart}
              onClick={() => handleAddProductToCart(cartProduct)}
              className="w-full "
            >
              <div className="relative flex items-center gap-3">
                {isProductInCart ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle />
                    Added to cart
                  </div>
                ) : (
                  <>
                    <ShoppingBasket />
                    <PlusCircle className="size-4 absolute -top-1 -left-3" />{" "}
                    Add to cart
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
