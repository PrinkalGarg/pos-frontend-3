import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

import GenericForm from "../../components/common/GenericForm";
import GenericTable from "../../components/common/GenericTable";
import Pagination from "../../components/common/Pagination";
import useDebounce from "../../hooks/useDebounce";

function Store() {
  /* ================= STATE ================= */

  const [stores, setStores] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);

  /* 🔹 Update Modal State */
  const [showModal, setShowModal] = useState(false);
  const [editStore, setEditStore] = useState({
    id: "",
    name: "",
    address: "",
  });

  /* ================= FETCH ================= */

  const fetchStores = async (pageNumber = page) => {
    try {
      const endpoint = debouncedSearch
        ? "/stores/search"
        : "/stores/get-store";

      const res = await api.get(endpoint, {
        params: {
          query: debouncedSearch,
          page: pageNumber,
        },
      });

      setStores(res.data?.data || []);
      setPagination(res.data?.pagination || {});
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stores");
    }
  };

  useEffect(() => {
    fetchStores(page);
  }, [debouncedSearch, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* ================= CREATE ================= */

  const createStore = async () => {
    try {
      await api.post("/stores/add-store", newStore);
      toast.success("Store created");

      setNewStore({ name: "", address: "" });
      setPage(1);
      fetchStores(1);
    } catch {
      toast.error("Create failed");
    }
  };

  /* ================= UPDATE ================= */

  const openEditModal = (store) => {
    setEditStore({
      id: store.id,
      name: store.name,
      address: store.address,
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put("/stores/put-store", {
        storeId: editStore.id,
        name: editStore.name,
        address: editStore.address,
      });

      toast.success("Store updated");
      setShowModal(false);

      fetchStores(page);
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (store) => {
    if (!window.confirm("Delete this store?")) return;

    await api.delete("/stores/delete-store", {
      data: { storeId: store.id },
    });

    toast.success("Deleted");

    if (stores.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      fetchStores(page);
    }
  };

  /* ================= TABLE ================= */

  const columns = [
    { key: "name", header: "Store Name", type: "avatar" },
    { key: "address", header: "City" },
    { key: "storeCode", header: "Code" },
  ];

  /* ================= UI ================= */

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-semibold">Store Management</h2>

      {/* 🔹 Create Form */}
      <GenericForm
        title="Create Store"
        compact
        submitText="Create"
        onSubmit={createStore}
        fields={[
          {
            name: "name",
            placeholder: "Store Name",
            value: newStore.name,
            onChange: (v) =>
              setNewStore((p) => ({ ...p, name: v })),
          },
          {
            name: "address",
            placeholder: "City",
            value: newStore.address,
            onChange: (v) =>
              setNewStore((p) => ({ ...p, address: v })),
          },
        ]}
      />

      {/* 🔹 Table */}
      <div className="bg-white rounded-xl shadow p-3 space-y-3">
        <GenericTable
          columns={columns}
          data={stores}
          search={search}
          onSearch={setSearch}
          rowActions={(store) => (
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(store)}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs"
              >
                Update
              </button>

              <button
                onClick={() => handleDelete(store)}
                className="px-3 py-1 bg-red-600 text-white rounded text-xs"
              >
                Delete
              </button>
            </div>
          )}
        />

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* ================= UPDATE MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">
              Update Store
            </h3>

            <input
              type="text"
              value={editStore.name}
              onChange={(e) =>
                setEditStore((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              placeholder="Store Name"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <input
              type="text"
              value={editStore.address}
              onChange={(e) =>
                setEditStore((p) => ({
                  ...p,
                  address: e.target.value,
                }))
              }
              placeholder="City"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;