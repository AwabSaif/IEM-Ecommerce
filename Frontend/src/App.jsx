import Home from "./Page/home/Home";
import Dashbord from "./Page/dashboard/Dashbord";
import { Routes, Route } from "react-router-dom";
import {
  Register,
  ForGotPassword,
  ResetPassword,
  ChangrPassword,
  Login,
  Verify,
} from "./Page/auth/index";

import { Layout } from "./components/layout/Layout";
import { Profile } from "./Page/profile/Profile";
import { Product } from "./Page/porduct/Product";
import { ContactUs } from "./Page/contactUs/ContactUs";
import { DashboardLayout } from "./components/dashboard/Layout/DashboardLayout";
import { Missing } from "./Page/missingPage/Missing";
import { Unauthorized } from "./Page/missingPage/Unauthorized";
import { AddProduct } from "./components/product/AddProduct";
import RequireAuth from "./Page/auth/RequireAuth";
import { Users } from "./components/users/Users";
import PersistLogin from "./Page/auth/PersistLogin";
import { AllProducts } from "./components/product/AllProducts";
import { AddUser } from "./components/users/AddUser";
import { EditUser } from "./components/users/EditUser";
import { UpdateUser } from "./components/users/UpdateUser";

export default function App() {
  return (
    <Routes>
      {/* plblic routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgotpassword" element={<ForGotPassword />} />
      <Route path="resetpassword/:resetToken" element={<ResetPassword />} />
    
      <Route path="users/confirm/:token" element={<Verify />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* catch all */}
      <Route path="*" element={<Missing />} />
      {/* potect routes */}
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="product" element={<Product />} />
          <Route path="profile" element={<Profile />} />
          <Route path="changepassword" element={<ChangrPassword />} />
            <Route path="edituser/:id" element={<EditUser />} />
        </Route>
         {/* potect admin routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="users" element={<Users />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="updateuser/:id" element={<UpdateUser />} />
            <Route index element={<Dashbord />} />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="products" element={<AllProducts />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
