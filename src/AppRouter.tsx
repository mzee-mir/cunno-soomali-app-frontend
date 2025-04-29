import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layouts";
import HomePage from "./Pages/HomePage";
import AuthCallBack from "./Pages/AuthCallBack";
import UserProfilePage from "./Pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./Pages/ManageRestaurantPage";
import SearchPage from "./Pages/SearchPage";
import DetailPage from "./Pages/detailsPage";
import OrderStatusPage from "./Pages/OrderStatusPage";
import LoginPage from "./Pages/LoginPage";
import EmailVerificationPage from "./Pages/emailVerification";
import ForgotPassword from "./Pages/forgotPassword";
import VerifyResetPasswordOtp from "./Pages/resetpasswordVerification";
import ResetPassword from "./Pages/resetPassword";
import MenuItems from "./components/MenuItems";
import Address from "./Pages/Adress";
import AnalyticsDashboard from "./components/Dashboard";
import Dashboard from "./components/dashboardpages";
import { useAppSelector } from "./store/store";
const AppRoute = () => {
    
    // Get user role from Redux store
    const { role } = useAppSelector((state) => state.user);

    return( 
        <Routes>
            <Route 
            path ="/" 
            element= { 
            <Layout showHero>
                <HomePage/>
            </Layout>
            } />

            <Route 
            path ="/Login-Page" 
            element= { 
            <Layout>
                <LoginPage/>
            </Layout>
            } />

            <Route 
            path ="/verification-email" 
            element= { 
            <Layout>
                <EmailVerificationPage/>
            </Layout>
            } />

            <Route 
            path ="/forgot-Password" 
            element= { 
            <Layout>
                <ForgotPassword/>
            </Layout>
            } />

            <Route 
            path ="/resetPassword-Otp" 
            element= { 
            <Layout>
                <VerifyResetPasswordOtp/>
            </Layout>
            } />

            <Route
            path ="/resetPassword"
            element= {
            <Layout>
                <ResetPassword/>
            </Layout>
            }
            />

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
            </Route>
                <Route element={<ProtectedRoute requiredRole="RESTAURANT OWNER" />}>
            
                        <Route 
                            path="/manage-restaurant" 
                            element={
                                <Layout>
                                    <ManageRestaurantPage/>
                                </Layout>
                            } 
                        />
                        
                        <Route 
                            path="/menuItems" 
                            element={
                                <Layout>
                                    <MenuItems/>
                                </Layout>
                            } 
                        />

                        <Route 
                            path="/analytical" 
                            element={
                                <Layout>
                                    <AnalyticsDashboard/>
                                </Layout>
                            } 
                        />

                        <Route 
                            path="/dashboard" 
                            element={
                                <Layout>
                                    <Dashboard/>
                                </Layout>
                            } 
                        />

            </Route>
            
            
            <Route path ="*" element= {<Navigate to = "/" />} />
            
        </Routes>
    );
    
}

export default AppRoute