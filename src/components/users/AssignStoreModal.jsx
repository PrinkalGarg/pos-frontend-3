import React from 'react';
import { X, Store } from 'lucide-react';

const AssignStoreModal = ({
  open,
  onClose,
  stores,
  selectedStore,
  setSelectedStore,
  onConfirm,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-indigo-100">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Assign Store
                </h3>
                <p className="text-sm text-gray-600">
                  Select a store for the manager
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Available Stores
              </label>
              <div className="relative">
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-4 pr-10 text-sm font-medium
                           transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none 
                           focus:ring-2 focus:ring-blue-200 hover:border-gray-300"
                  disabled={loading}
                >
                  <option value="">Select a store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name} - {store.location}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <Store className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {stores.length === 0 && (
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  No unassigned stores available. All stores are currently assigned.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold 
                       text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!selectedStore || loading}
              className="rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold 
                       text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 
                       hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Assigning...
                </>
              ) : (
                'Assign Store & Approve'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStoreModal;