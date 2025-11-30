import { useState, useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Info, Plus, Edit2, Trash2, BarChart3, Package, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import ProductFormModal from '../components/ProductFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import { api } from '../lib/api';

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product, onProductClick, onEdit, onDelete }) => {
  return (
    <div
      onClick={() => onProductClick(product.id)}
      className="group cursor-pointer"
    >
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 h-[480px] flex flex-col">
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image_url || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-gray-900/95" />
          
          {/* Top Info - Price Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="backdrop-blur-md shadow-lg text-base font-bold px-2 py-1">
              ${product.price}
            </Badge>
          </div>

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="backdrop-blur-md shadow-lg px-2 py-1">
                {product.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Brand */}
            {product.brand && (
              <p className="text-purple-300 text-xs font-semibold tracking-wide uppercase">
                {product.brand}
              </p>
            )}
            
            {/* Product Name */}
            <h2 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
              {product.name}
            </h2>
            
            {/* Description */}
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Style Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {product.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-gray-300 border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
            <div className="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1.5 transition-colors font-medium">
              <Info className="w-4 h-4" />
              View details
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                title="Edit product"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product);
                }}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Delete product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Fetch function for React Query
const fetchProducts = async () => {
  const response = await fetch('http://localhost:5000/api/dashboard/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [displayCount, setDisplayCount] = useState(24);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState(null);

  // Use React Query for caching and automatic refetching
  const { data: products = [], isLoading, error, isError } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: (productData) => api.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard-products']);
      setIsFormModalOpen(false);
      setSelectedProduct(null);
      showToast('Product created successfully!', 'success');
    },
    onError: (error) => {
      showToast(error.message || 'Failed to create product', 'error');
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard-products']);
      setIsFormModalOpen(false);
      setSelectedProduct(null);
      showToast('Product updated successfully!', 'success');
    },
    onError: (error) => {
      showToast(error.message || 'Failed to update product', 'error');
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (productId) => api.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard-products']);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      showToast('Product deleted successfully!', 'success');
    },
    onError: (error) => {
      showToast(error.message || 'Failed to delete product', 'error');
    },
  });

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Handle form submission
  const handleFormSubmit = (formData) => {
    if (selectedProduct) {
      // Update existing product
      updateMutation.mutate({ id: selectedProduct.id, data: formData });
    } else {
      // Create new product
      createMutation.mutate(formData);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  // Handle edit action
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Handle add new product
  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  // Memoize displayed products to prevent recalculation
  const displayedProducts = useMemo(() => {
    return products.slice(0, displayCount);
  }, [products, displayCount]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active' || !p.status).length;
    const inactive = products.filter(p => p.status === 'inactive').length;
    return { total, active, inactive };
  }, [products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 24, products.length));
  };

  const hasMore = displayCount < products.length;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950 text-white">
      {/* Header with Add Button */}
      <div className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 shrink-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Brand Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage your product inventory ({products.length} products)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {/* TODO: Link to Grafana dashboard */}}
                className="font-semibold"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Open Analytics</span>
              </Button>
              <Button
                onClick={handleAddNew}
                variant="secondary"
                className="bg-purple-900/80 hover:bg-purple-800/80 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all hover:scale-105 shadow-lg border border-purple-700/50 hover:border-purple-600/50"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Bento Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Total Products */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Active Products */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-green-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            {/* Inactive Products */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-red-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Inactive</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.inactive}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-400 mb-4">Error: {error?.message || 'Failed to load products'}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-lg mb-4">No products yet</p>
            <Button
              onClick={handleAddNew}
              variant="secondary"
              className="bg-purple-900/80 hover:bg-purple-800/80 text-white px-6 py-3 rounded-lg flex items-center gap-2 border border-purple-700/50 hover:border-purple-600/50"
            >
              <Plus className="w-5 h-5" />
              Add Your First Product
            </Button>
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex flex-col items-center mt-12 gap-3">
                <p className="text-gray-400 text-sm">
                  Showing {displayCount} of {products.length} products
                </p>
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="font-semibold"
                >
                  Load More Products
                </Button>
              </div>
            )}
            
            {!hasMore && products.length > 24 && (
              <p className="text-center text-gray-400 mt-12">
                You've reached the end of the catalog
              </p>
            )}
          </>
        )}
        </div>
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name}
        isLoading={deleteMutation.isLoading}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="shrink-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors group"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
