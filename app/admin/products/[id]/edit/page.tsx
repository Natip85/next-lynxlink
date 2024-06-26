import AddProductForm from "@/components/forms/AddProductForm";
import db from "@/db/db";

export default async function EditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  return <AddProductForm product={product} />;
}
