import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { AnalyticsService } from "@/lib/AnalyticalServices"; // Correct path if needed
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const AnalyticsDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    totalRevenue,
    totalOrders,
    dailyStats,
    restaurantStats,
  } = useAppSelector((state: RootState) => state.analytical);
  console.log('data', totalRevenue,
    totalOrders,
    dailyStats,
    restaurantStats,);
  
  useEffect(() => {
    AnalyticsService.fetchOverallStats(dispatch);
    AnalyticsService.fetchDailyStats(dispatch);
    AnalyticsService.fetchRestaurantStats(dispatch); // Note: currently fetching daily stats per restaurant instead of total
  }, [dispatch]);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Overall Stats</h2>
          <p>Total Orders: {totalOrders}</p>
          <p>Total Revenue: ${totalRevenue}</p>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 xl:col-span-3">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={(Array.isArray(dailyStats) ? dailyStats : []).map((stat) => ({
                ...stat,
                date: stat.date, // Already formatted string
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dailyRevenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 xl:col-span-3">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Stats per Restaurant</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={restaurantStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="totalOrders" fill="#82ca9d" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
