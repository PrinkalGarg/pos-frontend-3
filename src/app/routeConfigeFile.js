import { ROLES } from "../auth/roles";

export const ROUTE_SEARCH = [
  // ADMIN
  {
    label: "Admin Dashboard",
    path: "/admin/dashboard",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Stores",
    path: "/admin/stores",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Users",
    path: "/admin/users",
    roles: [ROLES.ADMIN],
  },

  // MANAGER
  {
    label: "Manager Dashboard",
    path: "/manager/dashboard",
    roles: [ROLES.MANAGER],
  },
  {
    label: "Staff",
    path: "/manager/staff",
    roles: [ROLES.MANAGER],
  },
  {
    label: "Stock Approvals",
    path: "/manager/stock-approvals",
    roles: [ROLES.MANAGER],
  },
  {
    label: "Sales",
    path: "/manager/sales",
    roles: [ROLES.MANAGER],
  },
  {
    label: "Stock",
    path: "/manager/stock",
    roles: [ROLES.MANAGER],
  },

  // INVENTORY
  {
    label: "Inventory Dashboard",
    path: "/inventory/dashboard",
    roles: [ROLES.INVENTORY_MANAGER],
  },
  {
    label: "Products",
    path: "/inventory/products",
    roles: [ROLES.INVENTORY_MANAGER],
  },

  // CASHIER
  {
    label: "Cashier Dashboard",
    path: "/cashier/dashboard",
    roles: [ROLES.CASHIER],
  },
  {
    label: "Billing",
    path: "/cashier/billing",
    roles: [ROLES.CASHIER],
  },
  {
    label: "Sales",
    path: "/cashier/sales",
    roles: [ROLES.CASHIER],
  },
];