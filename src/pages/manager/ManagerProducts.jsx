import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import api from "../../api/axios";

import GenericTable from "../../components/common/GenericTable";
import Pagination from "../../components/common/Pagination";
import GenericToast from "../../components/common/GenericToast";

import { CheckCircle, Trash2 } from "lucide-react";

const ManagerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 800);

  // ✅ LOAD PRODUCTS (BACKEND PAGINATION)
  const loadProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const params = {
        page: pageNumber,
        limit: pagination.limit,
      };

      if (status !== "ALL") {
        params.isActive = status === "ACTIVE";
      }

      let response;

      if (debouncedSearch) {
        params.query = debouncedSearch;
        response = await api.get("/products/search-product", {
          params,
        });
      } else {
        response = await api.get("/products/get-product", {
          params,
        });
      }

      const backendData = response?.data?.data || [];
      const backendPagination = response?.data?.pagination;

      setProducts(backendData);

      if (backendPagination) {
        setPagination({
          page: backendPagination.currentPage,
          limit: backendPagination.perPage,
          total: backendPagination.totalProducts,
          totalPages: backendPagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Load Products Error:", error);
      GenericToast.error(
        error?.response?.data?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Effects
  useEffect(() => {
    loadProducts(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    loadProducts(1);
  }, [debouncedSearch, status]);

  // ✅ Toggle Active / Inactive
  const handleToggleStatus = async (product) => {
    GenericToast.confirm({
      message: product.isActive
        ? `Deactivate ${product.name}?`
        : `Activate ${product.name}?`,
      confirmText: product.isActive ? "Deactivate" : "Activate",
      cancelText: "Cancel",
      type: product.isActive ? "warning" : "success",
      onConfirm: async () => {
        try {
          const res = await api.put("/products/update-product", {
            productId: product.id,
            isActive: !product.isActive,
          });

          GenericToast.success(
            res?.data?.message || "Status updated successfully"
          );

          loadProducts(page);
        } catch (error) {
          GenericToast.error(
            error?.response?.data?.message || "Action failed"
          );
        }
      },
    });
  };

  // ✅ Delete Product
  const handleDelete = async (product) => {
    GenericToast.confirm({
      message: `Delete ${product.name}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "error",
      onConfirm: async () => {
        try {
          const res = await api.delete("/products/delete-product", {
            params: { productId: product.id },
          });

          GenericToast.warning(
            res?.data?.message || "Product deleted"
          );

          loadProducts(page);
        } catch (error) {
          GenericToast.error(
            error?.response?.data?.message || "Delete failed"
          );
        }
      },
    });
  };

  const columns = [
    { key: "name", header: "Product Name" },
    { key: "sku", header: "SKU" },
    { key: "price", header: "Price" },
    { key: "gstRate", header: "GST %" },
    { key: "stock", header: "Stock" },
    {
      key: "category",
      header: "Category",
      render: (row) => row.category?.name || "—",
    },
    {
      key: "store",
      header: "Store",
      render: (row) => row.store?.name || "—",
    },
    { key: "isActive", header: "Status", type: "status" },
  ];

  const rowActions = (row) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleStatus(row);
        }}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-white ${
          row.isActive ? "bg-yellow-500" : "bg-green-600"
        }`}
      >
        <CheckCircle className="h-3.5 w-3.5" />
        {row.isActive ? "Deactivate" : "Activate"}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(row);
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
    </div>
  );

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
    <div className="space-y-6">
      <GenericTable
        columns={columns}
        data={products}
        searchFilters={searchFilters}
        searchPlaceholder="Search products..."
        onSearch={setSearch}
        loading={loading}
        rowActions={rowActions}
        striped
        hoverable
        inlineFilters
      />

      {pagination.totalPages > 1 && (
        <div className="flex justify-between pt-4 border-t">
          <span className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}{" "}
            of {pagination.total}
          </span>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default ManagerProductsPage;
