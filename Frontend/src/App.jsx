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
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Missing } from "./Page/missingPage/Missing";
import { Unauthorized } from "./Page/missingPage/Unauthorized";
import { AddProduct } from "./components/product/AddProduct";
import RequireAuth from "./Page/auth/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgotpassword" element={<ForGotPassword />} />
      <Route path="resetpassword/:resetToken" element={<ResetPassword />} />
      <Route path="users/confirm/:token" element={<Verify />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="product" element={<Product />} />
        <Route path="profile" element={<Profile />} />
        <Route path="changepassword" element={<ChangrPassword />} />
      </Route>
      <Route path="*" element={<Missing />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashbord />} />
          <Route path="addproduct" element={<AddProduct />} />
        </Route>
      </Route>
    </Routes>
  );
}
