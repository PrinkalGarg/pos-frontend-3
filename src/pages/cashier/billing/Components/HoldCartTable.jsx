import React, {
  useEffect,
  useState,
} from "react";
import api from "../../../../api/axios";
import GenericTable from "../../../../components/common/GenericTable";
import Button from "../../../../components/common/Button";

const HeldCartsTable = ({
  setCart,
  refreshHeld,
}) => {
  const [heldCarts, setHeldCarts] =
    useState([]);
  const [loading, setLoading] =
    useState(false);

  ////////////////////////////////////////////
  // Fetch held carts
  ////////////////////////////////////////////
  const fetchHeldCarts =
    async () => {
      try {
        setLoading(true);

        const res = await api.get(
          "/carts?status=HELD"
        );

        setHeldCarts(
          res.data.data || []
        );
      } finally {
        setLoading(false);
      }
    };

  ////////////////////////////////////////////
  // Refresh when hold happens
  ////////////////////////////////////////////
  useEffect(() => {
    fetchHeldCarts();
  }, [refreshHeld]);

  ////////////////////////////////////////////
  // Resume cart
  ////////////////////////////////////////////
  const resumeCart =
    async (cart) => {
      await api.post(
        `/carts/${cart.id}/resume`
      );

      localStorage.setItem(
        "cartId",
        cart.id
      );

      const res = await api.get(
        `/carts/${cart.id}`
      );

      setCart(res.data);

      fetchHeldCarts();
    };

  ////////////////////////////////////////////
  // Columns
  ////////////////////////////////////////////
  const columns = [
    {
      key: "id",
      header: "Cart ID",
      render: (r) =>
        r.id.slice(0, 8),
    },
    {
      key: "items",
      header: "Items",
      render: (r) =>
        r.items.length,
    },
    {
      key: "createdBy",
      header: "Cashier",
      render: (r) =>
        r.createdBy.name,
    },
    {
      key: "status",
      header: "Status",
      type: "badge",
    },
  ];

  const rowActions = (row) => (
    <Button
      onClick={() =>
        resumeCart(row)
      }
    >
      Resume
    </Button>
  );

  ////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////
  return (
    <GenericTable
      columns={columns}
      data={heldCarts}
      loading={loading}
      rowActions={rowActions}
      emptyMessage="No held carts"
    />
  );
};

export default HeldCartsTable;