import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { RestaurantService } from '@/lib/restaurantServices';
import { 
  setCurrentRestaurant,
  setRestaurantLoading,
  setRestaurantError,
  clearRestaurantState
} from '@/store/restaurantSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restautant-form/ManageRestaurantForm";
import LoadinButton from "@/components/LoadinButton";
import MenuItems from '@/components/MenuItems';
import OrderItemCard from '@/components/OrderItemCards';
import OrderItemCardInfo from '@/components/orderItemCardInfo';
import AnalyticsDashboard from '@/components/Dashboard';
import Dashboard from '@/components/dashboardpages';
import { Order } from '@/store/OrderSlice';
import MobileManageRestaurantForm from "@/forms/manage-restautant-form/MobileManageRestaurantForm";
import MobileMenuItems from "@/components/MobileMenuItems";
import MobileOrdersList from "@/components/MobileOrdersList";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ManageRestaurantPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentRestaurant, loading, error } = useSelector(
    (state: RootState) => state.restaurant
  );
  const { orders } = useSelector((state: RootState) => state.order);
  const { _id: userId } = useSelector((state: RootState) => state.user);
  const { menuItems } = useSelector((state: RootState) => state.menuItem);
  const [activeTab, setActiveTab] = useState("manage-restaurant");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        dispatch(setRestaurantLoading(true));
        if (userId) {
          await RestaurantService.getUserRestaurants(dispatch, userId);
          toast.success(t("manageRestaurant.messages.success.loaded"));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t("manageRestaurant.messages.error.fetch");
        dispatch(setRestaurantError(errorMessage));
        toast.error(errorMessage);
      } finally {
        dispatch(setRestaurantLoading(false));
      }
    };

    fetchRestaurants();
  }, [dispatch, userId, t]);

  const handleSaveRestaurant = async (formData: any) => {
    try {
      dispatch(setRestaurantLoading(true));
      
      if (currentRestaurant?._id) {
        const updatedRestaurant = await RestaurantService.updateRestaurant(
          dispatch,
          currentRestaurant._id,
          formData
        );
        dispatch(setCurrentRestaurant(updatedRestaurant));
        toast.success("Restaurant updated successfully");
      } else {
        const newRestaurant = await RestaurantService.createRestaurant(
          dispatch,
          {
            ...formData,
            owner: userId
          }
        );
        dispatch(setCurrentRestaurant(newRestaurant));
        toast.success("Restaurant created successfully");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("manageRestaurant.messages.error.fetch");
      dispatch(setRestaurantError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setRestaurantLoading(false));
    }
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    try {
      dispatch(setRestaurantLoading(true));
      await RestaurantService.deleteRestaurant(dispatch, restaurantId);
      dispatch(clearRestaurantState());
      toast.success("Restaurant deleted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete restaurant";
      dispatch(setRestaurantError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setRestaurantLoading(false));
    }
  };

  return (
    <div className="container mx-auto p-2 md:p-4 bg-background text-foreground">
      {isMobile ? (
        <div className="mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="bg-accent w-full border-border">
              <SelectValue placeholder={t("manageRestaurant.mobileTabs.selectPrompt")} />
            </SelectTrigger>
            <SelectContent className="bg-accent border-border">
              {Object.entries({
                "orders": t("manageRestaurant.mobileTabs.orders"),
                "manage-restaurant": t("manageRestaurant.mobileTabs.manage"),
                "menuItems": t("manageRestaurant.mobileTabs.menu"),
                "analytical": t("manageRestaurant.mobileTabs.analytics"),
                "dashboard": t("manageRestaurant.mobileTabs.dashboard")
              }).map(([value, label]) => (
                <SelectItem 
                  key={value} 
                  value={value}
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-card border-border">
            {Object.entries({
              "orders": t("manageRestaurant.tabs.orders"),
              "manage-restaurant": t("manageRestaurant.tabs.manage"),
              "menuItems": t("manageRestaurant.tabs.menu"),
              "analytical": t("manageRestaurant.tabs.analytics"),
              "dashboard": t("manageRestaurant.tabs.dashboard")
            }).map(([value, label]) => (
              <TabsTrigger 
                key={value}
                value={value}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {loading && <LoadinButton />}
      {error && <p className="text-destructive text-center py-4">{error}</p>}

      {/* Mobile Content */}
      {isMobile ? (
        <div className="mt-2">
          {activeTab === "orders" && <MobileOrdersList orders={orders} />}
          {activeTab === "manage-restaurant" && (
            <div className="bg-card p-3 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-3">
                {currentRestaurant?._id 
                  ? t("manageRestaurant.formTitles.update")
                  : t("manageRestaurant.formTitles.create")}
              </h2>
              <MobileManageRestaurantForm />
            </div>
          )}
          {activeTab === "menuItems" && <MobileMenuItems />}
          {activeTab === "analytical" && <AnalyticsDashboard />}
          {activeTab === "dashboard" && <Dashboard />}
        </div>
      ) : (
        /* Desktop Content */
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="orders" className="bg-accent/10 rounded-lg border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-2xl font-bold">
                  {t("manageRestaurant.orders.active", { count: orders?.length })}
                </h2>
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {orders?.map((order) => (
                    <div 
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer transition-all ${
                        selectedOrder?._id === order._id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-accent/5 hover:ring-1 hover:ring-border'
                      }`}
                    >
                      <OrderItemCard order={order} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                {selectedOrder ? (
                  <OrderItemCardInfo order={selectedOrder} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-card rounded-lg p-8 border border-border">
                    <div className="text-center text-muted-foreground">
                      <h3 className="text-xl font-medium">
                        {t("manageRestaurant.orders.selectPrompt")}
                      </h3>
                      <p className="text-sm mt-2">
                        {t("manageRestaurant.orders.selectDescription")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage-restaurant">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-bold mb-4">
                {currentRestaurant?._id 
                  ? t("manageRestaurant.formTitles.update")
                  : t("manageRestaurant.formTitles.create")}
              </h2>
              <ManageRestaurantForm />
            </div>
          </TabsContent>

          <TabsContent value="menuItems">
            <MenuItems />
          </TabsContent>

          <TabsContent value="analytical">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ManageRestaurantPage;