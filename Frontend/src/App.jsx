import Home from "./Page/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { User,Register ,ForGotPassword ,Login ,ResetPassword} from "./components/User/index";



export default function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/register" element={<Register />}/>
    <Route path="/login" element={<Login />}/>
    <Route path="/user" element={<User />}/>
    <Route path="/forgotpassword" element={<ForGotPassword />}/>
    <Route path="/resetpassword/:resetToken" element={<ResetPassword />}/>
      
      
  
    </Routes>
  </BrowserRouter>
  )
}