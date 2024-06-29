import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductDetailsClient from "@/components/products/ProductDetailsClient";
import db from "@/db/db";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  return (
    <MaxWidthWrapper>
      <ProductDetailsClient product={product} />
    </MaxWidthWrapper>
  );
}
