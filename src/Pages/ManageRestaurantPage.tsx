import { useCreateMyRestaurant, useGetMyRestaurant, useGetMyRestaurantOrders, useUpdateMyRestaurant } from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restautant-form/ManageRestaurantForm";


const manageRestaurantPage = () => {
  const {createRestaurant, isLoading: isCreateLoading} = useCreateMyRestaurant();

  const {restaurant} = useGetMyRestaurant();

  const {updateRestaurant, isLoading:isUpdateLoading} = useUpdateMyRestaurant();

  const {orders} = useGetMyRestaurantOrders();
  

  const isEditing = !!restaurant;

  return (
    <Tabs defaultValue="orders">
      <TabsList>
      <TabsTrigger value="orders">
          Orders
        </TabsTrigger>
        
        <TabsTrigger value="manage-restaurant">
          Manage Restaurant
        </TabsTrigger>
      </TabsList>

      <TabsContent value="orders" 
      className="space-y-5 bg-blue-50 pg-10 rounded-lg">
      <h2 className="text-2xl font-bold">active order: {orders?.length}</h2>
      {orders?.map((order) => (
        <OrderItemCard key={order._id} order={order} />
      ))}
      </TabsContent>

      <TabsContent value="manage-restaurant">
      <ManageRestaurantForm 
        restaurant ={restaurant}
        onSave={isEditing ? updateRestaurant: createRestaurant} 
        isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
      
  )

};

export default manageRestaurantPage;