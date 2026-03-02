import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import { ROLES } from "../auth/roles";
import HomeRedirect from "../pages/HomeRedrect";

// Public pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import InventoryManagerLayout from "../layouts/InvetnoryManagerLayout";
import CashierLayout from "../layouts/CashierLayout";

// Dashboards
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import InventoryManagerDashboard from "../pages/inventory_manager/InventroyManagerDashBoard";
import CashierDashboard from "../pages/cashier/CashierDashboard";
import NotFound from "../pages/NotFound";

import Store from "../pages/admin/Store";


//Pages
import UsersPage from "../pages/admin/UsersPage";
import UsersPageManager from "../pages/manager/UsersPageManager";
import BillingScreen from "../pages/cashier/billing/BillinScreen";
import Products from "../pages/inventory_manager/Products";
import ManagerProducts from "../pages/manager/ManagerProducts"; 
import InvoiceHistory from "../pages/manager/InvoiceHistory"; 
import Salespage from "../pages/cashier/sales/SalesPage";


const AppRouter = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<HomeRedirect />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

     {/* ADMIN */}
<Route
  path="/admin"
  element={
    <ProtectedRoute role={ROLES.ADMIN}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="stores" element={<Store />} />  {/* <-- Ye line yahi add karni hai */}
</Route>
      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role={ROLES.ADMIN}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        
      </Route>
  {/* MANAGER */}


    <Route
  path="/manager"
  element={
    <ProtectedRoute role={ROLES.MANAGER}>
      <ManagerLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<ManagerDashboard />} />
  <Route path="dashboard" element={<ManagerDashboard />} />
  <Route path="staff" element={<UsersPageManager />} />
  <Route path="products" element={<ManagerProducts />} />
  <Route path="sales" element={<InvoiceHistory />} />
</Route>



      {/* INVENTORY MANAGER */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute role={ROLES.INVENTORY_MANAGER}>
            <InventoryManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InventoryManagerDashboard />} />
        <Route path="dashboard" element={<InventoryManagerDashboard />} />
        <Route path="products" element={<Products />} /> 
      </Route>

      {/* CASHIER */}
      <Route
        path="/cashier"
        element={
          <ProtectedRoute role={ROLES.CASHIER}>
            <CashierLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CashierDashboard />} />
        <Route path="dashboard" element={<CashierDashboard />} />
        <Route path="billing" element={<BillingScreen />} />
        <Route path="sales" element={<Salespage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
