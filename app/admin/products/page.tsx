import { ImageType } from "@/components/forms/AddProductForm";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "@/components/products/DropdownMenuActionItems.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatNumber, formatPrice } from "@/lib/formatters";
import { Prisma } from "@prisma/client";
import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <>
      <h1 className="text-xl font-semibold md:text-4xl w-full md:max-w-4xl mx-auto my-10">
        Products
      </h1>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      images: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0) return <p>No products found</p>;

  return (
    <Table className="w-full md:max-w-4xl mx-auto rounded-lg">
      <TableHeader className="bg-secondary overflow-hidden">
        <TableRow className=" overflow-hidden">
          <TableHead className="w-0 rounded-l-lg">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0 rounded-r-lg">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const images = product.images as unknown as ImageType[];
          return (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailableForPurchase ? (
                  <>
                    <span className="sr-only">Available</span>
                    <CheckCircle2 />
                  </>
                ) : (
                  <>
                    <span className="sr-only">Unavailable</span>
                    <XCircle className="stroke-destructive" />
                  </>
                )}
              </TableCell>
              <TableCell className="flex items-center gap-3">
                <div className="relative aspect-video size-14">
                  <Image
                    src={images.length > 0 ? images[0].url : ""}
                    alt={product.name}
                    fill
                    sizes="30"
                  />
                </div>
                {product.name}
              </TableCell>
              <TableCell>{formatPrice(product.priceInCents / 100)}</TableCell>
              <TableCell>{formatNumber(product._count.orders)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a
                        download
                        href={`/admin/products/${product.id}/download`}
                      >
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem
                      id={product.id}
                      isAvailableForPurchase={product.isAvailableForPurchase}
                    />
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem
                      id={product.id}
                      images={product.images as ImageType[]}
                      // disabled={product._count.orders > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
