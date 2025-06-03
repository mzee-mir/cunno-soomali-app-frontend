// components/Dashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error, timePeriod } = useSelector((state: RootState) => state.dashboard);
    const { t } = useTranslation();
  
    useEffect(() => {
      dispatch(fetchDashboardData(timePeriod));
    }, [dispatch, timePeriod]);

    const handleTimePeriodChange = (event: SelectChangeEvent) => {
      dispatch(setTimePeriod(event.target.value));
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
        <Typography variant="h4">{t("dashboard.title")}</Typography>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>{t("dashboard.timePeriod")}</InputLabel>
          <Select
            value={timePeriod}
            onChange={handleTimePeriodChange}
            label="Time Period"
          >
            <MenuItem value="day">{t("dashboard.today")}</MenuItem>
            <MenuItem value="week">{t("dashboard.thisWeek")}</MenuItem>
            <MenuItem value="month">{t("dashboard.thisMonth")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <LinearProgress />}

      <Grid container spacing={3}>
        {/* Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="bg-accent text-foreground">
              <Typography  gutterBottom>
                {t("dashboard.totalRevenue")}
              </Typography>
              <Typography variant="h5">
                ${data?.totalRevenue?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="body2" >
                {timePeriod === 'day' ? t("dashboard.today") : timePeriod === 'week' ? t("dashboard.thisWeek") : t("dashboard.thisMonth")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="bg-accent text-foreground">
              <Typography  gutterBottom>
                {t("dashboard.totalOrders")}
              </Typography>
              <Typography variant="h5">
                {data?.totalOrders || 0}
              </Typography>
              <Typography variant="body2" >
                {timePeriod === 'day' ? t("dashboard.today") : timePeriod === 'week' ? t("dashboard.thisWeek") : t("dashboard.thisMonth")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Customers Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
          <CardContent className="bg-accent text-foreground">
              <Typography  gutterBottom>
                {t("dashboard.regularCustomers")}
              </Typography>
              <Typography variant="h5">
                {data?.regularCustomers || 0}
              </Typography>
              <Typography variant="body2" >
                {t("dashboard.orderedMore")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Rate Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
          <CardContent className="bg-accent text-foreground">
              <Typography gutterBottom>
                {t("dashboard.orderCompletion")}
              </Typography>
              <Typography variant="h5">
                {data?.orderCompletionRate?.toFixed(1) || '0'}%
              </Typography>
              <Typography variant="body2" >
                {t("dashboard.successfullyDelivered")}
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
          <CardContent className="bg-accent text-foreground">
              <Typography variant="h6" gutterBottom>
                {t("dashboard.growthRate")}
              </Typography>
              <Typography variant="h3" color={data?.growthRate && data.growthRate >= 0 ? 'success.main' : 'error.main'}>
                {data?.growthRate?.toFixed(1) || '0'}%
              </Typography>
              <Typography variant="body2">
                {t("dashboard.comparedToPrevious")} {timePeriod === 'day' ? t("dashboard.day") : timePeriod === 'week' ? t("dashboard.week") : t("dashboard.month")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders Section - You can connect this to your orderService */}
        <Grid item xs={12} md={6}>
          <Card>
          <CardContent className="bg-accent text-foreground">
              <Typography variant="h6" gutterBottom>
                {t("dashboard.quickActions")}
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