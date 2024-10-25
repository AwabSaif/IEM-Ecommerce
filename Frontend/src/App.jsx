// Importing necessary components and modules
import { Routes, Route } from "react-router-dom";
import {
  Register,
  ForGotPassword,
  ResetPassword,
  ChangrPassword,
  Login,
  Verify,
} from "./Page/auth/index";
import { 
  AddCategory, 
  Categories, 
  UpdateCategory 
} from "./components/Categories/index";
import { CartPage } from "./components/Cart/index";
import { Layout } from "./components/layout/Layout";
import { ContactUs } from "./Page/AboutUs/ContactUs";
import { DashboardLayout } from "./components/dashboard/Layout/DashboardLayout";
import { Missing } from "./Page/missingPage/Missing";
import { Unauthorized } from "./Page/missingPage/Unauthorized";
import { AddProduct } from "./components/products/AddProduct";
import RequireAuth from "./Page/auth/RequireAuth";
import { Users } from "./components/users/Users";
import PersistLogin from "./Page/auth/PersistLogin";
import { AllProducts } from "./components/products/AllProducts";
import { AddUser } from "./components/users/AddUser";
import { EditUser } from "./components/users/EditUser";
import { UpdateUser } from "./components/users/UpdateUser";
import { UpdateProduct } from "./components/products/UpdateProduct";
import { Orders } from "./components/Orders/Orders";
import { UpdateOrder } from "./components/Orders/UpdateOrder";
import { CategoriesStore } from "./Page/Categories/CategoriesStore";
import { Store } from "./Page/Store/Store";
import { MyOrders } from "./Page/Orders/MyOrders";
import { ProductDetails } from "./components/products/ProductDetails";
import { CheckOut } from "./Page/Orders/CheckOut";
import { AboutUs } from "./Page/AboutUs/AboutUs";
import { Policies } from "./Page/AboutUs/Policies";
import { OrderDetails } from "./components/Orders/OrderDetails";
import { SearchResults } from "./components/search input/SearchResults";
import Home from "./Page/home/Home";
import {Dashboard} from "./Page/dashboard/DashBord";

// Defining the main App component
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgotpassword" element={<ForGotPassword />} />
      <Route path="resetpassword/:resetToken" element={<ResetPassword />} />
      <Route path="users/confirm/:token" element={<Verify />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* Catch all route */}
      <Route path="*" element={<Missing />} />
      {/* Protected routes */}
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="store" element={<Store />} />
          <Route path="searchresults" element={<SearchResults />} />
          <Route path="orders/:id" element={<MyOrders />} />
          <Route path="orderdetails/:id" element={<OrderDetails />} />
          <Route path="categories" element={<CategoriesStore />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="edituser/:id" element={<EditUser />} />
          <Route path="changepassword" element={<ChangrPassword />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="policies" element={<Policies />} />
          <Route path="contactus" element={<ContactUs />} />
        </Route>
        {/* Protected admin routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orderdetails/:id" element={<UpdateOrder />} />
            <Route path="users" element={<Users />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="updateuser/:id" element={<UpdateUser />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="updateproduct/:id" element={<UpdateProduct />} />
            <Route path="categories" element={<Categories />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="updatecategory/:id" element={<UpdateCategory />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
