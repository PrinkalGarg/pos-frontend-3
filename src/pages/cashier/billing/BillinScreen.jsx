import React, {
  useState,
  useEffect,
} from "react";
import ProductSearch from "./Components/ProductSearch";
import CartPanel from "./Components/CartPanel";
import HeldCartsTable from "./Components/HoldCartTable";
import api from "../../../api/axios";

const BillingScreen = () => {
  const [cart, setCart] =
    useState(null);
  const [loading, setLoading] =
    useState(true);

  // 🔥 Trigger for held carts refresh
  const [refreshHeld, setRefreshHeld] =
    useState(false);

  ////////////////////////////////////////////
  // Init Cart
  ////////////////////////////////////////////
  useEffect(() => {
    const initCart = async () => {
      try {
        let cartId =
          localStorage.getItem(
            "cartId"
          );

        if (cartId) {
          const res = await api.get(
            `/carts/${cartId}`
          );

          setCart(res.data);
        } else {
          const storeId =
            localStorage.getItem(
              "storeId"
            );

          const res =
            await api.post("/carts", {
              storeId,
            });

          cartId = res.data.id;

          localStorage.setItem(
            "cartId",
            cartId
          );

          setCart(res.data);
        }
      } catch (err) {
        console.error(
          "Cart init failed",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    initCart();
  }, []);

  ////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading billing...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* LEFT */}
      <div className="w-2/3 p-4 border-r">
        <ProductSearch
          cart={cart}
          setCart={setCart}
        />
      </div>

      {/* RIGHT */}
      <div className="w-1/3 p-4 space-y-4">
        <CartPanel
          cart={cart}
          setCart={setCart}
          triggerHeldRefresh={() =>
            setRefreshHeld((p) => !p)
          }
        />

        <HeldCartsTable
          setCart={setCart}
          refreshHeld={refreshHeld}
        />
      </div>
    </div>
  );
};

export default BillingScreen;