import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { formatNumber, formatPrice } from "@/lib/formatters";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await currentUser();
  if (user?.role !== UserRole.ADMIN) {
    return redirect("/");
  }
  return (
    <MaxWidthWrapper className="flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Sales"
          subtitle={`${formatNumber(500)} Orders`}
          body={formatPrice(400)}
        />
        {/* <DashboardCard
          title="Customers"
          subtitle={`${formatPrice(
            userData.averageValuePerUser
          )} Average Value`}
          body={formatNumber(userData.userCount)}
        />
        <DashboardCard
          title="Active Products"
          subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
          body={formatNumber(productData.activeCount)}
        /> */}
      </div>
    </MaxWidthWrapper>
  );
}
type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
