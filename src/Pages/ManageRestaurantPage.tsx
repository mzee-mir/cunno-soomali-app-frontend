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

const ManageRestaurantPage = () => {
  const dispatch = useDispatch();
  const { currentRestaurant, loading, error } = useSelector(
    (state: RootState) => state.restaurant
  );
  const { orders } = useSelector((state: RootState) => state.order); // Add this line
  const { _id: userId } = useSelector((state: RootState) => state.user);
  const { menuItems } = useSelector((state: RootState) => state.menuItem); // Add this line
  const [activeTab, setActiveTab] = useState("manage-restaurant");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        dispatch(setRestaurantLoading(true));
        if (userId) {
          await RestaurantService.getUserRestaurants(dispatch, userId);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch restaurants";
        dispatch(setRestaurantError(errorMessage));
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
      } else {
        const newRestaurant = await RestaurantService.createRestaurant(
          dispatch,
          {
            ...formData,
            owner: userId
          }
        );
        dispatch(setCurrentRestaurant(newRestaurant));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save restaurant";
      dispatch(setRestaurantError(errorMessage));
    } finally {
      dispatch(setRestaurantLoading(false));
    }
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    try {
      dispatch(setRestaurantLoading(true));
      await RestaurantService.deleteRestaurant(dispatch, restaurantId);
      dispatch(clearRestaurantState());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete restaurant";
      dispatch(setRestaurantError(errorMessage));
    } finally {
      dispatch(setRestaurantLoading(false));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
          <TabsTrigger value="menuItems">Menu Items</TabsTrigger>
          <TabsTrigger value="analytical">Analytics</TabsTrigger>
          <TabsTrigger value="dashboard">Dasboard</TabsTrigger>
        </TabsList>

        {loading && <LoadinButton />}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        <TabsContent value="orders" className="bg-blue-50 rounded-lg">
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
                        ? 'ring-2 ring-primary' 
                        : 'hover:ring-1 hover:ring-gray-200'
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
              isMobile ? (
                <MobileOrderItemCardInfo order={selectedOrder} />
              ) : (
                <OrderItemCardInfo order={selectedOrder} />
              )
            ) : (
                <div className="flex items-center justify-center h-full bg-white rounded-lg p-8">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-gray-500">
                      Select an order to view details
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                      Click on any order from the list to see its full details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage-restaurant">
  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
    <h2 className="text-xl md:text-2xl font-bold mb-4">
      {currentRestaurant?._id ? "Update Restaurant" : "Create Restaurant"}
    </h2>
    
    {isMobile ? (
      <MobileManageRestaurantForm />
    ) : (
      <ManageRestaurantForm />
    )}
  </div>
</TabsContent>

<TabsContent value="menuItems">
  {isMobile ? (
    <MobileMenuItems />
  ) : (
    <MenuItems />
  )}
</TabsContent>

        <TabsContent value="analytical">
            <AnalyticsDashboard/>
        </TabsContent>

        <TabsContent value="dashboard">
            <Dashboard/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageRestaurantPage;