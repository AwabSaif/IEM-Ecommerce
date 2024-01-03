import Home from "./Page/home/Home";
import Dashbord from "./Page/dashboard/Dashbord";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashbord />} />
        <Route
          index
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForGotPassword />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="/profile" element={ <Layout><Profile /></Layout> } />
        <Route path="/changepassword" element={ <Layout><ChangrPassword /></Layout> } />

        <Route
          path="/verify/:verificationToken"
          element={
            <Layout>
              {" "}
              <Verify />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
