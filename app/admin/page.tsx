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
import { formatDate, formatNumber, formatPrice } from "@/lib/formatters";
import { Prisma, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfWeek,
  interval,
  max,
  min,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { RANGE_OPTIONS, getRangeOption } from "@/lib/rangeOptions";
import { ChartCard } from "@/components/charts/ChartCard";
import { OrdersByDayChart } from "@/components/charts/OrderByDay";
async function getSalesData(
  createdAfter: Date | null,
  createdBefore: Date | null
) {
  const createdAtQuery: Prisma.OrderWhereInput["createdAt"] = {};
  if (createdAfter) createdAtQuery.gte = createdAfter;
  if (createdBefore) createdAtQuery.lte = createdBefore;

  const [data, chartData] = await Promise.all([
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
    }),
    db.order.findMany({
      select: { createdAt: true, pricePaidInCents: true },
      where: { createdAt: createdAtQuery },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const { array, format } = getChartDateArray(
    createdAfter || startOfDay(chartData[0].createdAt),
    createdBefore || new Date()
  );

  const dayArray = array.map((date) => {
    return {
      date: format(date),
      totalSales: 0,
    };
  });

  return {
    chartData: chartData.reduce((data, order) => {
      const formattedDate = format(order.createdAt);
      const entry = dayArray.find((day) => day.date === formattedDate);
      if (entry == null) return data;
      entry.totalSales += order.pricePaidInCents / 100;
      return data;
    }, dayArray),
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
export default async function AdminPage({
  searchParams: { totalSalesRange, totalSalesRangeFrom, totalSalesRangeTo },
}: {
  searchParams: {
    totalSalesRange?: string;
    totalSalesRangeFrom?: string;
    totalSalesRangeTo?: string;
  };
}) {
  const user = await currentUser();
  if (user?.role !== UserRole.ADMIN) {
    return redirect("/");
  }
  const totalSalesRangeOption =
    getRangeOption(totalSalesRange, totalSalesRangeFrom, totalSalesRangeTo) ||
    RANGE_OPTIONS.last_7_days;
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(
      totalSalesRangeOption.startDate,
      totalSalesRangeOption.endDate
    ),
    getUserData(),
    getProductData(),
    // revenueByProductRangeOption.startDate,
    // revenueByProductRangeOption.endDate
    // newCustomersRangeOption.startDate,
    // newCustomersRangeOption.endDate
  ]);
  return (
    <MaxWidthWrapper className="flex flex-col gap-3 my-10">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <ChartCard
          title="Total Sales"
          queryKey="totalSalesRange"
          selectedRangeLabel={totalSalesRangeOption.label}
        >
          <OrdersByDayChart data={salesData.chartData} />
        </ChartCard>
        {/* <ChartCard
          title="New Customers"
          queryKey="newCustomersRange"
          selectedRangeLabel={newCustomersRangeOption.label}
        >
          <UsersByDayChart data={userData.chartData} />
        </ChartCard>
        <ChartCard
          title="Revenue By Product"
          queryKey="revenueByProductRange"
          selectedRangeLabel={revenueByProductRangeOption.label}
        >
          <RevenueByProductChart data={productData.chartData} />
        </ChartCard> */}
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
function getChartDateArray(startDate: Date, endDate: Date = new Date()) {
  const days = differenceInDays(endDate, startDate);
  if (days < 30) {
    return {
      array: eachDayOfInterval(interval(startDate, endDate)),
      format: formatDate,
    };
  }

  const weeks = differenceInWeeks(endDate, startDate);
  if (weeks < 30) {
    return {
      array: eachWeekOfInterval(interval(startDate, endDate)),
      format: (date: Date) => {
        const start = max([startOfWeek(date), startDate]);
        const end = min([endOfWeek(date), endDate]);

        return `${formatDate(start)} - ${formatDate(end)}`;
      },
    };
  }

  const months = differenceInMonths(endDate, startDate);
  if (months < 30) {
    return {
      array: eachMonthOfInterval(interval(startDate, endDate)),
      format: new Intl.DateTimeFormat("en", { month: "long", year: "numeric" })
        .format,
    };
  }

  return {
    array: eachYearOfInterval(interval(startDate, endDate)),
    format: new Intl.DateTimeFormat("en", { year: "numeric" }).format,
  };
}
