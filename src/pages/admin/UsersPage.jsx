import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

import {
  fetchUsers,
  approveUser,
  rejectUser,
  blockUser,
  fetchUnassignedStores,
  assignStoreToManager,
} from "../../services/users.services";

import GenericTable from "../../components/common/GenericTable";
import Pagination from "../../components/common/Pagination";
import AssignStoreModal from "../../components/users/AssignStoreModal";

import { CheckCircle, XCircle, Ban } from "lucide-react";
import GenericToast from "../../components/common/GenericToast";

const UsersPage = () => {
  const { user } = useAuth();

  // 🔹 Data
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  // 🔹 Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // 🔹 UI state
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedStore, setSelectedStore] = useState("");
  const [assigning, setAssigning] = useState(false);

  const debouncedSearch = useDebounce(search, 2000);

  // 🔹 Fetch users
  const loadUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await fetchUsers({
        page: pageNumber,
        status:
          status === "ALL"
            ? "all"
            : status === "ACTIVE"
            ? "active"
            : "inactive",
        search: debouncedSearch,
      });

      setUsers(res?.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        ...res?.data?.pagination,
      }));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch stores
  const loadStores = async () => {
    try {
      const res = await fetchUnassignedStores();
      setStores(res?.data?.data || []);
    } catch {
      GenericToast.error("Failed to load stores");
    }
  };

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    setPage(1);
    loadUsers(1);
  }, [debouncedSearch, status]);

  // 🔹 Columns
  const columns = [
    { key: "name", header: "Name", type: "avatar" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
          {row.role}
        </span>
      ),
    },
    { key: "isActive", header: "Status", type: "status" },
    {
    key: "storeCode",
    header: "Store Code",
    render: (row) => row.store?.storeCode || "—",
  },
  {
    key: "storeName",
    header: "Store Name",
    render: (row) => row.store?.name || "—",
  },
  {
    key: "storeAddress",
    header: "Store Address",
    render: (row) => row.store?.address || "—",
  },
  ];

  // 🔹 Filters
  const searchFilters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "ALL", label: "All Users" },
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
      ],
      value: status,
      onChange: setStatus,
    },
  ];

  // 🔹 Approve handler
  const handleApprove = async (targetUser) => {
    // 👉 Manager without store → Assign first
    if (targetUser.role === "MANAGER" && !targetUser.storeId) {
      setSelectedManager(targetUser);
      setShowModal(true);
      return;
    }

    // 👉 Direct approve
    GenericToast.confirm({
      message: `Approve ${targetUser.name}?`,
      confirmText: "Approve",
      type: "success",
      onConfirm: async () => {
        await approveUser(targetUser.id);
        GenericToast.success("User approved");
        loadUsers(page);
      },
    });
  };

  // 🔹 Assign + Approve manager
  const confirmAssign = async () => {
    if (!selectedManager) return;

    try {
      setAssigning(true);

      // Assign store if not assigned
      if (!selectedManager.storeId) {
        if (!selectedStore) {
          GenericToast.warning("Please select a store");
          return;
        }

        await assignStoreToManager(
          selectedManager.id,
          selectedStore
        );
      }

      // Approve manager
      await approveUser(selectedManager.id);

      GenericToast.success("Manager approved successfully");

      setShowModal(false);
      setSelectedManager(null);
      setSelectedStore("");

      loadUsers(page);
      loadStores();
    } catch (err) {
      GenericToast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setAssigning(false);
    }
  };

  // 🔹 Row actions (FINAL FIXED)
  const rowActions = (row) => {
    const isActive = row.isActive; // ✅ ONLY source of truth

    // 🔸 INACTIVE → Approve / Reject
    if (!isActive) {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(row);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2 text-xs font-medium text-white"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Approve
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              GenericToast.confirm({
                message: `Reject ${row.name}? This action cannot be undone.`,
                confirmText: "Reject",
                type: "error",
                onConfirm: async () => {
                  await rejectUser(row.id);
                  GenericToast.info("User rejected");
                  loadUsers(page);
                },
              });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-gray-400 to-gray-500 px-4 py-2 text-xs font-medium text-white"
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      );
    }

    // 🔸 ACTIVE → Block
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          GenericToast.confirm({
            message: `Block ${row.name}? They will lose access immediately.`,
            confirmText: "Block",
            type: "error",
            onConfirm: async () => {
              await blockUser(row.id);
              GenericToast.warning("User blocked");
              loadUsers(page);
            },
          });
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-red-600 to-rose-700 px-4 py-2 text-xs font-medium text-white"
      >
        <Ban className="h-3.5 w-3.5" />
        Block
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <GenericTable
        columns={columns}
        data={users}
        searchFilters={searchFilters}
        searchPlaceholder="Search users..."
        onSearch={setSearch}
        loading={loading}
        rowActions={rowActions}
        striped
        hoverable
      />

      {pagination.totalPages > 0 && (
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

      <AssignStoreModal
        open={showModal}
        onClose={() => setShowModal(false)}
        stores={stores}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        onConfirm={confirmAssign}
        loading={assigning}
      />
    </div>
  );
};

export default UsersPage;