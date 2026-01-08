import { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { getImageUrl } from '../../../utils/helpers';

export default function ProductForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = 'Lưu'
}) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description:  '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        price: initialData. price,
        stockQuantity:  initialData.stockQuantity,
        categoryId: initialData.categoryId || initialData.category?.id || '',
        imageUrl: initialData.imageUrl || '',
      });
      setPreviewImage(getImageUrl(initialData.imageUrl));
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update preview image
    if (name === 'imageUrl') {
      setPreviewImage(getImageUrl(value));
    }
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name. trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Số lượng không hợp lệ';
    if (!formData.categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      name: formData.name. trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      categoryId: parseInt(formData.categoryId),
      imageUrl: formData.imageUrl. trim(),
    };

    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left:  Form fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tên sản phẩm */}
          <Input
            label="Tên sản phẩm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={loading}
            placeholder="Ví dụ: Son môi Maybelline"
          />

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả sản phẩm
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Mô tả chi tiết về sản phẩm..."
              disabled={loading}
            />
          </div>

          {/* Giá và Số lượng */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá (VNĐ)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              required
              disabled={loading}
              placeholder="150000"
            />

            <Input
              label="Số lượng tồn kho"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              error={errors.stockQuantity}
              required
              disabled={loading}
              placeholder="100"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          {/* URL Ảnh */}
          <Input
            label="URL Ảnh"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/upload/product. jpg"
            disabled={loading}
          />
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Xem trước ảnh
            </label>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="8" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Nhập URL ảnh để xem preview
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          size="lg"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          size="lg"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
}