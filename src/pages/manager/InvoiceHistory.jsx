import { useEffect, useState } from "react";
import api from "../../api/axios";

import GenericTable from "../../components/common/GenericTable";
import Pagination from "../../components/common/Pagination";
import GenericToast from "../../components/common/GenericToast";
import useDebounce from "../../hooks/useDebounce";
import generateInvoicePDF from "../../components/common/GenericInvoicePDFGenerator";

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  //////////////////////////////////////////////////////
  // LOAD INVOICES
  //////////////////////////////////////////////////////
  const loadInvoices = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await api.get("/invoices", {
        params: {
          page: pageNumber,
          limit: pagination.limit,
          search: debouncedSearch || undefined,
        },
      });

      setInvoices(res.data.data || []);

      setPagination(
        res.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      console.error(error);
      GenericToast.error("Failed to load invoice history");
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////////
  // EFFECTS
  //////////////////////////////////////////////////////
  useEffect(() => {
    loadInvoices(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    loadInvoices(1);
  }, [debouncedSearch]);

  //////////////////////////////////////////////////////
  // HANDLE GENERATE PDF
  //////////////////////////////////////////////////////
  const handleGeneratePDF = async (invoiceNumber) => {
    try {
      setPdfLoading(invoiceNumber);

      const res = await api.get(`/invoices/full/${invoiceNumber}`);

      const fullInvoice = res.data;
      generateInvoicePDF(fullInvoice);

      GenericToast.success("Invoice loaded successfully");

      // 🔥 OPTIONAL:
      // If you want to open InvoicePDFGenerator modal,
      // store fullInvoice in state and render it conditionally.

    } catch (error) {
      console.error(error);
      GenericToast.error("Failed to fetch invoice details");
    } finally {
      setPdfLoading(null);
    }
  };

  //////////////////////////////////////////////////////
  // TABLE COLUMNS
  //////////////////////////////////////////////////////
  const columns = [
    {
      key: "invoiceNumber",
      header: "Invoice No",
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) =>
        new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) =>
        row.customer?.name || "Walk-in",
    },
    {
      key: "createdBy",
      header: "Cashier",
      render: (row) => row.createdBy?.name || "—",
    },
    {
      key: "grandTotal",
      header: "Amount",
      render: (row) => `₹${row.grandTotal}`,
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      type: "status",
    },
  ];

  //////////////////////////////////////////////////////
  // ROW ACTIONS
  //////////////////////////////////////////////////////
  const rowActions = (row) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleGeneratePDF(row.invoiceNumber);
      }}
      disabled={pdfLoading === row.invoiceNumber}
      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
    >
      {pdfLoading === row.invoiceNumber
        ? "Loading..."
        : "Generate PDF"}
    </button>
  );

  //////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <GenericTable
        columns={columns}
        data={invoices}
        rowActions={rowActions}
        loading={loading}
        searchPlaceholder="Search invoice number..."
        onSearch={setSearch}
        striped
        hoverable
      />

      {pagination.totalPages > 1 && (
        <div className="flex justify-between border-t pt-4">
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

export default InvoiceHistory;