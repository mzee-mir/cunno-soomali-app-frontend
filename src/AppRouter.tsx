import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layouts";
import HomePage from "./Pages/HomePage";
import AuthCallBack from "./Pages/AuthCallBack";
import UserProfilePage from "./Pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";

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

            <Route element={<ProtectedRoute/>}>
                <Route path ="/user-profile" element= {
                <Layout>
                <UserProfilePage/>
                </Layout>
                } 
                />
            </Route>
            
            
            <Route path ="*" element= {<Navigate to = "/" />} />
        </Routes>
    );
}

export default AppRoute