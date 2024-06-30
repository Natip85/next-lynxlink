import { formatPrice } from "@/lib/formatters";
import { Prisma, Product } from "@prisma/client";
import { ImageType } from "../forms/AddProductForm";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ImageSlider from "../ImageSlider";
type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const validUrls = product.images
    .map(({ url }: any) => (typeof url === "string" ? url : url))
    .filter(Boolean) as string[];

  return (
    <Card className="flex flex-col gap-4 justify-between border-none shadow-none">
      <Link
        className={cn(" h-full w-full cursor-pointer")}
        href={`/products/${product.id}`}
      >
        <div className="flex flex-col w-full ">
          <ImageSlider urls={validUrls} />
        </div>
        <CardHeader className="p-0">
          <CardTitle className="text-lg md:text-xl text-center">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <p className="line-clamp-2 text-sm text-center px-4">
            {product.description}...
          </p>
          {/* <p className="text-xl md:text-2xl text-center">
            {formatPrice(product.priceInCents / 100)}
          </p> */}
          <p className="text-center ">Size: {product.size}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
