// components/Dashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardService } from '@/lib/dashboardServices';
import { AppDispatch, RootState } from '@/store/store';
import { 
  Card, 
  CardContent, 
  Typography,  
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Box,
  LinearProgress,
  Grid
} from '@mui/material';
import { fetchDashboardData, setTimePeriod } from '@/store/dashboardSlice';
import { DashboardLineChart } from './dashboardLineChart';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error, timePeriod } = useSelector((state: RootState) => state.dashboard);
  
    useEffect(() => {
      dispatch(fetchDashboardData(timePeriod));
    }, [dispatch, timePeriod]);

  const handleTimePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setTimePeriod(event.target.value as string));
  };

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Sample data for the chart - replace with your actual data structure
  const chartData = [
    { name: 'Week 1', revenue: data?.totalRevenue ? data.totalRevenue * 0.2 : 0, orders: data?.totalOrders ? data.totalOrders * 0.2 : 0 },
    { name: 'Week 2', revenue: data?.totalRevenue ? data.totalRevenue * 0.4 : 0, orders: data?.totalOrders ? data.totalOrders * 0.4 : 0 },
    { name: 'Week 3', revenue: data?.totalRevenue ? data.totalRevenue * 0.6 : 0, orders: data?.totalOrders ? data.totalOrders * 0.6 : 0 },
    { name: 'Week 4', revenue: data?.totalRevenue || 0, orders: data?.totalOrders || 0 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timePeriod}
            onChange={handleTimePeriodChange}
            label="Time Period"
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <LinearProgress />}

      <Grid container spacing={3}>
        {/* Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h5">
                ${data?.totalRevenue?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {timePeriod === 'day' ? 'Today' : timePeriod === 'week' ? 'This Week' : 'This Month'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h5">
                {data?.totalOrders || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {timePeriod === 'day' ? 'Today' : timePeriod === 'week' ? 'This Week' : 'This Month'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Customers Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Regular Customers
              </Typography>
              <Typography variant="h5">
                {data?.regularCustomers || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ordered more than 5 times
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Rate Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Order Completion
              </Typography>
              <Typography variant="h5">
                {data?.orderCompletionRate?.toFixed(1) || '0'}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Successfully delivered
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12}>
            <DashboardLineChart />
        </Grid>

        {/* Growth Rate Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Growth Rate
              </Typography>
              <Typography variant="h3" color={data?.growthRate && data.growthRate >= 0 ? 'success.main' : 'error.main'}>
                {data?.growthRate?.toFixed(1) || '0'}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Compared to previous {timePeriod === 'day' ? 'day' : timePeriod === 'week' ? 'week' : 'month'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders Section - You can connect this to your orderService */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              {/* Add quick action buttons or links here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;