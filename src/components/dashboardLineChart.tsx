import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Generate sample time series data based on dashboard metrics
const generateChartData = (dashboardData: {
  totalRevenue: number;
  totalOrders: number;
}) => {
  const daysInMonth = 30;
  const data = [];
  
  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (daysInMonth - i - 1));
    
    // Generate values based on dashboard data with some random variation
    const desktopValue = Math.round(
      (dashboardData.totalRevenue / daysInMonth) * (0.8 + Math.random() * 0.4)
    );
    const mobileValue = Math.round(
      (dashboardData.totalOrders / daysInMonth) * (0.8 + Math.random() * 0.4)
    );
    
    data.push({
      date: date.toISOString().split('T')[0],
      desktop: desktopValue,
      mobile: mobileValue,
      revenue: Math.round(dashboardData.totalRevenue / daysInMonth),
      orders: Math.round(dashboardData.totalOrders / daysInMonth),
    });
  }
  
  return data;
};

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DashboardLineChart() {
  const { data: dashboardData } = useSelector((state: RootState) => state.dashboard);
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("desktop");
  
  // Generate chart data based on dashboard metrics
  const chartData = React.useMemo(() => {
    if (!dashboardData) return [];
    return generateChartData(dashboardData);
  }, [dashboardData]);

  const total = React.useMemo(() => {
    if (!dashboardData) return { desktop: 0, mobile: 0 };
    return {
      desktop: dashboardData.totalRevenue,
      mobile: dashboardData.totalOrders,
    };
  }, [dashboardData]);

  if (!dashboardData) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Showing revenue and orders data from dashboard
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {key === 'desktop' 
                    ? `$${total.desktop.toLocaleString()}`
                    : total.mobile.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar 
              dataKey={activeChart} 
              fill={activeChart === 'desktop' ? '#8884d8' : '#82ca9d'} 
              name={activeChart === 'desktop' ? 'Revenue' : 'Orders'}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}