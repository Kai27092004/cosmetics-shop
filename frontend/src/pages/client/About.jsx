import { Link } from 'react-router-dom';
import '../../styles/custom.css';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white py-20">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in-up">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Về <span className="gradient-text drop-shadow-2xl">Cosmetics Shop</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Nơi vẻ đẹp tự nhiên gặp gỡ công nghệ hiện đại. Chúng tôi mang đến những sản phẩm mỹ phẩm cao cấp, chính hãng từ khắp nơi trên thế giới.
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center fade-in-up">
              <div className="text-4xl md:text-5xl font-black text-pink-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Sản phẩm</div>
            </div>
            <div className="text-center fade-in-up delay-100">
              <div className="text-4xl md:text-5xl font-black text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Khách hàng</div>
            </div>
            <div className="text-center fade-in-up delay-200">
              <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Thương hiệu</div>
            </div>
            <div className="text-center fade-in-up delay-300">
              <div className="text-4xl md:text-5xl font-black text-pink-600 mb-2">99%</div>
              <div className="text-gray-600 font-medium">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Sứ Mệnh & Tầm Nhìn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến vẻ đẹp và sự tự tin cho mọi người
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="card-3d bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 slide-in-left">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ Mệnh</h3>
              <p className="text-gray-700 leading-relaxed">
                Mang đến những sản phẩm mỹ phẩm chính hãng, chất lượng cao với giá cả hợp lý.
                Chúng tôi tin rằng mọi người đều xứng đáng được chăm sóc bản thân với những sản phẩm tốt nhất.
              </p>
            </div>

            {/* Vision Card */}
            <div className="card-3d bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 slide-in-right">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm Nhìn</h3>
              <p className="text-gray-700 leading-relaxed">
                Trở thành nền tảng mua sắm mỹ phẩm hàng đầu Việt Nam, được khách hàng tin tưởng
                và lựa chọn cho hành trình làm đẹp của họ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="feature-card-3d bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Chất Lượng</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                100% sản phẩm chính hãng, có nguồn gốc xuất xứ rõ ràng
              </p>
            </div>

            {/* Value 2 */}
            <div className="feature-card-3d bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl fade-in-up delay-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Uy Tín</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Minh bạch trong mọi giao dịch, đảm bảo quyền lợi khách hàng
              </p>
            </div>

            {/* Value 3 */}
            <div className="feature-card-3d bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl fade-in-up delay-200">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Tận Tâm</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Luôn đặt khách hàng lên hàng đầu, tư vấn nhiệt tình
              </p>
            </div>

            {/* Value 4 */}
            <div className="feature-card-3d bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl fade-in-up delay-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Đổi Mới</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Cập nhật xu hướng làm đẹp và công nghệ mới nhất
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hành trình phát triển và trưởng thành
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Timeline Item 1 */}
              <div className="flex gap-6 fade-in-up">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2020</span>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 card-3d">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Khởi Đầu</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cosmetics Shop được thành lập với mục tiêu mang đến những sản phẩm mỹ phẩm chất lượng cao cho người Việt.
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex gap-6 fade-in-up delay-100">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2022</span>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 card-3d">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mở Rộng</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Đạt mốc 10,000 khách hàng và mở rộng danh mục sản phẩm với hơn 50 thương hiệu quốc tế.
                  </p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex gap-6 fade-in-up delay-200">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2024</span>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 card-3d">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phát Triển</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Ra mắt nền tảng online hiện đại, phục vụ hơn 50,000 khách hàng trên toàn quốc.
                  </p>
                </div>
              </div>

              {/* Timeline Item 4 */}
              <div className="flex gap-6 fade-in-up delay-300">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2026</span>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 card-3d">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tương Lai</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tiếp tục đổi mới và phát triển, mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Sẵn Sàng Khám Phá?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Hãy để chúng tôi đồng hành cùng bạn trên hành trình làm đẹp.
              Khám phá ngay hàng nghìn sản phẩm chất lượng cao!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <button className="btn-3d px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300">
                  🛍️ Khám Phá Sản Phẩm
                </button>
              </Link>
              <Link to="/contact">
                <button className="btn-3d px-8 py-4 glass border-2 border-white/50 text-white rounded-xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all duration-300">
                  💬 Liên Hệ Ngay
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
