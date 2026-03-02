import React, {
  useState,
  useEffect,
} from "react";
import api from "../../../../api/axios";
import useDebounce from "../../../../hooks/useDebounce";

const CustomerSelection = ({
  selectedCustomer,
  setSelectedCustomer,
}) => {
  //////////////////////////////////////////////////////
  // State
  //////////////////////////////////////////////////////
  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [showCreate, setShowCreate] =
    useState(false);

  const [newCustomer, setNewCustomer] =
    useState({
      name: "",
      phone: "",
      email: "",
      gstNumber: "",
      address: "",
    });

  //////////////////////////////////////////////////////
  // 🔥 Debounced Search Value
  //////////////////////////////////////////////////////
  const debouncedSearch =
    useDebounce(search, 400);

  //////////////////////////////////////////////////////
  // Search API
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const fetchCustomers =
      async () => {
        try {
          setLoading(true);

          const res =
            await api.get(
              `/customers/search?search=${debouncedSearch}`
            );
            console.log(res.data);
            

          setResults(
            res.data || []
          );
        } catch (err) {
          console.error(
            "Search failed",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCustomers();
  }, [debouncedSearch]);

  //////////////////////////////////////////////////////
  // Select Customer
  //////////////////////////////////////////////////////
  const handleSelect = (
    customer
  ) => {
    setSelectedCustomer(
      customer
    );
    setSearch(
      customer.name
    );
    setResults([]);
  };

  //////////////////////////////////////////////////////
  // Remove Customer
  //////////////////////////////////////////////////////
  const handleRemoveCustomer = () => {
    setSelectedCustomer(null);
    setSearch("");
    setResults([]);
  };

  //////////////////////////////////////////////////////
  // Create Customer
  //////////////////////////////////////////////////////
  const handleCreate =
    async () => {
      if (
        !newCustomer.name ||
        !newCustomer.phone
      ) {
        alert(
          "Name & Phone required"
        );
        return;
      }

      try {
        const res =
          await api.post(
            "/customers",
            newCustomer
          );

        setSelectedCustomer(
          res.data
        );
        setSearch(
          res.data.name
        );

        setShowCreate(false);

        setNewCustomer({
          name: "",
          phone: "",
          email: "",
          gstNumber: "",
          address: "",
        });
      } catch (err) {
        console.error(
          "Create customer failed",
          err
        );
      }
    };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <div>
      <h3 className="font-semibold mb-2">
        Customer
      </h3>

      {/* SEARCH INPUT WITH SELECTED CUSTOMER INDICATOR */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className={`border p-2 rounded w-full ${
            selectedCustomer ? "pr-10" : ""
          }`}
        />
        
        {/* REMOVE CUSTOMER BUTTON - SHOWS ONLY WHEN CUSTOMER IS SELECTED */}
        {selectedCustomer && (
          <button
            onClick={handleRemoveCustomer}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
            title="Remove customer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        )}
      </div>

      {/* SEARCH RESULTS INDICATOR */}
      {search && !selectedCustomer && (
        <p className="text-xs text-gray-500 mt-1">
          {loading ? "Searching..." : `${results.length} customer${results.length !== 1 ? 's' : ''} found`}
        </p>
      )}

      {/* RESULTS */}
      {results.length > 0 && !selectedCustomer && (
        <div className="border rounded mt-1 max-h-48 overflow-y-auto bg-white shadow">
          {results.map((c) => (
            <div
              key={c.id}
              onClick={() =>
                handleSelect(c)
              }
              className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-medium">
                {c.name}
              </div>

              <div className="text-sm text-gray-500">
                📞 {c.phone}
              </div>

              {c.email && (
                <div className="text-xs text-gray-400">
                  ✉ {c.email}
                </div>
              )}

              {c.gstNumber && (
                <div className="text-xs text-gray-400">
                  GST: {c.gstNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LOADING */}
      {loading && !selectedCustomer && (
        <p className="text-sm text-gray-500 mt-1">
          Searching...
        </p>
      )}

      {/* NO RESULTS */}
      {debouncedSearch && !loading && results.length === 0 && !selectedCustomer && (
        <p className="text-sm text-gray-500 mt-1">
          No customers found
        </p>
      )}

      {/* SELECTED CUSTOMER BANNER */}
      {selectedCustomer && (
        <div className="mt-2 flex items-start justify-between bg-green-50 border border-green-200 rounded p-3">
          <div className="text-green-700 text-sm flex-1">
            <div className="font-medium">
              {selectedCustomer.name}
            </div>
            <div className="text-xs mt-1 space-y-0.5">
              <div>📞 {selectedCustomer.phone}</div>
              {selectedCustomer.email && <div>✉ {selectedCustomer.email}</div>}
              {selectedCustomer.gstNumber && <div>GST: {selectedCustomer.gstNumber}</div>}
              {selectedCustomer.address && <div>📍 {selectedCustomer.address}</div>}
            </div>
          </div>
          
          {/* REMOVE BUTTON IN BANNER */}
          <button
            onClick={handleRemoveCustomer}
            className="text-gray-400 hover:text-red-600 transition-colors ml-2"
            title="Remove customer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
      )}

      {/* ADD NEW - HIDE WHEN CUSTOMER SELECTED */}
      {!selectedCustomer && (
        <button
          onClick={() =>
            setShowCreate(
              !showCreate
            )
          }
          className="text-blue-600 text-sm mt-2 hover:underline"
        >
          + Add New Customer
        </button>
      )}

      {/* CREATE FORM */}
      {showCreate && !selectedCustomer && (
        <div className="border rounded p-3 mt-2 space-y-2 bg-gray-50">
          <input
            placeholder="Name *"
            value={
              newCustomer.name
            }
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                name: e.target
                  .value,
              })
            }
            className="border p-2 w-full rounded"
          />

          <input
            placeholder="Phone *"
            value={
              newCustomer.phone
            }
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                phone:
                  e.target.value,
              })
            }
            className="border p-2 w-full rounded"
          />

          <input
            placeholder="Email"
            value={
              newCustomer.email
            }
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                email:
                  e.target.value,
              })
            }
            className="border p-2 w-full rounded"
          />

          <input
            placeholder="GST Number"
            value={
              newCustomer.gstNumber
            }
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                gstNumber:
                  e.target.value,
              })
            }
            className="border p-2 w-full rounded"
          />

          <textarea
            placeholder="Address"
            value={
              newCustomer.address
            }
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address:
                  e.target.value,
              })
            }
            className="border p-2 w-full rounded"
          />

          <button
            onClick={
              handleCreate
            }
            className="bg-green-600 text-white px-3 py-2 rounded text-sm w-full hover:bg-green-700"
          >
            Save Customer
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerSelection;