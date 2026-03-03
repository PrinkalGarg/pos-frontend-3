// import { useState, useEffect } from "react";
// import useAuth from "../../hooks/useAuth";
// import useDebounce from "../../hooks/useDebounce";

// import GenericForm from "../../components/common/GenericForm";
// import GenericToast from "../../components/common/GenericToast";
// import GenericTable from "../../components/common/GenericTable";

// import {
//   createCategory,
//   getCategories,
// } from "../../services/category.services";

// import {
//   createProduct,
//   checkSkuAvailability,
//   fetchProducts,
//   updateProductRequest,
//   deleteProductRequest,
// } from "../../services/product.services";

// const Products = () => {
//   const { user } = useAuth();

//   // ================= CATEGORY =================
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryLoading, setCategoryLoading] = useState(false);

//   // ================= PRODUCT =================
//   const [categories, setCategories] = useState([]);
//   const [productLoading, setProductLoading] = useState(false);
//   const [skuAvailable, setSkuAvailable] = useState(null);

//   const [productForm, setProductForm] = useState({
//     name: "",
//     sku: "",
//     price: "",
//     gstRate: "",
//     stock: "",
//     categoryId: "",
//   });

//   // ================= EDIT PRODUCT =================
//   const [editingProduct, setEditingProduct] = useState(null);

//   // ================= TABLE =================
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("ALL");
//   const [loadingTable, setLoadingTable] = useState(false);

//   const debouncedSearch = useDebounce(search, 2000);

//   // ================= FETCH CATEGORIES =================
//   const fetchCategories = async () => {
//     try {
//       const res = await getCategories();
//       setCategories(res.data?.data || []);
//     } catch {
//       GenericToast.error("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // ================= FETCH PRODUCTS =================
//   const loadProducts = async () => {
//     try {
//       setLoadingTable(true);

//       const res = await fetchProducts({
//         search: debouncedSearch,
//         isActive:
//           status === "ALL"
//             ? undefined
//             : status === "ACTIVE"
//             ? true
//             : false,
//       });

//       setProducts(res?.data?.data || []);
//     } catch {
//       GenericToast.error("Failed to load products");
//     } finally {
//       setLoadingTable(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, [debouncedSearch, status]);

//   // ================= SKU CHECK =================
//   useEffect(() => {
//     const checkSku = async () => {
//       if (!productForm.sku?.trim() || !user?.storeId) return;

//       try {
//         const res = await checkSkuAvailability(
//           productForm.sku.trim(),
//           user.storeId
//         );

//         setSkuAvailable(res.data.available);
//       } catch {
//         setSkuAvailable(null);
//       }
//     };

//     const delay = setTimeout(checkSku, 500);
//     return () => clearTimeout(delay);
//   }, [productForm.sku, user?.storeId]);

//   // ================= ADD CATEGORY =================
//   const handleAddCategory = async () => {
//     if (!categoryName.trim()) {
//       GenericToast.warning("Category name is required");
//       return;
//     }

//     try {
//       setCategoryLoading(true);
//       await createCategory({ name: categoryName.trim() });
//       GenericToast.success("Category created successfully");
//       setCategoryName("");
//       await fetchCategories();
//     } catch (err) {
//       GenericToast.error(
//         err?.response?.data?.message || "Failed to create category"
//       );
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   // ================= ADD PRODUCT =================
//   const handleAddProduct = async () => {
//     const { name, sku, price, gstRate, stock, categoryId } = productForm;

//     if (!name || !sku || !price || !gstRate || !stock || !categoryId) {
//       GenericToast.warning("All product fields are required");
//       return;
//     }

//     if (skuAvailable === false) {
//       GenericToast.error("SKU already exists in this store");
//       return;
//     }

//     try {
//       setProductLoading(true);

//       await createProduct({
//         name: name.trim(),
//         sku: sku.trim(),
//         price: Number(price),
//         gstRate: Number(gstRate),
//         stock: Number(stock),
//         categoryId,
//       });

//       GenericToast.success("Product created successfully");

//       setProductForm({
//         name: "",
//         sku: "",
//         price: "",
//         gstRate: "",
//         stock: "",
//         categoryId: "",
//       });

