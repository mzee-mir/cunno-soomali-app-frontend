import StatCard from "@/components/dashboardStat";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/api/dashboard";
import DashboardLineChart from "@/components/dashboardLineChart";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    getDashboardData(period).then(setData);
  }, [period]);

  return (
    <div className="p-6 space-y-6">
      {/* Time period selector */}
      <div className="flex gap-2">
        {["month", "week", "day"].map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "outline"}
            onClick={() => setPeriod(p)}
          >
            Last {p === "month" ? "30 Days" : p === "week" ? "7 Days" : "24 Hours"}
          </Button>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value={`£${(data?.totalRevenue / 100).toFixed(2)}`}
          change="+12.1%"
          description="Trending up this month"
        />
        <StatCard
          title="Regular Customers"
          value={data?.regularCustomers || 0}
          change="-5.2%"
          description="Returning users"
          changePositive={false}
        />
        <StatCard
          title="Total Orders"
          value={data?.totalOrders || 0}
          change="+7.3%"
          description="Compared to last period"
        />
        <StatCard
          title="Order Completion"
          value={`${data?.orderCompletionRate?.toFixed(1)}%`}
          change="+4.4%"
          description="Efficient fulfillment"
        />
        <StatCard
          title="Growth Rate"
          value={`${data?.growthRate?.toFixed(1)}%`}
          change="+2.8%"
          description="Steady performance"
        />
      </div>

      {/* Chart */}
      <DashboardLineChart period={period} />
    </div>
  );
};

export default Dashboard;
