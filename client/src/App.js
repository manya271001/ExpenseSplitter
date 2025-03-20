import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Registration from "./Registration";
import Login from "./Login";
import HeroSection from "./Hero";
import AboutSection from "./About";
import ContactPage from "./ContactPage";
import Dashboard from "./Dashboard";
import AddGroup from "./AddGroup";
import Groups from "./Groups";
import InviteModal from "./InviteModal";
import Invitations from "./Invitations";
import ExpenseTracker from "./ExpenseTracker";
import ManageExpense from "./ManageExpense";
import SettleComponent from "./Settlement";


function App() {
  return (
    
      <Routes>
        {/* Routes without Navbar & Footer */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HeroSection />} />
          

        {/* Routes with Navbar & Footer */}
        <Route element={<Layout />}>
          <Route path="/about" element={<AboutSection />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/groups" element={<Groups/>} />
          <Route path="/addgroup" element={<AddGroup/>} />
          <Route path="/invite" element={<InviteModal/>} />
          <Route path="/Invitations" element={<Invitations/>} />
          <Route path="/expenseTracker" element={<ExpenseTracker/>}/>
          <Route path="/expenseManager/:groupId" element={<ManageExpense />} />
        </Route>
      </Routes>
    
  );
}

export default App;
