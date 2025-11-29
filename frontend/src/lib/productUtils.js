export const getProductImage = (product) =>
  product?.image_url ||
  product?.image ||
  product?.media?.[0]?.url ||
  product?.images?.[0] ||
  '';

export const normalizeProduct = (product, idx = 0) => ({
  ...product,
  id: product?.id ?? product?.external_id ?? `product-${idx}`,
  name: product?.name || product?.title || 'Untitled product',
  description: product?.description || 'No description available.',
  price: product?.price ?? 0,
  category: product?.category || 'Product',
  image_url: getProductImage(product)
});