//       setSkuAvailable(null);
//       loadProducts();
//     } catch (err) {
//       GenericToast.error(
//         err?.response?.data?.message || "Failed to create product"
//       );
//     } finally {
//       setProductLoading(false);
//     }
//   };

//   // ================= UPDATE SUBMIT =================
//   const handleUpdateSubmit = async () => {
//     const original = editingProduct.original;
//     const updated = editingProduct;

//     const payload = { productId: original.id };

//     if (updated.name !== original.name) payload.name = updated.name;
//     if (updated.sku !== original.sku) payload.sku = updated.sku;
//     if (Number(updated.price) !== original.price)
//       payload.price = Number(updated.price);
//     if (Number(updated.gstRate) !== original.gstRate)
//       payload.gstRate = Number(updated.gstRate);
//     if (Number(updated.stock) !== original.stock)
//       payload.stock = Number(updated.stock);
//     if (updated.categoryId !== original.categoryId)
//       payload.categoryId = updated.categoryId;

//     if (Object.keys(payload).length === 1) {
//       GenericToast.info("No changes detected");
//       return;
//     }

//     await updateProductRequest(payload);

//     GenericToast.success("Update request sent");
//     setEditingProduct(null);
//     loadProducts();
//   };

//   // ================= TABLE COLUMNS =================
//   const columns = [
//     { key: "name", header: "Name" },
//     {
//       key: "category",
//       header: "Category",
//       render: (row) => row.category?.name || "—",
//     },
//     { key: "gstRate", header: "GST %" },
//     {
//       key: "price",
//       header: "Price",
//       render: (row) => `₹ ${row.price}`,
//     },
//     { key: "sku", header: "SKU" },
//     { key: "stock", header: "Stock" },
//     {
//       key: "store",
//       header: "Store",
//       render: (row) => row.store?.name || "—",
//     },
//     { key: "isActive", header: "Status", type: "status" },
//   ];

//   // ================= ROW ACTIONS =================
//   const rowActions = (row) => {
//     if (!row.isActive) return null;

//     return (
//       <div className="flex gap-2">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setEditingProduct({
//               ...row,
//               original: row,
//             });
//           }}
//           className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white"
//         >
//           Update
//         </button>

//         <button
//           onClick={(e) => {
//             e.stopPropagation();

//             GenericToast.confirm({
//               message: `Delete ${row.name}?`,
//               confirmText: "Delete",
//               type: "error",
//               onConfirm: async () => {
//                 await deleteProductRequest(row.id);
//                 GenericToast.warning("Delete request sent");
//                 loadProducts();
//               },
//             });
//           }}
//           className="px-3 py-1 text-xs rounded-md bg-red-600 text-white"
//         >
//           Delete
//         </button>
//       </div>
//     );
//   };

//   const searchFilters = [
//     {
//       key: "status",
//       label: "Status",
//       options: [
//         { value: "ALL", label: "All Products" },
//         { value: "ACTIVE", label: "Active" },
//         { value: "INACTIVE", label: "Inactive" },
//       ],
//       value: status,
//       onChange: setStatus,
//     },
//   ];

//   return (
//     <div className="p-4 max-w-7xl mx-auto space-y-8">
//       <h2 className="text-lg font-semibold">Inventory Management</h2>

//       <GenericForm
//         title="Add Category"
//         compact
//         submitText="Create Category"
//         loading={categoryLoading}
//         onSubmit={handleAddCategory}
//         fields={[
//           {
//             name: "category",
//             placeholder: "Category Name",
//             value: categoryName,
//             onChange: setCategoryName,
//           },
//         ]}
//       />

