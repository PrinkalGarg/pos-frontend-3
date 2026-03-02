import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import useDebounce from "../../../../hooks/useDebounce";

const ProductSearch = ({ setCart }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  //////////////////////////////////////////////////////
  // 🔎 Search products with loading state
  //////////////////////////////////////////////////////
  const fetchProducts = async (query) => {
    try {
      if (!query) {
        setProducts([]);
        setSearchError(null);
        return;
      }

      setIsLoading(true);
      setSearchError(null);

      const res = await api.get(
        `/products/search-product?query=${query}`
      );

      setProducts(res.data.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search failed", error);
      setSearchError("Failed to search products. Please try again.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  //////////////////////////////////////////////////////
  // 🛒 Add to cart with loading state
  //////////////////////////////////////////////////////
  const [addingToCart, setAddingToCart] = useState(null);

  const addToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      const cartId = localStorage.getItem("cartId");

      await api.post(`/carts/${cartId}/items`, {
        productId,
        qty: 1,
      });

      const res = await api.get(`/carts/${cartId}`);
      setCart(res.data);

      // Clear search after add
      setSearch("");
      setProducts([]);
      setShowDropdown(false);
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(null);
    }
  };

  //////////////////////////////////////////////////////
  // Render loading skeleton
  //////////////////////////////////////////////////////
  const renderLoadingSkeleton = () => (
    <div className="absolute w-full bg-white border mt-1 rounded shadow z-50">
      {[1, 2, 3].map((item) => (
        <div key={item} className="p-3 border-b animate-pulse">
          {/* Row 1 */}
          <div className="flex justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          {/* Row 2 */}
          <div className="flex justify-between mb-2">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/5"></div>
          </div>
          
          {/* Row 3 */}
          <div className="flex justify-between mb-2">
            <div className="h-3 bg-gray-200 rounded w-1/5"></div>
            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          </div>
          
          {/* Row 4 */}
          <div className="h-2 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  //////////////////////////////////////////////////////
  // Render empty state
  //////////////////////////////////////////////////////
  const renderEmptyState = () => (
    <div className="absolute w-full bg-white border mt-1 rounded shadow z-50 p-4 text-center">
      <p className="text-gray-500">No products found</p>
      <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
    </div>
  );

  //////////////////////////////////////////////////////
  // Render error state
  //////////////////////////////////////////////////////
  const renderErrorState = () => (
    <div className="absolute w-full bg-white border mt-1 rounded shadow z-50 p-4 text-center">
      <p className="text-red-500">⚠️ {searchError}</p>
      <button 
        onClick={() => fetchProducts(debouncedSearch)}
        className="text-sm text-blue-500 hover:text-blue-700 mt-2"
      >
        Try again
      </button>
    </div>
  );

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <div className="relative">
      {/* Search Input with loading indicator */}
      <div className="relative">
        <input
          placeholder="Search product by name / SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => products.length && setShowDropdown(true)}
          className="border p-2 w-full rounded pr-10"
        />
        
        {/* Loading spinner inside input */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {/* Clear button (optional) */}
        {search && !isLoading && (
          <button
            onClick={() => {
              setSearch("");
              setProducts([]);
              setShowDropdown(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown with states */}
      {showDropdown && (
        <>
          {/* Loading State */}
          {isLoading && renderLoadingSkeleton()}
          
          {/* Error State */}
          {!isLoading && searchError && renderErrorState()}
          
          {/* Empty State */}
          {!isLoading && !searchError && products.length === 0 && search && renderEmptyState()}
          
          {/* Products List */}
          {!isLoading && !searchError && products.length > 0 && (
            <div className="absolute w-full bg-white border mt-1 rounded shadow max-h-80 overflow-y-auto z-50">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p.id)}
                  className={`p-3 border-b hover:bg-gray-100 cursor-pointer transition-colors ${
                    addingToCart === p.id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {/* Row 1 */}
                  <div className="flex justify-between font-semibold">
                    <span>{p.name}</span>
                    <span>₹ {p.price}</span>
                  </div>

                  {/* Row 2 */}
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>SKU: {p.sku}</span>
                    <span>GST: {p.gstRate}%</span>
                  </div>

                  {/* Row 3 */}
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span>Category: {p.category?.name}</span>
                    <span>Stock: {p.stock}</span>
                  </div>

                  {/* Row 4 */}
                  <div className="text-xs text-gray-400 flex justify-between items-center">
                    <span>Store: {p.store?.name}</span>
                    {addingToCart === p.id && (
                      <span className="text-xs text-blue-500">
                        Adding...
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Results count */}
              <div className="p-2 text-xs text-gray-500 text-center border-t bg-gray-50">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSearch;