import api from "../api/axios";

export const createCategory = (data) => {
  return api.post("/categories/add-category", data);
};
export const getCategories = (params) => {
  return api.get("/categories/get-category", { params });
};

export const searchCategories = (query) => {
  return api.get("/categories/search-category", {
    params: { query },
  });
};