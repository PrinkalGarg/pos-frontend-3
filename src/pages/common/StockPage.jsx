import { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";

import GenericToast from "../../components/common/GenericToast";
import GenericTable from "../../components/common/GenericTable";
import GenericForm from "../../components/common/GenericForm";

import {
  fetchProducts,
  updateProductRequest,
  deleteProductRequest,
} from "../../services/product.services";

import { getCategories } from "../../services/category.services";

const StockPage = () => {
  // ================= STATE =================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loadingTable, setLoadingTable] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const debouncedSearch = useDebounce(search, 2000);

  // ================= FETCH CATEGORIES =================
  const fetchCategoriesData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data?.data || []);
    } catch {
      GenericToast.error("Failed to load categories");
    }
  };

  // ================= FETCH PRODUCTS =================
  const loadProducts = async () => {
    try {
      setLoadingTable(true);

      const res = await fetchProducts({
        search: debouncedSearch,
        isActive:
          status === "ALL"
            ? undefined
            : status === "ACTIVE"
            ? true
            : false,
      });

      setProducts(res?.data?.data || []);
    } catch {
      GenericToast.error("Failed to load products");
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [debouncedSearch, status]);

  // ================= UPDATE SUBMIT =================
  const handleUpdateSubmit = async () => {
    const original = editingProduct.original;
    const updated = editingProduct;

    const payload = { productId: original.id };

    if (updated.name !== original.name) payload.name = updated.name;
    if (updated.sku !== original.sku) payload.sku = updated.sku;
    if (Number(updated.price) !== original.price)
      payload.price = Number(updated.price);
    if (Number(updated.gstRate) !== original.gstRate)
      payload.gstRate = Number(updated.gstRate);
    if (Number(updated.stock) !== original.stock)
      payload.stock = Number(updated.stock);
    if (updated.categoryId !== original.categoryId)
      payload.categoryId = updated.categoryId;

    if (Object.keys(payload).length === 1) {
      GenericToast.info("No changes detected");
      return;
    }

    try {
      await updateProductRequest(payload);
      GenericToast.success("Update request sent");
      setEditingProduct(null);
      loadProducts();
    } catch {
      GenericToast.error("Failed to update product");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { key: "name", header: "Name" },
    {
      key: "category",
      header: "Category",
      render: (row) => row.category?.name || "—",
    },
    { key: "gstRate", header: "GST %" },
    {
      key: "price",
      header: "Price",
      render: (row) => `₹ ${row.price}`,
    },
    { key: "sku", header: "SKU" },
    { key: "stock", header: "Stock" },
    {
      key: "store",
      header: "Store",
      render: (row) => row.store?.name || "—",
    },
    { key: "isActive", header: "Status", type: "status" },
  ];

  // ================= ROW ACTIONS =================
  const rowActions = (row) => {
    if (!row.isActive) return null;

    return (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingProduct({
              ...row,
              original: row,
            });
          }}
          className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white"
        >
          Update
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();

            GenericToast.confirm({
              message: `Delete ${row.name}?`,
              confirmText: "Delete",
              type: "error",
              onConfirm: async () => {
                await deleteProductRequest(row.id);
                GenericToast.warning("Delete request sent");
                loadProducts();
              },
            });
          }}
          className="px-3 py-1 text-xs rounded-md bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    );
  };

  const searchFilters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "ALL", label: "All Products" },
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
      ],
      value: status,
      onChange: setStatus,
    },
  ];

  return (
    <div className="m-4 mx-auto ">
      <h2 className="text-lg font-semibold">Stock Management</h2>

      <div className="pt-2">
        <GenericTable
          columns={columns}
          data={products}
          searchFilters={searchFilters}
          searchPlaceholder="Search products..."
          onSearch={setSearch}
          loading={loadingTable}
          rowActions={rowActions}
          striped
          hoverable
        />
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h3 className="font-semibold text-lg">
              Update {editingProduct.name}
            </h3>

            <GenericForm
              submitText="Send Update Request"
              onSubmit={handleUpdateSubmit}
              fields={[
                {
                  name: "name",
                  value: editingProduct.name,
                  onChange: (v) =>
                    setEditingProduct((p) => ({ ...p, name: v })),
                },
                {
                  name: "sku",
                  value: editingProduct.sku,
                  onChange: (v) =>
                    setEditingProduct((p) => ({ ...p, sku: v })),
                },
                {
                  name: "price",
                  value: editingProduct.price,
                  onChange: (v) =>
                    setEditingProduct((p) => ({ ...p, price: v })),
                },
                {
                  name: "gstRate",
                  value: editingProduct.gstRate,
                  onChange: (v) =>
                    setEditingProduct((p) => ({ ...p, gstRate: v })),
                },
                {
                  name: "stock",
                  value: editingProduct.stock,
                  onChange: (v) =>
                    setEditingProduct((p) => ({ ...p, stock: v })),
                },
                {
                  name: "categoryId",
                  type: "select",
                  value: editingProduct.categoryId,
                  onChange: (v) =>
                    setEditingProduct((p) => ({
                      ...p,
                      categoryId: v,
                    })),
                  options: categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })),
                },
              ]}
            />

            <button
              onClick={() => setEditingProduct(null)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;