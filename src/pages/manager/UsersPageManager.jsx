import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

import {
  fetchUsers,
  approveUser,
  rejectUser,
  blockUser,
} from "../../services/users.services";

import GenericTable from "../../components/common/GenericTable";
import Pagination from "../../components/common/Pagination";

import { CheckCircle, XCircle, Ban } from "lucide-react";
import GenericToast from "../../components/common/GenericToast";

const UsersPageManager = () => {
  const { user } = useAuth();

  // 🔹 Data
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    loadUsers(page);
  }, [page]);

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

  // 🔹 Approve user (NO manager logic)
  const handleApprove = async (targetUser) => {
    GenericToast.confirm({
      message: `Approve ${targetUser.name}?`,
      confirmText: "Approve",
      cancelText: "Cancel",
      type: "success",
      onConfirm: async () => {
        await approveUser(targetUser.id);
        GenericToast.success("User approved");
        loadUsers(page);
      },
    });
  };

  // 🔹 Row actions
  const rowActions = (row) => {
    if (!row.isActive) {
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
                cancelText: "Cancel",
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

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          GenericToast.confirm({
            message: `Block ${row.name}? They will lose access immediately.`,
            confirmText: "Block",
            cancelText: "Cancel",
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
      <div className="text-xs">
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
</div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-between pt-4 border-t">
          <span className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
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

export default UsersPageManager;
