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
import MobileOrderItemCardInfo from "@/components/MobileOrderItemCardInfo";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';

const ManageRestaurantPage = () => {
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
          toast.success("Restaurant data loaded successfully");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch restaurants";
        dispatch(setRestaurantError(errorMessage));
        toast.error(errorMessage);
      } finally {
        dispatch(setRestaurantLoading(false));
      }
    };

    fetchRestaurants();
  }, [dispatch, userId]);

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
      const errorMessage = error instanceof Error ? error.message : "Failed to save restaurant";
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
            <SelectTrigger className=" bg-accent w-full border-border">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent className="bg-accent border-border">
              <SelectItem value="orders" className="hover:bg-accent hover:text-accent-foreground">
                📋 Orders
              </SelectItem>
              <SelectItem value="manage-restaurant" className="hover:bg-accent hover:text-accent-foreground">
                🏠 Restaurant
              </SelectItem>
              <SelectItem value="menuItems" className="hover:bg-accent hover:text-accent-foreground">
                🍽️ Menu
              </SelectItem>
              <SelectItem value="analytical" className="hover:bg-accent hover:text-accent-foreground">
                📊 Analytics
              </SelectItem>
              <SelectItem value="dashboard" className="hover:bg-accent hover:text-accent-foreground">
                📈 Dashboard
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-card border-border">
            <TabsTrigger value="orders" className="hover:bg-accent hover:text-accent-foreground">
              Orders
            </TabsTrigger>
            <TabsTrigger value="manage-restaurant" className="hover:bg-accent hover:text-accent-foreground">
              Manage Restaurant
            </TabsTrigger>
            <TabsTrigger value="menuItems" className="hover:bg-accent hover:text-accent-foreground">
              Menu Items
            </TabsTrigger>
            <TabsTrigger value="analytical" className="hover:bg-accent hover:text-accent-foreground">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="hover:bg-accent hover:text-accent-foreground">
              Dashboard
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {loading && <LoadinButton />}
      {error && <p className="text-destructive text-center py-4">{error}</p>}

      {/* Mobile Content */}
      {isMobile ? (
        <div className="mt-2">
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Active Orders: {orders?.length}</h2>
              <div className="space-y-3">
                {orders?.map((order) => (
                  <div 
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3 rounded-lg transition-colors ${
                      selectedOrder?._id === order._id 
                        ? 'bg-primary/10 ring-1 ring-primary' 
                        : 'bg-card hover:bg-accent/10'
                    }`}
                  >
                    <OrderItemCard order={order} />
                  </div>
                ))}
              </div>
              {selectedOrder && (
                <div className="mt-4 p-3 bg-card rounded-lg border border-border">
                  <MobileOrderItemCardInfo order={selectedOrder} />
                </div>
              )}
            </div>
          )}

          {activeTab === "manage-restaurant" && (
            <div className="bg-card p-3 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-3">
                {currentRestaurant?._id ? "Update Restaurant" : "Create Restaurant"}
              </h2>
              <MobileManageRestaurantForm 
                onSave={handleSaveRestaurant}
                onDelete={handleDeleteRestaurant}
              />
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
              {/* Orders List Column */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-2xl font-bold">Active Orders: {orders?.length}</h2>
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

              {/* Order Details Column */}
              <div className="lg:col-span-2">
                {selectedOrder ? (
                  <OrderItemCardInfo order={selectedOrder} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-card rounded-lg p-8 border border-border">
                    <div className="text-center text-muted-foreground">
                      <h3 className="text-xl font-medium">
                        Select an order to view details
                      </h3>
                      <p className="text-sm mt-2">
                        Click on any order from the list to see its full details
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
                {currentRestaurant?._id ? "Update Restaurant" : "Create Restaurant"}
              </h2>
              <ManageRestaurantForm 
                onSave={handleSaveRestaurant}
                onDelete={handleDeleteRestaurant}
              />
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