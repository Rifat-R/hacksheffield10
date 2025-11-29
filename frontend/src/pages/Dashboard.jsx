import { useState, useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product, onProductClick }) => {
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-gray-900/95" />
          
          {/* Top Info - Price Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="backdrop-blur-md shadow-lg text-base font-bold">
              ${product.price}
            </Badge>
          </div>

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="backdrop-blur-md shadow-lg">
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

          {/* View Details Link */}
          <div className="mt-4 pt-3 border-t border-gray-800">
            <div className="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1.5 transition-colors font-medium">
              <Info className="w-4 h-4" />
              View details
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
  const [displayCount, setDisplayCount] = useState(24);

  // Use React Query for caching and automatic refetching
  const { data: products = [], isLoading, error, isError } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
  });

  // Memoize displayed products to prevent recalculation
  const displayedProducts = useMemo(() => {
    return products.slice(0, displayCount);
  }, [products, displayCount]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 24, products.length));
  };

  const hasMore = displayCount < products.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            All Products
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Browse our complete collection ({products.length} products)
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-lg">No products available</p>
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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50"
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-50">
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
