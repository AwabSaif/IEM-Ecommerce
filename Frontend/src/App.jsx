import Home from "./Page/home/Home";
import Dashbord from "./Page/dashboard/Dashbord";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Register,
  ForGotPassword,
  ResetPassword,
  ChangrPassword,
  Login,
  Verify,
} from "./Page/auth/index";

import { Layout } from "./layout/Layout";
import { Profile } from "./Page/profile/Profile";
import { Product } from "./Page/porduct/Product";
import { ContactUs } from "./Page/contactUs/ContactUs";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForGotPassword />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile /> } />
        <Route path="/changepassword" element={ <ChangrPassword /> } />
      </Route>
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/product" element={<Product />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashbord />} />

      </Route>
      </Routes>
    </BrowserRouter>
  );
}
