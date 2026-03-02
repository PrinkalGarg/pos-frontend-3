import React, { useState } from "react";
import api from "../../../../api/axios";
import CustomerSelection from "./CustomerSelection";
import InvoicePDFGenerator from "./InvoicePDFGenerator";

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? "✓" : "✕";

  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slideIn`}>
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">{icon}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 text-lg">
          ✕
        </button>
      </div>
    </div>
  );
};

const CheckoutModal = ({ open, onClose, cart, setCart }) => {

  //////////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////////

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [payments, setPayments] = useState([{ mode: "CASH", amount: 0 }]);
  const [loading, setLoading] = useState(false);

  const [showPDFGenerator, setShowPDFGenerator] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  //////////////////////////////////////////////////////
  // TOAST
  //////////////////////////////////////////////////////

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  //////////////////////////////////////////////////////
  // CALCULATIONS
  //////////////////////////////////////////////////////

  const subtotal =
    cart?.items?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;

  const tax =
    cart?.items?.reduce(
      (sum, item) => sum + (item.price * item.qty * item.gstRate) / 100,
      0
    ) || 0;

  const grandTotal = subtotal + tax;

  const paidAmount = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const balance = grandTotal - paidAmount;

  //////////////////////////////////////////////////////
  // PAYMENT HANDLERS
  //////////////////////////////////////////////////////

  const handlePaymentChange = (index, field, value) => {
    const updated = [...payments];
    updated[index][field] = value;
    setPayments(updated);
  };

  const addPaymentRow = () => {
    setPayments([...payments, { mode: "CASH", amount: 0 }]);
  };

  const payFullCash = () => {
    setPayments([{ mode: "CASH", amount: grandTotal }]);
  };

  //////////////////////////////////////////////////////
  // CHECKOUT (Generate Invoice)
  //////////////////////////////////////////////////////

  const handleCheckout = async () => {
    try {
      if (paidAmount <= 0) {
        showToast("Please enter payment amount", "error");
        return;
      }

      setLoading(true);

      const cartId = localStorage.getItem("cartId");

      const res = await api.post("/checkout", {
        cartId,
        customerId: selectedCustomer?.id || null,
        payments,
      });

      setGeneratedInvoice(res.data);
      setShowPDFGenerator(true);

      // Reset cart
      localStorage.removeItem("cartId");
      const storeId = localStorage.getItem("storeId");
      const newCartRes = await api.post("/carts", { storeId });

      localStorage.setItem("cartId", newCartRes.data.id);
      setCart(newCartRes.data);

      showToast(`Invoice Created: ${res.data.invoice.invoiceNumber}`, "success");

    } catch (err) {
      showToast(
        err.response?.data?.error || err.message || "Checkout failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////////
  // UI GUARD
  //////////////////////////////////////////////////////

  if (!open) return null;

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {showPDFGenerator && generatedInvoice && (
        <InvoicePDFGenerator
          invoiceData={generatedInvoice}
          onClose={() => {
            setShowPDFGenerator(false);
            onClose();
          }}
        />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn { animation: slideIn 0.3s ease-out; }
        `
      }} />

      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40">
        <div className="bg-white w-[900px] rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Checkout</h2>
            <button onClick={onClose} className="text-red-500 text-lg hover:text-red-700">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">

            {/* LEFT */}
            <div>
              <h3 className="font-semibold mb-2">Cart Items</h3>

              <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex justify-between p-2 border-b last:border-b-0">
                    <span>{item.product?.name}</span>
                    <span>{item.qty} × ₹{item.price}</span>
                  </div>
                ))}
                {(!cart?.items || cart.items.length === 0) && (
                  <div className="p-4 text-center text-gray-500">No items in cart</div>
                )}
              </div>

              <div className="mt-4 font-bold text-lg flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="text-sm text-gray-600 flex justify-between">
                <span>Tax (GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="mt-2 pt-2 border-t font-bold text-xl flex justify-between text-blue-600">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* RIGHT */}
            <div>

              <CustomerSelection
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
              />

              <h3 className="font-semibold mt-4 mb-2">Payments</h3>

              {payments.map((pay, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={pay.mode}
                    onChange={(e) => handlePaymentChange(index, "mode", e.target.value)}
                    className="border p-2 rounded w-24"
                  >
                    <option>CASH</option>
                    <option>UPI</option>
                    <option>CARD</option>
                  </select>

                  <input
                    type="number"
                    value={pay.amount}
                    onChange={(e) => handlePaymentChange(index, "amount", Number(e.target.value))}
                    className="border p-2 rounded flex-1"
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}

              <div className="flex gap-4">
                <button onClick={addPaymentRow} className="text-blue-600 text-sm hover:underline">
                  + Add Payment
                </button>
                <button onClick={payFullCash} className="text-green-600 text-sm hover:underline">
                  Pay Full Cash
                </button>
              </div>

              <div className="mt-4 space-y-1 bg-gray-50 p-3 rounded">
                <div className="flex justify-between text-sm">
                  <span>Paid Amount:</span>
                  <span className="font-semibold">₹{paidAmount.toFixed(2)}</span>
                </div>

                <div className={`flex justify-between text-sm font-bold ${
                  balance > 0 ? "text-red-600" :
                  balance < 0 ? "text-green-600" :
                  "text-gray-600"
                }`}>
                  <span>
                    {balance > 0 ? "Balance Due:" :
                     balance < 0 ? "Change:" : "Balance:"}
                  </span>
                  <span>₹{Math.abs(balance).toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">

            <button
              onClick={() => {
                if (!generatedInvoice) {
                  showToast("Please generate invoice first", "error");
                  return;
                }
                setShowPDFGenerator(true);
              }}
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Generate PDF
            </button>

            <button
              disabled={loading}
              onClick={handleCheckout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Processing..." : "Generate Invoice"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;