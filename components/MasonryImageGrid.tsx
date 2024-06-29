import { Product } from "@prisma/client";
import Image from "next/image";
type MasonryImageGridType = {
  product: Product;
};
export default function MasonryImageGrid({ product }: MasonryImageGridType) {
  return (
    <div>
      <div className="hidden md:grid grid-cols-4 gap-4 h-[65vh] rounded-lg overflow-hidden">
        {product.images.map((image: any, index) => (
          <div
            key={index}
            className={`relative bg-secondary p-4 flex items-center justify-center ${
              index === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <Image
              loading="lazy"
              src={image.url}
              alt={`Image ${image.name}`}
              fill
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
