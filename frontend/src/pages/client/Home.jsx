import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/custom.css';

// Dữ liệu sản phẩm tĩnh - không cần gọi API
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Son Dưỡng Ẩm Cao Cấp #1',
    price: 299000,
    originalPrice: 399000,
    image: '/son-duong-am-1.jpg',
    rating: 4.8,
    sold: 1250,
    discount: 25,
    category: 'Son Dưỡng'
  },
  {
    id: 2,
    name: 'Son Dưỡng Ẩm Thiên Nhiên #2',
    price: 249000,
    originalPrice: 329000,
    image: '/son-duong-am-2.jpg',
    rating: 4.9,
    sold: 2100,
    discount: 24,
    category: 'Son Dưỡng'
  },
  {
    id: 3,
    name: 'Son Dưỡng Ẩm Vitamin E #3',
    price: 279000,
    originalPrice: 359000,
    image: '/son-duong-am-3.jpg',
    rating: 4.7,
    sold: 890,
    discount: 22,
    category: 'Son Dưỡng'
  },
  {
    id: 4,
    name: 'Son Dưỡng Ẩm Hoa Hồng #4',
    price: 319000,
    originalPrice: 429000,
    image: '/son-duong-am-4.jpg',
    rating: 4.9,
    sold: 1580,
    discount: 26,
    category: 'Son Dưỡng'
  },
  {
    id: 5,
    name: 'Son Dưỡng Ẩm Luxury #5',
    price: 349000,
    originalPrice: 469000,
    image: '/son-duong-am-5.jpg',
    rating: 5.0,
    sold: 3200,
    discount: 26,
    category: 'Son Dưỡng'
  },
  {
    id: 6,
    name: 'Son Dưỡng Ẩm Organic #1',
    price: 289000,
    originalPrice: 379000,
    image: '/son-duong-am-1-1.jpg',
    rating: 4.6,
    sold: 750,
    discount: 24,
    category: 'Son Dưỡng'
  },
  {
    id: 7,
    name: 'Son Dưỡng Ẩm Premium #2',
    price: 329000,
    originalPrice: 439000,
    image: '/son-duong-am-2-1.jpg',
    rating: 4.8,
    sold: 1420,
    discount: 25,
    category: 'Son Dưỡng'
  },
  {
    id: 8,
    name: 'Son Dưỡng Ẩm Deluxe #3',
    price: 359000,
    originalPrice: 479000,
    image: '/son-duong-am-3-1.jpg',
    rating: 4.9,
    sold: 2890,
    discount: 25,
    category: 'Son Dưỡng'
  }
];

