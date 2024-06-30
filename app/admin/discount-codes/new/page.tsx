import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import DiscountCodeForm from "@/components/forms/DiscountCodeForm";
import db from "@/db/db";

export default async function NewDiscountCodePage() {
  const products = await db.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <MaxWidthWrapper className="my-10">
      <h2 className="text-4xl font-bold">Add Coupon</h2>
      <DiscountCodeForm products={products} />
    </MaxWidthWrapper>
  );
}
