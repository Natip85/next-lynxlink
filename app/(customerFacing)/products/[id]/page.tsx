import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductDetailsClient from "@/components/products/ProductDetailsClient";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ProductDetailsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  return (
    <MaxWidthWrapper>
      <ProductDetailsClient product={product} />
    </MaxWidthWrapper>
  );
}