export default function Home() {
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Lấy hàm addItem từ cart store
  const addItem = useCartStore((state) => state.addItem);

  // Hàm thêm sản phẩm vào giỏ hàng với Toastify
  const handleAddToCart = (product) => {
    try {
      console.log('🛒 Attempting to add product to cart:', product);

      // Chuẩn bị product data với đầy đủ thông tin cho cart
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.image,
        image: product.image,
        rating: product.rating,
        category: product.category,
        discount: product.discount
      };

      addItem(cartProduct, 1);
      console.log('✅ Product added successfully!');

      // Hiển thị toast thành công ở giữa màn hình
      toast.success(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          marginTop: '45vh',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      });

    } catch (error) {
      console.error('❌ Error adding to cart:', error);

      // Hiển thị toast lỗi
      toast.error('❌ Lỗi: Không thể thêm vào giỏ hàng!', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          marginTop: '45vh',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      });
    }
  };

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50">
      {/* Hero Section with 3D Effects */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white"
      >
        {/* Animated Background Shapes */}
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full floating-element blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/20 rounded-full floating-element-reverse blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-300/20 rounded-full floating-element blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-blue-300/20 rounded-full floating-element-reverse blur-lg"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center parallax-container">
            {/* Main Heading with 3D Effect */}
            <div
              className="parallax-layer"
              style={{
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
              }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 fade-in-up">
                <span className="block gradient-text drop-shadow-2xl">
                  Cosmetics Shop
                </span>
                <span className="block text-3xl md:text-5xl mt-4 font-bold text-white/90">
                  Vẻ Đẹp Hoàn Hảo
                </span>
              </h1>
            </div>

            {/* Subtitle with Glass Effect */}
            <div
              className="parallax-layer fade-in-up delay-200"
              style={{
                transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
              }}
            >
              <div className="inline-block glass-dark rounded-2xl px-8 py-4 mb-8 backdrop-blur-md">
                <p className="text-xl md:text-2xl text-white font-medium">
                  ✨ Mỹ phẩm chính hãng • Giá tốt nhất • Giao hàng nhanh 24h ✨
                </p>
              </div>
            </div>

            {/* CTA Buttons with 3D Effect */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up delay-400"
              style={{
                transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
              }}
            >
              <Link to="/products">
                <button className="btn-3d px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300">
                  🛍️ Khám Phá Ngay
                </button>
              </Link>
              <Link to="/about">
                <button className="btn-3d px-8 py-4 glass border-2 border-white/50 text-white rounded-xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all duration-300">
                  💎 Tìm Hiểu Thêm
                </button>
              </Link>
            </div>

            {/* Floating Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto fade-in-up delay-600">
              <div className="glass-dark rounded-xl p-4 card-3d">
                <div className="text-3xl md:text-4xl font-black text-white">1000+</div>
                <div className="text-sm md:text-base text-white/80 mt-1">Sản phẩm</div>
              </div>
              <div className="glass-dark rounded-xl p-4 card-3d">
                <div className="text-3xl md:text-4xl font-black text-white">50K+</div>
                <div className="text-sm md:text-base text-white/80 mt-1">Khách hàng</div>
              </div>
              <div className="glass-dark rounded-xl p-4 card-3d">
                <div className="text-3xl md:text-4xl font-black text-white">99%</div>
                <div className="text-sm md:text-base text-white/80 mt-1">Hài lòng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#wave-gradient)" />
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249, 250, 251, 0.1)" />
                <stop offset="100%" stopColor="rgba(249, 250, 251, 1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Featured Products Section - ĐÃ CHUYỂN LÊN TRƯỚC */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
                ⭐ BEST SELLERS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Sản Phẩm <span className="gradient-text">Nổi Bật</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm được yêu thích và đánh giá cao nhất bởi khách hàng
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {MOCK_PRODUCTS.map((product, index) => (
              <div key={product.id} className="product-grid-item">
                <div className="card-3d h-full">
                  {/* Custom Product Card */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    {/* Product Image - CLICKABLE */}
                    <Link to={`/products/${product.id}`} className="relative overflow-hidden bg-gray-100 aspect-square block cursor-pointer group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg pointer-events-none">
                          -{product.discount}%
                        </div>
                      )}
                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg pointer-events-none">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-gray-900">{product.rating}</span>
                      </div>
                      {/* Hover Overlay - POINTER EVENTS NONE */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                          👁️ Xem Chi Tiết
                        </span>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col relative z-10">
                      {/* Category */}
                      <div className="text-xs text-purple-600 font-semibold mb-2">
                        {product.category}
                      </div>

                      {/* Product Name - Also clickable */}
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 flex-1 hover:text-purple-600 transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Sold Count */}
                      <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <span>🔥</span>
                        <span>Đã bán {product.sold.toLocaleString()}</span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl md:text-2xl font-black text-pink-600">
                            {product.price.toLocaleString()}₫
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {product.originalPrice.toLocaleString()}₫
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button - WITH ONCLICK */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event bubbling
                          handleAddToCart(product);
                        }}
                        className="relative z-20 w-full btn-3d bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                        type="button"
                      >
                        <span>🛒</span>
                        <span>Thêm Vào Giỏ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center fade-in-up delay-400">
            <Link to="/products">
              <button className="btn-3d px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300">
                🎁 Xem Tất Cả Sản Phẩm →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards - ĐÃ CHUYỂN XUỐNG SAU */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Tại Sao Chọn <span className="gradient-text">Chúng Tôi?</span>
            </h2>
            <p className="text-xl text-gray-600">
              Cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card-3d bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl slide-in-left">
              <div className="icon-wrapper w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Chính Hãng 100%</h3>
              <p className="text-gray-600 leading-relaxed">
                Cam kết sản phẩm chính hãng, nguồn gốc xuất xứ rõ ràng, có tem chống hàng giả
              </p>
              <div className="mt-6 flex items-center text-pink-600 font-semibold">
                <span>Xem chi tiết</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card-3d bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl fade-in-up delay-200">
              <div className="icon-wrapper w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Giá Tốt Nhất</h3>
              <p className="text-gray-600 leading-relaxed">
                Giá cạnh tranh nhất thị trường, nhiều chương trình khuyến mãi hấp dẫn mỗi tuần
              </p>
              <div className="mt-6 flex items-center text-purple-600 font-semibold">
                <span>Xem ưu đãi</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card-3d bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl slide-in-right">
              <div className="icon-wrapper w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Giao Hàng Nhanh</h3>
              <p className="text-gray-600 leading-relaxed">
                Giao hàng toàn quốc trong 24h, miễn phí ship cho đơn hàng trên 500K
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-semibold">
                <span>Chính sách giao hàng</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-up">
            <div className="text-6xl mb-6">💌</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Đăng Ký Nhận Ưu Đãi
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Nhận ngay mã giảm giá 15% cho đơn hàng đầu tiên và cập nhật sản phẩm mới nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
              />
              <button className="btn-3d px-8 py-4 bg-white text-purple-600 rounded-xl font-bold shadow-2xl hover:shadow-white/50 transition-all duration-300">
                Đăng Ký Ngay 🎉
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* React Toastify Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}