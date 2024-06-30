import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";
import { formatNumber, formatPrice } from "@/lib/formatters";
import { Prisma, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
async function getSalesData() {
  // createdAfter: Date | null,
  // createdBefore: Date | null
  const createdAtQuery: Prisma.OrderWhereInput["createdAt"] = {};
  // if (createdAfter) createdAtQuery.gte = createdAfter;
  // if (createdBefore) createdAtQuery.lte = createdBefore;

  const [data] = await Promise.all([
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
    }),
    // db.order.findMany({
    //   select: { createdAt: true, pricePaidInCents: true },
    //   where: { createdAt: createdAtQuery },
    //   orderBy: { createdAt: "asc" },
    // }),
  ]);

  // const { array, format } = getChartDateArray(
  //   createdAfter || startOfDay(chartData[0].createdAt),
  //   createdBefore || new Date()
  // );

  // const dayArray = array.map((date) => {
  //   return {
  //     date: format(date),
  //     totalSales: 0,
  //   };
  // });

  return {
    // chartData: chartData.reduce((data, order) => {
    //   const formattedDate = format(order.createdAt);
    //   const entry = dayArray.find((day) => day.date === formattedDate);
    //   if (entry == null) return data;
    //   entry.totalSales += order.pricePaidInCents / 100;
    //   return data;
    // }, dayArray),
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}
async function getUserData() {
  // createdAfter: Date | null,
  // createdBefore: Date | null
  const createdAtQuery: Prisma.UserWhereInput["createdAt"] = {};
  // if (createdAfter) createdAtQuery.gte = createdAfter;
  // if (createdBefore) createdAtQuery.lte = createdBefore;

  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
    // db.user.findMany({
    //   select: { createdAt: true },
    //   where: { createdAt: createdAtQuery },
    //   orderBy: { createdAt: "asc" },
    // }),
  ]);

  // const { array, format } = getChartDateArray(
  //   createdAfter || startOfDay(chartData[0].createdAt),
  //   createdBefore || new Date()
  // );

  // const dayArray = array.map((date) => {
  //   return {
  //     date: format(date),
  //     totalUsers: 0,
  //   };
  // });

  return {
    // chartData: chartData.reduce((data, user) => {
    //   const formattedDate = format(user.createdAt);
    //   const entry = dayArray.find((day) => day.date === formattedDate);
    //   if (entry == null) return data;
    //   entry.totalUsers += 1;
    //   return data;
    // }, dayArray),
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}
async function getProductData() {
  // createdAfter: Date | null,
  // createdBefore: Date | null
  const createdAtQuery: Prisma.OrderWhereInput["createdAt"] = {};
  // if (createdAfter) createdAtQuery.gte = createdAfter;
  // if (createdBefore) createdAtQuery.lte = createdBefore;

  const [activeCount, inactiveCount, chartData] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
    db.product.findMany({
      select: {
        name: true,
        orders: {
          select: { pricePaidInCents: true },
          where: { createdAt: createdAtQuery },
        },
      },
    }),
  ]);

  return {
    chartData: chartData
      .map((product) => {
        return {
          name: product.name,
          revenue: product.orders.reduce((sum, order) => {
            return sum + order.pricePaidInCents / 100;
          }, 0),
        };
      })
      .filter((product) => product.revenue > 0),
    activeCount,
    inactiveCount,
  };
}
export default async function AdminPage() {
  const user = await currentUser();
  if (user?.role !== UserRole.ADMIN) {
    return redirect("/");
  }

  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
    // revenueByProductRangeOption.startDate,
    // revenueByProductRangeOption.endDate
    // newCustomersRangeOption.startDate,
    // newCustomersRangeOption.endDate
    // totalSalesRangeOption.startDate,
    // totalSalesRangeOption.endDate
  ]);
  return (
    <MaxWidthWrapper className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Sales"
          subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
          body={formatPrice(salesData.amount)}
        />
        <DashboardCard
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
        />
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
