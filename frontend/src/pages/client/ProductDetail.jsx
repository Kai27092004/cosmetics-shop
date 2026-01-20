import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService';
import { getImageUrl } from '../../utils/helpers';
import { formatCurrency } from '../../utils/formatters';
import useCart from '../../hooks/useCart';
import Loading from '../../components/common/Loading';
import showToast from '../../utils/toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        setSelectedImage(0); // Reset to main image when product changes
        setCurrentSlide(0); // Reset carousel to first slide
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Combine main image with sub-images (max 6 total: 1 main + 5 sub)
  const allImages = product ? [
    { imageUrl: product.imageUrl, isMain: true },
    ...(product.images?.slice(0, 5).map(img => ({ ...img, isMain: false })) || [])
  ] : [];

  // Carousel logic: Show 5 thumbnails at a time
  const THUMBNAILS_PER_PAGE = 5;
  const totalSlides = Math.ceil(allImages.length / THUMBNAILS_PER_PAGE);
  const startIndex = currentSlide * THUMBNAILS_PER_PAGE;
  const endIndex = startIndex + THUMBNAILS_PER_PAGE;
  const visibleThumbnails = allImages.slice(startIndex, endIndex);

  // Debug: Log product data
  useEffect(() => {
    if (product) {
      console.log('📦 Product data:', product);
      console.log('🖼️ Product images:', product.images);
      console.log('🎨 All images array:', allImages);
      console.log('🔍 Selected image index:', selectedImage);
      console.log('🎠 Current slide:', currentSlide, '/', totalSlides - 1);
      console.log('👀 Visible thumbnails:', visibleThumbnails);
    }
  }, [product, selectedImage, currentSlide]);

  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value) || 1;
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > product.stockQuantity) {
      setQuantity(product.stockQuantity);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1));
  };

  const handleAddToCart = () => {
    const result = addToCart(product, quantity);
    if (result.success) {
      showToast.success(result.message);
    } else {
      showToast.error(result.message);
    }
  };

  const handleBuyNow = () => {
    const result = addToCart(product, quantity);
    if (result.success) {
      navigate('/cart');
    } else {
      showToast.error(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20">
        <Loading size="lg" text="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-red-600 mb-6">{error || 'Không tìm thấy sản phẩm'}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors font-semibold">
            Trang chủ
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/products" className="text-gray-600 hover:text-pink-600 transition-colors font-semibold">
            Sản phẩm
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-bold">{product.name}</span>
        </nav>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Image Gallery */}
            <div>
              {/* Main Image - Show selected image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4 shadow-xl border-4 border-white">
                <img
                  src={getImageUrl(allImages[selectedImage]?.imageUrl || product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23f0f0f0" width="600" height="600"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" dy="10" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Image Thumbnails Carousel (Show 5 at a time) */}
              {allImages.length > 0 && (
                <div className="relative">
                  {/* Left Arrow Button */}
                  {totalSlides > 1 && (
                    <button
                      onClick={handlePrevSlide}
                      disabled={currentSlide === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-50 hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white"
                      aria-label="Previous thumbnails"
                    >
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Thumbnails Grid */}
                  <div className="grid grid-cols-5 gap-3">
                    {visibleThumbnails.map((image, visibleIndex) => {
                      const actualIndex = startIndex + visibleIndex;
                      return (
                        <div
                          key={actualIndex}
                          onClick={() => setSelectedImage(actualIndex)}
                          className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all shadow-md cursor-pointer ${selectedImage === actualIndex
                              ? 'ring-pink-500 ring-4 scale-105 shadow-lg'
                              : 'ring-gray-200 hover:ring-pink-300 hover:scale-105'
                            }`}
                        >
                          <img
                            src={getImageUrl(image.imageUrl)}
                            alt={`${product.name} - ${image.isMain ? 'Ảnh chính' : `Ảnh ${actualIndex}`}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Arrow Button */}
                  {totalSlides > 1 && (
                    <button
                      onClick={handleNextSlide}
                      disabled={currentSlide === totalSlides - 1}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-50 hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white"
                      aria-label="Next thumbnails"
                    >
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              {product.category && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-bold uppercase tracking-wide">
                    {product.category.name}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price & Stock */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-baseline gap-3 mb-4">
                  <p className="text-5xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Còn {product.stockQuantity} sản phẩm</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 font-semibold">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Hết hàng</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Mô tả sản phẩm
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              {product.stockQuantity > 0 && (
                <div className="mb-8">
                  <label className="block text-lg font-black text-gray-900 mb-3">
                    Số lượng
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl hover:from-pink-100 hover:to-purple-100 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-24 text-center text-2xl font-black border-2 border-gray-300 rounded-xl py-3 focus:outline-none focus:border-pink-500 transition-all"
                      min="1"
                      max={product.stockQuantity}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                      className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl hover:from-pink-100 hover:to-purple-100 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {product.stockQuantity > 0 ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 px-8 py-4 border-2 border-pink-500 text-pink-600 font-black rounded-xl hover:bg-pink-50 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {isInCart(product.id) ? 'Thêm nữa' : 'Thêm vào giỏ'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-lg"
                    >
                      Mua ngay
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full px-8 py-4 bg-gray-300 text-gray-500 font-black rounded-xl cursor-not-allowed text-lg"
                  >
                    Hết hàng
                  </button>
                )}
              </div>

              {/* In Cart Info */}
              {isInCart(product.id) && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                  <p className="text-green-800 font-bold flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Sản phẩm đã có {getItemQuantity(product.id)} trong giỏ hàng
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}