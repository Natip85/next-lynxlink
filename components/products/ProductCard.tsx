import { formatPrice } from "@/lib/formatters";
import { Product } from "@prisma/client";
import { ImageType } from "../forms/AddProductForm";

export default function ProductCard({ product }: { product: Product }) {
  const productImgs = product.images as ImageType[];
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-secondary lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src={productImgs[0]?.url}
          alt="product image"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.color}</p>
        </div>

        <p className="text-sm font-medium text-gray-900">
          {formatPrice(product.priceInCents / 100)}
        </p>
      </div>
    </div>
  );
}
