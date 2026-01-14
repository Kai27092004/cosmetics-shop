import { Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import ProductCard from '../../components/products/ProductCard';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

export default function Home() {
  const { products, loading, error } = useProducts({ limit: 8 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Chào mừng đến với Cosmetics Shop
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100">
              Mỹ phẩm chính hãng - Giá tốt nhất - Giao hàng nhanh
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary">
                  Xem sản phẩm
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="! border-white ! text-whitehover:!bg-white hover:! text-purple-600">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Chính hãng 100%</h3>
              <p className="text-gray-600">Cam kết sản phẩm chính hãng, nguồn gốc rõ ràng</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 . 895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Giá tốt nhất</h3>
              <p className="text-gray-600">Giá cạnh tranh, nhiều ưu đãi hấp dẫn</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600">Giao hàng toàn quốc, nhanh chóng trong 24h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Những sản phẩm được yêu thích nhất
            </p>
          </div>

          {loading ?  (
            <div className="flex justify-center py-12">
              <Loading size="lg" text="Đang tải sản phẩm..." />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">❌ {error}</p>
              <Button onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/products">
                  <Button size="lg" variant="primary">
                    Xem tất cả sản phẩm →
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}