//       <GenericForm
//         title="Add Stock"
//         submitText="Create Stock"
//         loading={productLoading}
//         onSubmit={handleAddProduct}
//         fields={[
//           {
//             label:"Product Name",
//             name: "name",
//             placeholder: "Product Name",
//             value: productForm.name,
//             onChange: (v) =>
//               setProductForm((p) => ({ ...p, name: v })),
//           },
//           {
//             label:"SKU",
//             name: "sku",
//             placeholder: "SKU",
//             value: productForm.sku,
//             onChange: (v) =>
//               setProductForm((p) => ({ ...p, sku: v })),
//             error: skuAvailable === false ? "SKU already exists" : null,
//             helperText:
//               skuAvailable === true ? "SKU available" : null,
//             success: skuAvailable === true,
//           },
//           {
//             label:"Price",
//             name: "price",
//             placeholder: "Price",
//             value: productForm.price,
//             onChange: (v) =>
//               setProductForm((p) => ({ ...p, price: v })),
//           },
//           {
//             label:"GST Rate (%)",
//             name: "gstRate",
//             placeholder: "GST %",
//             value: productForm.gstRate,
//             onChange: (v) =>
//               setProductForm((p) => ({ ...p, gstRate: v })),
//           },
//           {
//             label:"Number of Stocks",
//             name: "stock",
//             placeholder: "Stock",
//             value: productForm.stock,
//             onChange: (v) =>
//               setProductForm((p) => ({ ...p, stock: v })),
//           },
//           {
//             label:"Category",
//             name: "categoryId",
//             type: "select",
//             value: productForm.categoryId,
//             onChange: (v) =>
//               setProductForm((p) => ({ ...p, categoryId: v })),
//             options: categories.map((cat) => ({
//               value: cat.id,
//               label: `${cat.name} (${cat._count?.products || 0})`,
//             })),
//           },
//         ]}
//       />

//       <div className="pt-6 border-t">
//         <GenericTable
//           columns={columns}
//           data={products}
//           searchFilters={searchFilters}
//           searchPlaceholder="Search products..."
//           onSearch={setSearch}
//           loading={loadingTable}
//           rowActions={rowActions}
//           striped
//           hoverable
//         />
//       </div>

//       {/* EDIT MODAL */}
//       {editingProduct && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
//             <h3 className="font-semibold text-lg">
//               Update {editingProduct.name}
//             </h3>

//             <GenericForm
//               submitText="Send Update Request"
//               onSubmit={handleUpdateSubmit}
//               fields={[
//                 {
//                   name: "name",
//                   value: editingProduct.name,
//                   onChange: (v) =>
//                     setEditingProduct((p) => ({
//                       ...p,
//                       name: v,
//                     })),
//                 },
//                 {
//                   name: "sku",
//                   value: editingProduct.sku,
//                   onChange: (v) =>
//                     setEditingProduct((p) => ({
//                       ...p,
//                       sku: v,
//                     })),
//                 },
//                 {
//                   name: "price",
//                   value: editingProduct.price,
//                   onChange: (v) =>
//                     setEditingProduct((p) => ({
//                       ...p,
//                       price: v,
//                     })),
//                 },
//                 {
//                   name: "gstRate",
//                   value: editingProduct.gstRate,
//                   onChange: (v) =>
//                     setEditingProduct((p) => ({
//                       ...p,
//                       gstRate: v,
//                     })),
//                 },
//                 {
//                   name: "stock",
//                   value: editingProduct.stock,
//                   onChange: (v) =>
//                     setEditingProduct((p) => ({
//                       ...p,
//                       stock: v,
//                     })),
//                 },
//                 {
//                   name: "categoryId",
//                   type: "select",
//                   value: editingProduct.categoryId,
//                   onChange: (v) =>
//                     setEditingProduct((p) => ({
//                       ...p,
//                       categoryId: v,
//                     })),
//                   options: categories.map((cat) => ({
//                     value: cat.id,
//                     label: cat.name,
//                   })),
//                 },
//               ]}
//             />

//             <button
//               onClick={() => setEditingProduct(null)}
//               className="text-sm text-gray-500"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

import GenericForm from "../../components/common/GenericForm";
import GenericToast from "../../components/common/GenericToast";

import {
  createCategory,
  getCategories,
} from "../../services/category.services";

import {
  createProduct,
  checkSkuAvailability,
} from "../../services/product.services";

