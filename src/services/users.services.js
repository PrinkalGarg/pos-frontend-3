import api from "../api/axios";

// USERS (BACKEND PAGINATION)
export const fetchUsers = ({
  page = 1,
  status,
  search,
}) => {
  return api.get("/users/users", {
    params: {
      page,
      status,
      search,
    },
  });
};

export const approveUser = (id) => {
  return api.post(`/users/${id}/approve`);
};

export const rejectUser = (id) => {
  return api.post(`/users/${id}/reject`);
};

export const blockUser = (id) => {
  return api.post(`/users/${id}/block`);
};

// 🔹 ADMIN – MANAGER STORE ASSIGNMENT
export const fetchUnassignedStores = () => {
  return api.get("/admin/unassigned-stores");
};

export const assignStoreToManager = (managerId, storeId) => {
  return api.post("/admin/assign-store", {
    managerId,
    storeId,
  });
};
