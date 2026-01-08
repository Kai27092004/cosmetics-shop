import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Về Chúng Tôi</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chào mừng đến với Cosmetics Shop
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Chúng tôi là đơn vị hàng đầu trong lĩnh vực cung cấp mỹ phẩm chính hãng, 
              mang đến cho khách hàng những sản phẩm làm đẹp chất lượng cao từ các thương hiệu 
              uy tín trên thế giới.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Với sứ mệnh mang lại vẻ đẹp tự nhiên và sự tự tin cho mọi người, 
              chúng tôi không ngừng nỗ lực để cung cấp dịch vụ tốt nhất và sản phẩm 
              phù hợp với từng nhu cầu của khách hàng.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">✓</span>
                <span className="text-gray-600">
                  <strong>Chất lượng:</strong> Cam kết 100% sản phẩm chính hãng
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">✓</span>
                <span className="text-gray-600">
                  <strong>Uy tín:</strong> Minh bạch trong mọi giao dịch
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">✓</span>
                <span className="text-gray-600">
                  <strong>Tận tâm:</strong> Luôn đặt khách hàng lên hàng đầu
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">✓</span>
                <span className="text-gray-600">
                  <strong>Đổi mới:</strong> Cập nhật xu hướng làm đẹp mới nhất
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Liên Hệ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Hãy ghé thăm chúng tôi hoặc liên hệ qua trang{' '}
              <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Liên Hệ
              </a>{' '}
              để được tư vấn về các sản phẩm phù hợp với bạn.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