const Products = () => {
  const { user } = useAuth();

  // ================= CATEGORY =================
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  // ================= PRODUCT =================
  const [categories, setCategories] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [skuAvailable, setSkuAvailable] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    price: "",
    gstRate: "",
    stock: "",
    categoryId: "",
  });

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data?.data || []);
    } catch {
      GenericToast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= SKU CHECK =================
  useEffect(() => {
    const checkSku = async () => {
      if (!productForm.sku?.trim() || !user?.storeId) return;

      try {
        const res = await checkSkuAvailability(
          productForm.sku.trim(),
          user.storeId
        );

        setSkuAvailable(res.data.available);
      } catch {
        setSkuAvailable(null);
      }
    };

    const delay = setTimeout(checkSku, 500);
    return () => clearTimeout(delay);
  }, [productForm.sku, user?.storeId]);

  // ================= ADD CATEGORY =================
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      GenericToast.warning("Category name is required");
      return;
    }

    try {
      setCategoryLoading(true);
      await createCategory({ name: categoryName.trim() });
      GenericToast.success("Category created successfully");
      setCategoryName("");
      await fetchCategories();
    } catch (err) {
      GenericToast.error(
        err?.response?.data?.message || "Failed to create category"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // ================= ADD PRODUCT =================
  const handleAddProduct = async () => {
    const { name, sku, price, gstRate, stock, categoryId } = productForm;

    if (!name || !sku || !price || !gstRate || !stock || !categoryId) {
      GenericToast.warning("All product fields are required");
      return;
    }

    if (skuAvailable === false) {
      GenericToast.error("SKU already exists in this store");
      return;
    }

    try {
      setProductLoading(true);

      await createProduct({
        name: name.trim(),
        sku: sku.trim(),
        price: Number(price),
        gstRate: Number(gstRate),
        stock: Number(stock),
        categoryId,
      });

      GenericToast.success("Product created successfully");

      setProductForm({
        name: "",
        sku: "",
        price: "",
        gstRate: "",
        stock: "",
        categoryId: "",
      });

      setSkuAvailable(null);
    } catch (err) {
      GenericToast.error(
        err?.response?.data?.message || "Failed to create product"
      );
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8">
      <h2 className="text-lg font-semibold">Inventory Management</h2>

      <GenericForm
        title="Add Category"
        compact
        submitText="Create Category"
        loading={categoryLoading}
        onSubmit={handleAddCategory}
        fields={[
          {
            name: "category",
            placeholder: "Category Name",
            value: categoryName,
            onChange: setCategoryName,
          },
        ]}
      />

      <GenericForm
        title="Add Stock"
        submitText="Create Stock"
        loading={productLoading}
        onSubmit={handleAddProduct}
        fields={[
          {
            label: "Product Name",
            name: "name",
            placeholder: "Product Name",
            value: productForm.name,
            onChange: (v) =>
              setProductForm((p) => ({ ...p, name: v })),
          },
          {
            label: "SKU",
            name: "sku",
            placeholder: "SKU",
            value: productForm.sku,
            onChange: (v) =>
              setProductForm((p) => ({ ...p, sku: v })),
            error: skuAvailable === false ? "SKU already exists" : null,
            helperText:
              skuAvailable === true ? "SKU available" : null,
            success: skuAvailable === true,
          },
          {
            label: "Price",
            name: "price",
            placeholder: "Price",
            value: productForm.price,
            onChange: (v) =>
              setProductForm((p) => ({ ...p, price: v })),
          },
          {
            label: "GST Rate (%)",
            name: "gstRate",
            placeholder: "GST %",
            value: productForm.gstRate,
            onChange: (v) =>
              setProductForm((p) => ({ ...p, gstRate: v })),
          },
          {
            label: "Number of Stocks",
            name: "stock",
            placeholder: "Stock",
            value: productForm.stock,
            onChange: (v) =>
              setProductForm((p) => ({ ...p, stock: v })),
          },
          {
            label: "Category",
            name: "categoryId",
            type: "select",
            value: productForm.categoryId,
            onChange: (v) =>
              setProductForm((p) => ({ ...p, categoryId: v })),
            options: categories.map((cat) => ({
              value: cat.id,
              label: `${cat.name} (${cat._count?.products || 0})`,
            })),
          },
        ]}
      />
    </div>
  );
};

export default Products;