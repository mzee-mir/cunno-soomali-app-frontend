import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layouts";
import HomePage from "./Pages/HomePage";
import AuthCallBack from "./Pages/AuthCallBack";
import UserProfilePage from "./Pages/UserProfilePage";
//import manageRestaurantPage from "./Pages/ManageRestaurantPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./Pages/ManageRestaurantPage";
import SearchBar from "./components/SearchBar";
import SearchPage from "./Pages/SearchPage";
import DetailPage from "./Pages/detailsPage";
import OrderStatusPage from "./Pages/OrderStatusPage";

const AppRoute = () => {
    return(
        <Routes>
            <Route 
            path ="/" 
            element= { 
            <Layout showHero>
                <HomePage/>
            </Layout>
            } />
            <Route path ="/auth-callback" element= {<AuthCallBack/>} />

            <Route path ="/search/:city" element= {<Layout showHero={false}> 
                <SearchPage /> 
            </Layout>} />

            <Route path ="/detail/:restaurantId" element= {<Layout showHero={false}> 
                <DetailPage /> 
            </Layout>} />

            <Route element={<ProtectedRoute/>}>
                <Route 
                path ="/order-status" 
                element= {
                <Layout>
                    <OrderStatusPage/>
                </Layout>
                } 
                />

                <Route path ="/user-profile" element= {
                <Layout>
                <UserProfilePage/>
                </Layout>
                } 
                />
                
                <Route 
                path ="/manage-restaurant" 
                element= {
                <Layout>
                    <ManageRestaurantPage/>
                </Layout>
                } 
                />

            </Route>
            
            
            <Route path ="*" element= {<Navigate to = "/" />} />
        </Routes>
    );
}

export default AppRoute