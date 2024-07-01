import DiscountCodeForm from "@/components/forms/DiscountCodeForm";
import db from "@/db/db";

export default async function NewDiscountCodePage() {
  const products = await db.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <DiscountCodeForm products={products} />
    </>
  );
}
