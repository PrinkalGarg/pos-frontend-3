import React, {
  useEffect,
  useState,
} from "react";
import api from "../../../../api/axios";
import Button from "../../../../components/common/Button";
import CheckoutModal from "./CheckoutModule";

const CartPanel = ({
  cart,
  setCart,
  triggerHeldRefresh,
}) => {
  //////////////////////////////////////////////////////
  // State
  //////////////////////////////////////////////////////
  const [loadingItemId, setLoadingItemId] =
    useState(null);

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const [openCheckout, setOpenCheckout] =
    useState(false);

 //////////////////////////////////////////////////////
// 🆕 Auto ensure active cart on load/update
//////////////////////////////////////////////////////
useEffect(() => {
  if (cart?.status === "CONVERTED") {
    ensureActiveCart(cart);
  }
}, [cart]);

  if (!cart) {
    return <p>No cart found</p>;
  }

  //////////////////////////////////////////////////////
  // Refresh Cart
  //////////////////////////////////////////////////////
const refreshCart = async () => {
  const cartId = localStorage.getItem("cartId");

  const res = await api.get(`/carts/${cartId}`);

  await ensureActiveCart(res.data);
};

  //////////////////////////////////////////////////////
// 🆕 Ensure Active Cart
//////////////////////////////////////////////////////
const ensureActiveCart = async (cartData) => {
  if (cartData?.status === "CONVERTED") {
    try {
      console.log("Cart converted → Creating new cart");

      localStorage.removeItem("cartId");

      const storeId = localStorage.getItem("storeId");

      const res = await api.post("/carts", {
        storeId,
      });

      localStorage.setItem("cartId", res.data.id);

      setCart(res.data);
    } catch (err) {
      console.error("New cart creation failed", err);
    }
  } else {
    setCart(cartData);
  }
};
  //////////////////////////////////////////////////////
  // ➕ Increase Qty
  //////////////////////////////////////////////////////
  const increaseQty = async (item) => {
    try {
      setLoadingItemId(item.id);

      const cartId =
        localStorage.getItem("cartId");

      await api.post(
        `/carts/${cartId}/items`,
        {
          productId: item.productId,
          qty: 1,
        }
      );

      await refreshCart();
    } finally {
      setLoadingItemId(null);
    }
  };

  //////////////////////////////////////////////////////
  // ➖ Decrease Qty
  //////////////////////////////////////////////////////
  const decreaseQty = async (item) => {
    try {
      setLoadingItemId(item.id);

      if (item.qty === 1) {
        return removeItem(item.id);
      }

      await api.patch(
        `/carts/items/${item.id}`,
        {
          qty: item.qty - 1,
        }
      );

      await refreshCart();
    } finally {
      setLoadingItemId(null);
    }
  };

  //////////////////////////////////////////////////////
  // ❌ Remove Item
  //////////////////////////////////////////////////////
  const removeItem = async (itemId) => {
    try {
      setLoadingItemId(itemId);

      await api.delete(
        `/carts/items/${itemId}`
      );

      await refreshCart();
    } finally {
      setLoadingItemId(null);
    }
  };

  //////////////////////////////////////////////////////
  // 🟡 Hold Cart
  //////////////////////////////////////////////////////
  const holdCart = async () => {
    try {
      const cartId =
        localStorage.getItem("cartId");

      await api.post(
        `/carts/${cartId}/hold`
      );

      triggerHeldRefresh();

      localStorage.removeItem(
        "cartId"
      );

      const storeId =
        localStorage.getItem(
          "storeId"
        );

      const res = await api.post(
        "/carts",
        { storeId }
      );

      localStorage.setItem(
        "cartId",
        res.data.id
      );

      setCart(res.data);
    } catch (err) {
      console.error(
        "Hold cart failed",
        err
      );
    }
  };

  //////////////////////////////////////////////////////
  // 💰 Grand Total
  //////////////////////////////////////////////////////
  const grandTotal =
    cart.items?.reduce(
      (sum, item) =>
        sum + item.total,
      0
    ) || 0;

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Cart
      </h2>

      {/* Empty Cart */}
      {!cart.items?.length && (
        <p>No items added</p>
      )}

      {/* Items */}
      {cart.items?.map((item) => {
        const isLoading =
          loadingItemId === item.id;

        return (
          <div
            key={item.id}
            className="border rounded p-3 mb-3 relative"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm font-semibold">
                Updating...
              </div>
            )}

            <div className="font-semibold text-lg">
              {item.product.name}
            </div>

            <div className="text-sm text-gray-500">
              SKU: {item.product.sku}
            </div>

            <div className="text-sm">
              GST: {item.product.gstRate}%
            </div>

            <div className="text-sm">
              Price: ₹{item.price}
            </div>

            {/* Qty Controls */}
            <div className="flex items-center gap-3 mt-2">
              <button
                disabled={isLoading}
                onClick={() =>
                  decreaseQty(item)
                }
                className="bg-gray-200 px-2 disabled:opacity-50"
              >
                ➖
              </button>

              <span className="font-bold">
                {item.qty}
              </span>

              <button
                disabled={isLoading}
                onClick={() =>
                  increaseQty(item)
                }
                className="bg-gray-200 px-2 disabled:opacity-50"
              >
                ➕
              </button>

              <button
                disabled={isLoading}
                onClick={() =>
                  removeItem(item.id)
                }
                className="ml-auto text-red-600 disabled:opacity-50"
              >
                Remove
              </button>
            </div>

            <div className="text-right font-semibold mt-2">
              Total: ₹{item.total}
            </div>
          </div>
        );
      })}

      {/* Grand Total */}
      <div className="text-xl font-bold text-right mt-4">
        Grand Total: ₹{grandTotal}
      </div>

      {/* Actions */}
      <div className="space-y-2 mt-4">

        {/* HOLD */}
        <Button onClick={holdCart}>
          Hold Cart
        </Button>

        {/* CHECKOUT BUTTON */}
        <Button
          onClick={() =>
            setOpenCheckout(true)
          }
          disabled={
            !cart.items?.length
          }
        >
          Checkout
        </Button>
      </div>

      {/* CHECKOUT MODAL */}
     <CheckoutModal
  open={openCheckout}
  onClose={() =>
    setOpenCheckout(false)
  }
  cart={cart}
  setCart={setCart}   // 👈 ADD THIS
/>
    </div>
  );
};

export default CartPanel;
