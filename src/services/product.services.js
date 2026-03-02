import api from "../api/axios";

// ✅ CREATE PRODUCT
export const createProduct = (data) => {
  return api.post("/products/add-product", data);
};

// ✅ CHECK SKU AVAILABILITY
export const checkSkuAvailability = (sku, storeId) => {
  return api.get("/products/check-sku", {
    params: { sku, storeId },
  });
};

export const fetchProducts = (params) => {
  return api.get("/products/get-product", { params });
};

// ✅ UPDATE PRODUCT
export const updateProductRequest = (data) => {
  return api.put("/products/update-product", data);
};

// ✅ DELETE PRODUCT
export const deleteProductRequest = (productId) => {
  return api.delete("/products/delete-product", {
    params: { productId },
  });
};
